import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'

// Types
export type LiveOrderUpdate = {
    orderId: string
    status: 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled'
    location?: { lat: number; lng: number }
}

export type AdminNotification = {
    id: string
    title: string
    message: string
    timestamp: Date
    type: 'info' | 'warning' | 'success' | 'error'
    read: boolean
}

interface GlobalState {
    // Socket
    socket: Socket | null
    isConnected: boolean
    connectSocket: () => void
    disconnectSocket: () => void

    // Live Operations
    liveOrders: Record<string, LiveOrderUpdate>
    updateOrder: (update: LiveOrderUpdate) => void

    // Notifications (verification alerts, system warnings)
    notifications: AdminNotification[]
    addNotification: (notification: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) => void
    markAsRead: (id: string) => void
    clearAllNotifications: () => void
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'

export const useStore = create<GlobalState>((set, get) => ({
    socket: null,
    isConnected: false,
    liveOrders: {},
    notifications: [],

    connectSocket: () => {
        if (get().socket?.connected) return

        const socket = io(SOCKET_URL, {
            autoConnect: true,
            reconnection: true,
        })

        socket.on('connect', () => {
            console.log('🔌 Socket Connected to HQ')
            set({ isConnected: true })
        })

        socket.on('disconnect', () => {
            console.log('❌ Socket Disconnected')
            set({ isConnected: false })
        })

        // Listen for standard events
        socket.on('order_update', (data: LiveOrderUpdate) => {
            get().updateOrder(data)
        })

        socket.on('admin_alert', (alert: { title: string; message: string; type: any }) => {
            get().addNotification(alert)
        })

        set({ socket })
    },

    disconnectSocket: () => {
        get().socket?.disconnect()
        set({ socket: null, isConnected: false })
    },

    updateOrder: (update) =>
        set((state) => ({
            liveOrders: {
                ...state.liveOrders,
                [update.orderId]: { ...state.liveOrders[update.orderId], ...update }
            }
        })),

    addNotification: (notification) =>
        set((state) => ({
            notifications: [
                {
                    id: Math.random().toString(36).substr(2, 9),
                    timestamp: new Date(),
                    read: false,
                    ...notification
                },
                ...state.notifications
            ]
        })),

    markAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            )
        })),

    clearAllNotifications: () => set({ notifications: [] })
}))

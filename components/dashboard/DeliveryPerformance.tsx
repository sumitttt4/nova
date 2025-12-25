"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ChevronDown } from "lucide-react"

const data = [
    { name: "On Time", value: 38, color: "#93C5FD" }, // Blue-300 (Light Blue)
    { name: "In Progress", value: 25, color: "#C4B5FD" }, // Violet-300 (Light Purple)
    { name: "Delayed", value: 37, color: "#FCD34D" }, // Amber-300 (Light Yellow)
]

export function DeliveryPerformance() {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-900">
                    Deliveries
                </h3>
                <button className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-900 transition-colors">
                    This year <ChevronDown className="h-3 w-3" />
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center relative">
                <div className="h-[140px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={60}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="w-full mt-2 space-y-3">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-[4px]" style={{ backgroundColor: item.color }} />
                                <span className="text-xs font-semibold text-slate-600">{item.name}</span>
                            </div>
                            <span className="text-xs font-bold text-slate-900">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

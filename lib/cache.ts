import Redis from 'ioredis'

// --- Cache Configuration ---
// In a real environment, you would use process.env.REDIS_URL
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

// Gracefully handle connection failures in dev/mock environment
let redis: Redis | null = null

try {
    if (process.env.REDIS_URL) {
        redis = new Redis(REDIS_URL)
        redis.on('error', (err) => {
            console.warn('[Cache] Redis Connection Error:', err)
        })
    } else {
        console.log('[Cache] Running in Mock/No-Redis Mode')
    }
} catch (error) {
    console.warn('[Cache] Failed to initialize Redis', error)
}

// --- Helper Functions ---

/**
 * Get data from cache or fetch it from source
 * @param key Cache Key
 * @param fetcher Function to fetch fresh data if cache miss
 * @param ttl Time to live in seconds (default 60)
 */
export async function getOrSetCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 60
): Promise<T> {
    if (!redis) {
        // Fallback: Just return fresh data if no cache
        return await fetcher()
    }

    try {
        const cached = await redis.get(key)
        if (cached) {
            return JSON.parse(cached) as T
        }
    } catch (e) {
        console.warn(`[Cache] Get ErrorForKey ${key}:`, e)
    }

    // Cache Miss
    const freshData = await fetcher()

    try {
        if (freshData) {
            await redis.set(key, JSON.stringify(freshData), 'EX', ttl)
        }
    } catch (e) {
        console.warn(`[Cache] Set Error For Key ${key}:`, e)
    }

    return freshData
}

export async function invalidateCache(keyPattern: string) {
    if (!redis) return

    // Scan and delete keys matching pattern
    // Note: Use careful scanning in production for large datasets
    const keys = await redis.keys(keyPattern)
    if (keys.length > 0) {
        await redis.del(...keys)
    }
}

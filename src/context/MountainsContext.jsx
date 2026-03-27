import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { MOUNTAIN_SEED_DATA } from '../data/mountainsSeed'
import { isFirebaseConfigured } from '../firebase/config'
import {
  seedMountainsFromDefaultsIfEmpty,
  subscribeMountains,
} from '../firebase/mountainsFirestore'

/** @typedef {{ mountains: object[], loading: boolean, error: string | null, source: string }} MountainsState */

const MountainsContext = createContext(
  /** @type {MountainsState} */ ({
    mountains: [],
    loading: true,
    error: null,
    source: 'unknown',
  }),
)

export function MountainsProvider({ children }) {
  const [mountains, setMountains] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('unknown')

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setMountains(MOUNTAIN_SEED_DATA)
      setLoading(false)
      setError(null)
      setSource('local-seed')
      return undefined
    }

    let unsub = () => {}
    let cancelled = false

    ;(async () => {
      try {
        if (import.meta.env.VITE_FIREBASE_SEED_IF_EMPTY === 'true') {
          await seedMountainsFromDefaultsIfEmpty()
        }
      } catch (e) {
        console.error('[Firestore] 초기 시드 실패:', e)
      }
      if (cancelled) return

      unsub = subscribeMountains(
        (list) => {
          if (cancelled) return
          setError(null)
          setMountains(list)
          setLoading(false)
          setSource('firestore')
        },
        (err) => {
          if (cancelled) return
          console.error('[Firestore]', err)
          setError(err?.message ?? String(err))
          setMountains(MOUNTAIN_SEED_DATA)
          setLoading(false)
          setSource('local-seed-fallback')
        },
      )
    })()

    return () => {
      cancelled = true
      unsub()
    }
  }, [])

  const value = useMemo(
    () => ({ mountains, loading, error, source }),
    [mountains, loading, error, source],
  )

  return (
    <MountainsContext.Provider value={value}>
      {children}
    </MountainsContext.Provider>
  )
}

export function useMountains() {
  return useContext(MountainsContext)
}

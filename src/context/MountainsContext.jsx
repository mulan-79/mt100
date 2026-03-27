import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { MOUNTAIN_SEED_DATA } from '../data/mountainsSeed'
import { isFirebaseConfigured } from '../firebase/config'
import { subscribeJournalPosts } from '../firebase/journalPostsFirestore'
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
  const firebaseOn = isFirebaseConfigured()

  const [baseMountains, setBaseMountains] = useState(() =>
    firebaseOn ? [] : MOUNTAIN_SEED_DATA,
  )
  const [journalMountains, setJournalMountains] = useState([])
  const [mountainsReady, setMountainsReady] = useState(() => !firebaseOn)
  const [journalReady, setJournalReady] = useState(() => !firebaseOn)
  const [error, setError] = useState(null)
  const [source, setSource] = useState(() => (firebaseOn ? 'unknown' : 'local-seed'))

  const mountains = useMemo(
    () => [...journalMountains, ...baseMountains],
    [journalMountains, baseMountains],
  )

  const loading = useMemo(
    () => (firebaseOn ? !mountainsReady || !journalReady : false),
    [firebaseOn, mountainsReady, journalReady],
  )

  useEffect(() => {
    if (!firebaseOn) return undefined

    let unsubMountains = () => {}
    let unsubJournal = () => {}
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

      unsubMountains = subscribeMountains(
        (list) => {
          if (cancelled) return
          setError(null)
          setBaseMountains(list)
          setMountainsReady(true)
          setSource('firestore')
        },
        (err) => {
          if (cancelled) return
          console.error('[Firestore]', err)
          setError(err?.message ?? String(err))
          setBaseMountains(MOUNTAIN_SEED_DATA)
          setMountainsReady(true)
          setSource('local-seed-fallback')
        },
      )

      unsubJournal = subscribeJournalPosts(
        (list) => {
          if (cancelled) return
          setJournalMountains(list)
          setJournalReady(true)
        },
        (err) => {
          if (cancelled) return
          console.error('[Firestore journal_posts]', err)
          setJournalMountains([])
          setJournalReady(true)
        },
      )
    })()

    return () => {
      cancelled = true
      unsubMountains()
      unsubJournal()
    }
  }, [firebaseOn])

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

// eslint-disable-next-line react-refresh/only-export-components
export function useMountains() {
  return useContext(MountainsContext)
}

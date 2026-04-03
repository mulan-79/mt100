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
  subscribeMountains100Plus,
} from '../firebase/mountainsFirestore'

/**
 * @typedef {{
 *   mountains: object[],
 *   mountains100Plus: object[],
 *   loading: boolean,
 *   error: string | null,
 *   source: string
 * }} MountainsState
 */

const MountainsContext = createContext(
  /** @type {MountainsState} */ ({
    mountains: [],
    mountains100Plus: [],
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
  const [mountains100Plus, setMountains100Plus] = useState([])
  const [mountainsReady, setMountainsReady] = useState(() => !firebaseOn)
  const [mountains100PlusReady, setMountains100PlusReady] = useState(
    () => !firebaseOn,
  )
  const [journalReady, setJournalReady] = useState(() => !firebaseOn)
  const [error, setError] = useState(null)
  const [source, setSource] = useState(() => (firebaseOn ? 'unknown' : 'local-seed'))

  const mountains = useMemo(
    () => [...journalMountains, ...baseMountains],
    [journalMountains, baseMountains],
  )

  const loading = useMemo(
    () =>
      firebaseOn
        ? !mountainsReady || !mountains100PlusReady || !journalReady
        : false,
    [firebaseOn, mountainsReady, mountains100PlusReady, journalReady],
  )

  useEffect(() => {
    if (!firebaseOn) return undefined

    let unsubMountains = () => {}
    let unsub100Plus = () => {}
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

      unsub100Plus = subscribeMountains100Plus(
        (list) => {
          if (cancelled) return
          setMountains100Plus(list)
          setMountains100PlusReady(true)
        },
        (err) => {
          if (cancelled) return
          console.error('[Firestore mountains_100_plus]', err)
          setMountains100Plus([])
          setMountains100PlusReady(true)
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
      unsub100Plus()
      unsubJournal()
    }
  }, [firebaseOn])

  const value = useMemo(
    () => ({ mountains, mountains100Plus, loading, error, source }),
    [mountains, mountains100Plus, loading, error, source],
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

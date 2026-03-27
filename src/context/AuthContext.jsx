import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import {
  getFirebaseAuth,
  getGoogleAuthProvider,
  isAuthorizedUserEmail,
  isFirebaseConfigured,
} from '../firebase/config'

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthorized: false,
  isEnabled: false,
  signInWithGoogle: async () => {},
  logout: async () => {},
})

function getInitialAuthLoading() {
  if (!isFirebaseConfigured()) return false
  return getFirebaseAuth() != null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(getInitialAuthLoading)

  useEffect(() => {
    if (!isFirebaseConfigured()) return undefined

    const auth = getFirebaseAuth()
    if (!auth) return undefined

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  const signInWithGoogle = async () => {
    const auth = getFirebaseAuth()
    const provider = getGoogleAuthProvider()
    if (!auth || !provider) {
      throw new Error('Firebase Auth가 설정되지 않았습니다.')
    }
    await signInWithPopup(auth, provider)
  }

  const logout = async () => {
    const auth = getFirebaseAuth()
    if (!auth) return
    await signOut(auth)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthorized: isAuthorizedUserEmail(user?.email),
      isEnabled: isFirebaseConfigured(),
      signInWithGoogle,
      logout,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}

import { createContext, useContext, useState, useEffect  } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../Constants/Routes'
import axios from '../Intercepter/Api'
import { LOCAL_STORAGE_KEY } from '../Constants/Constants'

interface AuthContextType {
  user: any | null
  login: (user: any) => void
  logout: () => void
  title: string
  setTitle: (title: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null)
  const [title, setTitle] = useState('Dashboard')
  const navigate = useNavigate()
  
  const login = (user: any) => {
    setUser(user)
    navigate(ROUTES.HOME)
  }

  const logout = () => {
    setUser(null)
    navigate(ROUTES.LOGIN)
    localStorage.removeItem(LOCAL_STORAGE_KEY.AUTH_TOKEN)
  }

  const getUser = async () => {
    const response = await axios.get('auth/request-user')
    return response.data
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let user = await getUser()
        setUser(user.profile) 
        if(user){
          navigate(ROUTES.HOME)
        }else{
          navigate(ROUTES.LOGIN)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        navigate(ROUTES.LOGIN)
      }
    }
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, title, setTitle }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { useAuth }
import { getCurrentUser } from "@/lib/appwrite"
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react"
import { Models } from "react-native-appwrite"

interface GlobalContextType {
  isLoggedIn: boolean
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
  user: Models.Document | null
  setUser: Dispatch<SetStateAction<Models.Document | null>>
  isLoading: boolean
}

const defaultContextValue: GlobalContextType = {
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
  isLoading: true,
}

const GlobalContext = createContext<GlobalContextType>(defaultContextValue)
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [user, setUser] = useState<Models.Document | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    getCurrentUser()
      .then((res: any) => {
        if (res) {
          setIsLoggedIn(true)
          setUser(res)
        } else {
          setIsLoggedIn(false)
          setUser(null)
        }
      })
      .catch((error: Error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider

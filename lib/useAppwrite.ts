import { useEffect, useState } from "react"
import { Alert } from "react-native"
import { Models } from "react-native-appwrite"

type useAppwriteProps = {
  fn: (query?: string) => Promise<Models.Document[]>
}

const useAppwrite = ({ fn }: useAppwriteProps) => {
  const [data, setData] = useState<Models.Document[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchData = async () => {
    setIsLoading(true)

    try {
      const response = await fn()

      setData(response)
    } catch (error: any) {
      Alert.alert("Error", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refetch = () => fetchData

  return { data, isLoading, refetch }
}

export default useAppwrite

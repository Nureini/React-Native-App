import { useState } from "react"
import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native"

import { icons } from "../constants"
import { router, usePathname } from "expo-router"

type SearchInputProps = {
  initialQuery?: string
  placeholder: string
  page: string
}

const SearchInput = ({ initialQuery, placeholder, page }: SearchInputProps) => {
  const pathname = usePathname()
  const [query, setQuery] = useState(initialQuery || "")

  return (
    <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary items-center flex-row space-x-4">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder={placeholder}
        placeholderTextColor="#CDCDE0"
        onChangeText={(e: string) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please input something to search results across database"
            )
          }

          if (page === "home") {
            if (pathname.startsWith("/search")) router.setParams({ query })
            else router.push(`/search/${query}`)
          } else if (page === "bookmark") {
            if (pathname.startsWith("/search/bookmark"))
              router.setParams({ query })
            else router.push(`/search/bookmark/${query}`)
          }
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  )
}

export default SearchInput

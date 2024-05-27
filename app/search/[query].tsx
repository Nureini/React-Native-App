import { View, Text, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import SearchInput from "@/components/SearchInput"
import EmptyState from "@/components/EmptyState"
import { useEffect } from "react"
import useAppwrite from "@/lib/useAppwrite"
import { searchPosts } from "@/lib/appwrite"
import VideoCard from "@/components/VideoCard"
import { router, useLocalSearchParams } from "expo-router"
import { Models } from "react-native-appwrite"

const Search = () => {
  const { query } = useLocalSearchParams()
  const { data: posts, refetch } = useAppwrite({
    fn: () => searchPosts(query as string),
  })

  useEffect(() => {
    refetch()
  }, [query])

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts as Models.Document[]}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>

            <View className="mt-6 mb-8">
              <SearchInput
                initialQuery={query as string}
                placeholder="Search for a video topic"
                page="home"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
            customButtonTitle="Create Video"
            handlePress={() => router.push("/create")}
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search

import EmptyState from "@/components/EmptyState"
import SearchInput from "@/components/SearchInput"
import VideoCard from "@/components/VideoCard"
import { useGlobalContext } from "@/context/GlobalProvider"
import { searchBookmarkedPosts } from "@/lib/appwrite"
import useAppwrite from "@/lib/useAppwrite"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect } from "react"
import { View, Text, SafeAreaView, FlatList } from "react-native"

const BookmarkSearch = () => {
  const { user } = useGlobalContext()
  const { query } = useLocalSearchParams()

  const { data: posts, refetch } = useAppwrite({
    fn: () => searchBookmarkedPosts(query as string, user?.$id!),
  })

  useEffect(() => {
    refetch()
  }, [query])

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts[0] !== undefined ? posts : []}
        keyExtractor={(item: any) => item?.$id}
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
                placeholder={"Search your saved videos"}
                page="bookmark"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Saved Videos Found"
            subtitle="No results found for your search"
            customButtonTitle="Return"
            handlePress={() => router.back()}
          />
        )}
      />
    </SafeAreaView>
  )
}

export default BookmarkSearch

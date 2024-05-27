import { View, Text, FlatList, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import SearchInput from "@/components/SearchInput"
import EmptyState from "@/components/EmptyState"
import { useState } from "react"
import useAppwrite from "@/lib/useAppwrite"
import { getUsersBookmarkedVideos } from "@/lib/appwrite"
import VideoCard from "@/components/VideoCard"
import { useGlobalContext } from "@/context/GlobalProvider"
import { router } from "expo-router"
import { Query } from "react-native-appwrite"

const Bookmark = () => {
  const { user } = useGlobalContext()

  const { data: posts, refetch } = useAppwrite({
    fn: () => getUsersBookmarkedVideos(user?.$id!),
  })

  const [refreshing, setRefreshing] = useState<boolean>(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="text-2xl font-psemibold text-white">
                  Saved Videos
                </Text>
              </View>
            </View>

            <SearchInput
              placeholder={"Search your saved videos"}
              page="bookmark"
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Saved Videos Found"
            subtitle="Save your first video"
            customButtonTitle="Browse Videos"
            handlePress={() => router.push("/home")}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  )
}

export default Bookmark

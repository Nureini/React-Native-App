import { View, Text, Image, TouchableOpacity, Alert } from "react-native"
import { Models } from "react-native-appwrite"

import { icons } from "@/constants"
import { useEffect, useState } from "react"
import { ResizeMode, Video } from "expo-av"
import { useGlobalContext } from "@/context/GlobalProvider"
import {
  bookmarkVideo,
  deleteBookmarkedVideo,
  isVideoBookmarkedByUser,
} from "@/lib/appwrite"
import { router } from "expo-router"

type VideoCardProps = {
  video: Models.Document
}

const VideoCard = ({
  video: {
    $id,
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
}: VideoCardProps) => {
  const { user } = useGlobalContext()

  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)
  const [bookmarkedDocumentId, setBookmarkedDocumentId] = useState<
    string | null
  >(null)
  useEffect(() => {
    const getIsVideoBookmarkedByUser = async () => {
      const results = await isVideoBookmarkedByUser(user?.$id!, $id)
      if (results) {
        setIsBookmarked(true)
        setBookmarkedDocumentId((results as Models.Document[])[0].$id)
      }
    }

    getIsVideoBookmarkedByUser()
  }, [])

  const [play, setPlay] = useState<boolean>(false)

  const handlePress = async () => {
    try {
      await bookmarkVideo($id as string, user?.$id as string)

      Alert.alert("Success", "Post bookmarked successfully")
      router.push("/bookmark")
    } catch (error: any) {
      Alert.alert("Error", error.message)
    }
  }

  const deleteBookmarked = async () => {
    try {
      await deleteBookmarkedVideo(bookmarkedDocumentId!)

      Alert.alert("Success", "bookmark removed successfully")
      router.push("/bookmark")
    } catch (error: any) {
      Alert.alert("Error", error.message)
    }
  }

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="text-sm text-white font-psemibold"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          {isBookmarked ? (
            <TouchableOpacity onPress={deleteBookmarked}>
              <Image
                source={icons.bookmark}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handlePress}>
              <Image
                source={icons.plus}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {play ? (
        <Video
          source={{
            uri: video,
          }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status: any) => {
            if (status.didJustFinish) {
              setPlay(false)
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default VideoCard

import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  ViewToken,
} from "react-native"
import { Models } from "react-native-appwrite"
import * as Animatable from "react-native-animatable"
import { useState } from "react"
import { icons } from "@/constants"

import { Video, ResizeMode } from "expo-av"

type TrendingItemProps = {
  activeItem: string | null
  item: Models.Document
}

type TrendingProps = {
  posts: Models.Document[]
}

const zoomIn: any = {
  0: { scale: 0.9 },
  1: { scale: 1.1 },
}

const zoomOut: any = {
  0: { scale: 1 },
  1: { scale: 0.9 },
}

const TrendingItem = ({ activeItem, item }: TrendingItemProps) => {
  const [play, setPlay] = useState(false)
  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{
            uri: item.video,
          }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
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
          className="relative justify-center items-center"
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  )
}

const Trending = ({ posts }: TrendingProps) => {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken<Models.Document>[]
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key)
    }
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item: Models.Document) => item.$id.toString()}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      contentOffset={{ x: 170, y: 0 }}
      horizontal
    />
  )
}

export default Trending

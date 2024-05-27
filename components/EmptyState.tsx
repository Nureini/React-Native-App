import { View, Text, Image } from "react-native"

import { images } from "@/constants"
import CustomButton from "./CustomButton"

type EmptyStateProps = {
  title: string
  subtitle: string
  customButtonTitle: string
  handlePress: () => void
}

const EmptyState = ({
  title,
  subtitle,
  customButtonTitle,
  handlePress,
}: EmptyStateProps) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />

      <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {title}
      </Text>

      <CustomButton
        title={customButtonTitle}
        handlePress={handlePress}
        containerStyles="w-full my-5"
        isLoading={false}
      />
    </View>
  )
}

export default EmptyState

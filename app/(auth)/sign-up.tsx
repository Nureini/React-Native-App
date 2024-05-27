import { View, Text, ScrollView, Image, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { images } from "../../constants"
import FormField from "@/components/FormField"
import { useState } from "react"
import CustomButton from "@/components/CustomButton"
import { Link, router } from "expo-router"

import { createUser } from "../../lib/appwrite"
import { useGlobalContext } from "@/context/GlobalProvider"
import { Models } from "react-native-appwrite"

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext()

  const [form, setForm] = useState<{
    username: string
    email: string
    password: string
  }>({
    username: "",
    email: "",
    password: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields")
    }

    setIsSubmitting(true)
    try {
      const result = await createUser(form.email, form.password, form.username)

      setUser(result as Models.Document)
      setIsLoggedIn(true)

      router.replace("/home")
    } catch (error: any) {
      Alert.alert("Error", error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h=[35px]"
          />

          <Text className="text-2xl text-white text-semibold mt-10 font-psemiboldw">
            Sign up to Aora
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e: string) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: string) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: string) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account?
            </Text>

            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp

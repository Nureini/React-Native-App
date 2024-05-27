import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Models,
  Query,
  Storage,
} from "react-native-appwrite"

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.n4thedev.aora",
  projectId: "664ae981003361436762",
  databaseId: "664aea4200391478146d",
  userCollectionId: "664aea5c002fec745164",
  videoCollectionId: "664aea700016452c18ba",
  bookmarkedCollectionId: "6651d8670005542fcea0",
  storageId: "664aeb5f0034125d6377",
}

export const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  bookmarkedCollectionId,
  storageId,
} = appwriteConfig

const client = new Client()

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.

const account = new Account(client)
const avatars = new Avatars(client)
export const databases = new Databases(client)
const storage = new Storage(client)

export const createUser = async (
  email: string,
  password: string,
  username: string
): Promise<Models.Document> => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    )

    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    )

    return newUser
  } catch (error: any) {
    console.log(error)
    throw new Error(error)
  }
}

export const signIn = async (
  email: string,
  password: string
): Promise<Models.Session> => {
  try {
    const session = await account.createEmailPasswordSession(email, password)

    return session
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getCurrentUser = async (): Promise<
  Models.Document | undefined
> => {
  try {
    const currentAccount = await account.get()

    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )

    if (!currentUser) throw Error

    return currentUser.documents[0]
  } catch (error: any) {
    console.log(error)
  }
}

export const getAllPosts = async (): Promise<Models.Document[]> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
    ])

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getLatestPosts = async (): Promise<Models.Document[]> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(7),
    ])

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}

export const searchPosts = async (
  query: string
): Promise<Models.Document[]> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ])

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getUserPosts = async (
  userId: string
): Promise<Models.Document[]> => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
      Query.orderDesc("$createdAt"),
    ])

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current")

    return session
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getFilePreview = async (fileId: string, type: string) => {
  let fileUrl

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId)
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      )
    } else {
      throw new Error("Invalid file type")
    }

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error: any) {
    throw new Error(error)
  }
}

export const uploadFile = async (file: any, type: string) => {
  if (!file) return

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  }

  try {
    const uploadedFile = await storage.createFile(storageId, ID.unique(), asset)
    const fileUrl = await getFilePreview(uploadedFile.$id, type)

    return fileUrl
  } catch (error: any) {
    throw new Error(error)
  }
}

type formTypes = {
  title: string
  video: {
    uri: string
  } | null
  thumbnail: {
    uri: string
  } | null
  prompt: string
  userId: string
}

export const createVideo = async (
  form: formTypes
): Promise<Models.Document> => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ])

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    )

    return newPost
  } catch (error: any) {
    throw new Error(error)
  }
}

export const bookmarkVideo = async (
  documentId: string,
  userId: string
): Promise<Models.Document> => {
  try {
    const newBookmark = await databases.createDocument(
      databaseId,
      bookmarkedCollectionId,
      ID.unique(),
      {
        userId,
        videoId: documentId,
      }
    )

    return newBookmark
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getUsersBookmarkedVideos = async (userId: string) => {
  try {
    const bookmarkedPosts = await databases.listDocuments(
      databaseId,
      bookmarkedCollectionId,
      [Query.equal("userId", userId)]
    )

    let allBookmarkedPosts = []
    for (let i = 0; i < bookmarkedPosts.documents.length; i++) {
      const getPost = await databases.getDocument(
        databaseId,
        videoCollectionId,
        bookmarkedPosts.documents[i].videoId
      )
      allBookmarkedPosts.push(getPost)
    }

    return allBookmarkedPosts
  } catch (error: any) {
    throw new Error(error)
  }
}

export const isVideoBookmarkedByUser = async (
  userId: string,
  videoId: string
): Promise<boolean | Models.Document[]> => {
  try {
    const bookmarkedPosts = await databases.listDocuments(
      databaseId,
      bookmarkedCollectionId,
      [Query.equal("userId", userId), Query.equal("videoId", videoId)]
    )

    if (!bookmarkedPosts.documents.length) {
      return false
    }

    return bookmarkedPosts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}

export const deleteBookmarkedVideo = async (documentId: string) => {
  try {
    await databases.deleteDocument(
      databaseId,
      bookmarkedCollectionId,
      documentId
    )

    return
  } catch (error: any) {
    throw new Error(error)
  }
}

export const searchBookmarkedPosts = async (
  query: string,
  userId: string
): Promise<Models.Document[]> => {
  try {
    const bookmarkedPosts = await databases.listDocuments(
      databaseId,
      bookmarkedCollectionId,
      [Query.equal("userId", userId)]
    )

    let queryBookmarkedPosts = []
    for (let i = 0; i < bookmarkedPosts.documents.length; i++) {
      const getPost = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [
          Query.search("title", query),
          Query.equal("$id", bookmarkedPosts.documents[i].videoId),
        ]
      )

      queryBookmarkedPosts.push(getPost.documents[0])
    }

    return queryBookmarkedPosts
  } catch (error: any) {
    throw new Error(error)
  }
}

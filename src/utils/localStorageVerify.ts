import { IImageInfo } from "@/hooks/useUploadImage"

export const loadFromLocalStorage = () => {
  const savedStories = localStorage.getItem("stories")
  if (savedStories) {
    const parsedItems = JSON.parse(savedStories)
    const filteredStories = parsedItems.filter((story: IImageInfo) => {
      return Date.now() - story.timestamp < 24 * 60 * 60 * 1000
    })
    return filteredStories
  }
  return []
}

export const saveToLocalStorage = (stories: IImageInfo[]) => {
  localStorage.setItem("stories", JSON.stringify(stories))
}

export const getTimeAgo = (timestamp: number): string => {
  const timeDiff = Date.now() - timestamp
  const minutes = Math.floor(timeDiff / 1000 / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  } else {
    return "Just now"
  }
}

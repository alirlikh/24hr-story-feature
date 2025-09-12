import { useCallback, useEffect, useRef, useState } from "react"
import UploadButton from "../../UploadButton/Upload.button"
import {
  getTimeAgo,
  loadFromLocalStorage,
  saveToLocalStorage,
} from "@/utils/localStorageVerify"
import { IImageInfo, useUploadImage } from "@/hooks/useUploadImage"
import StoryList from "../../StoryList/Story.list"
import StoryItem from "../../StoryItem/Story.item"

const MainPageView = () => {
  const [stories, setStories] = useState<IImageInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(
    null
  )

  const { imageFileChange } = useUploadImage()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      try {
        const newStory = await imageFileChange(file)
        if (newStory) {
          setStories((prevStories) => {
            const updatedStories = [...prevStories, newStory]
            console.log(updatedStories)

            saveToLocalStorage(updatedStories)
            return updatedStories
          })
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        alert(error instanceof Error ? error.message : "Error uploading image")
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [imageFileChange]
  )
  const cleanupExpiredStories = useCallback(() => {
    setStories((prevStories) => {
      const filteredStories = prevStories.filter(
        (story) => Date.now() - story.timestamp < 24 * 60 * 60 * 1000
      )
      if (filteredStories.length !== prevStories.length) {
        saveToLocalStorage(filteredStories)
      }
      return filteredStories
    })
  }, [])

  useEffect(() => {
    const loadStories = async () => {
      setIsLoading(true)
      try {
        const loadedStories = await loadFromLocalStorage()
        setStories(loadedStories)
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    }

    loadStories()
    // const cleanup = setInterval(cleanupExpiredStories, 60000000)
    // return () => clearInterval(cleanup)
  }, [])

  const handleStoryClick = useCallback((index: number) => {
    setStories((prevStories) => {
      const updatedStories = prevStories.map((story, i) => {
        if (i === index && !story.viewed) {
          return { ...story, viewed: true }
        }
        return story
      })
      saveToLocalStorage(updatedStories)
      return updatedStories
    })
    setSelectedStoryIndex(index)
  }, [])

  console.log(stories)

  return (
    <div className="grid grid-rows-[100px_1fr] h-screen gap-2 text-center">
      <div className="text-left ml-10">
        <div className="inline-flex flex-row mt-10">
          <UploadButton />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
        />

        {selectedStoryIndex !== null && (
          <StoryList
            stories={stories}
            initialIndex={selectedStoryIndex}
            onClose={() => setSelectedStoryIndex(null)}
          />
        )}
      </div>
      <div className="flex flex-row gap-4">
        {" "}
        {stories.map((story, index) => (
          <StoryItem
            key={story.id}
            story={story}
            index={index}
            onStoryClick={handleStoryClick}
            getTimeAgo={getTimeAgo}
          />
        ))}
      </div>
    </div>
  )
}
export default MainPageView

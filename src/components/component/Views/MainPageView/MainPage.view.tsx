import { useCallback, useRef, useState } from "react"
import UploadButton from "../../UploadButton/Upload.button"
import { getTimeAgo } from "@/utils/localStorageVerify"
import { IImageInfo, useUploadImage } from "@/hooks/useUploadImage"
import StoryItem from "../../StoryItem/Story.item"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { addStories, storyView } from "@/redux/features/story/story.slice"
import ImageViewer from "../../ImageViewer/ImageViewer"

const MainPageView = () => {
  const allStories = useAppSelector((state) => state.storySlice.storeis)

  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(
    null
  )

  const dispatch = useAppDispatch()

  const handleInput = () => {
    fileInputRef.current?.click()
  }

  const { imageFileChange } = useUploadImage()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      try {
        const newStory = await imageFileChange(file)
        if (newStory) {
          dispatch(addStories(newStory))
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        alert(error instanceof Error ? error.message : "Error uploading image")
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [dispatch, imageFileChange]
  )
  // const cleanupExpiredStories = useCallback(() => {
  //   setStories((prevStories) => {
  //     const filteredStories = prevStories.filter(
  //       (story) => Date.now() - story.timestamp < 24 * 60 * 60 * 1000
  //     )
  //     if (filteredStories.length !== prevStories.length) {
  //       saveToLocalStorage(filteredStories)
  //     }
  //     return filteredStories
  //   })
  // }, [])

  const handleStoryClick = useCallback(
    (story: IImageInfo, index: number) => {
      dispatch(storyView(index))
      setSelectedStoryIndex(index)
    },
    [dispatch]
  )

  return (
    <div className="grid grid-rows-[100px_1fr] h-screen gap-2 text-center bg-gray-700 overflow-hidden">
      <div className="inline-flex pl-10 flex-row mt-10 justify-start gap-4 items-center h-[100px] overflow-hidden  ">
        <UploadButton onClick={handleInput} />
        <div className="flex flex-row gap-4  min-w-full pr-[100px] overflow-scroll [scrollbar-width:none] ">
          {allStories.map((story, index) => (
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

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {selectedStoryIndex !== null && (
        <ImageViewer
          storyList={allStories}
          currentIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}
    </div>
  )
}
export default MainPageView

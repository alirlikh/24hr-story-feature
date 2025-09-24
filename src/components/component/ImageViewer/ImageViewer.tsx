import { IImageInfo } from "@/hooks/useUploadImage"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import NavigationButton from "../NavigationButton/NavigationButton"
import ProgressBar from "../ProgressBar/ProgressBar"
import { useAppDispatch } from "@/hooks/redux"
import { storyView } from "@/redux/features/story/story.slice"

export interface ImageViewerProps {
  storyList: IImageInfo[]
  currentIndex: number | null
  onClose: () => void
}

const ImageViewer: FC<ImageViewerProps> = ({
  storyList,
  currentIndex,
  onClose,
}) => {
  const [storyIndex, setStoryIndex] = useState<number>(currentIndex!)
  const [startPosition, setStartPosition] = useState<{
    x: number
    y: number
  } | null>()
  const [endPosition, setEndPosition] = useState<{
    x: number
    y: number
  } | null>()
  const [isMounted, setIsMounted] = useState<boolean>(true)

  const dispatch = useAppDispatch()

  const progressTimeout = useRef<number>(null)

  const storyMoveOn = useCallback(() => {
    if (progressTimeout.current) {
      window.clearTimeout(progressTimeout.current)
    }

    progressTimeout.current = window.setTimeout(() => {
      if (storyIndex < storyList.length - 1) {
        setStoryIndex((prev) => {
          return prev + 1
        })
      } else {
        onClose()
      }
    }, 4000)
  }, [storyIndex, storyList.length, onClose])

  useEffect(() => {
    if (isMounted) {
      storyMoveOn()
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && storyIndex > 0) {
        setStoryIndex((prev) => prev - 1)
      } else if (e.key === "ArrowRight" && storyIndex < storyList.length - 1) {
        setStoryIndex((prev) => prev + 1)
      } else if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      if (progressTimeout.current) {
        window.clearTimeout(progressTimeout.current)
      }
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMounted, onClose, storyIndex, storyList.length, storyMoveOn])

  useEffect(() => {
    dispatch(storyView(storyIndex))
  }, [storyIndex, dispatch])

  const handleChangeStory = (type: "prev" | "next") => {
    if (type === "next") {
      setStoryIndex((prev) => {
        return prev < storyList.length - 1 ? prev + 1 : prev
      })
    } else if (type === "prev") {
      setStoryIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsMounted(false)
    const clientX = e.touches?.[0]?.clientX
    const clientY = e.touches?.[0]?.clientY
    setStartPosition({ x: clientX, y: clientY })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const clientX = e.touches?.[0]?.clientX
    const clientY = e.touches?.[0]?.clientY
    setEndPosition({ x: clientX, y: clientY })
  }

  const handleTouchEnd = () => {
    setIsMounted(true)
    if (!startPosition || !endPosition) return
    const diffX = startPosition.x - endPosition?.x
    const diffY = startPosition.y - endPosition?.y

    if (
      Math.abs(diffX) > Math.abs(diffY) &&
      Math.abs(diffX) > 50 &&
      storyIndex < storyList.length - 1
    ) {
      if (diffX > 0 && storyIndex < storyList.length - 1) {
        setStoryIndex((prev) => prev + 1)
      } else if (diffX < 0 && storyIndex > 0) {
        setStoryIndex((prev) => prev - 1)
      }

      setStartPosition(null)
      setEndPosition(null)
    }
  }

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed touch-pan-y inset-0 select-none bg-gray-500/95 "
    >
      <div className="absolute right-7 top-6 px-2 py-1  rounded-md z-10">
        <button className="text-white/60 hover:text-white" onClick={onClose}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="absolute top-5 w-full flex flex-row z-10">
        {storyList.map((_, index) => (
          <ProgressBar key={index} index={index} currentIndex={storyIndex} />
        ))}
      </div>
      <div className="absolute inset-0 w-full flex">
        <img
          src={storyList[storyIndex!].imageUrl}
          className="max-w-full max-h-full w-full object-contain"
          alt="story"
        />
      </div>
      <div className="flex flex-row justify-between absolute w-full top-1/2">
        <NavigationButton
          className="ml-4"
          direction="left"
          onClick={() => handleChangeStory("prev")}
          hide={storyIndex <= 0}
        />
        <NavigationButton
          className="mr-4"
          direction="right"
          onClick={() => handleChangeStory("next")}
          hide={storyIndex > storyList.length - 2}
        />
      </div>
    </div>
  )
}

export default ImageViewer

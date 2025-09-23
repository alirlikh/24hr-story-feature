import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IStorySlice } from "./story.type"
import { IImageInfo } from "@/hooks/useUploadImage"

const initialState: IStorySlice = {
  storeis: [],
}

export const storySlice = createSlice({
  name: "storySlice",
  initialState,
  reducers: {
    addStories: (state, action: PayloadAction<IImageInfo>) => {
      const newItem = action.payload
      state.storeis.push(newItem)
    },
    storyView: (state, action: PayloadAction<number>) => {
      const storyIndex = action.payload

      const selectedStory = state.storeis[storyIndex]
      if (selectedStory) {
        selectedStory.viewed = true
      }
    },
  },
})

export const { addStories, storyView } = storySlice.actions
export default storySlice.reducer

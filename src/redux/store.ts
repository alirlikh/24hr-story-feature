import { combineReducers, configureStore, Reducer } from "@reduxjs/toolkit"
import { storySlice } from "./features/story/story.slice"
import {
  createTransform,
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import { IStorySlice } from "./features/story/story.type"

const storyExpireTransform = createTransform<IStorySlice, IStorySlice>(
  // Called when persisting (we just pass it through)
  (inboundState) => inboundState,
  // Called when rehydrating
  (outboundState) => {
    const now = Date.now()
    const expiryTime = 24 * 60 * 60 * 1000 // 24 hours

    return {
      ...outboundState,
      storeis: outboundState.storeis.filter(
        (story) => now - (story.timestamp ?? 0) < expiryTime
      ),
    }
  },
  { whitelist: [storySlice.name] }
)

const rootReducer = combineReducers({
  [storySlice.name]: storySlice.reducer,
})

const persistConfig = {
  key: "story-persist",
  storage,
  whitelist: [storySlice.name],
  transforms: [storyExpireTransform],
  timeout: 1000,
}

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer as Reducer<{
    storySlice: IStorySlice
  }>
)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
export const persistor = persistStore(store)

export type AppStore = typeof store
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

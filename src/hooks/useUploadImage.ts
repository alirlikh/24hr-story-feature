export interface IImageInfo {
  id: string
  imageUrl: string
  timestamp: number
  viewed: boolean
}

export const useUploadImage = () => {
  const imageFileChange = async (file: File): Promise<IImageInfo | null> => {
    if (!file.type.startsWith("image/")) {
      throw Error("you must upload the image file")
    }

    const imageUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = (e) => {
        resolve(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    })
    const img = new Image()
    img.src = imageUrl

    return {
      id: Date.now().toString(),
      imageUrl: imageUrl,
      timestamp: Date.now(),
      viewed: false,
    }
  }

  return { imageFileChange }
}

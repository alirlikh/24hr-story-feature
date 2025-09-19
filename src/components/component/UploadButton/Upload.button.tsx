import { FC } from "react"

const UploadButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <>
      <button onClick={onClick} className="text-sm">
        <div className="rounded-full border border-dashed w-16 h-16 flex items-center justify-center font-bold text-2xl mb-1">
          +
        </div>
        Add Story
      </button>
    </>
  )
}
export default UploadButton

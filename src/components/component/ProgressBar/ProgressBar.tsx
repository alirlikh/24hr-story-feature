import { FC } from "react"

import styles from "./ProgressBar.module.css"

interface ProgressBar {
  currentIndex: number
  index: number
}

const ProgressBar: FC<ProgressBar> = ({ currentIndex, index }) => {
  return (
    <div className="h-0.5 mx-1 w-full ">
      <div className="w-full h-full bg-white/30">
        <div
          className={`bg-white h-full  ${
            index < currentIndex
              ? "w-full"
              : index === currentIndex
              ? styles.progress_bar
              : "w-0"
          }`}
        ></div>
      </div>
    </div>
  )
}
export default ProgressBar

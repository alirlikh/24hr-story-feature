import { FC } from "react"

interface NavigationButtonProps {
  direction: "right" | "left"
  onClick: () => void
  className?: string
  hide?: boolean
}

const NavigationButton: FC<NavigationButtonProps> = ({
  direction,
  onClick,
  className,
  hide,
}) => {
  return (
    <button
      className={`${className}  rounded-md p-2  text-white/60 hover:text-white ${
        hide ? "invisible" : ""
      }`}
      onClick={onClick}
      disabled={hide}
    >
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  )
}
export default NavigationButton

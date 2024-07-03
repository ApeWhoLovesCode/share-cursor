import type { OtherCursorsMap } from "~type"

import "../../style.css"

import { useRef, useState } from "react"

import UserAvatar from "./UserAvatar"

export default function CursorPop({
  others,
  toCursor
}: {
  others: OtherCursorsMap
  toCursor: (key: string) => void
}) {
  const [isShow, setIsShow] = useState(false)

  const timer = useRef<NodeJS.Timeout>(null)

  const onPopShow = () => {
    setIsShow(true)
    clearTimeout(timer.current)
  }

  const onPopHide = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setIsShow(false)
    }, 1000)
  }

  return (
    <div
      className={`${isShow ? "translate-x-0" : "translate-x-[calc(100%-1rem)]"} fixed right-0 top-2 bg-zinc-500 p-1 rounded-md transition-all !duration-500`}
      onMouseEnter={onPopShow}
      onMouseLeave={onPopHide}>
      <div className="max-w-[168px] flex gap-2 scrollbar-hide overflow-x-auto">
        {Object.keys(others).map((key) => (
          <UserAvatar
            key={key}
            user={others[key]}
            onClick={() => toCursor(key)}
          />
        ))}
      </div>
    </div>
  )
}

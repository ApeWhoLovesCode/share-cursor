import cssText from "data-text:~/contents/style.css"

import "./style.css"

import React from "react"

import { useMessage } from "@plasmohq/messaging/hook"
import { useStorage } from "@plasmohq/storage/hook"

import { CUR_URL, MY_SELF_KEY, OTHERS_KEY, ROOM_KEY } from "~config/storageKey"
import type { MessageData, OtherCursorsMap, User } from "~type"
import { isIncludesId } from "~utils/tab"

import CursorPop from "./components/CursorPop"
import CursorsContextProvider from "./components/cursors-context"
import { SharedSpace } from "./components/shared-space"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export default function Cursor() {
  const [room] = useStorage<string>(ROOM_KEY, "")
  const [curUrl] = useStorage<string>(CUR_URL, "")
  const [self] = useStorage<User>(MY_SELF_KEY)
  const [others] = useStorage<OtherCursorsMap>(OTHERS_KEY, {})

  const toCursor = (key: string) => {
    const item = others[key]
    if (!item) {
      console.log("cursor not found", key)
      return
    }
    const scrollX = (item.x - 0.5) * window.innerWidth
    const scrollY = (item.y - 0.5) * window.innerHeight
    console.log("scroll X Y: ", scrollX, scrollY)
    window.scrollTo(scrollX, scrollY)
  }

  useMessage<{ key: string }, string>((req, res) => {
    toCursor(req.body.key)
  })

  const isUrlEnabled = curUrl
    ? isIncludesId(curUrl, [window.location.host])
    : true

  const isShare = room && isUrlEnabled

  if (!isShare) return <></>

  return (
    <>
      <CursorsContextProvider room={room} userId={self?.name}>
        <SharedSpace />
      </CursorsContextProvider>
      {others && Object.keys(others).length && (
        <CursorPop others={others} toCursor={toCursor} />
      )}
    </>
  )
}

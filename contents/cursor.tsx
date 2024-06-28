import cssText from "data-text:~/contents/style.css"
import './style.css';
import React from "react";
import { useMessage } from "@plasmohq/messaging/hook"
import { useStorage } from "@plasmohq/storage/hook";
import type { MessageData, User } from "~type";
import CursorsContextProvider from "./components/cursors-context";
import { SharedSpace } from "./components/shared-space";
import { ROOM_KEY } from "~config/storageKey";
import useSocket from "./hooks/useSocket";

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export default function Cursor() {
  const [room, setRoom] = useStorage<string>(ROOM_KEY, '')
  const { data } = useMessage<MessageData, User>(async (req, res) => {
    setRoom(req.body.room)
    res.send(req.body.mySelf)
  })
  const { mySelf } = data || {}
  console.log('room: ', room);

  return (
    <>
      {room ? (
        // <CursorsContextProvider room={room} host={'voronoi-party.genmon.partykit.dev'}>
        <CursorsContextProvider room={room} userId={mySelf?.name}>
          <SharedSpace />
        </CursorsContextProvider>
      ) : null}
      {mySelf && (
        <div 
          className="absolute -top-1 -left-1 size-6 text-gray-300" 
          style={{ 
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
            left: mySelf.left,
            top: mySelf.top,
            backgroundColor: mySelf.color,
          }}
        >
          {mySelf.name}
        </div>
      )}
    </>
  )
}
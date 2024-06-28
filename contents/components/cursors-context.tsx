'use client'

import { useState, useEffect, useContext, createContext } from "react"
import usePartySocket from "partysocket/react"
import useSocket from "~contents/hooks/useSocket"

type Position = {
  x: number,
  y: number,
  pointer: "mouse" | "touch",
}

type Cursor = Position & {
  country: string | null,
  lastUpdate: number,
}

type OtherCursorsMap = {
  [id: string]: Cursor
}

interface CursorsContextType {
  others: OtherCursorsMap
  self: Position | null
}

export const CursorsContext = createContext<CursorsContextType>({ others: {}, self: null })

export function useCursors() {
  return useContext(CursorsContext)
}

export default function CursorsContextProvider(props: { 
  room: string;
  userId: string;
  children: React.ReactNode;
}) {
  const {
    joinRoom,
  } = useSocket({
    room: props.room,
    userId: props.userId,
    onUserJoin: (data) => {
      console.log('onUserJoin: ', data);
    },
    onMessage: (data) => {
      console.log('onMessage: ', data);
    }
  })

  const [self, setSelf] = useState<Position | null>(null)
  const [dimensions, setDimensions] = useState<{ width: number, height: number }>({ width: 0, height: 0 })

  const socket = usePartySocket({
    host: 'voronoi-party.genmon.partykit.dev',
    room: props.room
  })
  const [others, setOthers] = useState<OtherCursorsMap>({})

  useEffect(() => {
    joinRoom()
    console.log('joinRoom: ');

    if (socket) {
      const onMessage = (evt: WebSocketEventMap['message']) => {
        const msg = JSON.parse(evt.data as string);
        switch (msg.type) {
          case "sync":
            const newOthers = { ...msg.cursors }
            setOthers(newOthers)
            break;
          case "update":
            const other = { x: msg.x, y: msg.y, country: msg.country, lastUpdate: msg.lastUpdate, pointer: msg.pointer }
            setOthers((others) => ({ ...others, [msg.id]: other }))
            break;
          case "remove":
            setOthers((others) => {
              const newOthers = { ...others }
              delete newOthers[msg.id]
              return newOthers
            })
            break;
        }
      }
      socket.addEventListener("message", onMessage)

      return () => {
        // @ts-ignore
        socket.removeEventListener("message", onMessage)
      }
    }
  }, [socket])

  // Track window dimensions
  useEffect(() => {
    const onResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Always track the mouse position
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!socket) return
      if (!dimensions.width || !dimensions.height) return
      const position = { x: e.clientX / dimensions.width, y: e.clientY / dimensions.height, pointer: "mouse" } as Position
      socket.send(JSON.stringify(position))
      setSelf(position)
    }
    window.addEventListener('mousemove', onMouseMove)

    // Also listen for touch events
    const onTouchMove = (e: TouchEvent) => {
      if (!socket) return
      if (!dimensions.width || !dimensions.height) return
      e.preventDefault()
      const position = { x: e.touches[0].clientX / dimensions.width, y: e.touches[0].clientY / dimensions.height, pointer: "touch" } as Position
      socket.send(JSON.stringify(position))
      setSelf(position)
    }
    window.addEventListener('touchmove', onTouchMove)

    // Catch the end of touch events
    const onTouchEnd = (e: TouchEvent) => {
      if (!socket) return
      socket.send(JSON.stringify({}))
      setSelf(null)
    }
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [socket, dimensions])

  return (
    <CursorsContext.Provider value={{ others: others, self: self }}>
      {props.children}
    </CursorsContext.Provider>
  )
}

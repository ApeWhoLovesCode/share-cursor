import usePartySocket from "partysocket/react"
import { createContext, useContext, useEffect, useRef, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { MY_SELF_KEY, OTHERS_KEY } from "~config/storageKey"
import useSocket from "~contents/hooks/useSocket"
import type { OtherCursorsMap, OthersMap, Position, User } from "~type"

interface CursorsContextType {
  others: OtherCursorsMap
  self: Position | null
}

export const CursorsContext = createContext<CursorsContextType>({
  others: {},
  self: null
})

export function useCursors() {
  return useContext(CursorsContext)
}

export default function CursorsContextProvider(props: {
  room: string
  userId: string
  children: React.ReactNode
}) {
  // const { joinRoom } = useSocket({
  //   room: props.room,
  //   userId: props.userId,
  //   onUserJoin: (data) => {
  //     console.log("onUserJoin: ", data)
  //   },
  //   onMessage: (data) => {
  //     console.log("onMessage: ", data)
  //   }
  // })

  const [selfStorage, setSelfStorage] = useStorage<User>(MY_SELF_KEY)
  const [othersStorage, setOthersStorage] = useStorage<OthersMap>(
    OTHERS_KEY,
    {}
  )
  const [self, setSelf] = useState<Position>()
  const [others, setOthers] = useState<OtherCursorsMap>({})
  const [dimensions, setDimensions] = useState<{
    width: number
    height: number
  }>({ width: 0, height: 0 })

  const socket = usePartySocket({
    host: "voronoi-party.genmon.partykit.dev",
    room: props.room
  })

  const selfTimer = useRef<NodeJS.Timeout>(null)
  const setSelfFn = (_self: Position) => {
    setSelf(_self)
    if (selfTimer.current) return
    selfTimer.current = setTimeout(() => {
      setSelfStorage((state) => ({ ...state, x: _self.x, y: _self.y }))
      clearTimeout(selfTimer.current)
      selfTimer.current = null
    }, 100)
  }

  const othersTimer = useRef<NodeJS.Timeout>(null)
  const setOthersFn = (_others: OtherCursorsMap) => {
    if (othersTimer.current) return
    othersTimer.current = setTimeout(() => {
      setOthersStorage((state) => {
        for (let key in _others) {
          if (_others[key]) {
            state[key] = {
              id: key,
              name: key,
              ..._others[key]
            }
          }
        }
        return state
      })
      clearTimeout(othersTimer.current)
      othersTimer.current = null
    }, 100)
  }

  useEffect(() => {
    // joinRoom()
    let updateTime = 0
    if (socket) {
      const onMessage = (evt: WebSocketEventMap["message"]) => {
        const msg = JSON.parse(evt.data as string)
        // console.log("msg: ", msg)
        switch (msg.type) {
          case "sync":
            const newOthers = { ...msg.cursors }
            setOthers(newOthers)
            setOthersFn(newOthers)
            break
          case "update":
            if (Date.now() - updateTime < 20) {
              break
            }
            updateTime = Date.now()
            const other = {
              x: msg.x,
              y: msg.y,
              country: msg.country,
              lastUpdate: msg.lastUpdate,
              pointer: msg.pointer
            }
            setOthers((others) => {
              const newOthers = { ...others, [msg.id]: other }
              setOthersFn(newOthers)
              return newOthers
            })
            break
          case "remove":
            setOthers((others) => {
              const newOthers = { ...others }
              delete newOthers[msg.id]
              setOthersFn(newOthers)
              return newOthers
            })
            break
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
    window.addEventListener("resize", onResize)
    onResize()
    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])

  useEffect(() => {
    let moveTimer = 0
    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!socket) return
      if (!dimensions.width || !dimensions.height) return
      if (Date.now() - moveTimer < 20) return
      moveTimer = Date.now()
      const isTouch = (e as TouchEvent)?.touches?.[0]
      if (isTouch) {
        e.preventDefault()
      }
      // clientX
      const ex = (e as MouseEvent)?.pageX ?? (e as TouchEvent)?.touches[0].pageX
      const ey = (e as MouseEvent)?.pageY ?? (e as TouchEvent)?.touches[0].pageY
      const user: Position = {
        x: ex / dimensions.width,
        y: ey / dimensions.height,
        pointer: isTouch ? "touch" : "mouse"
        // 其他属性无法传递
        // color: selfRef.current?.color
      }
      socket.send(JSON.stringify(user))
      setSelfFn(user)
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("touchmove", onMouseMove)

    // Catch the end of touch events
    const onTouchEnd = (e: TouchEvent) => {
      if (!socket) return
      socket.send(JSON.stringify({}))
      setSelfFn(null)
    }
    window.addEventListener("touchend", onTouchEnd)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("touchmove", onMouseMove)
      window.removeEventListener("touchend", onTouchEnd)
    }
  }, [socket, dimensions])

  return (
    <CursorsContext.Provider value={{ others: others, self: self }}>
      {props.children}
    </CursorsContext.Provider>
  )
}

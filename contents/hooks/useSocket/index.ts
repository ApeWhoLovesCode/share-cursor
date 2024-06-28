import { useRef } from "react"
import io, { Socket } from 'socket.io-client';
import useLatest from "../useLatest";
import { SOCKET_URL } from "~config";

export type MsgData = {
  roomId: string
  userId: string
}

type UseSocketProps = {
  room: string
  userId: string
  onUserJoin?: (data: MsgData & {
    userIndex: number
  }) => void
  onMessage?: (data: any) => void
}

export default (options: UseSocketProps) => {
  const optionsRef = useLatest(options);
  const socketRef = useRef<Socket>()

  const joinRoom = () => {
    
    socketRef.current = io(SOCKET_URL)

    socketRef.current.on('connect', () => {
      console.log('connect: ');
      handleConnect()
    })
    // 当有用户发送消息时触发
    socketRef.current.on('message', (data) => { 
      optionsRef.current.onMessage?.(data)
    })
  }

  // 连接成功
  function handleConnect() {
    socketRef.current?.emit('join', { userId: optionsRef.current.userId, room: optionsRef.current.room })
  }

  // 离开房间
  function leaveRoom() {
    // 发送离开的消息
    socketRef.current?.emit('leave', { userId: optionsRef.current.userId, room: optionsRef.current.room })
    // 关闭socket连接
    socketRef.current?.disconnect()
  }

  function emitMessage(data: {type: string} & Record<string, any>) {
    socketRef.current?.emit('message', {
      userId: optionsRef.current.userId,
      room: optionsRef.current.room,
      ...data,
    })
  }

  return {
    joinRoom,
    leaveRoom,
    emitMessage,
  }
}
export type User = {
  id: string
  name: string
  color?: string
  left?: number
  top?: number
}

export type MessageData = {
  mySelf: User
  room: string
}
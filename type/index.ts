export type PointerType = "mouse" | "touch"

export type Position = {
  x: number
  y: number
  pointer: PointerType
}

export type Cursor = Position & {
  country: string | null
  lastUpdate: number
}

export type OtherCursorsMap = {
  [id: string]: Cursor
}

export type User = {
  id: string
  name: string
  color?: string
  x?: number
  y?: number
}

export type OthersMap = {
  [id: string]: User
}

export type MessageData = {
  mySelf: User
  room: string
}

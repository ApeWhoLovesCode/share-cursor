import type { User } from "~type";
import "../style.css"

export default function UserAvatar({user, isActive, onClick}: {
  user: Partial<User>
  onClick?: () => void
  isActive?: boolean
}) {
  return (
    <div 
      className={`${isActive ? '!border-green-400' : ''} w-12 h-12 p-2 rounded-full flex items-center justify-center text-xs bg-stone-700 text-gray-100 break-all break-words cursor-pointer border-solid border-2 border-transparent hover:opacity-85`}
      style={{
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
        backgroundColor: user.color,
      }}
      onClick={onClick}
    >{user.name}</div>
  )
}
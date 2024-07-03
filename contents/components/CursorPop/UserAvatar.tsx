import type { User } from "~type"

export default function UserAvatar({
  user,
  isActive,
  onClick
}: {
  user: Partial<User>
  onClick?: () => void
  isActive?: boolean
}) {
  return (
    <div
      className={`${isActive ? "!border-green-400" : ""} flex-shrink-0 w-9 h-9 p-1 rounded-full flex items-center justify-center overflow-hidden text-xs bg-stone-700 text-gray-100 break-all break-words cursor-pointer border-solid border-2 border-transparent hover:opacity-85`}
      style={{
        textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
        backgroundColor: user?.color
      }}
      onClick={onClick}>
      {user?.id?.slice(0, 6)}
    </div>
  )
}

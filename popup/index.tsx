import type { OthersMap, User } from "~type"

import "./style.css"

import { useEffect, useState } from "react"

import { sendToContentScript } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

import { CUR_URL, MY_SELF_KEY, OTHERS_KEY, ROOM_KEY } from "~config/storageKey"
import { randomColor, randomString } from "~utils/random"
import { getActiveTab } from "~utils/tab"
import { getHostFromUrl } from "~utils/url"

import Button from "./components/Button"
import SelectBox from "./components/SelectBox"
import UserAvatar from "./components/UserAvatar"

const DEFAULT_ROOM = "share-cursor-room"

function IndexPopup() {
  const [room, setRoom] = useStorage<string>(ROOM_KEY, "")
  const [roomState, setRoomState] = useState(room || DEFAULT_ROOM)
  // 有个人信息代表在共享信息中
  const [self, setSelf] = useStorage<User>(MY_SELF_KEY)
  const [others, setOthers] = useStorage<OthersMap>(OTHERS_KEY, {})
  const [curUrl, setCurUrl] = useStorage<string>(CUR_URL, "")
  const [curUrlState, setCurUrlState] = useState<string>(curUrl)
  const [color, setColor] = useState<string>()
  const [name, setName] = useState<string>()

  /** 当前处于共享中 */
  const isShare = !!self

  useEffect(() => {
    getActiveTab().then((tab) => {
      const url = getHostFromUrl(tab.url)
      setCurUrlState(url)
    })
    if (!self) {
      setColor(randomColor())
      setName(randomString(3))
    }
    setTimeout(() => {
      setRoomState(room || DEFAULT_ROOM)
    }, 100)
  }, [])

  const openShare = () => {
    const newMySelf = !isShare
      ? {
          id: name || randomString(3),
          name: name || randomString(3),
          color: color || randomColor()
        }
      : void 0
    setSelf(newMySelf)
    setRoom(!isShare ? roomState : "")
    // 关闭共享
    if (isShare) {
      setCurUrl("")
      setOthers({})
    }
  }

  const toCursor = (key: string) => {
    sendToContentScript({
      name: "to-cursor",
      body: {
        key
      }
    })
  }

  return (
    <div className="px-2 py-4 bg-black w-[248px] text-gray-200">
      <div className="mb-4 flex items-center justify-center mx-2 pb-4 border-b border-indigo-500 border-dashed">
        <div className="text-sm font-medium whitespace-nowrap">
          {isShare ? "当前共享中：" : "未开启共享"}
        </div>
        {isShare && (
          <div className="text-sm text-ellipsis overflow-hidden text-nowrap underline decoration-gray-300 underline-offset-4">
            {curUrl ? curUrl : "全网页"}
          </div>
        )}
      </div>
      <div className="flex gap-x-2">
        <SelectBox
          isClosed={curUrl !== curUrlState}
          className="flex-1 flex-col"
          onClick={() => setCurUrl(curUrlState)}>
          共享当前网页
          <div className="text-ellipsis overflow-hidden text-nowrap">
            {curUrlState}
          </div>
        </SelectBox>
        <SelectBox
          isClosed={!!curUrl}
          className="flex-1 flex-col"
          onClick={() => setCurUrl("")}>
          全网页共享
        </SelectBox>
      </div>
      <div className="flex gap-x-2 items-center mt-4">
        <span className="inline-block text-nowrap">房间号:</span>
        <input
          type="text"
          className="flex-1 w-0 h-7 px-2 py-1 bg-zinc-600 rounded-sm border-none outline-none"
          value={roomState}
          placeholder="请输入房间号"
          maxLength={20}
          onChange={(e) => setRoomState(e.target.value)}
        />
        <Button className="!py-1" onClick={openShare}>
          {self ? "退出" : "加入"}
        </Button>
      </div>
      <div className="mt-4 mb-2 text-sm font-medium">自己信息</div>
      <div className="flex items-center gap-x-4">
        <UserAvatar
          user={{ name, color }}
          isActive={!!self}
          onClick={openShare}
        />
        <div className="flex items-center gap-x-4">
          <input
            type="text"
            className="w-16 h-7 px-2 py-1 bg-zinc-600 rounded-sm border-none outline-none"
            value={name}
            placeholder="请输入用户名"
            maxLength={6}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="color"
            className="w-16 h-7 color-input border-solid border-2 border-zinc-600 rounded-sm cursor-pointer"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
      <div className="mt-4 mb-2 text-sm font-medium">人员列表</div>
      <div className="flex flex-wrap gap-3 overflow-y-auto max-h-[500px]">
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

export default IndexPopup

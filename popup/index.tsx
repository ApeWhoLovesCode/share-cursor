import type { User } from "~type"
import "./style.css"
import { useEffect, useState } from "react"
import { sendToContentScript } from "@plasmohq/messaging"
import { randomColor, randomString } from "~utils/random"
import { useStorage } from "@plasmohq/storage/hook"
import UserAvatar from "./components/UserAvatar"
import Button from "./components/Button"
import SelectBox from "./components/SelectBox"
import { getActiveTab } from "~utils/tab"
import { getHostFromUrl } from "~utils/url"
import { MY_SELF_KEY, ROOM_KEY } from "~config/storageKey"

const DEFAULT_ROOM = 'my-cursor-global-room'

function IndexPopup() {
  const [list, setList] = useState<User[]>([])
  const [room, setRoom] = useStorage<string>(ROOM_KEY, '')
  // 有个人信息代表在共享信息中
  const [mySelf, setMySelf] = useStorage<User>(MY_SELF_KEY)
  const [curUrl, setCurUrl] = useState<string>('')
  const [color, setColor] = useState<string>()
  const [name, setName] = useState<string>()

  useEffect(() => {
    getActiveTab().then((tab) => {
      const url = getHostFromUrl(tab.url)
      setCurUrl(url)
    })
    if(!mySelf) {
      setColor(randomColor())
      setName(randomString(3))
    }
    setList([
      {id: '1', name: 'Lhh'}, {id: '2', name: 'Cody'}, {id: '3', name: 'Ddj'},
      {id: '4', name: 'Lhh'}, {id: '5', name: 'Cody'}, {id: '6', name: 'Ddj'},
    ])
  }, [])

  const onJoinRoom = (isGlobal: boolean) => {
    if(!isGlobal) {
      setRoom(room !== curUrl ? curUrl : '')
    } else {
      setRoom(room !== DEFAULT_ROOM ? DEFAULT_ROOM : '')
    }
  }

  const openShare = async () => {
    const newMySelf = !mySelf ? {
      id: 'id-' + randomString(),
      name: name || randomString(3),
      color: color || randomColor(),
    } : void 0
    const mySelfInfo = await sendToContentScript({
      name: "share-cursor",
      body: {
        room: !mySelf ? room : '',
        mySelf: newMySelf,
      }
    })
    setMySelf(mySelfInfo)
  }

  return (
    <div className="px-2 py-4 bg-black w-[248px] text-gray-200">
      <div className="flex gap-x-2">
        <SelectBox isClosed={room !== curUrl} className="flex-1 flex-col" onClick={() => onJoinRoom(false)}>
          当前网页共享
          <div className="text-ellipsis overflow-hidden text-nowrap">{curUrl}</div>
        </SelectBox>
        <SelectBox isClosed={room !== DEFAULT_ROOM} className="flex-1" onClick={() => onJoinRoom(true)}>全网页共享</SelectBox>
      </div>
      <Button onClick={() => {setRoom('')}}>退出</Button>
      <div className="mt-4 mb-2 text-sm font-medium">自己信息</div>
      <div className="flex items-center gap-x-4">
        <UserAvatar user={{name, color}} isActive={!!mySelf} onClick={openShare} />
        <div className="flex items-center gap-x-4">
          <input 
            type="text" 
            className="w-16 h-7 px-2 py-1 bg-zinc-600 rounded-sm border-none outline-none"
            value={name} 
            maxLength={6} 
            onChange={e => setName(e.target.value)} 
          />
          <input 
            type="color" 
            className="w-16 h-7 color-input border-solid border-2 border-zinc-600 rounded-sm cursor-pointer" 
            value={color} 
            onChange={e => setColor(e.target.value)} 
            style={{backgroundColor: color}}
          />
        </div>
      </div>
      <div className="mt-4 mb-2 text-sm font-medium">人员列表</div>
      <div className="flex flex-wrap gap-3 overflow-y-auto max-h-[500px]">
        {list.map(item => (
          <UserAvatar key={item.id} user={item} onClick={openShare} />
        ))}
      </div>
    </div>
  )
}

export default IndexPopup

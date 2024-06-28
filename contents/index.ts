import type { PlasmoCSConfig } from "plasmo"

import { relayMessage } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["http://localhost:1999/*"]
}

relayMessage({
  name: "get-manifest"
})


import { Peer } from 'peerjs'
import { getLogPrefix } from './utils'
import { getRTCPeerConnection } from './webrtc'
import { USER_LABEL as HOST_USER_LABEL } from './host'
import { CONNECTION_STEPS, HOOKS, MESSAGES, PING_INTERVAL } from './constants'
import { handleConnectionMessage } from './connectionHandler'

export const USER_LABEL = 'peer'

export const init = async (roomID) => {
  return new Promise(resolve => {
    const peer = new Peer()

    peer.on(HOOKS.OPEN, async (userID) => {
      const logPrefix = getLogPrefix(USER_LABEL, userID)
      console.log(logPrefix, MESSAGES.CONNECTED_TO_SIGNALING)

      const peerConnection = peer.connect(roomID)
      const { rtcPeerConnection } = getRTCPeerConnection(peerConnection)

      rtcPeerConnection.addEventListener(HOOKS.DATA_CHANNEL, event => {
        const dataChannel = event.channel
        dataChannel.addEventListener(HOOKS.MESSAGE, event => console.log(getLogPrefix(HOST_USER_LABEL, peerConnection.peer), event.data))
        dataChannel.addEventListener(HOOKS.OPEN, () => {
          console.log(dataChannel.label, MESSAGES.DATA_CHANNEL_OPEN)
          setInterval(() => {
            console.log(logPrefix, MESSAGES.PING)
            dataChannel.send(MESSAGES.PING)
          }, PING_INTERVAL)
          resolve(dataChannel)
        })
      })

      peerConnection.on(HOOKS.OPEN, () => {
        console.log(logPrefix, HOOKS.OPEN)
        peerConnection.on(HOOKS.DATA, handleConnectionMessage(peerConnection, rtcPeerConnection, userID))
        peerConnection.send(JSON.stringify({ type: CONNECTION_STEPS.DISCOVERY }))
      })
    })
  })
}

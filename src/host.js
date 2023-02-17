import { Peer } from 'peerjs'
import { handleConnectionMessage } from './connectionHandler'
import { getLogPrefix } from './utils'
import { getRTCPeerConnection } from './webrtc'
import { USER_LABEL as PEER_USER_LABEL } from './peer'
import { HOOKS, MESSAGES } from './constants'

export const USER_LABEL = 'host'

export const init = async (roomID) => {
  return new Promise(resolve => {
    const peer = new Peer(roomID)

    peer.on(HOOKS.OPEN, userID => {
      const logPrefix = getLogPrefix(USER_LABEL, userID)
      console.log(logPrefix, MESSAGES.CONNECTED_TO_SIGNALING)

      peer.on(HOOKS.CONNECTION, async peerConnection => {
        console.log(`${logPrefix} ${MESSAGES.CONNECTED_TO_SIGNALING_PEER}`, peerConnection.peer)
        const { rtcPeerConnection, dataChannel } = getRTCPeerConnection(peerConnection)

        const announce = (message) => {
          console.log(logPrefix, message)
          dataChannel.send(message)
        }

        dataChannel.addEventListener(HOOKS.OPEN, event => {
          announce(`${MESSAGES.DATA_CHANNEL_OPEN_PREFIX} ${event.target.label} ${peerConnection.peer}`)
          resolve(dataChannel)
        })
        dataChannel.addEventListener(HOOKS.MESSAGE, event => {
          console.log(getLogPrefix(PEER_USER_LABEL, peerConnection.peer), event.data)
          if (event.data === MESSAGES.PING) announce(MESSAGES.PONG)
        })

        peerConnection.on(HOOKS.DATA, handleConnectionMessage(peerConnection, rtcPeerConnection, userID))
      })
    })
  })
}

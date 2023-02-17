import { CONNECTION_STEPS } from './constants'

export const toJSON = data => JSON.stringify(data)
export const fromJSON = data => JSON.parse(data)

export const handleConnectionMessage = (peerConnection, rtcPeerConnection, peerID) => data => {
  const message = fromJSON(data)
  console.log(`[${message.type}] from ${peerConnection.peer} to ${peerID}`)
  switch (message.type) {
    case CONNECTION_STEPS.DISCOVERY:
      peerConnection.send(toJSON({ type: CONNECTION_STEPS.HANDSHAKE }))
      break
    case CONNECTION_STEPS.HANDSHAKE:
      rtcPeerConnection.createOffer()
        .then(offer => rtcPeerConnection.setLocalDescription(offer))
        .then(() => peerConnection.send(toJSON({ type: CONNECTION_STEPS.OFFER, payload: rtcPeerConnection.localDescription })))
      break
    case CONNECTION_STEPS.OFFER:
      rtcPeerConnection.setRemoteDescription(message.payload)
        .then(() => rtcPeerConnection.createAnswer())
        .then(answer => rtcPeerConnection.setLocalDescription(answer))
        .then(() => peerConnection.send(toJSON({ type: CONNECTION_STEPS.ANSWER, payload: rtcPeerConnection.localDescription })))
      break
    case CONNECTION_STEPS.ANSWER:
      rtcPeerConnection.setRemoteDescription(message.payload)
      break
    case CONNECTION_STEPS.CANDIDATE:
      rtcPeerConnection.addIceCandidate(message.payload)
      break
    default:
      break
  }
}


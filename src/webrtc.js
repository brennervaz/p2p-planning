import { CONNECTION_STEPS, DEFAULT_DATA_CHANNEL } from './constants'
import { toJSON } from './connectionHandler'

export const getRTCPeerConnection = peerConnection => {
  const rtcPeerConnection = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })
  const dataChannel = rtcPeerConnection.createDataChannel(DEFAULT_DATA_CHANNEL)

  rtcPeerConnection.onicecandidate = event => {
    if (event.candidate) {
      peerConnection.send(toJSON({ type: CONNECTION_STEPS.CANDIDATE, payload: event.candidate }))
    }
  }

  return { rtcPeerConnection, dataChannel }
}

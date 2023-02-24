import React, { useState } from 'react'
import P2PDataChannel, { IP2PDataChannel } from 'p2p-data-channel'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import Chat from './Chat'
import { Home } from './Home'

process.env.ENV = 'development'

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function App() {
  const [remotePeerTarget, setRemotePeerTarget] = useState('')
  const [room, setRoomId] = useState('')
  const [dataChannel, setDataChannel] = useState<IP2PDataChannel<string>>()
  const localPeerId = uuidv4()

  const createRoom = () => {
    const p2pChannel: IP2PDataChannel<string> = new P2PDataChannel(localPeerId)
    setDataChannel(p2pChannel)
    setRoomId(localPeerId)
  }

  const connectToRoom = async () => {
    const p2pChannel: IP2PDataChannel<string> = new P2PDataChannel(localPeerId)
    p2pChannel.connect(remotePeerTarget)
    setDataChannel(p2pChannel)
    setRoomId(remotePeerTarget)
  }

  const handleRoomIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemotePeerTarget(event.target.value);
  };

  return (
    <Wrapper>
      {room ? (
        <Chat
          localPeerId={localPeerId}
          room={room}
          dataChannel={dataChannel!}
        />
      ) : (
        <Home
          remotePeerId={remotePeerTarget}
          handleRoomIdChange={handleRoomIdChange}
          connectToRoom={() => connectToRoom()}
          createRoom={createRoom}
        />
      )}
    </Wrapper>
  )
}

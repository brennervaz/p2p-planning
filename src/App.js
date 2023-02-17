import { init as startPeer } from './peer'
import { init as startHost } from './host'
import { useState } from 'react'
import logo from './logo.svg';

function App() {
  const [targetRoomId, setTargetRoomId] = useState('')
  const [room, setRoom] = useState('')
  const [dataChannel, setDataChannel] = useState(null)
  const [message, setMessage] = useState('')

  const setupDataChannel = dataChannel => {
    dataChannel.addEventListener('message', handleMessage)
    setDataChannel(dataChannel)
  }

  const handleMessage = message => {
    if (message.data !== 'ping') {
      console.log('message', message.data)
    }
  }

  const createRoom = async (roomId = Math.floor(Math.random() * (1000 - 10 + 1)) + 10) => {
    setRoom(roomId)
    const dataChannel = await startHost(roomId)
    setupDataChannel(dataChannel)
  }

  const connectToRoom = async (roomId) => {
    setRoom(roomId)
    const dataChannel = await startPeer(roomId)
    setupDataChannel(dataChannel)
  }

  const sendMessage = message => {
    dataChannel.send(message)
    setMessage('')
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {room ? (
          <>
            <span>connected to room {room}</span>
            <br />
            <button onClick={() => setRoom('')}>exit</button>
            <br />
            <br />
            <br />
            <input type="text" placeholder="message" onChange={e => setMessage(e.currentTarget.value)} />
            <button onClick={() => sendMessage(message)}>send</button>
          </>
        ) : (
          <>
            <input type="text" placeholder="Room id" onChange={e => setTargetRoomId(e.currentTarget.value)} />
            <button
              className="App-link"
              onClick={() => connectToRoom(targetRoomId)}
            >
              Connect to room
            </button>
            <button
              className="App-link"
              onClick={e => createRoom(targetRoomId)}
            >
              Create room
            </button>
          </>
        )}
      </header>
    </div>
  )
}

export default App;
import { init as startPeer } from './peer'
import { init as startHost } from './host'
import { useState } from 'react'
import logo from './logo.svg';

function App() {
  const [targetRoomId, setTargetRoomId] = useState('')
  const [room, setRoom] = useState('')

  const createRoom = (roomId = Math.floor(Math.random() * (1000 - 10 + 1)) + 10) => {
    startHost(roomId)
    setRoom(roomId)
  }

  const connectToRoom = (roomId) => {
    startPeer(roomId)
    setRoom(roomId)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {room ? (
          <>
            <span>connected to room {room}</span>
            <button onClick={() => setRoom('')}>exit</button>
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
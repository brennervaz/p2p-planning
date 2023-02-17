import { init as startPeer } from './peer'
import { init as startHost } from './host'

function App() {
  const roomID = "arbitraryID"

  return (
    <>
      <button onClick={() => startHost(roomID)}>Init host</button>
      <button onClick={() => startPeer(roomID)}>Init peer</button>
    </>
  );
}

export default App;
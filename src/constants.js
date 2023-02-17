export const MESSAGES = {
  CONNECTED_TO_SIGNALING: 'connected to signaling',
  CONNECTED_TO_SIGNALING_PEER: 'connected to signaling peer',
  DATA_CHANNEL_OPEN_PREFIX: 'welcome to',
  DATA_CHANNEL_OPEN: 'open',
  PING: 'ping',
  PONG: 'pong',
}

export const HOOKS = {
  OPEN: 'open',
  CONNECTION: 'connection',
  MESSAGE: 'message',
  DATA: 'data',
  DATA_CHANNEL: 'datachannel',
}

export const CONNECTION_STEPS = {
  DISCOVERY: 'discovery',
  HANDSHAKE: 'handshake',
  OFFER: 'offer',
  ANSWER: 'answer',
  CANDIDATE: 'candidate',
}

export const PING_INTERVAL = 5000

export const DEFAULT_DATA_CHANNEL = 'default'
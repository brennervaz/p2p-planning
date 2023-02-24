import { IP2PChannelMessage, IP2PDataChannel } from 'p2p-data-channel';
import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';

interface ChatProps {
  localPeerId: string;
  room: string;
  dataChannel: IP2PDataChannel<string>;
}

interface ChatMessageProps {
  isOwnMessage: boolean;
}

interface ChatInputProps {
  hasValue: boolean;
}

const colors = {
  darkBlue: '#1D2028',
  blue: '#252C38',
  lightBlue: '#5B6280',
  grey: '#82899E',
  white: '#FFFFFF',
  lightGrey: '#B5BBC9',
  green: '#57A858',
};

const ChatContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${colors.darkBlue};
`;

const ChatTitle = styled.h2`
  margin: 0;
  padding: 1rem;
  color: ${colors.white};
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
  background-color: ${colors.blue};
`;

const ChatBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  color: ${colors.white};
`;

const ChatMessage = styled.div<ChatMessageProps>`
  max-width: 80%;
  align-self: ${props => (props.isOwnMessage ? 'flex-end' : 'flex-start')};
  background-color: ${props => (props.isOwnMessage ? colors.green : colors.blue)};
  padding: 1rem;
  margin: 0.5rem;
  border-radius: 1rem;
  font-size: 1.4rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ChatMessageText = styled.span`
  display: block;
`;

const ChatInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.blue};
  padding: 1rem;
`;

const ChatInput = styled.input<ChatInputProps>`
  flex: 1;
  background-color: ${colors.darkBlue};
  border: none;
  border-radius: 0.5rem;
  padding: 1rem 2rem;
  color: ${colors.white};
  font-size: 1.6rem;
  line-height: 1.5;
  outline: none;
  transition: all 0.2s;

  &:focus {
    box-shadow: 0 0 0 2px ${colors.lightBlue};
  }

  &::placeholder {
    color: ${colors.lightGrey};
  }
`;

const ChatButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.green};
  border: none;
  border-radius: 0.5rem;
  padding: 1.5rem 2.5rem;
  color: ${colors.white};
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 30px;

  &:hover {
    background-color: ${colors.grey};
  }
`;

export default function Chat({ room, dataChannel, localPeerId }: ChatProps) {
  const [chatMessages, setChatMessages] = useState<IP2PChannelMessage<string>[]>([])
  const [message, setMessage] = useState('')

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && message.trim() !== '') {
      send()
    }
  }

  const addMessageToLog = useCallback((message: IP2PChannelMessage<string>) => {
    setChatMessages(messages => [...messages, message])
  }, [])

  const onMessage = useCallback((message: IP2PChannelMessage<string>) => addMessageToLog(message), [addMessageToLog])

  const send = () => {
    if (!dataChannel) {
      console.error('no data channel')
      return
    }
    if (!message.trim()) {
      return
    }

    dataChannel.broadcast(message)
    addMessageToLog({ sender: localPeerId, payload: message })
    setMessage('')
  }

  useEffect(() => {
    dataChannel.onMessage(onMessage)
  }, [dataChannel, onMessage])

  return (
    <ChatContainer>
      <ChatTitle>4chat.in/{room}</ChatTitle>
      <ChatBox>
        {chatMessages.map((message, index) => (
          <ChatMessage key={index} isOwnMessage={message.sender === localPeerId}>
            <ChatMessageText>{message.sender}: {message.payload}</ChatMessageText>
          </ChatMessage>
        ))}
      </ChatBox>
      <ChatInputWrapper>
        <ChatInput
          hasValue={!!message}
          type='text'
          placeholder='Enter your message...'
          value={message}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
        />
        <ChatButton onClick={send}>Send</ChatButton>
      </ChatInputWrapper>
    </ChatContainer>
  )
}

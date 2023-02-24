import React from 'react'
import styled from 'styled-components'

const colors = {
  primary: '#242424',
  secondary: '#f8f8f8',
  accent: '#007aff',
  white: '#ffffff',
  black: '#000000',
  blue: '#2196f3',
  lightGrey: "#F1F1F1",
  darkGrey: "#363636",
  darkerGrey: "#222222",
  lightBlue: "#add8e6"
};

const HomeContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${colors.darkGrey};
`;

const HomeTitle = styled.h1`
  font-size: 48px;
  color: ${colors.white};
  margin-bottom: 24px;
`;

const HomeInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

const HomeInput = styled.input`
  background-color: ${colors.darkGrey};
  color: ${colors.white};
  border: none;
  border-bottom: 2px solid ${colors.white};
  font-size: 24px;
  padding: 8px;
  width: 320px;
  margin-right: 16px;

  &::placeholder {
    color: ${colors.lightGrey};
  }
`;

const HomeButton = styled.button`
  background-color: ${colors.blue};
  color: ${colors.white};
  border: none;
  border-radius: 8px;
  font-size: 24px;
  font-weight: bold;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${colors.lightBlue};
  }

  &:not(:last-child) {
    margin-right: 16px;
  }
`;

interface HomeProps {
  remotePeerId: string;
  handleRoomIdChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  connectToRoom: () => void;
  createRoom: () => void;
}

export function Home({
  remotePeerId,
  handleRoomIdChange,
  connectToRoom,
  createRoom
}: HomeProps) {
  return (
    <HomeContainer>
      <HomeTitle>Join or create a room</HomeTitle>
      <HomeInputWrapper>
        <HomeInput
          type='text'
          placeholder='Room ID'
          value={remotePeerId}
          onChange={handleRoomIdChange}
        />
        <HomeButton onClick={connectToRoom}>Join</HomeButton>
        <HomeButton onClick={createRoom}>Create</HomeButton>
      </HomeInputWrapper>
    </HomeContainer>
  )
}

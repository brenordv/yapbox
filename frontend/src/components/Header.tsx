import React from 'react';
import styled from 'styled-components';
import { User } from '../types/types';
import { FaSun, FaMoon } from 'react-icons/fa';

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: ${({ theme }) => theme.headerBackground};
    color: ${({ theme }) => theme.headerColor};
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
`;

const UserContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
`;

const Name = styled.h2`
    margin: 0;
    font-size: 16px;
    font-weight: bold;
`;

const ToggleContainer = styled.div`
  cursor: pointer;
`;

interface HeaderProps {
    otherUser: User;
    themeMode: string;
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ otherUser, themeMode, toggleTheme }) => {
    return (
        <HeaderContainer>
            <UserContainer>
                <Avatar src={otherUser.avatar} alt={`${otherUser.name}'s avatar`} />
                <Name>{otherUser.name}</Name>
            </UserContainer>
            <ToggleContainer onClick={toggleTheme}>
                {themeMode === 'light' ? <FaMoon /> : <FaSun />}
            </ToggleContainer>
        </HeaderContainer>
    );
};

export default Header;

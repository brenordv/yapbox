import React from 'react';
import styled from 'styled-components';
import { User } from '../types/types';

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: #f8f8f8;
    border-bottom: 1px solid #e0e0e0;
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
`;

interface HeaderProps {
    userA: User;
    userB: User;
}

const Header: React.FC<HeaderProps> = ({ userA, userB }) => {
    return (
        <HeaderContainer>
            <UserContainer>
                <Avatar src={userA.avatar} alt={`${userA.name}'s avatar`} />
                <Name>{userA.name}</Name>
            </UserContainer>
            <UserContainer>
                <Avatar src={userB.avatar} alt={`${userB.name}'s avatar`} />
                <Name>{userB.name}</Name>
            </UserContainer>
        </HeaderContainer>
    );
};

export default Header;

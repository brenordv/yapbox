import React from 'react';
import styled from 'styled-components';
import { User } from '../types/types';

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
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
    font-size: 16px;
    font-weight: bold;
`;

interface HeaderProps {
    otherUser: User;
}

const Header: React.FC<HeaderProps> = ({ otherUser }) => {
    return (
        <HeaderContainer>
            <UserContainer>
                <Avatar src={otherUser.avatar} alt={`${otherUser.name}'s avatar`} />
                <Name>{otherUser.name}</Name>
            </UserContainer>
        </HeaderContainer>
    );
};

export default Header;

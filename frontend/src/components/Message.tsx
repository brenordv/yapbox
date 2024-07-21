import React from 'react';
import styled from 'styled-components';
import { Message as MessageType, User } from '../types/types';

const MessageContainer = styled.div<{ isCurrentUser: boolean }>`
    display: flex;
    flex-direction: ${({ isCurrentUser }) => (isCurrentUser ? 'row-reverse' : 'row')};
    margin-bottom: 10px;
`;

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 0 10px;
`;

const MessageContent = styled.div<{ isCurrentUser: boolean }>`
    background-color: ${({ isCurrentUser }) => (isCurrentUser ? '#0084ff' : '#f0f0f0')};
    color: ${({ isCurrentUser }) => (isCurrentUser ? 'white' : 'black')};
    border-radius: 18px;
    padding: 10px 15px;
    max-width: 60%;
`;

const Timestamp = styled.span`
    font-size: 0.8em;
    color: #888;
    margin-top: 5px;
    display: block;
`;

interface MessageProps {
    message: MessageType;
    currentUser: User;
    otherUser: User;
}

const Message: React.FC<MessageProps> = ({ message, currentUser, otherUser }) => {
    const isCurrentUser = message.senderId === currentUser.id;
    const sender = isCurrentUser ? currentUser : otherUser;

    return (
        <MessageContainer isCurrentUser={isCurrentUser}>
            <Avatar src={sender.avatar} alt={`${sender.name}'s avatar`} />
            <MessageContent isCurrentUser={isCurrentUser}>
                {message.text}
                <Timestamp>{message.timestamp.toLocaleTimeString()}</Timestamp>
            </MessageContent>
        </MessageContainer>
    );
};

export default Message;

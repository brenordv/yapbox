import React from 'react';
import styled from 'styled-components';
import { Message as MessageType, User } from '../types/types';

const MessageContainer = styled.div`
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
`;

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
`;

const MessageContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const MessageHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
`;

const SenderName = styled.span`
    font-weight: bold;
    margin-right: 10px;
`;

const Timestamp = styled.span`
    font-size: 0.8em;
    color: #888;
`;

const MessageText = styled.div`
    background-color: #f0f0f0;
    color: black;
    border-radius: 8px;
    padding: 10px 15px;
    width: fit-content;
    max-width: 100%;
`;

interface MessageProps {
    message: MessageType;
    currentUser: User;
    otherUser: User;
}

const Message: React.FC<MessageProps> = ({ message, currentUser, otherUser }) => {
    const sender = message.senderId === currentUser.id ? currentUser : otherUser;

    return (
        <MessageContainer>
            <Avatar src={sender.avatar} alt={`${sender.name}'s avatar`} />
            <MessageContentContainer>
                <MessageHeader>
                    <SenderName>{sender.name}</SenderName>
                    <Timestamp>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Timestamp>
                </MessageHeader>
                <MessageText>{message.text}</MessageText>
            </MessageContentContainer>
        </MessageContainer>
    );
};

export default Message;

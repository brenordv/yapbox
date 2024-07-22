import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Message as MessageType, User } from '../types/types';
import Message from './Message';

const MessageListContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 20px;
`;

interface MessageListProps {
    messages: MessageType[];
    currentUser: User;
    otherUser: User;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser, otherUser }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <MessageListContainer>
            {messages.map((message) => (
                <Message key={message.id} message={message} currentUser={currentUser} otherUser={otherUser} />
            ))}
            <div ref={messagesEndRef} />
        </MessageListContainer>
    );
};

export default MessageList;

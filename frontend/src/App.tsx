import React, { useState } from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { User, Message } from './types/types';

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    border: 1px solid #e0e0e0;
`;

const userA: User = {
    id: '1',
    name: 'User A',
    avatar: 'https://via.placeholder.com/40',
};

const userB: User = {
    id: '2',
    name: 'User B',
    avatar: 'https://via.placeholder.com/40',
};

const initialMessages: Message[] = [
    {
        id: '1',
        senderId: userA.id,
        text: 'Hey, how are you?',
        timestamp: new Date('2023-04-23T10:00:00'),
    },
    {
        id: '2',
        senderId: userB.id,
        text: 'I\'m doing great! How about you?',
        timestamp: new Date('2023-04-23T10:02:00'),
    },
    {
        id: '3',
        senderId: userA.id,
        text: 'I\'m good too. Just working on a project.',
        timestamp: new Date('2023-04-23T10:05:00'),
    },
];

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);

    const handleSendMessage = (text: string) => {
        const newMessage: Message = {
            id: String(messages.length + 1),
            senderId: userA.id,
            text,
            timestamp: new Date(),
        };
        setMessages([...messages, newMessage]);
    };

    return (
        <AppContainer>
            <Header userA={userA} userB={userB} />
            <MessageList messages={messages} currentUser={userA} otherUser={userB} />
            <MessageInput onSendMessage={handleSendMessage} />
        </AppContainer>
    );
};

export default App;

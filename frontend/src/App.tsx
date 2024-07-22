import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import LoadingSkeleton from './components/LoadingSkeleton';
import { User, Message } from './types/types';
import {currentAgentTypeToAvatar, currentAgentTypeToName} from "./utils/converters";

const GlobalStyle = createGlobalStyle`
    body {
        --background-color: ${({ theme }) => theme.background};
        --color: ${({ theme }) => theme.color};
        background-color: var(--background-color);
        color: var(--color);
    }
`;

const lightTheme = {
    background: '#ffffff',
    color: '#000000',
    headerBackground: '#f8f8f8',
    headerColor: '#000000',
    borderColor: '#e0e0e0',
    messageBackground: '#f0f0f0',
    messageColor: '#000000',
};

const darkTheme = {
    background: '#181818',
    color: '#ffffff',
    headerBackground: '#282828',
    headerColor: '#ffffff',
    borderColor: '#444444',
    messageBackground: '#383838',
    messageColor: '#ffffff',
};

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 80%;
    margin: 0 auto;
    border: 1px solid ${({ theme }) => theme.borderColor};
`;

const userA: User = {
    id: '1',
    name: 'User',
    avatar: currentAgentTypeToAvatar(true),
};

const userB: User = {
    id: '2',
    name: currentAgentTypeToName(),
    avatar: currentAgentTypeToAvatar(false),
};

const initialMessages: Message[] = [
];

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
        const userPreference = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return userPreference ? 'dark' : 'light';
    });
    const [loading, setLoading] = useState(true);

    const toggleTheme = () => {
        setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const handleSendMessage = (newMessage: Message) => {
        console.log("newMessage", newMessage);
        setMessages(prevState => [...prevState, newMessage]);
    };

    const checkAgentType = () => {
        const agentType = process.env.REACT_APP_AGENT_TYPE;

        switch (agentType) {
            case 'data-analyst':
                // Any specific initialization for data-analyst can be added here
                break;
            // Add more cases for different agentTypes in the future
            default:
                break;
        }
    };

    useEffect(() => {
        checkAgentType();
        const timer = setTimeout(() => setLoading(false), 5000); // Simulate 5-second loading
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setThemeMode(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return (
        <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
            <GlobalStyle />
            {loading ? (
                <LoadingSkeleton />
            ) : (
                <AppContainer>
                    <Header otherUser={userB} themeMode={themeMode} toggleTheme={toggleTheme} />
                    <MessageList messages={messages} currentUser={userA} otherUser={userB} />
                    <MessageInput onSendMessage={handleSendMessage} currentUser={userA} />
                </AppContainer>
            )}
        </ThemeProvider>
    );
};

export default App;

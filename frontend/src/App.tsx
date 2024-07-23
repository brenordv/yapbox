import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import axios from 'axios';
import Header from './components/Header';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import LoadingSkeleton from './components/LoadingSkeleton';
import { User, Message } from './types/types';
import { currentAgentTypeToAvatar, currentAgentTypeToName } from "./utils/converters";

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

const ErrorMessage = styled.div`
    color: red;
    text-align: center;
    margin-top: 20px;
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

const initialMessages: Message[] = [];

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
        const userPreference = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return userPreference ? 'dark' : 'light';
    });
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState<string | null>(null);

    const toggleTheme = () => {
        setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const handleSendMessage = (newMessage: Message) => {
        setMessages((prevState) => [...prevState, newMessage]);
    };

    const checkAgentType = () => {
        const agentType = process.env.REACT_APP_AGENT_TYPE;

        switch (agentType) {
            case 'data-analyst':
                // Any specific initialization for data-analyst can be added here
                break;
            // TODO: Add more cases for different agentTypes in the future
            default:
                break;
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500); // Simulate 1.5 seconds of loading time, jsut because I like the loading screen.

        const checkServerStatus = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/ping`);
                if (response.status === 200) {
                    //setLoading(false); //Let the timer do this.
                } else {
                    setServerError('The server is down. Please try again later.');
                }
            } catch (error) {
                setServerError('The server is down. Please try again later.');
            }
        };

        checkAgentType();
        checkServerStatus();

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
            ) : serverError ? (
                <ErrorMessage>{serverError}</ErrorMessage>
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

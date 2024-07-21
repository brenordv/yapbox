import React, { useState } from 'react';
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
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

    const handleCopyClick = (messageId: string) => {
        setCopiedMessageId(messageId);
    };

    return (
        <MessageListContainer>
            {messages.map((message) => (
                <Message
                    key={message.id}
                    message={message}
                    currentUser={currentUser}
                    otherUser={otherUser}
                    copiedMessageId={copiedMessageId}
                    onCopyClick={handleCopyClick}
                />
            ))}
        </MessageListContainer>
    );
};

export default MessageList;

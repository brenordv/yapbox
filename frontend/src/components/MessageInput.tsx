import React, { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
    display: flex;
    padding: 10px;
    background-color: #f8f8f8;
    border-top: 1px solid #e0e0e0;
`;

const Input = styled.input`
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const SendButton = styled.button`
    margin-left: 10px;
    padding: 10px 20px;
    background-color: #0084ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

interface MessageInputProps {
    onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <InputContainer as="form" onSubmit={handleSubmit}>
            <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <SendButton type="submit">Send</SendButton>
        </InputContainer>
    );
};

export default MessageInput;

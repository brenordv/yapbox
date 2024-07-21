import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPaperPlane, FaPaperclip } from 'react-icons/fa';

const InputContainer = styled.div`
    display: flex;
    align-items: center;
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

const Button = styled.button`
    margin-left: 10px;
    padding: 10px;
    background-color: #0084ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PaperclipButton = styled(Button)`
    background-color: #aaa;
    padding: 10px; /* default size */
`;

const SendButton = styled(Button)`
  background-color: #0084ff;
  width: 80px; /* double width */
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

    const handlePaperclipClick = () => {
        // Handler for the paperclip button click
    };

    return (
        <InputContainer as="form" onSubmit={handleSubmit}>
            <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <PaperclipButton type="button" onClick={handlePaperclipClick}>
                <FaPaperclip />
            </PaperclipButton>
            <SendButton type="submit">
                <FaPaperPlane />
            </SendButton>
        </InputContainer>
    );
};

export default MessageInput;

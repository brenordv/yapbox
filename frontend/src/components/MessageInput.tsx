import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { FaPaperclip, FaPaperPlane, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { AiResponse, ChatContextItem, Message as MessageType, UploadDatafileResponse, User } from '../types/types';

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    background-color: ${({ theme }) => theme.headerBackground};
    border-top: 1px solid ${({ theme }) => theme.borderColor};
`;

const FileInfoContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const FileName = styled.span`
    margin-right: 10px;
`;

const RemoveFileButton = styled(FaTimes)`
    cursor: pointer;
    color: red;
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
`;

const TextArea = styled.textarea<{ disabled: boolean }>`
    padding: 10px;
    font-size: 16px;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 4px;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    resize: vertical; /* Allow vertical resizing */
    margin-bottom: 10px;
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const MessageLoaderContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0;

    .loader {
        margin-top: -50px;
        width: 36px;
        aspect-ratio: 1.154;
        display: grid;
        color: #000;
        background: linear-gradient(to bottom left, #0000 calc(50% - 1px), currentColor 0 calc(50% + 1px), #0000 0) right/50% 100%,
        linear-gradient(to bottom right, #0000 calc(50% - 1px), currentColor 0 calc(50% + 1px), #0000 0) left /50% 100%,
        linear-gradient(currentColor 0 0) bottom/100% 2px;
        background-repeat: no-repeat;
        transform-origin: 50% 66%;
        animation: l5 4s infinite linear;
    }

    .loader::before,
    .loader::after {
        content: "";
        grid-area: 1/1;
        background: inherit;
        transform-origin: inherit;
        animation: inherit;
    }

    .loader::after {
        animation-duration: 2s;
    }

    @keyframes l5 {
        100% {
            transform: rotate(1turn);
        }
    }
`;

const messageLoader = (
    <MessageLoaderContainer>
        <div className="loader"></div>
    </MessageLoaderContainer>
);

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
`;

const Button = styled.button<{ disabled: boolean }>`
    margin-left: 10px;
    padding: 10px;
    background-color: #0084ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const PaperclipButton = styled(Button)`
    background-color: #7938C7;
    padding: 10px; /* default size */
`;

const SendButton = styled(Button)`
    background-color: #271DA2;
    width: 80px; /* double width */
    margin-top: -10px;
`;

const Hint = styled.span`
    font-size: 12px;
    color: ${({ theme }) => theme.color};
    margin-top: -7px;
    margin-left: 5px;
    align-self: flex-start;
`;

interface MessageInputProps {
    onSendMessage: (message: MessageType) => void;
    currentUser: User;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, currentUser }) => {
    const [context, setContext] = useState<ChatContextItem[] | null>(null);
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const apiUrl = process.env.REACT_APP_API_URL;
    const agentType = process.env.REACT_APP_AGENT_TYPE;
    const isDataAnalyst = agentType === 'data-analyst';
    const isQueryEnabled = process.env.REACT_APP_DA_QUERY_ENABLED === 'true';

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (message.trim()) {
            setLoading(true);
            let fileId: string | null = null;

            if (selectedFile && isDataAnalyst) {
                try {
                    const formData = new FormData();
                    formData.append('file', selectedFile);
                    const response = await axios.post<UploadDatafileResponse>(`${apiUrl}/upload-data-file`, formData);
                    fileId = response.data.file_id;
                    setSelectedFile(null); // Clear the file after sending the message
                } catch (error) {
                    console.error('File upload error:', error);
                    alert('Failed to upload file.');
                    setLoading(false);
                    return;
                }
            }

            let endpoint: string;
            let payload;

            if (isDataAnalyst) {
                endpoint = '/analyze-data';
                payload = {
                    question_or_prompt: message,
                    data: null,
                    is_csv: isCsvFile(selectedFile),
                    data_before_prompt: false,
                    query: query,
                    file_id: fileId,
                    context,
                };
            } else {
                endpoint = '/ask-question';
                payload = {
                    question_or_prompt: message,
                    character_name: agentType,
                    context,
                    ruleset: process.env.REACT_APP_CHAT_RULESET,
                };
            }

            const newMessage: MessageType = {
                id: String(Date.now()),
                senderId: currentUser.id,
                text: message,
                timestamp: new Date(),
            };

            onSendMessage(newMessage);

            try {
                const response = await axios.post<AiResponse>(`${apiUrl}${endpoint}`, payload);
                const aiResponse = response.data.response;

                setContext(response.data.updated_context);

                setMessage(''); // Clear the message after sending the message

                const aiMessage: MessageType = {
                    id: String(Date.now() + 1),
                    senderId: 'ai',
                    text: aiResponse,
                    timestamp: new Date(),
                };

                onSendMessage(aiMessage);
            } catch (error) {
                console.error('Message sending error:', error);
                alert('Failed to send message.');
            } finally {
                setLoading(false);
            }

            if (process.env.REACT_APP_DA_CLEAR_QUERY_AFTER_SEND === 'true') {
                // Clear the query after sending the message
                setQuery('');
            }
            inputRef.current?.focus(); // Return focus to the message input field
        }
    };

    const handlePaperclipClick = () => {
        fileInputRef.current?.click();
    };

    const isCsvFile = (file: File | null): boolean => {
        if (!file) return false;

        return file.type === 'text/csv' || (file.type === 'application/vnd.ms-excel' && file.name.endsWith('.csv'));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const fileType = file.type;

            if (
                fileType === 'text/plain' ||
                fileType === 'application/json' ||
                isCsvFile(file)
            ) {
                setSelectedFile(file);
            } else {
                alert('Only .txt, .csv, or .json files are allowed');
            }
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.ctrlKey && e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <InputContainer>
            {selectedFile && (
                <FileInfoContainer>
                    <FileName>{selectedFile.name}</FileName>
                    <RemoveFileButton onClick={handleRemoveFile} />
                </FileInfoContainer>
            )}
            <FormContainer as="form" onSubmit={handleSubmit}>
                {isDataAnalyst && isQueryEnabled && (
                    <TextArea
                        rows={1}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Query (not doing anything right now, but the backend is aware of it)"
                        disabled={loading}
                    />
                )}
                <TextArea
                    rows={1}
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <Hint>Press Ctrl+Enter to send</Hint>
                <ButtonContainer>
                    {isDataAnalyst && (
                        <PaperclipButton type="button" onClick={handlePaperclipClick} disabled={loading}>
                            <FaPaperclip />
                        </PaperclipButton>
                    )}
                    <SendButton type="submit" disabled={loading}>
                        <FaPaperPlane />
                    </SendButton>
                </ButtonContainer>
                {loading && messageLoader}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".txt, .csv, .json"
                    onChange={handleFileChange}
                    disabled={loading}
                />
            </FormContainer>
        </InputContainer>
    );
};

export default MessageInput;

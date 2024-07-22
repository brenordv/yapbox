import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { FaPaperclip, FaPaperPlane, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { Message as MessageType, User, AiResponse, UploadDatafileResponse } from '../types/types';

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
`;

const TextArea = styled.textarea`
    padding: 10px;
    font-size: 16px;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 4px;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    resize: vertical; /* Allow vertical resizing */
    margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
`;

const Button = styled.button`
    margin-left: 10px;
    padding: 10px;
    background-color: #0084ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
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
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const apiUrl = process.env.REACT_APP_API_URL;
    const agentType = process.env.REACT_APP_AGENT_TYPE;
    const isDataAnalyst = agentType === 'data-analyst';
    const isQueryEnabled = process.env.REACT_APP_DA_QUERY_ENABLED === 'true';

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (message.trim()) {
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
                    return;
                }
            }

            const endpoint = isDataAnalyst ? '/analyze-data' : '/ask-question';

            let payload = {};

            const newMessage: MessageType = {
                id: String(Date.now()),
                senderId: currentUser.id,
                text: message,
                timestamp: new Date(),
            };

            onSendMessage(newMessage);

            if (!isDataAnalyst) {
                payload = {
                    question_or_prompt: message,
                    file_id: fileId,
                    query: isQueryEnabled ? query : undefined,
                    character_name: process.env.REACT_APP_AGENT_TYPE
                }
            } else {
                payload = {
                    question_or_prompt: message,
                    file_id: fileId,
                    is_csv: isCsvFile(selectedFile),
                    query: isQueryEnabled ? query : undefined,
                }
            }

            try {
                const response = await axios.post<AiResponse>(`${apiUrl}${endpoint}`, payload);
                const aiResponse = response.data.response;
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
            }



            if (process.env.REACT_APP_DA_CLEAR_QUERY_AFTER_SEND === 'true') {
                setQuery(''); // Clear the query after sending the message
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
    }

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
                    />
                )}
                <TextArea
                    rows={1}
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={handleKeyDown}
                />
                <Hint>Press Ctrl+Enter to send</Hint>
                <ButtonContainer>
                    {isDataAnalyst && (
                        <PaperclipButton type="button" onClick={handlePaperclipClick}>
                            <FaPaperclip />
                        </PaperclipButton>
                    )}
                    <SendButton type="submit">
                        <FaPaperPlane />
                    </SendButton>
                </ButtonContainer>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".txt, .csv, .json"
                    onChange={handleFileChange}
                />
            </FormContainer>
        </InputContainer>
    );
};

export default MessageInput;

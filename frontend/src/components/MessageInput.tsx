import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPaperPlane, FaPaperclip, FaTimes } from 'react-icons/fa';

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
    align-items: center;
    width: 100%;
`;

const Input = styled.input`
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 4px;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
`;

const TextArea = styled.textarea`
    width: 96.6%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 4px;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    resize: vertical; /* Allow only vertical resizing */
    margin-bottom: 10px;
    display: flex;
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
    onSendMessage: (text: string, query?: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [query, setQuery] = useState('');

    const isDataAnalyst = process.env.REACT_APP_AGENT_TYPE === 'data-analyst';
    const isQueryEnabled = process.env.REACT_APP_DA_QUERY_ENABLED === 'true';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message, isDataAnalyst && isQueryEnabled ? query : undefined);
            setMessage('');
            setSelectedFile(null); // Clear the file after sending the message
            setQuery(''); // Clear the query after sending the message
        }
    };

    const handlePaperclipClick = () => {
        document.getElementById('fileInput')?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const fileType = file.type;
            const fileName = file.name;

            if (
                fileType === 'text/plain' ||
                fileType === 'application/json' ||
                fileType === 'text/csv' ||
                (fileType === 'application/vnd.ms-excel' && fileName.endsWith('.csv'))
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

    return (
        <InputContainer>
            {selectedFile && (
                <FileInfoContainer>
                    <FileName>{selectedFile.name}</FileName>
                    <RemoveFileButton onClick={handleRemoveFile} />
                </FileInfoContainer>
            )}
            {isDataAnalyst && isQueryEnabled && (
                <TextArea
                    rows={2}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Query"
                />
            )}
            <FormContainer as="form" onSubmit={handleSubmit}>
                <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    accept=".txt, .csv, .json"
                    onChange={handleFileChange}
                />
                <PaperclipButton type="button" onClick={handlePaperclipClick}>
                    <FaPaperclip />
                </PaperclipButton>
                <SendButton type="submit">
                    <FaPaperPlane />
                </SendButton>
            </FormContainer>
        </InputContainer>
    );
};

export default MessageInput;

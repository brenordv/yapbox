import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { FaPaperclip, FaPaperPlane, FaTimes } from 'react-icons/fa';

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    background-color: ${({theme}) => theme.headerBackground};
    border-top: 1px solid ${({theme}) => theme.borderColor};

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
    onSendMessage: (text: string, query?: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isDataAnalyst = process.env.REACT_APP_AGENT_TYPE === 'data-analyst';
    const isQueryEnabled = process.env.REACT_APP_DA_QUERY_ENABLED === 'true';

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (message.trim()) {
            onSendMessage(message, isDataAnalyst && isQueryEnabled ? query : undefined);
            setMessage('');
            setSelectedFile(null); // Clear the file after sending the message
            if (process.env.REACT_APP_DA_CLEAR_QUERY_AFTER_SEND === 'true') {
                setQuery(''); // Clear the query after sending the message
            }
            inputRef.current?.focus(); // Return focus to the message input field
        }
    };

    const handlePaperclipClick = () => {
        fileInputRef.current?.click();
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
                    <PaperclipButton type="button" onClick={handlePaperclipClick}>
                        <FaPaperclip />
                    </PaperclipButton>
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

import React, { useState } from 'react';
import styled from 'styled-components';
import { Message as MessageType, User } from '../types/types';
import { FaRegClipboard, FaCheck } from 'react-icons/fa';

const MessageContainer = styled.div`
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
    position: relative;

    &:hover .icon-container {
        opacity: 1;
    }
`;

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
`;

const MessageContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const MessageHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
`;

const SenderName = styled.span`
    font-weight: bold;
    margin-right: 10px;
`;

const Timestamp = styled.span`
    font-size: 0.8em;
    color: #888;
`;

const MessageText = styled.div`
    background-color: #f0f0f0;
    color: black;
    border-radius: 8px;
    padding: 10px 15px;
    width: fit-content;
    max-width: calc(100% - 60px); /* Adjust to leave space for the icon */
    position: relative;
    display: flex;
    align-items: center;
    white-space: pre-wrap; /* Preserve line breaks */
`;

const IconContainer = styled.div`
    cursor: pointer;
    color: gray;
    display: flex;
    align-items: center;
    position: absolute;
    right: -8px;
    opacity: 0;
    transition: opacity 0.2s;
    font-size: 1.4em;
`;

const ClipboardIcon = styled(FaRegClipboard)<{ visible: boolean }>`
    transition: opacity 0.3s ease;
    opacity: ${(props) => (props.visible ? 1 : 0)};
    position: absolute;
`;

const CheckIcon = styled(FaCheck)<{ visible: boolean }>`
    transition: opacity 0.3s ease;
    opacity: ${(props) => (props.visible ? 1 : 0)};
    color: green;
    position: absolute;
`;

interface MessageProps {
    message: MessageType;
    currentUser: User;
    otherUser: User;
}

const Message: React.FC<MessageProps> = ({ message, currentUser, otherUser }) => {
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const sender = message.senderId === currentUser.id ? currentUser : otherUser;

    const handleCopyClick = async (messageId: string) => {
        await navigator.clipboard.writeText(message.text);
        setCopiedMessageId(messageId);
    };

    return (
        <MessageContainer>
            <Avatar src={sender.avatar} alt={`${sender.name}'s avatar`} />
            <MessageContentContainer>
                <MessageHeader>
                    <SenderName>{sender.name}</SenderName>
                    <Timestamp>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Timestamp>
                </MessageHeader>
                <MessageText>
                    {message.text}
                    <IconContainer className="icon-container" onClick={() => handleCopyClick(message.id)}>
                        <ClipboardIcon visible={copiedMessageId !== message.id} />
                        <CheckIcon visible={copiedMessageId === message.id} />
                    </IconContainer>
                </MessageText>
            </MessageContentContainer>
        </MessageContainer>
    );
};

export default Message;

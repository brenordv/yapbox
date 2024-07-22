export interface User {
    id: string;
    name: string;
    avatar: string;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
}

export interface ChatContextItem {
    role: string;
    content: string;
}

export interface AiGeneratorConfig {
    base_url: string;
    ai_model_name: string;
}

export interface AiResponse {
    response: string;
    updated_context: ChatContextItem[];
    config: AiGeneratorConfig;
}

export interface UploadDatafileResponse {
    file_id: string;
}

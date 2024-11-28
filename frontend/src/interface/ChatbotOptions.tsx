export interface ChatbotOption {
    id: string;
    section: string;
    subOptions: ChatbotSubOption[];
}

export interface ChatbotSubOption {
    id: string;
    question: string;
    response: string;
}

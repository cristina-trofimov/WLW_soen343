export interface ChatbotMessage {
    text: string;
    sender: "user" | "bot";
}
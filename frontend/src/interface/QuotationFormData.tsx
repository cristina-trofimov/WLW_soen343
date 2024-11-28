import { Suggestion } from "./Suggestion";

export interface QuotationFormData {
    senderAddress: string;
    recipientAddress: string;
    senderAddressCoords: [number, number] | null;
    recipientAddressCoords: [number, number] | null;
    senderAddressSuggestions: Suggestion[];
    recipientAddressSuggestions: Suggestion[];
    distance: string | null;
    weight: number;
    height: number;
    width: number;
    length: number;
    shippingPrices: {
        regular: number;
        express: number;
        eco: number;
    };
    deliveryDate: {
        regular: string;
        express: string;
        eco: string;
    };
}
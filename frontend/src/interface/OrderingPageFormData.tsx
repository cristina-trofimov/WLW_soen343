import { Suggestion } from "./Suggestion";

export interface OrderingPageFormData {
    senderName: string;
    senderAddress: string;
    recipientName: string;
    recipientAddress: string;
    recipientPhone: string;
    packageWeight: number;
    packageHeight: number;
    packageWidth: number;
    packageLength: number;
    chosenDeliveryDate: string;
    chosenShippingPrice: number
    deliveryMethod: string;
    specialInstructions: string;
    senderAddressCoords: [number, number] | null;
    recipientAddressCoords: [number, number] | null;
    senderAddressSuggestions: Suggestion[];
    recipientAddressSuggestions: Suggestion[];
    distance: string | null;
    ecoPoints: number
}
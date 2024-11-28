export interface OrderDetail {
    id: number;
    theOtherId: number;
    senderName: string;
    senderAddress: string;
    recipientName: string;
    recipientAddress: string;
    recipientPhone: string;
    minDeliveryDate: string;
    chosenDeliveryDate: string;
    chosenDeliveryTime: string;
    deliveryMethod: string;
    specialInstructions: string;
    distance: number;
}
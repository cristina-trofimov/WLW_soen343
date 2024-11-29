export interface LocationState {
    state?: {
      trackingNumber?: String;
      senderName?: String;
      senderAddress?: String;
      receiverName?: String;
      receiverAddress?: String;
      amount?: number;
    };
}
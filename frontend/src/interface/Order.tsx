import { OrderDetail } from "./OrderDetail";
import { Package } from "./Package";
import { TrackingDetails } from "./trackingDetails";

export interface Order {
    trackingNumber: string;
    price: number;
    package: Package;
    orderDetails: OrderDetail;
    customerId: number;
    review: string;
    trackingDetails: TrackingDetails;
}
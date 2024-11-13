import './MyOrdersPage.css';
import axiosClient from "../axiosClient";
import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Define the types for the order data
interface Package {
    id: number;
    weight: number;
    length: number;
    width: number;
    height: number;
}

interface OrderDetail {
    id: number;
    senderName: string;
    senderAddress: string;
    recipientName: string;
    recipientAddress: string;
    recipientPhone: string;
    chosenDeliveryDate: string;
    deliveryMethod: string;
    specialInstructions: string;
    distance: number;
}

interface Order {
    trackingNumber: string;
    price: number;
    package: Package | null;
    orderDetails: OrderDetail[];
    customerId: number;
}

const MyOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosClient.get('/get_current_user_orders');
                if (response.status === 200){
                    // success
                    console.log('Orders retrieved successfully!');
                }
                else{
                    // error
                    console.log('Failed to retrieve orders: ', response.statusText);
                }
                setOrders(response.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.error || 'An error occurred while fetching your orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="orders-container">
            <h1>My Orders</h1>
            {orders.length === 0 ? (
                <p>You have no orders.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.trackingNumber} className="order-card">
                        <h2>Tracking Number: {order.trackingNumber}</h2>
                        <p>Price: ${order.price}</p>
                        {order.package && (
                            <div className="package-info">
                                <h3>Package Details:</h3>
                                <p>Weight: {order.package.weight} kg</p>
                                <p>Dimensions: {order.package.length} x {order.package.width} x {order.package.height} cm</p>
                            </div>
                        )}
                        <div className="order-details">
                            <h3>Order Details:</h3>
                            {order.orderDetails.map((detail) => (
                                <div key={detail.id} className="order-detail-card">
                                    <p>Sender: {detail.senderName}</p>
                                    <p>Sender Address: {detail.senderAddress}</p>
                                    <p>Recipient: {detail.recipientName}</p>
                                    <p>Recipient Address: {detail.recipientAddress}</p>
                                    <p>Recipient Phone: {detail.recipientPhone}</p>
                                    <p>Chosen Delivery Date: {detail.chosenDeliveryDate}</p>
                                    <p>Delivery Method: {detail.deliveryMethod}</p>
                                    <p>Special Instructions: {detail.specialInstructions}</p>
                                    <p>Distance: {detail.distance} km</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyOrdersPage;

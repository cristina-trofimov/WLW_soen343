import './MyOrdersPage.css';
import axiosClient from "../axiosClient";
import React, { useEffect, useState } from 'react';
import { Card, Container, Title } from '@mantine/core';

// Define the types for the order data
interface Package { // might not need this
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
    package: Package;
    orderDetails: OrderDetail;
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
    
                if (response.status === 200) {
                    // Ensure orders is always an array
                    const fetchedOrders = Array.isArray(response.data) ? response.data : [];
                    setOrders(fetchedOrders as Order[]);
                } else {
                    console.log('Failed to retrieve orders: ', response.statusText);
                    setOrders([]); // Fallback to an empty array
                }
            } catch (err: any) {
                setError(err.response?.data?.error || 'An error occurred while fetching your orders.');
                setOrders([]); // Fallback to an empty array on error
            } finally {
                setLoading(false);
            }
        };
    
        fetchOrders();
    }, []);    

    // Log the orders state after it has been updated
    useEffect(() => {
        if (orders.length > 0) {
            console.log('Updated Orders State:', orders);
            orders.forEach((order) => {
                console.log('Order Details:', order.orderDetails); // Check if it's populated
                console.log('Chosen Delivery Date:', order.orderDetails.chosenDeliveryDate);
                console.log('Sender Name:', order.orderDetails.senderName);
                console.log('Recipient Name:', order.orderDetails.recipientName);
            });
        }
    }, [orders]);
     // This will trigger whenever orders state changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <Container size="sm">
            <Title order={1} ta="center" mt="md" mb="xl">
                My Orders
            </Title>
            {orders.length === 0 ? (
                <p className="no-orders">You have no orders.</p>
            ) : (
                // Check if orders is an array before calling .map()
                Array.isArray(orders) && orders.map((order) => (
                    <Card 
                        key={order.trackingNumber} 
                        className="order-card" 
                        shadow="lg" 
                        padding="lg" 
                        radius="md" 
                        withBorder 
                        mb="md">
                        
                        <h2 className="tracking-number">
                            Tracking Number: {order.trackingNumber}
                        </h2>

                        {order.orderDetails && (
                            <div className="order-details">
                                <div className="price-delivery">
                                    <p><strong>Price:</strong> ${order.price}</p>
                                    <p><strong>Delivery Expected By:</strong> {order.orderDetails.chosenDeliveryDate}</p>
                                </div>

                                <div className="order-info-container">
                                    <div className="sender-info">
                                        <p><strong>Sender:</strong> {order.orderDetails.senderName}</p>
                                        <p><strong>Sender Address:</strong> {order.orderDetails.senderAddress}</p>
                                    </div>

                                    <div className="recipient-info">
                                        <p><strong>Recipient:</strong> {order.orderDetails.recipientName}</p>
                                        <p><strong>Recipient Address:</strong> {order.orderDetails.recipientAddress}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                ))
            )}
        </Container>
    ); 
};

export default MyOrdersPage;

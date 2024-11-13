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
        // const fetchOrders = async () => {
        //     try {
        //         const response = await axiosClient.get('/get_current_user_orders');
        //         if (response.status === 200){
        //             // success
        //             console.log('Orders retrieved successfully!');
        //         }
        //         else{
        //             // error
        //             console.log('Failed to retrieve orders: ', response.statusText);
        //         }
        //         setOrders(response.data);
        //         setError(null);
        //     } catch (err: any) {
        //         setError(err.response?.data?.error || 'An error occurred while fetching your orders.');
        //     } finally {
        //         setLoading(false);
        //     }
        // };

        // fetchOrders();

        // Mock data for testing
        const mockOrders: Order[] = [
            {
                trackingNumber: '123456789',
                price: 100.0,
                package: {
                    id: 1,
                    weight: 5.0,
                    length: 30.0,
                    width: 20.0,
                    height: 15.0,
                },
                orderDetails: {
                        id: 1,
                        senderName: 'John Doe',
                        senderAddress: '123 Main St, Cityville',
                        recipientName: 'Jane Smith',
                        recipientAddress: '456 Elm St, Townsville',
                        recipientPhone: '555-1234',
                        chosenDeliveryDate: '2024-11-15',
                        deliveryMethod: 'Standard Shipping',
                        specialInstructions: 'Leave at the front door',
                        distance: 120.5,
                },
                customerId: 42,
            },
            {
                trackingNumber: '987654321',
                price: 250.0,
                package: {
                    id: 2,
                    weight: 10.0,
                    length: 50.0,
                    width: 40.0,
                    height: 25.0,
                },
                orderDetails: {
                    id: 1,
                    senderName: 'John Doe',
                    senderAddress: '123 Main St, Cityville',
                    recipientName: 'Jane Smith',
                    recipientAddress: '456 Elm St, Townsville',
                    recipientPhone: '555-1234',
                    chosenDeliveryDate: '2024-11-15',
                    deliveryMethod: 'Standard Shipping',
                    specialInstructions: 'Leave at the front door',
                    distance: 120.5,
            },
                customerId: 42,
            },
        ];

        // Simulate API response
        setTimeout(() => {
            setOrders(mockOrders);
            setLoading(false);
        }, 100);
    }, []);

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
                orders.map((order) => (
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
                                {/* Price and Delivery Date */}
                                <div className="price-delivery">
                                    <p><strong>Price:</strong> ${order.price}</p>
                                    <p><strong>Delivery Expected By:</strong> {order.orderDetails.chosenDeliveryDate}</p>
                                </div>

                                {/* Sender and Recipient Info in two columns */}
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

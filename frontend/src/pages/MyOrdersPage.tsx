import './MyOrdersPage.css';
import axiosClient from "../axiosClient";
import React, { useEffect, useState } from 'react';
import { Card, Container, Title, Button, Textarea } from '@mantine/core';

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
    theOtherId: number;
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
    review: string;
    trackingDetails: TrackingDetails;
}

interface TrackingDetails {
    status: string;
}

const MyOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [reviewText, setReviewText] = useState<string>('');
    const [editingOrder, setEditingOrder] = useState<Order | null>(null); // Track which order is being reviewed

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosClient.get('/get_current_user_orders');
                if (response.status === 200) {
                    // success
                    console.log('Orders retrieved successfully!');
                    setOrders(response.data as Order[]);
                }
                else {
                    // error
                    console.log('Failed to retrieve orders: ', response.statusText);
                }
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.error || 'An error occurred while fetching your orders.');
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
                console.log('Review: ', order.review);
                console.log('Tracking Details:', order.trackingDetails);
                console.log('Status; ', order.trackingDetails.status);
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

    const handleReviewSubmit = async (order: Order) => {
        try {

            console.log('Submitting review for order:', order.trackingNumber);
            console.log('Review Text:', reviewText);

            const response = await axiosClient.post('/submit_review', {
                orderId: order.trackingNumber,
                review: reviewText,
            });

            if (response.status === 200) {
                // Update the order with the new review
                setOrders((prevOrders) =>
                    prevOrders.map((o) =>
                        o.orderDetails.id === order.orderDetails.id ? { ...o, review: reviewText } : o
                    )
                );
                setReviewText(''); // Clear the review input
                setEditingOrder(null); // Close the review editor
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            setError('Failed to submit review.');
        }
    };

    const handleReviewClick = (order: Order) => {
        setEditingOrder(order);
    };

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
                        {order.orderDetails && order.orderDetails && (
                            <div className="order-details">
                                {/* Price and Delivery Date */}
                                <div className="price-delivery">
                                    <p><strong>Price:</strong> ${order.price}</p>
                                    <p><strong>Delivery Expected By:</strong> {order.orderDetails.chosenDeliveryDate}</p>
                                    <p><strong>Status:</strong> {order.trackingDetails.status}</p>
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

                                <div className="review-order">{order.review ? (
                                    <div className="review-text">
                                        <p><strong>Your Review:</strong></p>
                                        <p>{order.review}</p>
                                    </div>
                                ) : (
                                    // If there's no review, show the button to submit a review
                                    <Button className="review-button"
                                        onClick={() => handleReviewClick(order)}
                                        disabled={order.trackingDetails.status != "Delivered"} // Disable if the delivery date hasn't passed
                                    >
                                        Submit a Review
                                    </Button>

                                )}

                                    {/* Conditionally render the review editor if editing */}
                                    {editingOrder?.orderDetails.id === order.orderDetails.id && !order.review && (
                                        <div className="review-editor">
                                            <Textarea
                                                placeholder="Write your review"
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                                autosize
                                                minRows={4}
                                            />
                                            <Button onClick={() => handleReviewSubmit(order)}>
                                                Submit Review
                                            </Button>
                                        </div>
                                    )}

                                    {/* Show a message if the delivery date hasn't passed */}
                                    {order.trackingDetails.status != "Delivered" && !order.review && (
                                        <p className="disabled-message">You have to wait until the delivery is complete to leave a review.</p>
                                    )}
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
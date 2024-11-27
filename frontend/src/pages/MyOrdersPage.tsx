import './MyOrdersPage.css';
import axiosClient from "../axiosClient";
import React, { useEffect, useState } from 'react';
import { Card, Container, Title, Button, Textarea } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';

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

// Date formatter
const formatDate = (date: Date | string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', options).format(parsedDate);
};

// Time formatter
const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);

    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(date);
};

const MyOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [reviewText, setReviewText] = useState<string>('');
    const [editingOrder, setEditingOrder] = useState<Order | null>(null); // Track which order is being reviewed
    const [editingDeliveryDate, setEditingDeliveryDate] = useState<string | null>(null);
    const [editingDeliveryTime, setEditingDeliveryTime] = useState<string | null>(null);
    const [editingDateOrder, setEditingDateOrder] = useState<string | null>(null); // Track order being edited for date
    const [editingTimeOrder, setEditingTimeOrder] = useState<string | null>(null); // Track order being edited for time


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
                console.log('Minimum Delivery Date:', order.orderDetails.minDeliveryDate);
                console.log('Chosen Delivery Date:', order.orderDetails.chosenDeliveryDate);
                console.log('Chosen Delivery Time:', order.orderDetails.chosenDeliveryTime);
                console.log('Sender Name:', order.orderDetails.senderName);
                console.log('Recipient Name:', order.orderDetails.recipientName);
                console.log('Review: ', order.review);
                console.log('Tracking Details:', order.trackingDetails);
                console.log('Status; ', order.trackingDetails.status);
            });
        }
    }, [orders]);
     // This will trigger whenever orders state changes

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

    const handleUpdateDate = async (order: Order) => {
        if (!editingDeliveryDate) return;
    
        const formattedDate = formatDate(editingDeliveryDate);
        try {
            const response = await axiosClient.post('/modify_delivery_date', {
                trackingNumber: order.trackingNumber,
                chosenDeliveryDate: formattedDate,
            });
    
            if (response.status === 200) {
                setOrders((prevOrders) =>
                    prevOrders.map((o) =>
                        o.trackingNumber === order.trackingNumber
                            ? { ...o, orderDetails: { ...o.orderDetails, chosenDeliveryDate: formattedDate } }
                            : o
                    )
                );
                setEditingDeliveryDate(null);
                setEditingDateOrder(null);
            }
        } catch (err) {
            console.error('Error updating delivery date:', err);
            setError('Failed to update delivery date.');
        }
    };    

    const handleUpdateTime = async (order: Order) => {
        if (!editingDeliveryTime) return;
        
        const formattedTime = formatTime(editingDeliveryTime);
        
        try {
            const response = await axiosClient.post('/modify_delivery_time', {
                trackingNumber: order.trackingNumber,
                chosenDeliveryTime: formattedTime,
            });
    
            if (response.status === 200) {
                setOrders((prevOrders) =>
                    prevOrders.map((o) =>
                        o.trackingNumber === order.trackingNumber
                            ? { ...o, orderDetails: { ...o.orderDetails, chosenDeliveryTime: formattedTime } }
                            : o
                    )
                );
                setEditingDeliveryTime(null);
                setEditingTimeOrder(null);
            }
        } catch (err) {
            console.error('Error updating delivery time:', err);
            setError('Failed to update delivery time.');
        }
    };    

    const handleCancelDateEdit = () => {
        setEditingDeliveryDate(null);
        setEditingDateOrder(null);
    };

    const handleCancelTimeEdit = () => {
        setEditingDeliveryTime(null);
        setEditingTimeOrder(null);
    };

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
                        {order.orderDetails && order.orderDetails && (
                            <div className="order-details">
                                {/* Price and Delivery Date */}
                                <div className="price-delivery">
                                    <p><strong>Price:</strong> ${order.price}</p>
                                    <p><strong>Delivery Status:</strong> {order.trackingDetails.status}</p>
                                    <p>
                                        <strong>Delivery Expected By:</strong> {order.orderDetails.chosenDeliveryDate}{' '}
                                        <Button size="xs" 
                                            onClick={() => setEditingDateOrder(order.trackingNumber)}
                                            disabled={order.trackingDetails.status == "Delivered"}
                                            className="small-edit-button">   
                                            Edit
                                        </Button>
                                    </p>
                                    {editingDateOrder === order.trackingNumber && (
                                        <DatePicker
                                            value={new Date(order.orderDetails.chosenDeliveryDate)}
                                            onChange={(date) => setEditingDeliveryDate(date ? formatDate(date) : null)}
                                            minDate={new Date(order.orderDetails.minDeliveryDate)}
                                            className="custom-date-picker"
                                        />
                                    )}
                                    {editingDeliveryDate && editingDateOrder === order.trackingNumber && (
                                        <>
                                            <Button size="xs" onClick={() => handleUpdateDate(order)}>
                                                Save Date
                                            </Button>
                                            <Button size="xs" onClick={handleCancelDateEdit}>
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                    <p>
                                        <strong>At Time:</strong> {order.orderDetails.chosenDeliveryTime}{' '}
                                        <Button size="xs" 
                                            onClick={() => setEditingTimeOrder(order.trackingNumber)}
                                            disabled={order.trackingDetails.status == "Delivered"}
                                            className="small-edit-button">
                                            Edit
                                        </Button>
                                    </p>
                                    {editingTimeOrder === order.trackingNumber && (
                                        <TimeInput
                                            value={editingDeliveryTime || order.orderDetails.chosenDeliveryTime}
                                            onChange={(event) => setEditingDeliveryTime(event.target.value)}
                                            className="custom-time-input"
                                        />
                                    )}
                                    {editingDeliveryTime && editingTimeOrder === order.trackingNumber && (
                                        <>
                                            <Button size="xs" onClick={() => handleUpdateTime(order)}>
                                                Save Time
                                            </Button>
                                            <Button size="xs" onClick={handleCancelTimeEdit}>
                                                Cancel
                                            </Button>
                                        </>
                                    )}
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
                                        <p className="disabled-message">You have to wait until the delivery is completed to leave a review.</p>
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
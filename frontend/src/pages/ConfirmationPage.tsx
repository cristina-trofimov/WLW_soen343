import { Container, Paper, Title, Text, Stack, Button } from '@mantine/core';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocationState } from '../interface/LocationState';
import { ConfirmationPageDetails } from '../interface/ConfirmationPageDetails';


function OrderConfirmation() {
  const location = useLocation() as LocationState;
  const [orderDetails, setOrderDetails] = useState<ConfirmationPageDetails>({
    trackingNum: location.state?.trackingNum ?? "12345",
    senderName: location.state?.senderName ?? "Potate Sender",
    senderAddress: location.state?.senderAddress ?? "234 kdek avenue",
    receiverName: location.state?.receiverName ?? "Macabo Rapper",
    receiverAddress: location.state?.receiverAddress ?? "987 xnsj street",
    total: location.state?.total ?? 69.97,
  });
  
  const navigate = useNavigate();

  return (
    <Container size="sm" my="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Stack gap="lg">
          <Title order={2}>Order Confirmation</Title>
          <Text>Thank you for trusting us with your package! Your order has been confirmed.</Text>
          
          <Text fw={700}>Tracking Number: {orderDetails.trackingNum}</Text>
          
          <Stack gap="xs">
            <Text fw={700}>Order Summary:</Text>
            <Text>Send by {orderDetails.senderName} from {orderDetails.senderAddress}</Text>
            <Text>Send to {orderDetails.receiverName} at {orderDetails.receiverAddress}</Text>
          </Stack>
          
          <Text fw={700} size="lg">Total: ${orderDetails.total.toFixed(2)}</Text>
          
          <Button onClick={() => navigate("/home")}>Track Your Order</Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default OrderConfirmation;
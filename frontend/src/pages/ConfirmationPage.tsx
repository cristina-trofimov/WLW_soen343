import { Container, Paper, Title, Text, Stack, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function OrderConfirmation() {
  const orderDetails = {
    orderId: '12345',
    items: "",
    total: 69.97,
  };

  const navigate = useNavigate();

  const trackOrder = () => {
    // Navigate to tracking page using tracking number
    navigate("");
  }

  return (
    <Container size="sm" my="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Stack gap="lg">
          <Title order={2}>Order Confirmation</Title>
          <Text>Thank you for trusting us with your package! Your order has been confirmed.</Text>
          
          <Text fw={700}>Order ID: {orderDetails.orderId}</Text>
          
          <Stack gap="xs">
            <Text fw={700}>Order Summary:</Text>
            {/* {orderDetails.items.map((item, index) => (
              <Text key={index}>
                {item.name} - Quantity: {item.quantity} - ${item.price.toFixed(2)}
              </Text>
            ))} */}
          </Stack>
          
          <Text fw={700} size="lg">Total: ${orderDetails.total.toFixed(2)}</Text>
          
          <Button>Track Your Order</Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default OrderConfirmation;
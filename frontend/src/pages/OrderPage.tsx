import './OrderPage.css';
import { useState, ChangeEvent } from 'react';
import axios from 'axios';

import {
  Container,
  Title,
  TextInput,
  NumberInput,
  Select,
  Textarea,
  Button,
  Group,
  Paper,
  Stack,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

interface FormData {
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  packageWeight: number;
  deliveryDate: Date | null;
  deliveryMethod: string;
  specialInstructions: string;
}

const OrderPage = () => {
  const [formData, setFormData] = useState<FormData>({
    senderName: '',
    senderAddress: '',
    recipientName: '',
    recipientAddress: '',
    packageWeight: 0,
    deliveryDate: null,
    deliveryMethod: '',
    specialInstructions: '',
  });

  const handleInputChange = (name: keyof FormData, value: string | number | Date | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
  };

  return (
    <Container size="sm">
      <Title order={1} ta="center" mt="md" mb="xl">
        Package Delivery Order
      </Title>

      <Paper shadow="xs" p="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Sender Name"
              required
              value={formData.senderName}
              onChange={(e) => handleInputChange('senderName', e.currentTarget.value)}
            />
            <Textarea
              label="Sender Address"
              required
              value={formData.senderAddress}
              onChange={(e) => handleInputChange('senderAddress', e.currentTarget.value)}
            />
            <TextInput
              label="Recipient Name"
              required
              value={formData.recipientName}
              onChange={(e) => handleInputChange('recipientName', e.currentTarget.value)}
            />
            <Textarea
              label="Recipient Address"
              required
              value={formData.recipientAddress}
              onChange={(e) => handleInputChange('recipientAddress', e.currentTarget.value)}
            />
            <NumberInput
              label="Package Weight (kg)"
              required
              min={0}
              value={formData.packageWeight}
              onChange={(value) => handleInputChange('packageWeight', value || 0)}
            />
            <DatePickerInput
              label="Delivery Date"
              required
              value={formData.deliveryDate}
              onChange={(date) => handleInputChange('deliveryDate', date)}
            />
            <Select
              label="Delivery Method"
              required
              data={[
                { value: 'standard', label: 'Standard' },
                { value: 'express', label: 'Express' },
                { value: 'overnight', label: 'Overnight' },
              ]}
              value={formData.deliveryMethod}
              onChange={(value) => handleInputChange('deliveryMethod', value || '')}
            />
            <Textarea
              label="Special Instructions"
              value={formData.specialInstructions}
              onChange={(e) => handleInputChange('specialInstructions', e.currentTarget.value)}
            />
            <Group justify="right" mt="md">
              <Button type="submit">Place Order</Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default OrderPage;
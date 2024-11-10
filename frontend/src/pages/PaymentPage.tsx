import React, { useState } from "react";
import {
  Container,
  Title,
  TextInput,
  NumberInput,
  Button,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expirationDate: string;
  cvv: string;
  amount: number;
}

const PaymentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    cardHolder: "",
    expirationDate: "",
    cvv: "",
    amount: 0,
  });

  const [cvvError, setCvvError] = useState<string | null>(null);
  const [cardNumError, setCardNumError] = useState<string | null>(null);

  const handleInputChange = ( name: keyof PaymentFormData, value: string | number ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardNumChange = ( e: React.FormEvent<HTMLInputElement>, isBlur: boolean ) => {
    let value = e.currentTarget.value.replace(/\D/g, ""); // Remove non-digit characters

    if (value.length > 16) {
      value = value.slice(0, 16); // Limit to 16 digits
    }

    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 "); // Add spaces after every 4 digits

    setCardNumError(
      isBlur && value.length < 16 ? "This is not a valid card number" : null
    );

    setFormData((prev) => ({ ...prev, cardNumber: formattedValue }));
  };

  const handleExpDateChange = ( e: React.FormEvent<HTMLInputElement>, isBlur: boolean ) => {
    let value = e.currentTarget.value.replace(/[^\d/]/g, ""); // Remove non-digit and non-slash characters

    if (value.length > 5) {
      value = value.slice(0, 5); // Limit to 5 characters
    }

    if (value.length === 2 && !value.includes("/")) {
      value += "/";
    } else if (value.length === 2 && value.includes("/")) {
      value = "0" + value; // Add leading zero if only one digit before slash
    } else if (value.length === 3 && !value.includes("/")) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    if (isBlur) {
      if (value.length < 5) {
        value = "0" + value.charAt(0) + "/" + value.charAt(1) + value.charAt(3);
      }
    }

    setFormData((prev) => ({ ...prev, expirationDate: value }));
  };

  const handleCvvChange = ( e: React.FormEvent<HTMLInputElement>, isBlur: boolean ) => {
    const value = e.currentTarget.value;
    const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters

    if (isBlur) {
      // Displays error message is cvv is too short or too long when this field is not in focus
      setCvvError(
        numericValue.length > 0 && numericValue.length < 3
          ? "CVV must be 3 or 4 digits"
          : null
      );
    }
    setFormData((prev) => ({ ...prev, cvv: numericValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Payment submitted:", formData);
    navigate("/home");
    // Send to payment processor
  };

  return (
    <Container size="sm">
      <Title order={1} ta="center" mt="md" mb="xl">Payment Details</Title>

      <Paper shadow="xs" p="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              error={cardNumError}
              required
              value={formData.cardNumber}
              maxLength={19}
              onInput={(e) => handleCardNumChange(e, false)}
              onBlur={(e) => handleCardNumChange(e, true)}
            />
            <TextInput
              label="Card Holder Name"
              placeholder="John Doe"
              required
              value={formData.cardHolder}
              onChange={(e) =>
                handleInputChange("cardHolder", e.currentTarget.value)
              }
            />
            <Group grow>
              <TextInput
                label="Expiration Date"
                placeholder="MM/YY"
                required
                value={formData.expirationDate}
                onInput={(e) => handleExpDateChange(e, false)}
                onBlur={(e) => handleExpDateChange(e, true)}
              />
              <TextInput
                label="CVV"
                placeholder="123 or 1234"
                required
                value={formData.cvv}
                onInput={(e) => handleCvvChange(e, false)}
                onBlur={(e) => handleCvvChange(e, true)}
                error={cvvError}
                maxLength={4}
              />
            </Group>
            {/* TODO: should receive the total */}
            <NumberInput
              label="Amount"
              required
              readOnly
              min={0}
              value={formData.amount}
            />
            <Button
              type="submit"
              fullWidth
              mt="md"
              onClick={() => navigate("/order/payment")}
            >
              Pay Now
            </Button>
          </Stack>
        </form>
      </Paper>
      <Text size="sm" ta="center" mt="sm" c="dimmed">
        Secure payment processed by PaymentProvider
      </Text>
    </Container>
  );
};

export default PaymentPage;

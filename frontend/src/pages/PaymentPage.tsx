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
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axiosClient";

interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expirationDate: string;
  cvv: string;
  amount: number;
}

interface LocationState {
  state?: {
    trackingNumber?: String;
    senderName?: String;
    senderAddress?: String;
    receiverName?: String;
    receiverAddress?: String;
    amount?: number;
  };
}

const PaymentPage = () => {
  const location = useLocation() as LocationState;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    cardHolder: "",
    expirationDate: "",
    cvv: "",
    amount: location.state?.amount ?? 0, // Use state passed from OrderPage or default to 0
  });

  useEffect(() => {
    const amountFromState = location.state?.amount ?? 0; // Fallback to 0 if undefined
    setFormData((prev) => ({
      ...prev,
      amount: amountFromState,
    }));
  }, [location.state]);

  const [cvvError, setCvvError] = useState<string | null>(null);
  const [cardNumError, setCardNumError] = useState<string | null>(null);

  const handleInputChange = (name: keyof PaymentFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardNumChange = (e: React.FormEvent<HTMLInputElement>, isBlur: boolean) => {
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

  // const handleExpDateChange = (e: React.FormEvent<HTMLInputElement>, isBlur: boolean) => {
  //   let value = e.currentTarget.value.replace(/[^\d/]/g, ""); // Remove non-digit and non-slash characters

  //   if (value.length > 5) {
  //     value = value.slice(0, 5); // Limit to 5 characters
  //   }

  //   if (value.length === 2 && !value.includes("/")) {
  //     value += "/";
  //   } else if (value.length === 2 && value.includes("/")) {
  //     value = "0" + value; // Add leading zero if only one digit before slash
  //   } else if (value.length === 3 && !value.includes("/")) {
  //     value = value.slice(0, 2) + "/" + value.slice(2);
  //   }

  //   if (isBlur) {
  //     if (value.length < 5) {
  //       value = "0" + value.charAt(0) + "/" + value.charAt(1) + value.charAt(3);
  //     }
  //   }

  //   setFormData((prev) => ({ ...prev, expirationDate: value }));
  // };

  const handleExpDateChange = (e: React.FormEvent<HTMLInputElement>, isBlur: boolean) => {
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

    // Validate expiration date
    if (value.length === 5) {
      const [month, year] = value.split("/").map(Number);

      if (month < 1 || month > 12) {
        alert("Invalid month. Please enter a valid expiration date.");
        return;
      }

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100; // Get last two digits of the current year
      const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed
      const maxYear = currentYear + 4; // Max allowed year (4 years from now)

      if (
        year < currentYear ||
        year > maxYear ||
        (year === currentYear && month < currentMonth)
      ) {
        alert("Invalid expiration date. Please enter a date between today and the next 4 years.");
        return;
      }
    }

    e.currentTarget.value = value;

    setFormData((prev) => ({ ...prev, expirationDate: value }));
  };


  const handleCvvChange = (e: React.FormEvent<HTMLInputElement>, isBlur: boolean) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Payment submitted:", formData);
    try {
      // Send the payment request to the backend
      const response = await axiosClient.post("/payment", {
        cardNumber: formData.cardNumber,
        cardHolder: formData.cardHolder,
        expirationDate: formData.expirationDate,
        cvv: formData.cvv,
      });
      console.log("Payment successful:", response.data);

      navigate("/order/review", {
        state: {
          trackingNum: location.state?.trackingNumber, senderName: location.state?.senderName, senderAddress: location.state?.senderAddress,
          receiverName: location.state?.receiverName, receiverAddress: location.state?.receiverAddress, total: formData.amount
        }
      });
    } catch (error) {
      console.log(error)
    }
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
              onClick={() => handleSubmit}
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
import './OrderPage.css';
import React, { useState, ChangeEvent, useEffect } from 'react';
import axiosClient from "../axiosClient"
import axios from 'axios';
import {
  Button,
  Container,
  Paper,
  Stack,
  TextInput,
  Textarea,
  Title,
  Group,
  NumberInput,
  Select,
  Tooltip
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import './OrderPage.css';
import Discount from '../components/Discount';
import { Customer } from '../interface/customer';

type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

interface FormData {
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
  packageWeight: number;
  packageHeight: number;
  packageWidth: number;
  packageLength: number;
  chosenDeliveryDate: string;
  chosenShippingPrice: number
  deliveryMethod: string;
  specialInstructions: string;
  senderAddressCoords: [number, number] | null;
  recipientAddressCoords: [number, number] | null;
  senderAddressSuggestions: Suggestion[];
  recipientAddressSuggestions: Suggestion[];
  distance: string | null;
  ecoPoints: number
}

const OrderPage = () => {

  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axiosClient.get('/get_customer');
        setCurrentCustomer(response.data);
      } catch (error) {
        console.error('Failed to fetch customer:', error);
      }
    };
    fetchCustomer();
  }, []);

  const [formData, setFormData] = useState<FormData>({
    senderName: '',
    senderAddress: '',
    recipientName: '',
    recipientAddress: '',
    recipientPhone: '',
    packageWeight: 1,
    packageHeight: 10,
    packageWidth: 10,
    packageLength: 10,
    chosenDeliveryDate: '',
    chosenShippingPrice: 0,
    deliveryMethod: '',
    specialInstructions: '',
    senderAddressCoords: null,
    recipientAddressCoords: null,
    senderAddressSuggestions: [],
    recipientAddressSuggestions: [],
    distance: null,
    ecoPoints: 0
  });
  // const [phoneError, setPhoneError] = useState<string | null>(null);
  const [senderAddressError, setSenderAddressError] = useState<string | null>(null);
  const [recipientAddressError, setRecipientAddressError] = useState<string | null>(null);
  const [PhoneNumError, setPhoneNumError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Main form data change handler

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // const validatePhoneNumber = () => {
  //   const phoneString = formData.recipientPhone.toString();
  //   if (phoneString.length !== 10) {
  //     setPhoneError('Recipient phone number must be exactly 10 digits and follow the format above.');
  //     return false;
  //   }
  //   setPhoneError(null);
  //   return true;
  // };

  const handlePhoneNumChange = (e: React.FormEvent<HTMLInputElement>, isBlur: boolean) => {
    let value = e.currentTarget.value.replace(/\D/g, ""); // Remove non-digit characters

    if (value.length > 11) {
      value = value.slice(0, 10); // Limit to 16 digits
      console.log("VALUE TOO LONG");
    }

    const formattedValue = value
      .replace(/\D/g, "") // Remove all non-digit characters
      .replace(/(\d)(\d{3})?(\d{3})?(\d{4})?$/, (_, p1, p2, p3, p4) =>
        [p1, p2, p3, p4].filter(Boolean).join(" ")
      ); // Add spaces at the correct positions

    setPhoneNumError(
      isBlur && value.length < 11 ? "This is not a valid phone number" : null
    );

    setFormData((prev) => ({ ...prev, recipientPhone: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // // Validate phone number before continuing
    // if (!validatePhoneNumber()) {
    //   return;
    // }



    // Wait for calculateDistance to finish
    await calculateDistance();



    // Check if distance calculation was successful (optional)
    if (formData.distance === 'Error calculating distance' || formData.distance === 'Invalid coordinates') {
      console.error('Cannot submit: Invalid distance data');
      return;
    }
    console.log("Form data after calculating distance:", formData);

    // Check if distance calculation was successful
    if (formData.distance === 'Error calculating distance' || formData.distance === 'Invalid coordinates') {
      console.error('Cannot submit: Invalid distance data');
      return;
    }


    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
      calculateEcoPoints();
      const dataToSubmit = formData;
      console.log("Form data before posting:", dataToSubmit);
      const response = await axiosClient.post('/create_order', dataToSubmit);

      console.log("response status:", response.status);

      if (response.status === 201) {
        // Handle successful response
        console.log('Order placed successfully!');

        // Extract tracking number from the response
        const { trackingNumber } = response.data;

        // Calculate amount from formData
        const calculatedAmount = formData.chosenShippingPrice;

        // Navigate to PaymentPage with required data
        navigate("/order/payment", {
          state: {
            trackingNumber: trackingNumber,
            senderName: formData.senderName,
            senderAddress: formData.senderAddress,
            receiverName: formData.recipientName,
            receiverAddress: formData.recipientAddress,
            amount: calculatedAmount,
          },
        });
      } else {
        // Handle server-side errors
        console.error('Failed to place order:', response.statusText);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Network error:', error);
    }
  };

  const handleAddressChange = async (e: ChangeEvent<HTMLInputElement>,
    addressType: 'senderAddress' | 'recipientAddress') => {
    const query = e.target.value;

    // Update the formData state for the appropriate address field
    setFormData((prev) => ({
      ...prev,
      [addressType]: query,
    }));

    if (query.length > 2) {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=ca`);

        // Update suggestions and clear previous coordinates based on the address type
        setFormData((prev) => ({
          ...prev,
          [`${addressType}Suggestions`]: response.data,
          [`${addressType}Coords`]: null, // Clear previous coordinates
        }));
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    } else {
      // Clear suggestions if the query is too short
      setFormData((prev) => ({
        ...prev,
        [`${addressType}Suggestions`]: [],
      }));
    }
  };

  const handleSelectSuggestion = (
    suggestion: Suggestion,
    addressType: 'senderAddress' | 'recipientAddress'
  ) => {
    setFormData((prev) => ({
      ...prev,
      [addressType]: suggestion.display_name,
      [`${addressType}Coords`]: [parseFloat(suggestion.lat), parseFloat(suggestion.lon)],
      [`${addressType}Suggestions`]: [],
    }));
  };

  const calculateEcoPoints = () => {
    console.log("entering calculateEcoPoints")
    if (formData.deliveryMethod === "eco") {
      console.log("delivery method is eco")
      if (!discountApplied) {
        console.log("discount not applied")
        console.log("chosen shipping price", formData.chosenShippingPrice)
        formData.ecoPoints = Math.floor(formData.chosenShippingPrice / 10);
        console.log("eco points", formData.ecoPoints)
      }
    }
  }

  const calculateShippingPrices = (distance: number) => {
    if (!formData.packageWeight || !formData.packageHeight || !formData.packageWidth || !formData.packageLength) {
      alert('Please fill all package dimensions (weight, height, width, length)');
      return;
    }

    // Basic calculation for volume and weight-based price (sample formula)
    const volume = formData.packageHeight * formData.packageWidth * formData.packageLength; // Volume in cubic units
    const basePrice = volume * 0.10 + formData.packageWeight * 0.10 + 0.001 * distance; // Price formula

    // Calculate prices for each shipping method
    const regularPrice = basePrice;
    const expressPrice = regularPrice * 1.2; // Express is 20% more expensive
    const ecoPrice = regularPrice * 0.8; // Eco is 20% cheaper


    formData.chosenShippingPrice =
      formData.deliveryMethod === 'regular' ? parseFloat(regularPrice.toFixed(2)) :
        formData.deliveryMethod === 'express' ? parseFloat(expressPrice.toFixed(2)) :
          parseFloat(ecoPrice.toFixed(2));

    if (discountApplied) {
      formData.chosenShippingPrice = parseFloat((formData.chosenShippingPrice * 0.85).toFixed(2));
    }
  };

  const calculateDeliveryDate = (daysToAdd: number): string => {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    return today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const updateDeliveryDates = () => {
    formData.chosenDeliveryDate = formData.deliveryMethod === 'regular' ? calculateDeliveryDate(5) :
      formData.deliveryMethod === 'express' ? calculateDeliveryDate(2) :
        calculateDeliveryDate(8);
  };

  // Calculate the distance using OpenRouteService API
  const calculateDistance = async () => {

    if (!formData.senderAddressCoords) {
      setSenderAddressError('Please select a valid sender address');
      return;
    } else if (!formData.recipientAddressCoords) {
      setRecipientAddressError('Please select a valid recipient address');
      return;
    } else {
      setSenderAddressError(null);
      setRecipientAddressError(null);
    }

    if (formData.senderAddressCoords && formData.recipientAddressCoords) {
      const apiKey = '5b3ce3597851110001cf6248f835839e4a72421881fa97ad83367c9d'; // Your OpenRouteService API Key
      const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;
      const body = `{
            "coordinates": [
                [${formData.senderAddressCoords[1]}, ${formData.senderAddressCoords[0]}],
                [${formData.recipientAddressCoords[1]}, ${formData.recipientAddressCoords[0]}]
            ]
        }`;
      // Create a new XMLHttpRequest
      const request = new XMLHttpRequest();
      request.open('POST', url);
      request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
      request.setRequestHeader('Content-Type', 'application/json');
      request.setRequestHeader('Authorization', apiKey);

      request.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            const responseData = JSON.parse(this.responseText);
            const distanceInMeters = responseData.features[0].properties.segments[0].distance;
            const distanceInKm = (distanceInMeters / 1000).toFixed(2);
            formData.distance = distanceInKm + 'km';
            calculateShippingPrices(parseFloat(distanceInKm));
            updateDeliveryDates();

          } else {
            formData.distance = 'Error calculating distance';
          }
        }
      };
      request.send(body);

    } else {
      formData.distance = 'Invalid coordinates';
    }
  }

  const shippingMethods = `Regular shipping is cost-effective and usually takes longer to deliver. Ideal for non-urgent deliveries.
Express shipping delivers faster at a higher cost. Great for urgent deliveries.
Eco shipping is environmentally friendly and balances cost and delivery time.`;

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
            <TextInput
              label="Sender Address"
              required
              value={formData.senderAddress}
              onChange={(e) => handleAddressChange(e, 'senderAddress')}
              error={senderAddressError}
            />
            {formData.senderAddressSuggestions.length > 0 && (
              <div className="suggestion-container" id="sender-suggestion">
                {formData.senderAddressSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      handleSelectSuggestion(suggestion, 'senderAddress')
                    }
                    className="suggestion-item"
                  >
                    {suggestion.display_name}
                  </div>
                ))}
              </div>
            )}
            <TextInput
              label="Recipient Name"
              required
              value={formData.recipientName}
              onChange={(e) => handleInputChange('recipientName', e.currentTarget.value)}
            />
            < TextInput
              label="Recipient Address"
              required
              value={formData.recipientAddress}
              onChange={(e) => handleAddressChange(e, 'recipientAddress')}
              error={recipientAddressError}
            />
            {formData.recipientAddressSuggestions.length > 0 && (
              <div className="suggestion-container" id="recipient-suggestion">
                {formData.recipientAddressSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      handleSelectSuggestion(suggestion, 'recipientAddress')
                    }
                    className="suggestion-item"
                  >
                    {suggestion.display_name}
                  </div>
                ))}
              </div>
            )}
            <TextInput
              label="Recipient Phone (format: 1 234 567 890)"
              required
              value={formData.recipientPhone}
              // onChange={(e) => handleInputChange('recipientPhone', Number(e.currentTarget.value))}
              error={PhoneNumError}
              onInput={(e) => handlePhoneNumChange(e, false)}
              onBlur={(e) => handlePhoneNumChange(e, true)}
              placeholder='1 234 567 890'
            />
            <NumberInput
              label="Package Weight (kg)"
              required
              min={1}
              value={formData.packageWeight}
              placeholder='1'
              onChange={(value) => handleInputChange('packageWeight', value || 0)}
            />
            <NumberInput
              label="Package Width (cm)"
              required
              min={10}
              value={formData.packageWidth}
              placeholder='10'
              onChange={(value) => handleInputChange('packageWidth', value || 0)}
            />
            <NumberInput
              label="Package Length (cm)"
              required
              min={10}
              value={formData.packageLength}
              placeholder='10'
              onChange={(value) => handleInputChange('packageLength', value || 0)}
            />
            <NumberInput
              label="Package Height (cm)"
              required
              min={10}
              value={formData.packageHeight}
              placeholder='10'
              onChange={(value) => handleInputChange('packageHeight', value || 0)}
            />            
            <Group>
              <Select
                label="Delivery Method"
                required
                data={[
                  { value: 'standard', label: 'Standard' },
                  { value: 'express', label: 'Express' },
                  { value: 'eco', label: 'Eco' },
                ]}
                value={formData.deliveryMethod}
                onChange={(value) => handleInputChange('deliveryMethod', value || '')}
              />
              <Tooltip multiline w={300} label={
                <div>
                  {shippingMethods.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              }>
                <span style={{ cursor: 'help' }}>ℹ️</span>
              </Tooltip>
            </Group>


            {currentCustomer && currentCustomer.ecoPoints > 5 && (<Discount discountApplied={discountApplied} setDiscountApplied={setDiscountApplied} />)}

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
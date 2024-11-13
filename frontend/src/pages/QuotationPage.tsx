import './QuotationPage.css';
import {useState, ChangeEvent} from 'react';
import axios from 'axios';
import {
    Button,
    Container,
    Paper,
    Stack,
    TextInput,
    Title,
    Group,
    NumberInput
} from '@mantine/core';

type Suggestion = {
    display_name: string;
    lat: string;
    lon: string;
};

interface QuotationFormData {
    senderAddress: string;
    recipientAddress: string;
    senderAddressCoords: [number, number] | null;
    recipientAddressCoords: [number, number] | null;
    senderAddressSuggestions: Suggestion[];
    recipientAddressSuggestions: Suggestion[];
    distance: string | null;
    weight: number;
    height: number;
    width: number;
    length: number;
    shippingPrices: {
        regular: number;
        express: number;
        eco: number;
    };
    deliveryDate: {
        regular: string;
        express: string;
        eco: string;
    };
}

const QuotationPage: React.FC = () => {
    const [qFormData, setQFormData] = useState<QuotationFormData>({
        senderAddress: '',
        recipientAddress: '',
        senderAddressCoords: null,
        recipientAddressCoords: null,
        senderAddressSuggestions: [],
        recipientAddressSuggestions: [],
        distance: null,
        weight: 0,
        height: 0,
        width: 0,
        length: 0,
        shippingPrices: {
            regular: 0,
            express: 0,
            eco: 0,
        },
        deliveryDate: {
            regular: "",
            express: "",
            eco: ""
        }
    });
    const [senderAddressError, setSenderAddressError] = useState<string | null>(null);
    const [recipientAddressError, setRecipientAddressError] = useState<string | null>(null);
    const [isResultsVisible, setIsResultsVisible] = useState(false);


    // Main form data change handler
    const handleInputChange = (field: keyof QuotationFormData, value: any) => {
        setQFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleAddressChange = async (e: ChangeEvent<HTMLInputElement>,
                                       addressType: 'senderAddress' | 'recipientAddress') => {
        const query = e.target.value;

        // Update the formData state for the appropriate address field
        setQFormData((prev) => ({
            ...prev,
            [addressType]: query,
        }));

        if (query.length > 2) {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=ca`);

                // Update suggestions and clear previous coordinates based on the address type
                setQFormData((prev) => ({
                    ...prev,
                    [`${addressType}Suggestions`]: response.data,
                    [`${addressType}Coords`]: null, // Clear previous coordinates
                }));
            } catch (error) {
                console.error("Error fetching address suggestions:", error);
            }
        } else {
            // Clear suggestions if the query is too short
            setQFormData((prev) => ({
                ...prev,
                [`${addressType}Suggestions`]: [],
            }));
        }
    };


    // Handle suggestion selection
    const handleSelectSuggestion = (
        suggestion: Suggestion,
        addressType: 'senderAddress' | 'recipientAddress'
    ) => {
        setQFormData((prev) => ({
            ...prev,
            [addressType]: suggestion.display_name,
            [`${addressType}Coords`]: [parseFloat(suggestion.lat), parseFloat(suggestion.lon)],
            [`${addressType}Suggestions`]: [],
        }));
    };
    // Function to calculate the shipping prices
    const calculateShippingPrices = (distance: number) => {
        if (!qFormData.weight || !qFormData.height || !qFormData.width || !qFormData.length) {
            alert('Please fill all package dimensions (weight, height, width, length)');
            return;
        }

        // Basic calculation for volume and weight-based price (just a sample formula)
        const volume = qFormData.height * qFormData.width * qFormData.length; // Volume in cubic units
        const basePrice = volume * 0.10 + qFormData.weight * 0.25 + 5 + 0.90 * distance; // Price formula

        // Calculate prices based on the shipping methods
        const regularPrice = basePrice;
        const expressPrice = regularPrice * 1.2; // Express shipping is 20% more expensive
        const ecoPrice = regularPrice * 0.8; // Eco shipping is 20% cheaper

        // Update the state with the prices
        qFormData.shippingPrices = ({
            regular: parseFloat(regularPrice.toFixed(2)),
            express: parseFloat(expressPrice.toFixed(2)),
            eco: parseFloat(ecoPrice.toFixed(2))
        });
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
        qFormData.deliveryDate = ({
            regular: calculateDeliveryDate(5),   // Regular: 5 days from today
            express: calculateDeliveryDate(2),   // Express: 2 days from today
            eco: calculateDeliveryDate(8)        // Eco: 8 days from today
        });
    };

    // Calculate the distance using OpenRouteService API
    const calculateDistance = () => {

        if (!qFormData.senderAddressCoords) {
            setSenderAddressError('Please select a valid sender address');
            return;
        } else if (!qFormData.recipientAddressCoords) {
            setRecipientAddressError('Please select a valid recipient address');
            return;
        } else {
            setSenderAddressError(null);
            setRecipientAddressError(null);
        }

        if (qFormData.senderAddressCoords && qFormData.recipientAddressCoords) {
            const apiKey = '5b3ce3597851110001cf6248f835839e4a72421881fa97ad83367c9d'; // Your OpenRouteService API Key
            const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;
            const body = `{
            "coordinates": [
                [${qFormData.senderAddressCoords[1]}, ${qFormData.senderAddressCoords[0]}],
                [${qFormData.recipientAddressCoords[1]}, ${qFormData.recipientAddressCoords[0]}]
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
                        qFormData.distance = distanceInKm + 'km';
                        calculateShippingPrices(parseFloat(distanceInKm));
                        updateDeliveryDates();
                        setIsResultsVisible(true);

                    } else {
                        qFormData.distance = 'Error calculating distance';
                        setIsResultsVisible(false);
                    }
                }
            };
            request.send(body);

        } else {
            qFormData.distance = 'Invalid coordinates';
            setIsResultsVisible(false);

        }
    };

    return (
        <Container size="sm">
            <Title order={1} ta="center" mt="md" mb="xl">
                Package Quotation
            </Title>

            <Paper shadow="xs" p="md">
                <form>
                    <Stack gap="md">
                        <TextInput
                            label="Sender Address"
                            required
                            value={qFormData.senderAddress}
                            onChange={(e) => handleAddressChange(e, 'senderAddress')}
                            error={senderAddressError}
                        />
                        {qFormData.senderAddressSuggestions.length > 0 && (
                            <div className="suggestion-container" id="sender-suggestion">
                                {qFormData.senderAddressSuggestions.map((suggestion, index) => (
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
                        < TextInput
                            label="Recipient Address"
                            required
                            value={qFormData.recipientAddress}
                            onChange={(e) => handleAddressChange(e, 'recipientAddress')}
                            error={recipientAddressError}
                        />
                        {qFormData.recipientAddressSuggestions.length > 0 && (
                            <div className="suggestion-container" id="recipient-suggestion">
                                {qFormData.recipientAddressSuggestions.map((suggestion, index) => (
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
                        <NumberInput
                            label="Package Weight (kg)"
                            required
                            min={0}
                            value={qFormData.weight}
                            onChange={(value) => handleInputChange('weight', value || 0)}
                        />
                        <NumberInput
                            label="Package Width (cm)"
                            required
                            min={0}
                            value={qFormData.width}
                            onChange={(value) => handleInputChange('width', value || 0)}
                        />
                        <NumberInput
                            label="Package Length (cm)"
                            required
                            min={0}
                            value={qFormData.length}
                            onChange={(value) => handleInputChange('length', value || 0)}
                        />
                        <NumberInput
                            label="Package Height (cm)"
                            required
                            min={0}
                            value={qFormData.height}
                            onChange={(value) => handleInputChange('height', value || 0)}
                        />
                        <Group justify="right" mt="md">
                            <Button onClick={calculateDistance}>check Quote</Button>
                        </Group>
                    </Stack>
                </form>
            </Paper>

            {isResultsVisible && (
                <>
                    <p>Distance: {qFormData.distance}</p>

                    <div>
                        <p>Shipping prices & Dates</p>
                        <p>Regular Shipping: ${qFormData.shippingPrices.regular} - delivers
                            on {qFormData.deliveryDate.regular}</p>
                        <p>Express Shipping: ${qFormData.shippingPrices.express} - delivers
                            on {qFormData.deliveryDate.express}</p>
                        <p>Eco Shipping: ${qFormData.shippingPrices.eco} - delivers on {qFormData.deliveryDate.eco}</p>
                    </div>
                </>
            )}
        </Container>
    );
};

export default QuotationPage;
import './QuotationPage.css';
import { useState, ChangeEvent } from 'react';
import axios from 'axios';

// Define the type for a suggestion object
type Suggestion = {
    display_name: string;
    lat: string;
    lon: string;
};

const QuotationPage = () => {
    const [shippingAddress, setShippingAddress] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [shippingCoords, setShippingCoords] = useState<[number, number] | null>(null);
    const [deliveryCoords, setDeliveryCoords] = useState<[number, number] | null>(null);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [distance, setDistance] = useState<string | null>(null);

    // Fetch address suggestions and update coordinates
    const handleAddressChange = async (
        e: ChangeEvent<HTMLInputElement>,
        setAddress: React.Dispatch<React.SetStateAction<string>>,
        setCoords: React.Dispatch<React.SetStateAction<[number, number] | null>>
    ) => {
        const query = e.target.value;
        setAddress(query);

        if (query.length > 2) {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
                setSuggestions(response.data);

                // Optional: clear coordinates when a new search starts
                setCoords(null);
            } catch (error) {
                console.error("Error fetching address suggestions:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    // Handle selection of an address suggestion
    const handleSelectSuggestion = (
        suggestion: Suggestion,
        setAddress: React.Dispatch<React.SetStateAction<string>>,
        setCoords: React.Dispatch<React.SetStateAction<[number, number] | null>>
    ) => {
        setAddress(suggestion.display_name);
        setCoords([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
        setSuggestions([]);
    };

    // Calculate the distance between two coordinates
    const calculateDistance = async () => {
        if (shippingCoords && deliveryCoords) {
            const apiKey = '5b3ce3597851110001cf6248f835839e4a72421881fa97ad83367c9d'; // Replace with your OpenRouteService API key
            const url = `https://api.openrouteservice.org/v2/matrix/driving-car`;

            try {
                const response = await axios.post(url, {
                    locations: [shippingCoords, deliveryCoords],
                    metrics: ["distance"]
                }, {
                    headers: {
                        Authorization: apiKey,
                        "Content-Type": "application/json",
                    },
                });

                console.log("API Response:", response.data);


                const distanceInMeters = response.data.distances[0][1];
                setDistance((distanceInMeters / 1000).toFixed(2) + " km");
            } catch (error) {
                console.error("Error calculating distance:", error);
                setDistance("Error calculating distance");
            }
        }
    };
console.log("Shipping Coordinates:", shippingCoords);
console.log("Delivery Coordinates:", deliveryCoords);

    return (


        <div>
            <p>Quotation Service</p>
            <form id="quotationForm" onSubmit={(e) => e.preventDefault()}>
                <label>Shipping Address</label><br />
                <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => handleAddressChange(e, setShippingAddress, setShippingCoords)}
                    placeholder="Shipping address"
                /><br />
                {suggestions.length > 0 && (
                    <div className="suggestion-container">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelectSuggestion(suggestion, setShippingAddress, setShippingCoords)}
                                className="suggestion-item"
                            >
                                {suggestion.display_name}
                            </div>
                        ))}
                    </div>
                )}

                <label>Delivery Address</label><br />
                <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => handleAddressChange(e, setDeliveryAddress, setDeliveryCoords)}
                    placeholder="Delivery address"
                /><br />
                {suggestions.length > 0 && (
                    <div className="suggestion-container">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelectSuggestion(suggestion, setDeliveryAddress, setDeliveryCoords)}
                                className="suggestion-item"
                            >
                                {suggestion.display_name}
                            </div>
                        ))}
                    </div>
                )}

                <label>Weight</label><br />
                <input name="weight" type="text" placeholder="Weight" /><br />
                <label>Height</label><br />
                <input name="height" type="text" placeholder="Height" /><br />
                <label>Width</label><br />
                <input name="width" type="text" placeholder="Width" /><br />
                <label>Length</label><br />
                <input name="length" type="text" placeholder="Length" /><br />

                <button onClick={calculateDistance}>Get Quotation</button>
            </form>

            {distance && <p>Distance: {distance}</p>}
        </div>
    );
};

export default QuotationPage;


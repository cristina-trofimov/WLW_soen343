import './QuotationPage.css';
import { useState, ChangeEvent, useEffect } from 'react';
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

  useEffect(() => {
    console.log("Shipping Coordinates:", shippingCoords);
  }, [shippingCoords]);

  useEffect(() => {
    console.log("Delivery Coordinates:", deliveryCoords);
  }, [deliveryCoords]);

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
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=ca`);
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

  // Calculate the distance between two coordinates using XMLHttpRequest
  const calculateDistance = () => {
    if (shippingCoords && deliveryCoords) {
      const apiKey = '5b3ce3597851110001cf6248f835839e4a72421881fa97ad83367c9d'; // Your OpenRouteService API Key
      const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;

      // Create a new XMLHttpRequest
      const request = new XMLHttpRequest();

      // Open the request with POST method and the OpenRouteService API URL
      request.open('POST', url);

      // Set necessary headers
      request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
      request.setRequestHeader('Content-Type', 'application/json');
      request.setRequestHeader('Authorization', apiKey); // Replace with your actual API key

      // Handle the response
      request.onreadystatechange = function () {
        if (this.readyState === 4) { // When request completes
          if (this.status === 200) { // If request was successful
            console.log('Status:', this.status);
            console.log('Headers:', this.getAllResponseHeaders());
            console.log('Body:', this.responseText);

            // Parsing the response to extract distance
            try {
              const responseData = JSON.parse(this.responseText);
              // Assuming the first feature contains the distance
              const distanceInMeters = responseData.features[0].properties.segments[0].distance;
              console.log(`Distance: ${(distanceInMeters / 1000).toFixed(2)} km`); // Convert to kilometers and log

              // You can return the distance here, or update the UI
              const distanceInKm = (distanceInMeters / 1000).toFixed(2);
              setDistance(distanceInKm + " km");
            } catch (error) {
              console.error('Error parsing response:', error);
              setDistance("Error calculating distance");
            }
          } else {
            console.error('Error with the request:', this.status);
            setDistance("Error calculating distance");
          }
        }
      };

      // Define the body with coordinates from the parameters
      const body = `{
        "coordinates": [
          [${shippingCoords[1]}, ${shippingCoords[0]}],
          [${deliveryCoords[1]}, ${deliveryCoords[0]}]
        ]
      }`;
      console.log(body);
      // Send the request with the coordinates as the body
      request.send(body);
    } else {
      console.warn("Shipping or Delivery coordinates are missing:", shippingCoords, deliveryCoords);
      setDistance("Invalid coordinates");
    }
  };

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


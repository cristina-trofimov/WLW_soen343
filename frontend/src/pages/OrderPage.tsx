import './QuotationPage.css';
import { useState, ChangeEvent } from 'react';
import axios from 'axios';

// Define the type for a suggestion object
type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
};

const OrderPage = () => {
  const [shippingAddress, setShippingAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [shippingCoords, setShippingCoords] = useState<[number, number] | null>(null);
  const [deliveryCoords, setDeliveryCoords] = useState<[number, number] | null>(null);
  const [shippingSuggestions, setShippingSuggestions] = useState<Suggestion[]>([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState<Suggestion[]>([]);
  const [distance, setDistance] = useState<string | null>(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [shippingPrices, setShippingPrices] = useState({
    regular: 0,
    express: 0,
    eco: 0
  });
  const [deliveryDate, setDeliveryDate] = useState({
    regular: "",
    express: "",
    eco: ""
  });

  // Handle address input change
  const handleAddressChange = async (
    e: ChangeEvent<HTMLInputElement>,
    setAddress: React.Dispatch<React.SetStateAction<string>>,
    setCoords: React.Dispatch<React.SetStateAction<[number, number] | null>>,
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>
  ) => {
    const query = e.target.value;
    setAddress(query);

    if (query.length > 2) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=ca`
        );
        setSuggestions(response.data);
        setCoords(null);  // Clear previous coordinates
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (
    suggestion: Suggestion,
    setAddress: React.Dispatch<React.SetStateAction<string>>,
    setCoords: React.Dispatch<React.SetStateAction<[number, number] | null>>,
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>
  ) => {
    setAddress(suggestion.display_name);
    setCoords([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
    setSuggestions([]);
  };

  // Function to calculate the shipping prices
  const calculateShippingPrices = (distance: number) => {
    if (!weight || !height || !width || !length) {
      alert('Please fill all package dimensions (weight, height, width, length)');
      return;
    }

    const packageWeight = parseFloat(weight);
    const packageHeight = parseFloat(height);
    const packageWidth = parseFloat(width);
    const packageLength = parseFloat(length);

    // Basic calculation for volume and weight-based price (just a sample formula)
    const volume = packageHeight * packageWidth * packageLength;
    const basePrice = volume * 0.10 + packageWeight * 0.25 + 5 + 0.90 * distance;

    const regularPrice = basePrice;
    const expressPrice = regularPrice * 1.2;
    const ecoPrice = regularPrice * 0.8;

    setShippingPrices({
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
    setDeliveryDate({
      regular: calculateDeliveryDate(5),
      express: calculateDeliveryDate(2),
      eco: calculateDeliveryDate(8)
    });
  };

  // Calculate the distance using OpenRouteService API
  const calculateDistance = () => {
    if (shippingCoords && deliveryCoords) {
      const apiKey = '5b3ce3597851110001cf6248f835839e4a72421881fa97ad83367c9d';
      const url = `https://api.openrouteservice.org/v2/directions/driving-car/geojson`;

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
            setDistance(distanceInKm + ' km');
            calculateShippingPrices(parseFloat(distanceInKm));
            updateDeliveryDates();
          } else {
            setDistance('Error calculating distance');
          }
        }
      };

      const body = `{
        "coordinates": [
          [${shippingCoords[1]}, ${shippingCoords[0]}],
          [${deliveryCoords[1]}, ${deliveryCoords[0]}]
        ]
      }`;

      request.send(body);
    } else {
      setDistance('Invalid coordinates');
    }
  };

  return (
    <div>
      <p>Order Service</p>
      <form id="orderForm" onSubmit={(e) => e.preventDefault()}>
        <label>Shipping Address</label><br />
        <input
          type="text"
          value={shippingAddress}
          onChange={(e) =>
            handleAddressChange(e, setShippingAddress, setShippingCoords, setShippingSuggestions)
          }
          placeholder="Shipping address"
        /><br />
        {shippingSuggestions.length > 0 && (
          <div className="suggestion-container">
            {shippingSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() =>
                  handleSelectSuggestion(suggestion, setShippingAddress, setShippingCoords, setShippingSuggestions)
                }
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
          onChange={(e) =>
            handleAddressChange(e, setDeliveryAddress, setDeliveryCoords, setDeliverySuggestions)
          }
          placeholder="Delivery address"
        /><br />
        {deliverySuggestions.length > 0 && (
          <div className="suggestion-container">
            {deliverySuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() =>
                  handleSelectSuggestion(suggestion, setDeliveryAddress, setDeliveryCoords, setDeliverySuggestions)
                }
                className="suggestion-item"
              >
                {suggestion.display_name}
              </div>
            ))}
          </div>
        )}

        <label>Weight (kg)</label><br />
        <input
          name="weight"
          type="text"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight"
        /><br />
        <label>Height (cm)</label><br />
        <input
          name="height"
          type="text"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Height"
        /><br />
        <label>Width (cm)</label><br />
        <input
          name="width"
          type="text"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          placeholder="Width"
        /><br />
        <label>Length (cm)</label><br />
        <input
          name="length"
          type="text"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          placeholder="Length"
        /><br />

        <button onClick={calculateDistance}>Get Quotation</button>
      </form>

      {distance && (
        <>
          <p>Distance: {distance}</p>

          <div>
            <p>Shipping Dates</p>
            <p>Regular Shipping: ${shippingPrices.regular} (delivers: {deliveryDate.regular})</p>
            <p>Express Shipping: ${shippingPrices.express} (delivers: {deliveryDate.express})</p>
            <p>Eco Shipping: ${shippingPrices.eco} (delivers: {deliveryDate.eco})</p>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderPage;

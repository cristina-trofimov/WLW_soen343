import { useState } from 'react';
import { Button, TextInput, Group, Modal, Loader, Text } from '@mantine/core';
import { TrackingDetails } from '../interface/trackingDetails.interface';
import axiosClient from '../axiosClient';

const TrackDelivery = () => {
  const [trackingId, setTrackingId] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<TrackingDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async () => {
    setIsLoading(true);
    setErrorMessage('');  // Clear any previous errors
    setDeliveryInfo(null);  // Reset delivery info

    try {
      const response = await axiosClient.get("/tracking_details", { params: { trackingNumber: trackingId } });

      if (response.status === 200) {
        setDeliveryInfo(response.data);
        setModalOpened(true);
      } else {
        setErrorMessage('Oops! We could not find any package associated with that tracking ID. Please verify and try again.');
        setModalOpened(true);
      }
    } catch (err) {
      setErrorMessage('Oops! We could not find any package associated with that tracking ID. Please verify and try again.');
      setModalOpened(true);
    } finally {
      setIsLoading(false);
    }
    // // Simulate API call to get delivery information , for now hardcoded
    // if (trackingId === 'O123456789') {
    //   setDeliveryInfo({
    //     status: 'In Transit',
    //     location: 'New York, NY',
    //     eta: '2024-11-09 15:30',
    //     contactName: 'Boudour Bannouri',
    //     contactPhone: '+1 438 221 2758',
    //   });
    //   setErrorMessage('');  // Clear any previous errors
    //   setModalOpened(true); // Open the modal
    // } else {
    //   setErrorMessage('Oops! We could not find any package associated with that tracking ID. Please verify and try again.');
    //   setDeliveryInfo(null);  // Reset delivery info
    //   setModalOpened(true);   // Show error modal
    // }
  };


  const handleCreateTracking = async () => {
    const trackingData = {
      trackingNumber: '1234',
      lastRegisteredLocation: 'New York, NY',
      status: 'In Transit',
      estimatedDeliveryTime: '2024-11-20 14:30:00',
      deliveryPersonNumber: 12345
    };

    try {
      const response = await axiosClient.post('/create_tracking', trackingData);
      setErrorMessage('Tracking detail created successfully!');
    } catch (error) {
      setErrorMessage('Error creating tracking detail');
    }
  };

  return (
    <div style={{ padding: '40px 20px' }}>
      {/* Styled Title */}
      <h1 style={{
        fontFamily: '"Alamanda", sans-serif',
        fontSize: '72px',
        marginBottom: '40px',
        color: '#444',
        textAlign: 'left',
        fontStyle: 'italic',
        fontWeight: '300', // Use a lighter weight for elegance
      }}>
        Track your delivery
      </h1>

      {/* Input and Button */}
      <Group justify="left" gap="sm" style={{ marginTop: '40px' }}>
        <TextInput
          size="lg"
          radius="md"
          placeholder="ENTER TRACKING ID"
          value={trackingId}
          disabled={isLoading}
          onChange={(e) => setTrackingId(e.target.value)}
          style={{
            width: '500px',
          }}
        />
        <Button
          size="lg"
          radius="md"
          onClick={handleTrack}
          style={{
            width: '100px',
            fontSize: '18px', // Increase font size
          }}>
          {isLoading ? <Loader color='black' size="sm" /> : 'Track'}
        </Button>

        <div>
          <Button
            onClick={handleCreateTracking}
            color="blue"
            size="md"
          >
            Create Tracking Detail
          </Button>
          {errorMessage && <Text >{errorMessage}</Text>}
        </div>
      </Group>

      {/* Modal for displaying delivery information or error */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        centered
      >
        {deliveryInfo ? (
          <div>
            <h1> Delivery Information </h1>
            <p><strong>Package Status:</strong> {deliveryInfo.status}</p>
            <p><strong>Last Registered Location:</strong> {deliveryInfo.lastRegisteredLocation}</p>
            <p><strong>Estimated Time of Arrival:</strong> {deliveryInfo.estimatedDeliveryTime || 'Not available'}</p>
            <p><strong>Delivery Person Number:</strong> {deliveryInfo.deliveryPersonNumber || 'Not assigned'}</p>
          </div>
        ) : (
          <p style={{ color: 'red' }}>{errorMessage}</p>
        )}
        <Button onClick={() => setModalOpened(false)} style={{ marginTop: '10px' }}>Close</Button>
      </Modal>
    </div>
  );
};

export default TrackDelivery;

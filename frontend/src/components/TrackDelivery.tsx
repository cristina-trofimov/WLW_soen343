import { useState } from 'react';
import { Button, TextInput, Group, Modal} from '@mantine/core';

const TrackDelivery = () => {
  const [trackingId, setTrackingId] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<null | {
    status: string,
    location: string,
    eta: string,
    contactName: string,
    contactPhone: string
  }>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTrack = () => {
    // Simulate API call to get delivery information , for now hardcoded
    if (trackingId === 'O123456789') {
      setDeliveryInfo({
        status: 'In Transit',
        location: 'New York, NY',
        eta: '2024-11-09 15:30',
        contactName: 'Boudour Bannouri',
        contactPhone: '+1 438 221 2758',
      });
      setErrorMessage('');  // Clear any previous errors
      setModalOpened(true); // Open the modal
    } else {
      setErrorMessage('Oops! We could not find any package associated with that tracking ID. Please verify and try again.');
      setDeliveryInfo(null);  // Reset delivery info
      setModalOpened(true);   // Show error modal
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
          Track
        </Button>
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
            <p><strong>Real-time Location:</strong> {deliveryInfo.location}</p>
            <p><strong>Estimated Time of Arrival:</strong> {deliveryInfo.eta}</p>
            <p><strong>Delivery Person Contact:</strong> {deliveryInfo.contactName} ({deliveryInfo.contactPhone})</p>
          </div>
        ) : (
          <p style={{color: 'red' }}>{errorMessage}</p>
        )}
        <Button onClick={() => setModalOpened(false)} style={{ marginTop: '10px' }}>Close</Button>
      </Modal>
    </div>
  );
};

export default TrackDelivery;

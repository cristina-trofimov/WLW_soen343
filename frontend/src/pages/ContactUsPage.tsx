import React, { useState } from 'react';
import {
    Select,
    Button,
    Container,
    Paper,
    Stack,
    TextInput,
    Title,
    Textarea,
    Text,
    Space,
    Modal
} from '@mantine/core';

const ContactUs: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [modalOpened, setModalOpened] = useState(false);

    const options = [
        { value: 'delivery-instructions', label: 'Delivery Instructions' },
        { value: 'pickup-return', label: 'Pickup Return' },
        { value: 'tracking-delivery', label: 'Tracking Delivery' },
        { value: 'report-issue', label: 'Report an Issue' },
        { value: 'other', label: 'Other' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Data:', { selectedOption, email, message });

        // Trigger the notification
        setModalOpened(true);

        // Add logic to send this data to the backend
    };

    return (
        <Container size="md">
            <Title order={1} ta="center" mt="md" mb="xl">
                Contact Us
            </Title>

            <Paper shadow="xs" p="md">
                <Title order={3} ta="center" c="#d4a373">
                    Have a question, concern, or feedback? Let us know so we can help you! 
                </Title>
                <Space h="md" />
                <Text size="lg" >
                    Fill out the form below, and we’ll get back to you within 72 hours. 
                    For urgent inquiries, our  customer  support team is just a call  away  at   <strong>+1 (514) 000-1234</strong>. 
                    Your satisfaction is our priority!
                </Text>
                <Space h="md" />
                <form>
                    <Stack gap="md">
                        <Select
                            label="What do you want to contact us about?"
                            placeholder="Choose a topic"
                            data={options}
                            value={selectedOption}
                            onChange={setSelectedOption}
                            required
                            styles={{
                                label: {
                                  fontWeight: 'bold',
                                  fontSize: '16px',
                                },
                            }}
                        />

                        <TextInput
                            label="Please enter the email address we can reach you at"
                            placeholder="Your email address"
                            value={email}
                            onChange={(event) => setEmail(event.currentTarget.value)}
                            required
                            styles={{
                                label: {
                                  fontWeight: 'bold',
                                  fontSize: '16px',  
                                },
                              }}
                        />

                        <Textarea
                            label="Let us know how we can assist you. Please provide as much detail as possible."
                            placeholder="Write your message here"
                            autosize
                                minRows={6}
                                maxRows={10}
                            value={message}
                            onChange={(event) => setMessage(event.currentTarget.value)}
                            required
                            styles={{
                                label: {
                                  fontWeight: 'bold',
                                  fontSize: '16px',
                                },
                              }}
                        />

                        <Button 
                            size="lg"
                            radius="md"
                            onClick={handleSubmit}
                            style={{
                                width: '180px',
                                fontSize: '16px',
                            }}>
                            Submit Inquiry
                        </Button>
                    </Stack>
                </form>
            </Paper>

            {/* Modal popup for success message */}
            <Modal
                opened={modalOpened}
                centered
                onClose={() => setModalOpened(false)}  
            >
                <Title order={3}>
                    Inquiry Submitted
                </Title>
                <Text>
                    Your inquiry has been successfully sent! We will get back to you within 72 hours.
                </Text>
                <Button onClick={() => setModalOpened(false)} style={{ marginTop: '20px' }}>
                    Close
                </Button>
            </Modal>
        </Container>

        
    );
};

export default ContactUs;

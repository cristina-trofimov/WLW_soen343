import React, { useState } from 'react';
import axiosClient from "../axiosClient"
import axios from 'axios';
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
    const [error, setError] = useState<string | null>(null);

    const options = [
        { value: 'Delivery Instructions', label: 'Delivery Instructions' },
        { value: 'Pickup Return', label: 'Pickup Return' },
        { value: 'Tracking Delivery', label: 'Tracking Delivery' },
        { value: 'Report Issue', label: 'Report an Issue' },
        { value: 'Other', label: 'Other' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset error state
        setError(null);

        // Validate inputs
        if (!selectedOption || !email || !message) {
            setError('All fields are required.');
            return;
        }

        const dataToSubmit = {
            topic: selectedOption,
            email: email,
            message: message,
        };

        try {
            console.log("Form data before posting:", dataToSubmit);

            // POST request using axios
            const response = await axiosClient.post('/send_email', dataToSubmit);

            if (response.status === 200) {
                // Open success modal
                setModalOpened(true);

                // Clear form fields
                setSelectedOption(null);
                setEmail('');
                setMessage('');
            } else {
                throw new Error(response.data.message || 'Failed to send email.');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || error.message);
        }
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

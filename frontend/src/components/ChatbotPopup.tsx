import { useState } from 'react';
import classes from '../routes/Layout.module.css';
import { Button, Popover, Text, TextInput, Stack, Image } from '@mantine/core';

interface ChatOption {
  id: string;
  text: string;
}

const chatOptions: ChatOption[] = [
  { id: '1', text: 'option 1!' },
  { id: '2', text: 'option 2' },
  { id: '3', text: 'option 3' },
];

const ChatbotPopup = () => {
    const [opened, setOpened] = useState(false);
    const [selectedOption, setSelectedOption] = useState<ChatOption | null>(null);

    const handleOptionSelect = (option: ChatOption) => {
      setSelectedOption(option);
      setOpened(false);
    };
    // const [message, setMessage] = useState('');
  
    // const handleSend = () => {
    //   // Handle sending the message here
    //   console.log('Sending message:', message);
    //   setMessage('');
    // };
  
    return (
      <div style={{ position: 'fixed', bottom: 100, right: 50 }}>
        <Popover opened={opened} onChange={setOpened} width={300} position="top" withArrow shadow="md" >
          <Popover.Target>
            <Button onClick={() => setOpened((o) => !o)}>
              {opened ? 'Close Chat' : (
                <><Image src="/WLW_logo.png" height={"30px"} radius={"150%"} style={{ marginRight: '8px' }} />Ask WLW</>
              )}
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Stack>
              <Text size="lg" ta="center" h={"35xp"} className={classes.chatbotHeader} >
                <Image src="/WLW_logo.png" height={"30px"} style={{ marginRight: '8px' }} />
                WLW Chatbot
              </Text>
              <Text size="md">How can I help you today?</Text>
              {chatOptions.map((option) => (
                <Button
                  key={option.id}
                  variant="subtle"
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.text}
                </Button>
              ))}
          </Stack>
            {/* The following is for the user sending texts */}
            {/* <Stack gap="xs">
              <Text size="sm" fw={500}>Chatbot</Text>
              <Text size="xs">How can I help you today?</Text>
              <TextInput
                placeholder="Type your message..."
                value={message}
                onChange={(event) => setMessage(event.currentTarget.value)}
                rightSection={
                  <Button size="xs" onClick={handleSend}>
                    Send
                  </Button>
                }
              />
            </Stack> */}
          </Popover.Dropdown>
        </Popover>
      </div>
    );
  };

export default ChatbotPopup;
import { useState } from 'react';
import { Button, Popover, Text, TextInput, Stack, Image } from '@mantine/core';

const ChatbotPopup = () => {
    const [opened, setOpened] = useState(false);
    const [message, setMessage] = useState('');
  
    const handleSend = () => {
      // Handle sending the message here
      console.log('Sending message:', message);
      setMessage('');
    };
  
    return (
      <div style={{ position: 'fixed', bottom: 100, right: 50 }}>
        <Popover
          opened={opened}
          onChange={setOpened}
          width={300}
          position="top"
          withArrow
          shadow="md"
        >
          <Popover.Target>
          <Button onClick={() => setOpened((o) => !o)}>
            {opened ? 'Close Chat' : (
              <><Image src="/WLW_logo.png" height={"30px"} radius={"150%"} style={{ marginRight: '8px' }} />Ask WLW</>
            )}
          </Button>
          </Popover.Target>
          {/* <Image src={"/WLW_logo.png"} h={"80px"}/> */}
          <Popover.Dropdown>
            <Stack gap="xs">
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
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </div>
    );
  };

export default ChatbotPopup;
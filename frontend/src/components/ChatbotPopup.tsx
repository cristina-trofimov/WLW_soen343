// import { useState } from 'react';
// import classes from '../routes/Layout.module.css';
// import { Button, Popover, Text, TextInput, Stack, Image } from '@mantine/core';

// interface ChatOption {
//   id: string;
//   text: string;
// }

// const chatOptions: ChatOption[] = [
//   { id: '1', text: 'option 1!' },
//   { id: '2', text: 'option 2' },
//   { id: '3', text: 'option 3' },
// ];

// const ChatbotPopup = () => {
//     const [opened, setOpened] = useState(false);
//     const [selectedOption, setSelectedOption] = useState<ChatOption | null>(null);

//     const handleOptionSelect = (option: ChatOption) => {
//       setSelectedOption(option);
//       setOpened(false);
//     };
//     // const [message, setMessage] = useState('');

//     // const handleSend = () => {
//     //   // Handle sending the message here
//     //   console.log('Sending message:', message);
//     //   setMessage('');
//     // };

//     return (
//       <div style={{ position: 'fixed', bottom: 100, right: 50 }}>
//         <Popover opened={opened} onChange={setOpened} width={300} position="top" withArrow shadow="md" >
//           <Popover.Target>
//             <Button onClick={() => setOpened((o) => !o)}>
//               {opened ? 'Close Chat' : (
//                 <><Image src="/WLW_logo.png" height={"30px"} radius={"150%"} style={{ marginRight: '8px' }} />Ask WLW</>
//               )}
//             </Button>
//           </Popover.Target>
//           <Popover.Dropdown>
//             <Stack>
//               <Text size="lg" ta="center" h={"35xp"} className={classes.chatbotHeader} >
//                 <Image src="/WLW_logo.png" height={"30px"} style={{ marginRight: '8px' }} />
//                 WLW Chatbot
//               </Text>
//               <Text size="md">How can I help you today?</Text>
//               {chatOptions.map((option) => (
//                 <Button
//                   key={option.id}
//                   variant="subtle"
//                   onClick={() => handleOptionSelect(option)}
//                 >
//                   {option.text}
//                 </Button>
//               ))}
//           </Stack>
//             {/* The following is for the user sending texts */}
//             {/* <Stack gap="xs">
//               <Text size="sm" fw={500}>Chatbot</Text>
//               <Text size="xs">How can I help you today?</Text>
//               <TextInput
//                 placeholder="Type your message..."
//                 value={message}
//                 onChange={(event) => setMessage(event.currentTarget.value)}
//                 rightSection={
//                   <Button size="xs" onClick={handleSend}>
//                     Send
//                   </Button>
//                 }
//               />
//             </Stack> */}
//           </Popover.Dropdown>
//         </Popover>
//       </div>
//     );
//   };

// export default ChatbotPopup;

import { useEffect, useRef, useState } from "react";
import classes from "../routes/Layout.module.css";
import { Button, Popover, Text, TextInput, Stack, Image, ScrollArea, } from "@mantine/core";
import axios from "axios";
import { ChatbotMessage } from "../interface/chatbotMessage";


const ChatbotPopup = () => {
  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [wlwData, setWlwData] = useState<string>('');

  // Load WLW's policies and information.
  // Will be passed to the AI so its reponses can be based off of those
  useEffect(() => {
    const readFile = async () => {
      try {
        const response = await fetch('/ChatbotData.txt');
        const text = await response.text();
        setWlwData(text);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }; readFile(); }, []);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: ChatbotMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      // Chatbot API endpoint
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      // model: "mistral-7b-instruct",
      messages: [
          { role: "system", content: wlwData},
          { role: "user", content: input }
        ],
        max_tokens: 150,
        temperature: 0.5,
      }, {
      headers: {
          'Authorization': `Bearer API_KEY`,
          'Content-Type': 'application/json'
      }
      });

      const botMessage: ChatbotMessage = { 
        text: response.data.choices[0].message.content, 
        sender: 'bot' as const
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatbotMessage = { 
        text: "Sorry, I'm having trouble responding right now.", 
        sender: 'bot' 
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  // Make the scrollarea jump to most recent messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div style={{ position: "fixed", bottom: 100, right: 50 }}>
      <Popover opened={opened} onChange={setOpened} width={300} position="top" withArrow shadow="md" >
        <Popover.Target>
          <Button onClick={() => setOpened((o) => !o)}>
            {opened ? ( "Close Chat" ) : (
              <>
                <Image src="/WLW_logo.png" height={"30px"} radius={"150%"} style={{ marginRight: "8px" }} /> Ask WLW </>
            )}
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack>
            <Text size="lg" ta="center" className={classes.chatbotHeader} >
              <Image src="/WLW_logo.png" height={"30px"} style={{ marginRight: "8px" }} />
              WLW Chatbot
            </Text>
            <Text size="md">How can I help you today?</Text>
          </Stack>
          <Stack gap="xs"></Stack>
          <Stack>
          <ScrollArea.Autosize key={"chatbotScrollArea"} viewportRef={scrollAreaRef} mah={200} scrollbarSize={4} style={{ flexGrow: 1, overflowY: 'auto', padding: '5px' }} >
            {messages.map((message, index) => (
              <div style={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <Text
                key={index}
                style={{
                  color: "#141511",
                  marginBottom: '10px',
                  padding: '0px 10px',
                  borderRadius: '12px',
                  maxWidth: '200px',
                  backgroundColor: message.sender === 'user' ? "#ccd5ae" : 'rgba(0, 0, 0, 0.05)' }}
              >
                {message.text}
              </Text>
            </div>
              ))}
            </ScrollArea.Autosize> 
            <TextInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              rightSection={
                <Button 
                  onClick={handleSendMessage}
                  style={{ minWidth: 'auto', marginTop: "15px", marginLeft: "5px", padding: '0 10px' }}
                >
                  &gt;
                </Button>}
              rightSectionPointerEvents="auto"
            />
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
};

export default ChatbotPopup;

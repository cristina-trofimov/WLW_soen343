import { useEffect, useRef, useState } from 'react';
import classes from '../routes/Layout.module.css';
import { Button, Popover, Text, TextInput, Stack, Image, ScrollArea } from '@mantine/core';
import { ChatbotOption, ChatbotSubOption } from '../interface/ChatbotOptions';
import { ChatbotMessage } from "../interface/chatbotMessage";

const chatOptions: ChatbotOption[] = [
  {
    id: "1",
    section: "Order Placement, cost, and Confirmation",
    subOptions: [
      { id: "1", question: "How much does shipping cost?", response: "To determine the exact cost of shipping your packages, click on 'Quotation' in the header, fill out the form and click on the 'Check Quote' button." },
      { id: "2", question: "How do I place an order?", response: "In the header, click on 'Shipping', fill out the form, make sure your information are accurate. After placing your order, you'll need to make a payment. Once your order is successfully placed and payment is made, you will receive an email confirmation with all the details of your order, including tracking information." },
      { id: "3", question: "Will I receive a confirmation after placing my order?", response: "Yes, once your order is successfully placed, you will receive an email confirmation with the details of your order and tracking information." },
      { id: "4", question: "Back", response: "" }
    ]
  },
  {
    id: "2",
    section: "Package Restrictions",
    subOptions: [
      { id: "1", question: "Are there any shipping restrictions?", response: "Yes, the company does not ship hazardous materials, perishables, or live animals. Additionally, only one package is allowed per order." },
      { id: "2", question: "Back", response: "" }
    ]
  },
  {
    id: "3",
    section: "Order Modifications and Cancellations",
    subOptions: [
      { id: "1", question: "Can an order be modified?", response: "You can edit the delivery date and time whlile the order is pending. However, once an order has been dispatched, modifications are not allowed. Customers should ensure their orders are correct before shipping." },
      { id: "2", question: "Can I cancel my order?", response: "Orders can only be canceled when they are pending. Once they have been processed for shipping, they can no longer be deleted." },
      { id: "3", question: "Back", response: "" }
    ]
  },
  {
    id: "4",
    section: "Delayed Shipments and Damages",
    subOptions: [
      { id: "1", question: "What happens if my package is delayed?", response: "While the company strives to meet delivery timelines, delays may occur due to unforeseen circumstances. Customers are encouraged to track their shipments for updates." },
      { id: "2", question: "How does the company handle damaged or lost packages?", response: "The company does not currently offer insurance for shipments. In cases of damage or loss, customers may not receive compensation." },
      { id: "3", question: "Back", response: "" }
    ]
  },
  {
    id: "5",
    section: "Shipping Methods and Delivery Times",
    subOptions: [
      { id: "1", question: "What shipping options are available?", response: "The company offers three shipping methods:\n\t- Express Delivery: Fastest delivery(~2 days).\n\t- Regular Delivery: Most cost effective(~7 days).\n\t- Eco Delivery: Most environmentally friendly(~10 days)." },
      { id: "2", question: "How long does it take to process an order?", response: "Orders are typically processed within one business day, but this may vary based on order volume." },
      { id: "3", question: "Back", response: "" }
    ]
  },
  {
    id: "6",
    section: "Tracking and Rewards Program",
    subOptions: [
      { id: "1", question: "How can I check the status of my order?", response: "You can check the status of your order by clicking on the tracking link provided in your confirmation email or by logging into your account on our website." },
      { id: "2", question: "When can I start tracking my order?", response: "Tracking begins as soon as the order is placed, allowing customers to monitor their shipment's progress." },
      { id: "3", question: "Is there a rewards program for shipping?", response: "Yes, for every $10 spent on eco delivery, customers accumulate points that can be redeemed for discounts on future shipments." },
      { id: "4", question: "Back", response: "" }
    ]
  }
];

const ChatbotPopup = () => {
  const [opened, setOpened] = useState(false);
  const [convoState, setConvoState] = useState<String>("start");
  const [selectedOption, setSelectedOption] = useState<ChatbotOption | null>(null);
  const [selectedSubOption, setSelectedSubOption] = useState<ChatbotSubOption | null>(null);
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const errorMessage: ChatbotMessage = { 
    text: "Sorry, this isn't a valid option. Please enter the number corresponding to the option you'd like to choose.", 
    sender: 'bot' 
  };
  const botOptions = `${chatOptions.map((option) => `\t${option.id}. ${option.section}`).join('\n')}'`;

  const handleBack = () => {
    if (selectedSubOption) {
      botMessage(`${selectedOption?.subOptions.map((subOpt) => `\t${subOpt.id}. ${subOpt.question}`).join('\n')}'`);
      setSelectedSubOption(null);
    } else {
      botMessage(`Please select another option.\n${botOptions}`);
      setSelectedOption(null);
    }
  };

  const userMessage = (message: string) => {
    const userMessage: ChatbotMessage = { text: message, sender: "user" };
    setMessages([...messages, userMessage]);
  }

  const botMessage = (message: string) => {
    const botMessage: ChatbotMessage = { text: message, sender: "bot" };
    setMessages(prev => [...prev, botMessage]);
  }

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    
    if (input.trim().toLowerCase() === "back") {
      userMessage("Back");
      handleBack();
      setInput("");
      return;
    }
    setConvoState("started");

    const inputValue = input.replace(/\D/g, "");
    if (inputValue != "") {
      let arrayIDX = parseInt(inputValue) - 1;

      if (selectedOption && arrayIDX >= 0 && arrayIDX < selectedOption.subOptions.length && selectedOption.subOptions[arrayIDX].question.toLowerCase() === "back") {
        userMessage("Back");
        handleBack();
      }
      else if (!selectedOption && arrayIDX >= 0 && arrayIDX < chatOptions.length) {
        setSelectedOption(chatOptions[arrayIDX]);
        setSelectedSubOption(null);

        userMessage(chatOptions[arrayIDX].section);
        botMessage(`Please go ahead and select another option. Thank you!\n${chatOptions[arrayIDX].subOptions.map((subOption) => `\t${subOption.id}. ${subOption.question}`).join('\n')}\nReply with the number of the option you'd like to choose.`);
      } else if (selectedOption && arrayIDX >= 0 && arrayIDX < selectedOption.subOptions.length) {
        setSelectedSubOption(selectedOption.subOptions[arrayIDX]);

        userMessage(selectedOption.subOptions[arrayIDX].question);
        botMessage(selectedOption.subOptions[arrayIDX].response);
      } else {
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } else {
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
    setInput("");
  };

  // Make the scrollarea jump to most recent messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' }); //Jumps to bottom of most reacent message
      // scrollAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });  //Jumps to top of most reacent message
    }
  }, [messages]);

  useEffect(() => {
    // Display initial message when component mounts
    setMessages([{ text: "Welcome! How can I assist you today?", sender: "bot" }]);
  }, []);

  useEffect(() => {
    const greetingMessage: ChatbotMessage = {
      text: `Hello, I'm WLW's support. How can I help you?
      ${botOptions}\nSimply reply with the number of the option you'd like to choose, and I'll be happy to assist you!`,
      sender: "bot"
    };
    setMessages(prev => [...prev, greetingMessage]);
    setMessages([greetingMessage]);
  }, []);


  return (
    <div style={{ position: "fixed", bottom: 100, right: 50 }}>
      <Popover opened={opened} onChange={setOpened} width={400} position="top" withArrow shadow="md" >
        <Popover.Target>
          <Button onClick={() => setOpened((o) => !o)}>
            {opened ? ( "Close Chat" ) : (
              <>
                <Image src="/WLW_logo.png" height={"30px"} radius={"150%"} style={{ marginRight: "8px" }} /> Ask WLW
              </>
            )}
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Stack>
            <Text size="lg" ta="center" className={classes.chatbotHeader} style={{ borderRadius: '10px' }} >
              <Image src="/WLW_logo.png" height={"30px"} style={{ marginRight: "8px" }} />
              WLW Chatbot
            </Text>
            <ScrollArea.Autosize key={"chatbotScrollArea"} viewportRef={scrollAreaRef} maw={400} mah={350} scrollbarSize={4} style={{ flexGrow: 1, overflowY: 'auto' }} >
              {messages.map((message, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <Text
                    key={index}
                    style={{
                      whiteSpace: 'pre-wrap',
                      color: "#141511",
                      marginBottom: '10px',
                      padding: '0px 10px',
                      borderRadius: '12px',
                      maxWidth: '350px',
                      backgroundColor: message.sender === 'user' ? "#ccd5ae" : 'rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    {message.text}
                  </Text>
                </div>
              ))}
            </ScrollArea.Autosize>
            {selectedSubOption && ( <Text>Enter 'back' to go back</Text> )}
            <TextInput
            autoFocus
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

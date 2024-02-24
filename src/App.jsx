import { useState } from "react";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {
  MainContainer,
  ChatContainer,
  Message,
  MessageList,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = "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"

function App() {
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT",
      sender: "ChatGPT",
    },
  ]); // []

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage]; // all the old messages , + new message

    // update the messages useState
    setMessages(newMessages);

    // Setting a typing indicator (chatgpt is thinking)
    setThinking(true);

    // Process the message to CHATGPT (and wait for response )
    processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatmessages) {
// chat Messages { sender :"user" or "ChatGPT", message : "the message content here"}
// api Messages { role: "user" or "assistant" content :"the message content here"}

    let apiMessages = chatmessages.map((messageObject) => {
      let role = '';
      if(messageObject.sender === "ChatGPT"){
        role = "assistant";
        } else {
          role = 'user';
      }
      return {role: role, content: messageObject.message};
    });

    // role : "user" -> a message from the user , "assistent" -> a response from chatGPT
    // system -> generally one initial message defining how we want chatGPT to talk

    const systemMessage ={
      role : "system",
      content:"Explain all concepts like I am 10 years old."
    }

    const apiRequestBody = {
      "model" : "gpt-3.5-turbo",
      "messages":[
        systemMessage,
        ...apiMessages
      ]
    }
    
    await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers: {
        "Authorization":"Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body:  JSON.stringify(apiRequestBody)
    }
    ).then((data)=>{
      return data.json();
    }).then((data)=>{
      console.log(data)
    })

  }

  return (
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              typingIndicator={
                thinking ? (
                  <TypingIndicator content="chatgpt is thinking" />
                ) : null
              }
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput
              placeholder="Type messages here"
              onSend={handleSend}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect, useRef } from "react";

import 'react-chat-elements/dist/main.css'
import { Input, Button, MessageList, MessageBox, MessageType } from 'react-chat-elements'
import { ChatItem } from "react-chat-elements"

function ChatComponent() {
    //create references for html elements
    let inputReference = useRef<HTMLInputElement>(null);
    let messageListReference = useRef<HTMLDivElement>(null);
    let messageListContainerRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');

    //Set initial message
    const [messageListArray, setMessageListArray] = useState<MessageType[]>([{
        id: '1',
        type: 'text',
        position: 'left',
        text: "Hello, I await your command!",
        title: "",
        focus: false,
        date: new Date(),
        titleColor: "",
        forwarded: false,
        replyButton: false,
        removeButton: false,
        status: 'sent',
        notch: false,
        retracted: false,
        className: 'textMessage'
    }]);

    useEffect(() => {
        if (messageListContainerRef.current) {
            messageListContainerRef.current.scrollTop = messageListContainerRef.current.scrollHeight
        }
    })

    //runs when input box changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        console.log('text entered')
    };

    const sendMessage = async (message: string) => {
        await fetch('/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });
      };

    async function messageSubmit() {
        if (!inputValue) {
            return
        }
        try {
            await sendMessage(inputValue)
            
            setMessageListArray(messageListArray => [
                ...messageListArray, {id: messageListArray.length,
                type: 'text',
                position: 'right',
                text: inputValue,
                title: "",
                focus: false,
                date: new Date(),
                titleColor: "",
                forwarded: false,
                replyButton: false,
                removeButton: false,
                status: 'sent',
                notch: false,
                retracted: false,
                className: 'textMessage'
                }
            ])
            if (inputReference.current) {
                inputReference.current.value = '';
            }
        } catch (error) {
            console.error("Failed to send message:", error)
        }       
        

    }

    return (
        <div className="chat-container" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative',
        }}>
            <div className="messagelist-container" ref={messageListContainerRef} style={{
                flexGrow: 1,
                position: 'relative',
                overflowY: 'auto',
                width: '100%',
                marginBottom: '50px',

            }}>
                <div className="message-wrapper" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end', // This keeps the initial message at the bottom
                    minHeight: '100%', // Ensure it takes at least the full height of the container
                }}>

                    <MessageList
                        referance={messageListReference}
                        className='message-list'
                        lockable={true}
                        toBottomHeight={'100%'}
                        dataSource={messageListArray} />
                </div>
            </div>
            <div className="input-container" style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
            }}>
                <Input defaultValue=""
                    referance={inputReference}
                    className="chatbox-area"
                    placeholder="Type here..."
                    multiline={false}
                    maxHeight={200}
                    onChange={handleChange}
                    onKeyPress={
                        (e) => {
                            if (e.shiftKey && e.key === 'Enter') {
                                return true
                            }
                            if (e.key === 'Enter') {

                                messageSubmit()
                            }
                        }
                    }
                    rightButtons={<Button onClick={() => messageSubmit()} color="white" backgroundColor="black" text="Send" />}
                />
            </div>
        </div>
    )
}

export default ChatComponent;

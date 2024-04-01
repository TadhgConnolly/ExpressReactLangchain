import React, { useState, useEffect, useRef } from "react";

import 'react-chat-elements/dist/main.css'
import { Input, Button, MessageList, MessageBox, MessageType } from 'react-chat-elements'
import { ChatItem } from "react-chat-elements"

function ChatComponent() {
    let inputReference = useRef<HTMLDivElement>(null);
    let messageListReference = useRef<HTMLDivElement>(null);
    let messageListContainerRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [messageListArray, setMessageListArray] = useState<MessageType[]>([{
        id: '1',
        type: 'text', // Ensure this matches one of the specific types in MessageType
        position: 'left',
        text: "Hello, I await your command!",
        title: "",
        focus: false,
        date: new Date(),
        titleColor: "",
        forwarded: false,
        replyButton: false,
        removeButton: false,
        status: 'sent', // Make sure this matches one of the expected status strings
        notch: false,
        retracted: false,
        // Include any other properties required by the specific message type
    }]);

    useEffect(() => {
        if (messageListContainerRef.current) {
            messageListContainerRef.current.scrollTop = messageListContainerRef.current.scrollHeight
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        console.log('text entered')
    };

    function messageSubmit() {
        console.log('pressed')
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
                            if (e.shiftKey && e.charCode === 13) {
                                return true
                            }
                            if (e.charCode === 13) {

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

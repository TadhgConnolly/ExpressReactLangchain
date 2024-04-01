import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import 'react-chat-elements/dist/main.css'
import { Input, Button, MessageList, MessageBox, MessageType } from 'react-chat-elements'
import { ChatItem } from "react-chat-elements"

function ChatComponent() {
    //create references for html elements
    let inputReference = useRef<HTMLInputElement>(null);
    let urlInputReference = useRef<HTMLInputElement>(null);
    let messageListReference = useRef<HTMLDivElement>(null);
    let messageListContainerRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [UrlInputValue, setUrlInputValue] = useState('yr5jgS72');


    //Set initial message - awkwardly long properties but needed for TS
    const [messageListArray, setMessageListArray] = useState<MessageType[]>([{
        id: uuidv4(),
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
    };

    const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrlInputValue(e.target.value)
    }

    const sendMessage = async (question: string, pastebinURL: string) => {

        try {
            const response = await fetch('/process-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, pastebinURL }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            //having AI reply as a seperate function allows for simple distrinctions
            setMessageListArray(messageListArray => [
                ...messageListArray, {
                    id: uuidv4(),
                    type: 'text',
                    position: 'left',
                    text: data.response?.kwargs?.content,
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
        } catch (error) {
            console.error('Error:', error);
        }
    };

    async function messageSubmit() {
        if (!inputValue) {
            return
        }
        //null check, bit clunky because the above line is also null check
        if (inputReference.current) {
            inputReference.current.value = '';
        }
        try {

            setMessageListArray(messageListArray => [
                ...messageListArray, {
                    id: messageListArray.length,
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
            await sendMessage(inputValue, UrlInputValue)

        } catch (error) {
            console.error("Failed to send message:", error)
        }


    }

    return (
        <div className="chat-container">
            <div className="secondary-input-container">
                <Input
                    value={UrlInputValue}
                    defaultValue=""
                    referance={urlInputReference}
                    className="chatbox-area"
                    placeholder="Secondary input..."
                    multiline={false}
                    maxHeight={200}
                    onChange={handleUrlInputChange}
                />
            </div>
            <div className="messagelist-container" ref={messageListContainerRef}>
                <div className="message-wrapper">
                    <MessageList
                        referance={messageListReference}
                        className='message-list'
                        lockable={true}
                        toBottomHeight={'100%'}
                        dataSource={messageListArray} />
                </div>
            </div>
            <div className="input-container" >
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

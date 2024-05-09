"use client"
import { useChat, useCompletion, Message } from "ai/react"
import { useState } from "react";

export default function ChatComponent() {
    // Vercel AI SDK (ai package) useChat()
    // useChat -> handles messages for us, user input, handling user submits, etc.
    const { input, handleInputChange, handleSubmit, isLoading, messages } = useChat({ api: '/api/chat/feedback' });
    const { completion, handleCompletionChange, handleCompletionSubmit } = useCompletion({ api: '/api/chat/completion' });
    // messages -> [user asks a question, gpt-4 response, user asks again, gpt-4 responds]
    const [feedback, setFeedback] = useState("");
    const handleFeedback = (e) => {
        console.log('### handleFeedback');
        e.preventDefault();
        e.stopPropagation();
        fetch("/api/chat/summary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: messages
            })
        }).then(async (res) => {
            let data = await res.json();
            setFeedback(data);
                console.log('### data', data);
        }
        ).catch((err) => {
            console.log(err);
        })
    };
    console.log(messages);
    console.log(input);

    return (
        <div>
            {messages.map((message : Message) => {
                return (
                    <div key={message.id}>
                        {/*  Name of person talking */}
                        {
                            message.role === "assistant"
                            ?
                            <h3 className="text-lg font-semibold mt-2">
                                GPT-4
                            </h3>
                            :
                            <h3 className="text-lg font-semibold mt-2">
                                User
                            </h3>
                        }
                        {message.content.split("\n").map((currentTextBlock: string, index : number) => {
                            if(currentTextBlock === "") {
                                return <p key={message.id + index}>&nbsp;</p> // " "
                            } else {
                                return <p key={message.id + index}>{currentTextBlock}</p> // "Cooper Codes is a YouTuber"
                            }
                        })}
                    </div>
                )
            })}
            {completion && <div className="mt-12">
                <p>Completion</p>
                <p>{completion}</p>
            </div>}

            <form className="mt-12">
                <p>User Message</p>
                <textarea
                    className="mt-2 w-full bg-slate-600 p-2"
                    placeholder={"How was did you like the most or not of the floorplan?"}
                    value={input}
                    onChange={handleInputChange}
                />
                <div className="flex justify-between mt-2">
                    <button className="rounded-md bg-blue-600 p-2 mt-2" onClick={handleSubmit}>
                        Send message
                    </button>
                    <button className="rounded-md bg-red-400 p-2 mt-2" onClick={handleFeedback}>
                        Send feedback
                    </button>
                </div>
            </form>
            {feedback && <div className="mt-12">
                <p>Feedback</p>
                <p>{feedback}</p>
            </div>}
        </div>
    )
}

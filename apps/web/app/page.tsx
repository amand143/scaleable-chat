'use client';
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
export default function Page(): JSX.Element {
  const {messages, sendMessage} = useSocket();
  const [message, setMessage] = useState("");
  return (
<div>
  All texts to appear here
  <div>
    <input placeholder="message here" onChange={(e) =>setMessage(e.target.value)}></input>
    <button onClick={(e) => sendMessage(message)}>send message</button>
  </div>
  <div>
        {messages.map((e) => (
          <li>{e}</li>
        ))}
      </div>
</div>
  );
}

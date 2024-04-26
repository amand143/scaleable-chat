"use client";
import { useContext, useState } from "react";
import React from "react";
import { Socket, io } from "socket.io-client";
import { useEffect } from "react";

interface ISocketContext {
    sendMessage: (msg: string) => any;
    messages: string[];
}

interface SocketProviderProps {
    children?: React.ReactNode;
}
const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () =>{
    const state = useContext(SocketContext);
    if(!state)throw new Error(`state undefined`);
    return state; 
}

export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {
    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);
    const onMesageRec = (msg: string) =>{
        console.log("msg received");
        setMessages((prev) =>[...prev, msg]);
        messages.forEach((msg) =>{
            console.log(msg, " ");
        });

    }
    useEffect(() =>{
        console.log("connecting");
        const _socket = io("http://localhost:3001");
        _socket.on("message", onMesageRec);
        setSocket(_socket);
        return () =>{
            _socket.off("message", onMesageRec);
            _socket.disconnect();
            setSocket(undefined);
        };
    }, [])
   
    const sendMessage :ISocketContext["sendMessage"] = (msg) =>{

        if(socket){
            console.log("here", msg);
            socket.emit("event:message", {message: msg});
        }
    }
    return <SocketContext.Provider value={{sendMessage, messages}}>
        {children}
        </SocketContext.Provider>
}
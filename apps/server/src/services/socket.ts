import {Server} from "socket.io";
import { Redis } from "ioredis";
import { createMessage } from "./kafka";
const pub = new Redis({
    host: '',
    port: 0,
    username: "",
    password: ""
});
const sub = new Redis({
    host: '',
    port: 0,
    username: "",
    password: ""
})
class SocketService {
    private _io: Server;
    constructor(){
        console.log('socket service init');
        this._io = new Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            },
        });
        sub.subscribe("MESSAGES");
    }
    public initListeners() {
        const io = this._io;
        io.on("connect", (socket) =>{
            console.log(`${socket.id} connected`);
            socket.on("event:message", async({message}: {message:string})=>{
                console.log(`${message} publushed`);
                pub.publish("MESSAGES", JSON.stringify({message}));
            })
        })
        sub.on("message", async (channel, message) =>{
            if(channel ==="MESSAGES"){
                io.emit("message", message);
                await createMessage(message);
            }
        })
    }
    get io(){
        return this._io;
    }
};
export default SocketService;
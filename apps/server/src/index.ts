import http from "http";
import SocketService from "./services/socket";
import { startConsumer } from "./services/kafka";
async function init() {
    const server = http.createServer();
    startConsumer();
    const port = process.env.PORT ? process.env.PORT : 3001;
    const socketService = new SocketService();
    socketService.io.attach(server);

    server.listen(port, () => {
        console.log(`hearing on ${port}`);
    });
    socketService.initListeners();
}

init();
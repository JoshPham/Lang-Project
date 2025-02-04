import { Server } from "socket.io";

const io = new Server(3000, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
    },
});

let timeouts: NodeJS.Timeout[] = [];

io.on("connection", (socket) => {
    console.log("connected");

    socket.on("start", (gameId: string, time: number) => {
        console.log("Game has started");

        timeouts.forEach(clearTimeout);
        timeouts = [];

        io.emit("serverstart", true);

        for (let i = 0; i <= time; i++) {
            const timeoutId = setTimeout(() => {
                io.emit("timer", gameId, time - i);
            }, i * 1000 + 4000);

            timeouts.push(timeoutId);
        }
    });

    socket.on("stop", () => {
        console.log("Game has stopped");
        timeouts.forEach(clearTimeout);
        timeouts = [];
        io.emit("serverstop", true);
    });

    socket.on("join", (name: string, deviceId: string) => {
        console.log("Emitting JOINED", name)
        console.log("Josh Joined")
        io.emit("join", name, deviceId);
    })

    socket.on("addPoints", (deviceId: string, currScore: number, points: number, itemName: string, name: string) => {
        io.emit("addPoints", deviceId, currScore, points, itemName, name);
    })

    socket.on("endGame", () => {
        io.emit("endGame");
    })
});

console.log("Server running on port 3000");
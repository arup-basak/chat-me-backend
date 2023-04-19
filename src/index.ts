import dotenv from 'dotenv';
import { Server, Socket } from 'socket.io'
import * as users from './users'
import { ActiveUser } from './interface'

dotenv.config();

const io = new Server()

const activeUsers: ActiveUser[] = []

io.on("connect", (socket: Socket) => {
    console.log("Connected " + socket.id);

    socket.on("disconnect", () => {
        console.log("Disconnected " + socket.id)
    })

    socket.on('signup', (user: {
        name: string,
        password: string
    }) => {
        if (users.createUser(user.name, user.password)) {
            socket.emit("message", "successful")
        }
        else {
            socket.emit("message", "username-exists")
        }
    })

    socket.on('login', (user: {
        name: string,
        password: string
    }) => {
        users.checkPass(user.name, user.password).then((response: boolean) => {
            if (response) {
                socket.emit("message", "successful")
                activeUsers.push({
                    name: user.name,
                    id: socket.id
                })
            }
            else {
                socket.emit("message", "wrong-password")
            }
        })
    })

    socket.onAny((listener, value) => {
        console.log(listener)
        console.log(value)
    })
})

const port = 3001;

io.listen(port)
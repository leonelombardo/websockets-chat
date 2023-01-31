import express from "express"
import { Server } from "socket.io"
import handlebars from "express-handlebars"

import { PORT } from "./config.js"
import { router } from "./router/router.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("src/public"))

app.engine("handlebars", handlebars.engine())

app.set("views", "src/views")

router(app)

const httpServer = app.listen(PORT, () => console.log(`Server running at port ${PORT}.`))

export const io = new Server(httpServer)

const messages = []

    io.on("connection", socket => {
        console.log(`Socket ${socket.id}.`)

        socket.emit("load-messages", messages)

        socket.on("username", data => {
            const username = data

            socket.broadcast.emit("user-connected", username)
        })

        socket.on("message", message => {
            messages.push(message)

            io.emit("new-message", messages)
        })
    })
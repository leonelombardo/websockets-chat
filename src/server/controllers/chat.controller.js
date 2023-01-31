import { Router } from "express"

export const chatController = Router()

chatController.get("/", (req, res) => {
    res.render("index.handlebars", { title: "Chat", style: "index.css"})
})
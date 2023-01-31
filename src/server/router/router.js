import { chatController } from "../controllers/chat.controller.js"

export const router = (app) => {
    app.use("/", chatController)
}
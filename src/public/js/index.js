import { notification } from "../utils/notification.js"

const messages = document.querySelector("#messages")
const messageForm = document.querySelector("#message-form")
const inputMessage = document.querySelector("#input-message")

const usernameFormContainer = document.querySelector("#username-form-container")
const usernameForm = document.querySelector("#username-form")
const inputUsername = document.querySelector("#input-username")
const usernameError = document.querySelector("#username-error")

const id = crypto.randomUUID()

const socket = io()

usernameForm.addEventListener("submit", (event) => {
    event.preventDefault()
    
    const username = inputUsername.value

    if(username.trim().length <= 0) {
        usernameError.style.display = "flex"
        usernameError.innerHTML = `<i class="ph-warning-circle-bold"></i> Please type something`
    }else{
        usernameError.style.display = "none"
        usernameError.innerHTML = ""
        
        usernameFormContainer.style.display = "none"
        
        socket.emit("username", username)
    }
})

messageForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const username = inputUsername.value
    const message = inputMessage.value
    
    if(username.trim().length <= 0) {
        notification("Users with no username can't chat here.")
        return
    }

    if(message.trim().length <= 0) return

    socket.emit("message", { id, username, message })

    inputMessage.value = ""
})

socket.on("load-messages", data => {
    messages.innerHTML = ""

    data.forEach(message => {
        messages.innerHTML += `
            <div class="message">
                <p class="message-username" style="${message.id === id && 'display: none'}">${message.username}</p>
                <span class="message-message">${message.message}</span>
            </div>
        `
    })
})

socket.on("user-connected", username => notification(`${username} joined to chat.`))

socket.on("new-message", data => {
    messages.innerHTML = ""

    data.forEach(message => {
        messages.innerHTML += `
            <div class="message ${message.id === id ? 'sender' : ''}">
            <p class="message-username" style="${message.id === id && 'display: none'}">${message.username}</p>
                <span class="message-message">${message.message}</span>
            </div>
        `
    })
})
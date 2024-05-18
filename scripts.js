function sendMessage() {
    var userInput = document.getElementById("userInput").value;
    if (userInput.trim() === "") return;
    if (userInput.trim() === "/clean") {
        clearChat(); // Call function to clear chat
        return;
    }
    appendUserMessage(userInput);
    getResponse(userInput);
    document.getElementById("userInput").value = "";
}

function appendUserMessage(message) {
    var chatBox = document.getElementById("chatBox");
    var userBubble = document.createElement("div");
    userBubble.classList.add("user-bubble");
    userBubble.innerHTML = '<i class="far fa-user user-icon"></i>' + message;
    chatBox.appendChild(userBubble);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendBotMessage(message) {
    var chatBox = document.getElementById("chatBox");
    var botBubble = document.createElement("div");
    botBubble.classList.add("chat-bubble");
    botBubble.innerHTML = '<i class="fas fa-rocket chatbot-icon"></i>' + message;
    chatBox.appendChild(botBubble);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getResponse(userInput) {
    try {
        const response = await fetch('https://fictional-system-jjj5jwjrwgvgh5xvx-5000.app.github.dev/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userInput: userInput })
        });
        const data = await response.json();
        let capitalizedFirstLetter = data.answer.charAt(0).toUpperCase() + data.answer.slice(1);
        if (capitalizedFirstLetter.charAt(capitalizedFirstLetter.length - 1) !== '.') {
            capitalizedFirstLetter += '.';
        }
        appendBotMessage(capitalizedFirstLetter);
    } catch (error) {
        appendBotMessage("Sorry, something went wrong. Please try again later.");
    }
}

function toggleDarkMode() {
    var body = document.body;
    var inputBox = document.querySelector('.input-box input[type="text"]');
    var buttons = document.querySelectorAll('button');
    body.classList.toggle("dark-mode");
    inputBox.classList.toggle("dark-mode");
    buttons.forEach(button => button.classList.toggle("dark-mode"));
}

function saveChat() {
    var chatBox = document.getElementById("chatBox");
    var chatContent = chatBox.innerHTML;
    var savedChatsList = document.getElementById("savedChatsList");
    var chatItem = document.createElement("li");
    chatItem.innerHTML = "Chat " + (savedChatsList.children.length + 1);
    chatItem.onclick = function() {
        loadChat(chatContent);
    };
    savedChatsList.appendChild(chatItem);
    localStorage.setItem("chat_" + savedChatsList.children.length, chatContent);
}

function loadChat(content) {
    var chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = content;
}

function clearChat() {
    var chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = '<div class="chat-bubble"><i class="fas fa-rocket chatbot-icon"></i> Welcome to SLA-GPT! Feel free to ask any questions regarding SLA.</div>';
}

document.getElementById("userInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

function updateSavedChatsList() {
    var savedChatsList = document.getElementById("savedChatsList");
    savedChatsList.innerHTML = '';
    for (var i = 1; i <= localStorage.length; i++) {
        var chatContent = localStorage.getItem("chat_" + i);
        if (chatContent) {
            var chatItem = document.createElement("li");
            chatItem.innerHTML = "Chat " + i;
            savedChatsList.appendChild(chatItem);
        }
    }
}

function clearChatHistory() {
    localStorage.clear();
    updateSavedChatsList();
}

document.getElementById("clearHistoryBtn").addEventListener('click', clearChatHistory);

// Load saved chats from localStorage on page load
window.onload = function() {
    var savedChatsList = document.getElementById("savedChatsList");
    for (var i = 1; i <= localStorage.length; i++) {
        var chatContent = localStorage.getItem("chat_" + i);
        if (chatContent) {
            var chatItem = document.createElement("li");
            chatItem.innerHTML = "Chat " + i;
            chatItem.onclick = function() {
                loadChat(chatContent);
            };
            savedChatsList.appendChild(chatItem);
        }
    }
};

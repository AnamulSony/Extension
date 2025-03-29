class ChatManager {
    constructor() {
        this.messages = [];
        this.lastMessageSender = null;
        this.initializeEventListeners();
        this.aiAvatarUrl = 'ai-avatar.png';
    }

    initializeEventListeners() {
        const sendBtn = document.getElementById('sendBtn');
        const userInput = document.getElementById('userInput');
        const newChatBtn = document.getElementById('newChatBtn');

        sendBtn.addEventListener('click', () => this.sendMessage());
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        newChatBtn.addEventListener('click', () => this.startNewChat());
    }

    sendMessage() {
        const input = document.getElementById('userInput');
        const message = input.value.trim();

        if (message) {
            // Add user message
            this.addMessage('user', message);
            input.value = '';

            // Show typing indicator
            this.showTypingIndicator();

            // Simulate AI response
            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage('ai', this.generateAIResponse(message));
            }, 1500);
        }
    }

    addMessage(type, content) {
        const messagesContainer = document.getElementById('messages');
        const messageWrapper = document.createElement('div');
        
        // Alternate message positioning
        const positionClass = this.getMessagePosition(type);
        
        messageWrapper.classList.add(
            'flex', 
            'w-full', 
            'my-2',
            positionClass
        );

        // Message content styling
        const messageElement = document.createElement('div');
        messageElement.classList.add(
            'max-w-[70%]', 
            'px-4', 
            'py-2', 
            'rounded-2xl', 
            'relative',
            type === 'user' 
                ? 'bg-blue-500 text-white rounded-br-none' 
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
        );
        messageElement.innerHTML = this.formatMessageContent(content);

        // Add avatar for AI messages
        if (type === 'ai') {
            const avatarWrapper = document.createElement('div');
            avatarWrapper.classList.add('flex', 'items-end', 'mr-2');
            
            const avatar = document.createElement('img');
            avatar.src = this.aiAvatarUrl;
            avatar.alt = 'AI';
            avatar.classList.add('w-8', 'h-8', 'rounded-full');
            
            avatarWrapper.appendChild(avatar);
            messageWrapper.appendChild(avatarWrapper);
        }

        // Add message to wrapper
        messageWrapper.appendChild(messageElement);

        // Add timestamp
        const timestampElement = document.createElement('div');
        timestampElement.classList.add(
            'text-xs', 
            'text-gray-500', 
            'self-end', 
            'mx-2',
            type === 'user' ? 'order-first' : 'order-last'
        );
        timestampElement.innerText = this.formatTime();
        messageWrapper.appendChild(timestampElement);

        // Append to messages
        messagesContainer.appendChild(messageWrapper);
        
        // Update last message sender
        this.lastMessageSender = type;
        
        // Scroll to bottom
        this.scrollToBottom();
    }

    getMessagePosition(type) {
        // Alternate message positioning
        return type === 'user' 
            ? 'justify-end' 
            : 'justify-start';
    }

    formatMessageContent(content) {
        // Add support for basic markdown or URL detection
        // Convert URLs to clickable links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return content.replace(urlRegex, (url) => 
            `<a href="${url}" target="_blank" class="text-blue-300 underline">${url}</a>`
        );
    }

    showTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        typingIndicator.classList.remove('hidden');
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        typingIndicator.classList.add('hidden');
    }

    scrollToBottom() {
        const chatContainer = document.getElementById('chatContainer');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    formatTime() {
        return new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    generateAIResponse(userMessage) {
        // Enhanced response generation
        const responseTemplates = [
            {
                keywords: ['hello', 'hi', 'hey'],
                responses: [
                    "Hello! How can I help you today?",
                    "Hi there! What can I assist you with?",
                    "Greetings! I'm ready to help."
                ]
            },
            {
                keywords: ['help', 'support', 'question'],
                responses: [
                    "I'm here to help. What specific information do you need?",
                    "Sure, I'll do my best to assist you.",
                    "Please go ahead and ask your question."
                ]
            },
            {
                default: [
                    "Interesting point! Could you elaborate?",
                    "I'm listening. Tell me more.",
                    "That's an intriguing thought.",
                    "How can I help you further?"
                ]
            }
        ];

        // Find matching response
        for (let template of responseTemplates) {
            if (template.keywords) {
                const matchedKeyword = template.keywords.find(keyword => 
                    userMessage.toLowerCase().includes(keyword)
                );
                
                if (matchedKeyword) {
                    return this.getRandomResponse(template.responses);
                }
            }
        }

        // Default response
        return this.getRandomResponse(responseTemplates[2].default);
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    startNewChat() {
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = `
            <div class="self-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm shadow-md my-4">
                <i class="fas fa-sparkles mr-2"></i>
                New chat started. How can I help you today?
            </div>
        `;
        this.lastMessageSender = null;
    }
}

// Initialize Chat Manager
document.addEventListener('DOMContentLoaded', () => {
    new ChatManager();
});
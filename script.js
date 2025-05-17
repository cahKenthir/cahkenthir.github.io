document.addEventListener('DOMContentLoaded', function() {
    // ==================== KONFIGURASI ====================
    const config = {
        groq: {
            endpoint: "/api/groq-proxy", // Gunakan proxy backend untuk keamanan
            model: "llama3-70b-8192",
            temperature: 0.7,
            maxTokens: 1024
        },
        ui: {
            typingDelay: 100, // Delay animasi mengetik (ms)
            maxHistory: 20 // Jumlah maksimal pesan yang disimpan
        }
    };

    // ==================== INISIALISASI ELEMEN UI ====================
    const chatDisplay = document.getElementById('chatDisplay');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // ==================== STATE MANAGEMENT ====================
    const state = {
        chatHistory: [],
        isProcessing: false,
        darkMode: localStorage.getItem('darkMode') === 'true' || false
    };

    // ==================== FUNGSI UTILITAS ====================
    const utils = {
        // Animasi mengetik
        typeWriter: async function(element, text, speed = 10) {
            return new Promise(resolve => {
                let i = 0;
                element.textContent = '';
                const typingInterval = setInterval(() => {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                        chatDisplay.scrollTop = chatDisplay.scrollHeight;
                    } else {
                        clearInterval(typingInterval);
                        resolve();
                    }
                }, speed);
            });
        },

        // Format waktu
        formatTime: () => {
            const now = new Date();
            return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        },

        // Simpan riwayat ke localStorage
        saveHistory: () => {
            if (state.chatHistory.length > 0) {
                localStorage.setItem('chatHistory', JSON.stringify(state.chatHistory));
            }
        },

        // Load riwayat dari localStorage
        loadHistory: () => {
            const savedHistory = localStorage.getItem('chatHistory');
            if (savedHistory) {
                state.chatHistory = JSON.parse(savedHistory);
                state.chatHistory.forEach(msg => {
                    if (msg.role === 'assistant') {
                        ui.addMessage(msg.content, false, msg.timestamp, false);
                    } else {
                        ui.addMessage(msg.content, true, msg.timestamp, false);
                    }
                });
            }
        }
    };

    // ==================== FUNGSI UI ====================
    const ui = {
        // Tambahkan pesan ke chat
        addMessage: async (content, isUser, timestamp = utils.formatTime(), animate = true) => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');
            
            const headerDiv = document.createElement('div');
            headerDiv.classList.add('message-header');
            
            const avatarSpan = document.createElement('span');
            avatarSpan.classList.add('avatar');
            avatarSpan.textContent = isUser ? '👤' : '🤖';
            
            const nameSpan = document.createElement('span');
            nameSpan.classList.add('sender-name');
            nameSpan.textContent = isUser ? 'Anda' : 'Groq AI';
            
            const timeSpan = document.createElement('span');
            timeSpan.classList.add('message-time');
            timeSpan.textContent = timestamp;
            
            headerDiv.appendChild(avatarSpan);
            headerDiv.appendChild(nameSpan);
            headerDiv.appendChild(timeSpan);
            
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('message-content');
            
            if (animate && !isUser) {
                await utils.typeWriter(contentDiv, content);
            } else {
                contentDiv.textContent = content;
            }
            
            messageDiv.appendChild(headerDiv);
            messageDiv.appendChild(contentDiv);
            chatDisplay.appendChild(messageDiv);
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
            
            // Simpan ke history
            if (content.trim() !== '') {
                state.chatHistory.push({
                    role: isUser ? 'user' : 'assistant',
                    content: content,
                    timestamp: timestamp
                });
                
                // Pertahankan batas maksimal history
                if (state.chatHistory.length > config.ui.maxHistory) {
                    state.chatHistory.shift();
                }
                
                utils.saveHistory();
            }
        },

        // Tampilkan indikator mengetik
        showTypingIndicator: () => {
            if (document.getElementById('typingIndicator')) return;
            
            const typingDiv = document.createElement('div');
            typingDiv.id = 'typingIndicator';
            typingDiv.classList.add('message', 'bot-message');
            
            const headerDiv = document.createElement('div');
            headerDiv.classList.add('message-header');
            
            const avatarSpan = document.createElement('span');
            avatarSpan.classList.add('avatar');
            avatarSpan.textContent = '🤖';
            
            const nameSpan = document.createElement('span');
            nameSpan.classList.add('sender-name');
            nameSpan.textContent = 'Groq AI';
            
            headerDiv.appendChild(avatarSpan);
            headerDiv.appendChild(nameSpan);
            
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('message-content');
            contentDiv.innerHTML = '<div class="typing-animation"><span></span><span></span><span></span></div>';
            
            typingDiv.appendChild(headerDiv);
            typingDiv.appendChild(contentDiv);
            chatDisplay.appendChild(typingDiv);
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        },

        // Hapus indikator mengetik
        hideTypingIndicator: () => {
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        },

        // Toggle dark mode
        toggleDarkMode: () => {
            document.body.classList.toggle('dark-mode');
            state.darkMode = !state.darkMode;
            localStorage.setItem('darkMode', state.darkMode);
            
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (state.darkMode) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Mode Terang';
            } else {
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Mode Gelap';
            }
        },

        // Bersihkan chat
        clearChat: () => {
            if (confirm('Apakah Anda yakin ingin menghapus semua riwayat chat?')) {
                chatDisplay.innerHTML = '';
                state.chatHistory = [];
                localStorage.removeItem('chatHistory');
                ui.addMessage("Halo! Saya Groq AI, ada yang bisa saya bantu?", false, utils.formatTime(), false);
            }
        },

        // Salin riwayat chat
        copyChat: () => {
            let chatText = '';
            state.chatHistory.forEach(msg => {
                const prefix = msg.role === 'user' ? 'Anda: ' : 'AI: ';
                chatText += `${prefix}${msg.content}\n`;
            });
            
            navigator.clipboard.writeText(chatText.trim())
                .then(() => alert('Riwayat chat telah disalin!'))
                .catch(err => console.error('Gagal menyalin:', err));
        }
    };

    // ==================== FUNGSI API ====================
    const api = {
        // Kirim permintaan ke Groq API
        sendToGroq: async (messages) => {
            try {
                const startTime = performance.now();
                
                const response = await fetch(config.groq.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: config.groq.model,
                        messages: messages,
                        temperature: config.groq.temperature,
                        max_tokens: config.groq.maxTokens
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                
                const data = await response.json();
                const endTime = performance.now();
                console.log(`Response time: ${(endTime - startTime).toFixed(0)}ms`);
                
                return data.choices[0].message.content.trim();
            } catch (error) {
                console.error("API Error:", error);
                throw error;
            }
        }
    };

    // ==================== EVENT HANDLERS ====================
    const handleUserMessage = async () => {
        if (state.isProcessing) return;
        
        const message = userInput.value.trim();
        if (message) {
            state.isProcessing = true;
            userInput.disabled = true;
            sendBtn.disabled = true;
            
            // Tampilkan pesan pengguna
            await ui.addMessage(message, true);
            userInput.value = '';
            
            // Tampilkan indikator mengetik
            ui.showTypingIndicator();
            
            try {
                // Siapkan konteks percakapan
                const messages = [
                    {
                        role: "system",
                        content: "Anda adalah asisten AI yang membantu dan ramah. Berikan jawaban yang jelas dalam bahasa Indonesia kecuali diminta bahasa lain. Sertakan emoji yang sesuai untuk membuat respons lebih hidup."
                    },
                    ...state.chatHistory.map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }))
                ];
                
                // Dapatkan respons dari API
                const botResponse = await api.sendToGroq(messages);
                
                // Hapus indikator dan tampilkan respons
                ui.hideTypingIndicator();
                await ui.addMessage(botResponse, false);
            } catch (error) {
                ui.hideTypingIndicator();
                await ui.addMessage("Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.", false);
                console.error("Error:", error);
            } finally {
                state.isProcessing = false;
                userInput.disabled = false;
                sendBtn.disabled = false;
                userInput.focus();
            }
        }
    };

    // ==================== INISIALISASI APLIKASI ====================
    const init = () => {
        // Load riwayat chat
        utils.loadHistory();
        
        // Set dark mode
        if (state.darkMode) {
            document.body.classList.add('dark-mode');
            document.getElementById('darkModeToggle').innerHTML = '<i class="fas fa-sun"></i> Mode Terang';
        }
        
        // Jika tidak ada riwayat, tampilkan pesan sambutan
        if (state.chatHistory.length === 0) {
            ui.addMessage("Halo! Saya Groq AI, ada yang bisa saya bantu?", false, utils.formatTime(), false);
        }
    };

    // ==================== EVENT LISTENERS ====================
    sendBtn.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserMessage();
        }
    });
    
    clearBtn.addEventListener('click', ui.clearChat);
    copyBtn.addEventListener('click', ui.copyChat);
    document.getElementById('darkModeToggle').addEventListener('click', ui.toggleDarkMode);

    // ==================== JALANKAN APLIKASI ====================
    init();
});

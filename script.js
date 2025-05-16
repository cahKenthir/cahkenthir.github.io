document.addEventListener('DOMContentLoaded', function() {
    // ==================== Inisialisasi Elemen ====================
    // Sections
    const sections = {
        chat: document.getElementById('chatBotSection'),
        image: document.getElementById('imageGenSection'),
        fbGroup: document.getElementById('fbGroupSection')
    };
    
    // Buttons
    const navButtons = {
        chat: document.getElementById('chatBotBtn'),
        image: document.getElementById('imageGenBtn'),
        fbGroup: document.getElementById('fbGroupBtn')
    };
    
    // Dark Mode Toggle
    const darkModeToggle = document.createElement('button');
    darkModeToggle.id = 'darkModeToggle';
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Mode Gelap';
    document.querySelector('header').appendChild(darkModeToggle);
    
    // ==================== Fungsi Bantuan ====================
    function setActiveSection(sectionKey) {
        // Sembunyikan semua section
        Object.values(sections).forEach(section => {
            section.classList.remove('active');
        });
        
        // Tampilkan section yang dipilih
        sections[sectionKey].classList.add('active');
        
        // Simpan section aktif terakhir ke localStorage
        localStorage.setItem('lastActiveSection', sectionKey);
    }
    
    function initializeDarkMode() {
        const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Mode Terang';
        }
    }
    
    // ==================== Event Listeners ====================
    // Navigasi
    navButtons.chat.addEventListener('click', () => setActiveSection('chat'));
    navButtons.image.addEventListener('click', () => setActiveSection('image'));
    navButtons.fbGroup.addEventListener('click', () => setActiveSection('fbGroup'));
    
    // Dark Mode Toggle
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Mode Terang';
            localStorage.setItem('darkMode', 'true');
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Mode Gelap';
            localStorage.setItem('darkMode', 'false');
        }
    });
    
    // ==================== Fitur Chat Bot ====================
    const chatDisplay = document.getElementById('chatDisplay');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    
    const botPersonality = {
        name: "MetaAI",
        avatar: "🤖",
        greetings: [
            "Halo! Saya MetaAI, ada yang bisa saya bantu?",
            "Hai! Saya di sini untuk membantu Anda.",
            "Selamat datang! Silakan bertanya apa saja."
        ],
        responses: {
            help: "Saya bisa membantu dengan berbagai topik. Coba tanyakan tentang teknologi, sains, atau berita terbaru.",
            about: "Saya adalah asisten AI canggih berbasis teknologi terbaru dari Meta.",
            creator: "Saya dikembangkan oleh tim pengembang menggunakan teknologi mutakhir.",
            joke: "Mengapa komputer tidak bisa dingin? Karena dia selalu punya Windows! 😄",
            thanks: "Sama-sama! Senang bisa membantu Anda.",
            default: "Maaf, saya tidak sepenuhnya memahami. Bisakah Anda menjelaskan dengan cara lain?"
        },
        farewells: [
            "Sampai jumpa lagi!",
            "Senang berbicara dengan Anda!",
            "Jika ada pertanyaan lagi, saya siap membantu."
        ]
    };
    
    function addMessageToChat(message, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        
        // Tambahkan avatar untuk pesan bot
        if (!isUser) {
            const avatarSpan = document.createElement('span');
            avatarSpan.classList.add('avatar');
            avatarSpan.textContent = botPersonality.avatar;
            messageDiv.appendChild(avatarSpan);
        }
        
        const textSpan = document.createElement('span');
        textSpan.textContent = message;
        messageDiv.appendChild(textSpan);
        
        chatDisplay.appendChild(messageDiv);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }
    
    async function getBotResponse(userMessage) {
        const lowerMsg = userMessage.toLowerCase();
        
        // Tanggapan berdasarkan kata kunci
        if (lowerMsg.includes('help') || lowerMsg.includes('bantuan')) {
            return botPersonality.responses.help;
        } else if (lowerMsg.includes('about') || lowerMsg.includes('tentang')) {
            return botPersonality.responses.about;
        } else if (lowerMsg.includes('creator') || lowerMsg.includes('pembuat')) {
            return botPersonality.responses.creator;
        } else if (lowerMsg.includes('joke') || lowerMsg.includes('lucu')) {
            return botPersonality.responses.joke;
        } else if (lowerMsg.includes('thanks') || lowerMsg.includes('terima kasih')) {
            return botPersonality.responses.thanks;
        } else if (lowerMsg.includes('hello') || lowerMsg.includes('hai') || lowerMsg.includes('halo')) {
            return botPersonality.greetings[Math.floor(Math.random() * botPersonality.greetings.length)];
        } else if (lowerMsg.includes('bye') || lowerMsg.includes('selamat tinggal')) {
            return botPersonality.farewells[Math.floor(Math.random() * botPersonality.farewells.length)];
        } else {
            // Simulasi permintaan ke API untuk pertanyaan kompleks
            return await simulateAIRequest(userMessage);
        }
    }
    
    async function simulateAIRequest(message) {
        // Ini adalah simulasi - dalam implementasi nyata, ini akan memanggil API AI
        const mockKnowledgeBase = {
            "apa itu ai": "AI (Artificial Intelligence) adalah kecerdasan buatan yang ditunjukkan oleh mesin.",
            "bagaimana cara kerja ai": "AI bekerja dengan memproses data, mengenali pola, dan membuat keputusan berdasarkan algoritma pembelajaran mesin.",
            "apa keuntungan ai": "AI dapat membantu otomatisasi tugas, analisis data besar, diagnosis medis, kendaraan otonom, dan banyak lagi.",
            "apa itu meta ai": "Meta AI adalah divisi penelitian kecerdasan buatan dari perusahaan Meta (Facebook) yang mengembangkan teknologi AI terdepan.",
            "contoh penerapan ai": "Contoh penerapan AI: asisten virtual, rekomendasi produk, deteksi penipuan, terjemahan bahasa, dan pengenalan gambar."
        };
        
        // Simulasi delay jaringan
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
        
        // Cari jawaban yang paling cocok
        const question = message.toLowerCase();
        for (const [key, value] of Object.entries(mockKnowledgeBase)) {
            if (question.includes(key)) {
                return value;
            }
        }
        
        return botPersonality.responses.default;
    }
    
    sendBtn.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });
    
    async function handleUserMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessageToChat(message, true);
            userInput.value = '';
            
            // Tampilkan indikator typing
            const typingIndicator = document.createElement('div');
            typingIndicator.id = 'typingIndicator';
            typingIndicator.textContent = `${botPersonality.name} sedang mengetik...`;
            chatDisplay.appendChild(typingIndicator);
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
            
            try {
                const botResponse = await getBotResponse(message);
                document.getElementById('typingIndicator').remove();
                addMessageToChat(botResponse, false);
            } catch (error) {
                document.getElementById('typingIndicator').remove();
                addMessageToChat("Maaf, terjadi kesalahan saat memproses permintaan Anda.", false);
                console.error("Error:", error);
            }
        }
    }
    
    // ==================== Fitur Generator Gambar ====================
    const imagePrompt = document.getElementById('imagePrompt');
    const generateBtn = document.getElementById('generateBtn');
    const imageResult = document.getElementById('imageResult');
    const artStyleSelect = document.getElementById('artStyle');
    const resolutionSelect = document.getElementById('resolution');
    
    // Contoh gambar dari berbagai kategori
    const sampleImages = {
        realistic: [
            "https://source.unsplash.com/random/800x600/?realistic,portrait",
            "https://source.unsplash.com/random/800x600/?landscape,nature",
            "https://source.unsplash.com/random/800x600/?city,urban"
        ],
        cartoon: [
            "https://source.unsplash.com/random/800x600/?cartoon,drawing",
            "https://source.unsplash.com/random/800x600/?comic,art",
            "https://source.unsplash.com/random/800x600/?animation,character"
        ],
        anime: [
            "https://source.unsplash.com/random/800x600/?anime,japanese",
            "https://source.unsplash.com/random/800x600/?manga,art",
            "https://source.unsplash.com/random/800x600/?chibi,cute"
        ],
        abstract: [
            "https://source.unsplash.com/random/800x600/?abstract,art",
            "https://source.unsplash.com/random/800x600/?modern,art",
            "https://source.unsplash.com/random/800x600/?colorful,painting"
        ]
    };
    
    generateBtn.addEventListener('click', async function() {
        const prompt = imagePrompt.value.trim();
        if (prompt) {
            // Tampilkan loading
            imageResult.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Membuat gambar "${prompt}" dalam gaya ${artStyleSelect.value}...</p>
            `;
            
            try {
                // Simulasi delay pembuatan gambar
                await new Promise(resolve => setTimeout(resolve, 2500));
                
                // Dapatkan gambar berdasarkan gaya yang dipilih
                const selectedStyle = artStyleSelect.value;
                const images = sampleImages[selectedStyle];
                const randomImage = images[Math.floor(Math.random() * images.length)];
                
                // Tampilkan hasil
                imageResult.innerHTML = `
                    <div class="image-result-container">
                        <h3>Hasil untuk: "${prompt}"</h3>
                        <p>Gaya: ${selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1)}</p>
                        <img src="${randomImage}" alt="Generated Image">
                        <div class="image-actions">
                            <button class="download-btn"><i class="fas fa-download"></i> Unduh</button>
                            <button class="regenerate-btn"><i class="fas fa-sync-alt"></i> Buat Ulang</button>
                        </div>
                        <p class="image-notice">Ini adalah simulasi. Dalam implementasi nyata, gambar akan dihasilkan oleh AI berdasarkan deskripsi Anda.</p>
                    </div>
                `;
                
                // Tambahkan event listener untuk tombol
                document.querySelector('.regenerate-btn').addEventListener('click', function() {
                    generateBtn.click();
                });
                
                document.querySelector('.download-btn').addEventListener('click', function() {
                    alert('Dalam implementasi nyata, ini akan mengunduh gambar.');
                });
                
            } catch (error) {
                imageResult.innerHTML = `
                    <p class="error"><i class="fas fa-exclamation-triangle"></i> Gagal membuat gambar. Silakan coba lagi.</p>
                `;
                console.error("Error generating image:", error);
            }
        } else {
            imageResult.innerHTML = `
                <p class="error"><i class="fas fa-exclamation-circle"></i> Silakan masukkan deskripsi gambar terlebih dahulu.</p>
            `;
        }
    });
    
    // ==================== Fitur Facebook Group ====================
    document.querySelector('.fb-group-link').addEventListener('click', function() {
        // Simulasi pelacakan analytics
        console.log('Pengguna mengklik link group Facebook');
        // Dalam implementasi nyata, bisa menggunakan Google Analytics atau lainnya
    });
    
    // ==================== Inisialisasi Awal ====================
    // Muat section terakhir yang aktif
    const lastActiveSection = localStorage.getItem('lastActiveSection') || 'chat';
    setActiveSection(lastActiveSection);
    
    // Inisialisasi dark mode
    initializeDarkMode();
    
    // Sambutan awal dari bot
    setTimeout(() => {
        addMessageToChat(botPersonality.greetings[0], false);
    }, 500);
});

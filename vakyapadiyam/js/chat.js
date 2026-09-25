document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const sendBtn = document.getElementById('send-btn');
  const typingIndicator = document.getElementById('typing-indicator');

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    appendMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing
    typingIndicator.classList.add('active');
    sendBtn.disabled = true;
    
    // Scroll to bottom
    scrollToBottom();

    try {
      // Simulate API call to the existing api.py backend
      // In a real environment with the server running, this would be:
      // const response = await fetch('http://127.0.0.1:8000/ask', { ... })
      
      // We will simulate a response for the UI demonstration
      setTimeout(() => {
        const aiResponse = generateSimulatedResponse(message);
        typingIndicator.classList.remove('active');
        appendMessage(aiResponse, 'ai');
        sendBtn.disabled = false;
        scrollToBottom();
      }, 1500);
      
    } catch (error) {
      typingIndicator.classList.remove('active');
      appendMessage("I apologize, but I am currently unable to connect to the knowledge base. Please ensure the API server is running.", 'ai');
      sendBtn.disabled = false;
      scrollToBottom();
    }
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerHTML = text.replace(/\n/g, '<br>');
    chatMessages.appendChild(msgDiv);
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Very basic simulation logic for the UI demo
  function generateSimulatedResponse(query) {
    const q = query.toLowerCase();
    
    if (q.includes("sphota") || q.includes("स्फोट")) {
      return "Sphoṭa (स्फोट) is Bhartṛhari's central theory of meaning. While the spoken sounds (dhvani) of a word are sequential and temporary, the Sphoṭa is the eternal, indivisible semantic unit that 'bursts forth' in the listener's mind, conveying the complete meaning in a flash of intuition (pratibhā).";
    }
    if (q.includes("brahman") || q.includes("sabda") || q.includes("shabda")) {
      return "According to Brahmakāṇḍa 1.1 (<span class='deva'>अनादिनिधनं ब्रह्म शब्दतत्त्वं यदक्षरम्</span>), the Ultimate Reality is Śabda-Brahman — the primordial Word. It is beginningless, endless, and imperishable. The entire universe is considered an apparent manifestation (vivarta) of this linguistic consciousness.";
    }
    if (q.includes("kanda") || q.includes("parts") || q.includes("structure")) {
      return "The Vākyapadīyam is traditionally divided into three books (kāṇḍas):\n1. Brahmakāṇḍa (Āgama-samuccaya) - Metaphysics\n2. Vākyakāṇḍa - Theory of the sentence\n3. Padakāṇḍa (Prakīrṇakāṇḍa) - Detailed grammatical and semantic analysis of words.";
    }
    
    return "That is a profound question. Based on the Vākyapadīyam and the commentaries of Helārāja and Puṇyarāja, this requires understanding the non-dual nature of the Word (Śabdādvaita). *(Note: This is a simulated UI response. In production, this connects to the api.py RAG endpoint)*.";
  }
});

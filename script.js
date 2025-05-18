// Replace with your Gemini API key if needed
const API_KEY = 'YOUR_GEMINI_API_KEY';

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const startOverBtn = document.getElementById('startOverBtn');

// Photo Gallery Elements
const photoGallery = document.getElementById('photoGallery');

// Complaint Form Elements
const loginContainer = document.getElementById('loginContainer');
const ticketsContainer = document.getElementById('ticketsContainer');
const complaintTextarea = document.getElementById('complaint');
const reasonTextarea = document.getElementById('reason');
const submitComplaintBtn = document.getElementById('submitComplaint');
const angerRatingInputs = document.querySelectorAll('input[name="anger-rating"]');
const ticketsList = document.getElementById('ticketsList');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Authentication credentials
const VALID_USERNAME = 'yuv';
const VALID_PASSWORD = 'aks';

// Maximum number of tickets allowed
const MAX_TICKETS = 5;

// Cache for storing recent responses
const responseCache = {};

// Initialize chat, form, and authentication
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for chat
    sendButton.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });
    startOverBtn.addEventListener('click', resetChat);
    
    // Initialize login functionality
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Initialize complaint form
    if (submitComplaintBtn) {
        submitComplaintBtn.addEventListener('click', handleComplaintSubmission);
    }
    
    // Check if user is already logged in (from session storage)
    checkAuthStatus();
    
    // Load photos from the photos directory
    loadPhotos();
    
    // Create typewriter effect for hero section
    const title = document.querySelector('.main-title');
    if (title) {
        const originalText = title.textContent;
        title.textContent = '';
        
        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                title.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start the typewriter effect
        typeWriter();
    }
});

// Handle user login
function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        // Set authentication status in session storage
        sessionStorage.setItem('isAuthenticated', 'true');
        
        // Show tickets list and hide login form
        loginContainer.style.display = 'none';
        ticketsContainer.style.display = 'block';
        
        // Load existing tickets
        loadTickets();
        
        // Clear inputs
        usernameInput.value = '';
        passwordInput.value = '';
    } else {
        alert('Invalid username or password. Please try again.');
    }
}

// Handle user logout
function handleLogout() {
    // Clear authentication status
    sessionStorage.removeItem('isAuthenticated');
    
    // Show login form and hide ticket list
    loginContainer.style.display = 'block';
    ticketsContainer.style.display = 'none';
}

// Check if user is authenticated
function isAuthenticated() {
    return sessionStorage.getItem('isAuthenticated') === 'true';
}

// Check authentication status on page load
function checkAuthStatus() {
    if (isAuthenticated()) {
        loginContainer.style.display = 'none';
        ticketsContainer.style.display = 'block';
        loadTickets();
    } else {
        loginContainer.style.display = 'block';
        ticketsContainer.style.display = 'none';
    }
}

// Load photos from the photos directory
function loadPhotos() {
    // Sample photo data - in a real application, you would dynamically load these from server
    const photos = [
        { src: 'photos/photo1.jpg', caption: '' },
        { src: 'photos/photo2.jpg', caption: 'T' },
        { src: 'photos/photo3.jpg', caption: '' },
        { src: 'photos/photo4.jpg', caption: '' },
        { src: 'photos/photo5.jpg', caption: '' }
    ];
    
    // If no photos are available, show placeholders
    if (photos.length === 0) {
        for (let i = 1; i <= 5; i++) {
            const photoItem = document.createElement('div');
            photoItem.classList.add('gallery-item');
            
            photoItem.innerHTML = `
                <div class="image-placeholder">Photo ${i}</div>
                <p class="caption">Add a caption here</p>
            `;
            
            photoGallery.appendChild(photoItem);
        }
    } else {
        // Create photo elements
        photos.forEach(photo => {
            const photoItem = document.createElement('div');
            photoItem.classList.add('gallery-item');
            
            // Check if the image file exists, otherwise use a placeholder
            const img = new Image();
            img.onload = function() {
                photoItem.innerHTML = `
                    <img src="${photo.src}" alt="${photo.caption}">
                    <p class="caption">${photo.caption}</p>
                `;
            };
            
            img.onerror = function() {
                photoItem.innerHTML = `
                    <div class="image-placeholder">Photo</div>
                    <p class="caption">${photo.caption}</p>
                `;
            };
            
            img.src = photo.src;
            photoGallery.appendChild(photoItem);
        });
    }
}

// Handle user messages
function handleUserMessage() {
    const userMessage = userInput.value.trim();
    
    if (userMessage === '') return;
    
    // Display user message
    addMessageToChat(userMessage, 'user');
    
    // Clear input
    userInput.value = '';
    
    // Show loading
    const loadingId = showLoading();
    
    // Check cache for existing response
    if (responseCache[userMessage]) {
        hideLoading(loadingId);
        addMessageToChat(responseCache[userMessage], 'violet');
        return;
    }
    
    // Generate response (simulated instead of using Gemini API)
    setTimeout(() => {
        const response = generateSimpleResponse(userMessage);
        hideLoading(loadingId);
        addMessageToChat(response, 'violet');
        
        // Cache the response
        responseCache[userMessage] = response;
    }, 1000);
}

// Generate a simple response without using the API
function generateSimpleResponse(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('first date')) {
        return "Our first date was magical! Remember how we got caught in that unexpected rain and had to take shelter in that cute little café? Your laugh when I accidentally spilled coffee on myself is still one of my favorite sounds. ❤️";
    } else if (lowerCaseMessage.includes('favorite memory')) {
        return "My favorite memory with you has to be our stargazing picnic. Just you, me, a blanket, and the endless sky above us. The way you held my hand when I pointed out the constellations... that moment felt eternal. ✨";
    } else if (lowerCaseMessage.includes('love me')) {
        return "Why do I love you? Because you're you. Your kindness, your strength, your beautiful smile that lights up my world. The way you understand me without words. You're my person, my home, my everything. 💓";
    } else if (lowerCaseMessage.includes('adventure')) {
        return "Next adventure? How about that coastal road trip we've been dreaming about? Ocean views, hidden beaches, small towns with character. Just us, the open road, and endless possibilities ahead. What do you say? 🚗";
    } else if (lowerCaseMessage.includes('together')) {
        return "When we're together, I feel complete. Like all the scattered pieces of my heart finally found their place. There's a peace in your presence that I've never found anywhere else. You're my calm in every storm. 💭";
    } else {
        return "Yaha Kya kar rahi hai , Usse jaake baat kar";
    }
}

// Handle complaint submission
function handleComplaintSubmission() {
    const complaint = complaintTextarea.value.trim();
    const reason = reasonTextarea.value.trim();
    let angerRating = 0;
    
    // Get the selected anger rating
    angerRatingInputs.forEach(input => {
        if (input.checked) {
            angerRating = parseInt(input.value);
        }
    });
    
    if (!complaint) {
        alert('Please tell me what troubles you, my flame.');
        return;
    }
    
    if (angerRating === 0) {
        alert('Please rate how angry you are.');
        return;
    }
    
    // Generate a ticket ID
    const ticketId = `TICKET-${Date.now().toString().slice(-6)}`;
    
    // Create ticket object
    const ticket = {
        id: ticketId,
        complaint: complaint,
        reason: reason,
        angerRating: angerRating,
        timestamp: new Date().toISOString(),
        status: 'Open'
    };
    
    // Store the ticket in local storage with limit enforcement
    storeTicket(ticket);
    
    // Generate ticket response
    const responseMessage = generateTicketResponse(ticket);
    
    // Show the ticket creation notification
    const responseContainer = document.createElement('div');
    responseContainer.classList.add('ticket-response');
    responseContainer.innerHTML = `
        <h3>Ticket Created</h3>
        <p>Your ticket ID: <strong>${ticketId}</strong></p>
        <p>${responseMessage}</p>
        <button class="close-response-btn">Close</button>
    `;
    
    // Add styles to the response container
    responseContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, var(--deep-red), #6e0000);
        color: var(--parchment);
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        max-width: 80%;
        text-align: center;
        animation: fadeIn 0.5s forwards;
    `;
    
    // Add the response to the body
    document.body.appendChild(responseContainer);
    
    // Add event listener to close button
    const closeBtn = responseContainer.querySelector('.close-response-btn');
    closeBtn.style.cssText = `
        background: var(--gold);
        color: var(--black);
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        margin-top: 20px;
        cursor: pointer;
        font-family: 'Cinzel', serif;
        transition: all 0.3s ease;
    `;
    
    closeBtn.addEventListener('click', () => {
        responseContainer.remove();
        // Reset the form
        complaintTextarea.value = '';
        reasonTextarea.value = '';
        angerRatingInputs.forEach(input => {
            input.checked = false;
        });
        
        // Reload tickets if user is authenticated
        if (isAuthenticated()) {
            loadTickets();
        }
    });
}

// Generate a response to the ticket based on anger level
function generateTicketResponse(ticket) {
    const responses = [
        "I see this troubles you, my flame. Like a small spark, I'll tend to it with care.",
        "Your concern has been noted, my heart. Like Tairn, I'll watch over this issue.",
        "By the gods, this clearly matters to you. I'll channel my lightning to address it.",
        "I can see the fire in your eyes about this. I'll handle it with the intensity it deserves.",
        "Your rage burns like dragonfire, my love. Consider it as good as solved by my hand."
    ];
    
    // Get the response based on anger rating (1-5)
    const baseResponse = responses[ticket.angerRating - 1];
    
    // Add a personalized touch based on the reason if provided
    let personalizedResponse = '';
    if (ticket.reason) {
        personalizedResponse = ` I understand why - ${ticket.reason.slice(0, 50)}${ticket.reason.length > 50 ? '...' : ''} - affects you deeply. Together, we'll face this like we faced the flightleaders.`;
    }
    
    return `${baseResponse}${personalizedResponse}`;
}

// Store ticket in local storage with a maximum limit
function storeTicket(ticket) {
    // Get existing tickets or initialize new array
    const existingTickets = JSON.parse(localStorage.getItem('worry_tickets') || '[]');
    
    // Add new ticket
    existingTickets.push(ticket);
    
    // If we exceed the maximum number of tickets, remove the oldest one(s)
    while (existingTickets.length > MAX_TICKETS) {
        // Sort by timestamp (oldest first)
        existingTickets.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        // Remove the oldest ticket
        existingTickets.shift();
    }
    
    // Store back to local storage
    localStorage.setItem('worry_tickets', JSON.stringify(existingTickets));
}

// Load tickets from local storage
function loadTickets() {
    if (!ticketsList) return;
    
    // Clear existing tickets
    ticketsList.innerHTML = '';
    
    // Get tickets from local storage
    const tickets = JSON.parse(localStorage.getItem('worry_tickets') || '[]');
    
    if (tickets.length === 0) {
        ticketsList.innerHTML = '<div class="no-tickets">No complaint tickets found. Submit a worry to create one!</div>';
        return;
    }
    
    // Sort tickets by timestamp (newest first)
    tickets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Create ticket elements
    tickets.forEach(ticket => {
        const ticketElement = document.createElement('div');
        ticketElement.classList.add('ticket-item');
        
        // Format date
        const ticketDate = new Date(ticket.timestamp);
        const formattedDate = ticketDate.toLocaleDateString() + ' ' + ticketDate.toLocaleTimeString();
        
        // Create fire icons based on anger rating
        let fireIcons = '';
        for (let i = 0; i < ticket.angerRating; i++) {
            fireIcons += '<i class="fas fa-fire"></i>';
        }
        
        ticketElement.innerHTML = `
            <div class="ticket-header">
                <div class="ticket-id">${ticket.id}</div>
                <div class="ticket-date">${formattedDate}</div>
            </div>
            <div class="ticket-content">
                <div class="ticket-anger">Anger Level: ${fireIcons}</div>
                <p><strong>Complaint:</strong> ${ticket.complaint}</p>
                ${ticket.reason ? `<p><strong>Reason:</strong> ${ticket.reason}</p>` : ''}
            </div>
            <div class="ticket-actions">
                <button class="delete-ticket-btn" data-id="${ticket.id}"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        
        ticketsList.appendChild(ticketElement);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-ticket-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-id');
            deleteTicket(ticketId);
        });
    });
}

// Delete a ticket
function deleteTicket(ticketId) {
    // Get existing tickets
    const tickets = JSON.parse(localStorage.getItem('worry_tickets') || '[]');
    
    // Filter out the ticket to delete
    const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
    
    // Update local storage
    localStorage.setItem('worry_tickets', JSON.stringify(updatedTickets));
    
    // Reload tickets
    loadTickets();
}

// Add message to chat
function addMessageToChat(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    
    if (sender === 'user') {
        messageDiv.classList.add('user-message');
    } else {
        messageDiv.classList.add('violet-message');
    }
    
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageDiv);
    
    // Auto scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add fade-in animation
    messageDiv.style.opacity = '0';
    messageDiv.style.animation = 'fadeIn 0.5s forwards';
}

// Show loading animation
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'violet-message', 'loading');
    
    loadingDiv.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return Date.now(); // Return a unique ID for the loading element
}

// Hide loading animation
function hideLoading(loadingId) {
    const loadingElements = document.querySelectorAll('.loading');
    if (loadingElements.length > 0) {
        loadingElements[loadingElements.length - 1].remove();
    }
}

// Reset chat
function resetChat() {
    // Clear all messages except the welcome message
    while (chatMessages.children.length > 1) {
        chatMessages.removeChild(chatMessages.lastChild);
    }
    
    // Clear input
    userInput.value = '';
    
    // Clear cache
    Object.keys(responseCache).forEach(key => {
        delete responseCache[key];
    });
} 
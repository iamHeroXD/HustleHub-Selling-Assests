// Sample product data
const products = [
    {
        id: 1,
        name: "Advanced Script Pack",
        creator: "ScriptMaster",
        price: 24.99,
        description: "A comprehensive collection of advanced Roblox scripts including admin tools, game mechanics, and UI systems.",
        image: "💻"
    },
    {
        id: 2,
        name: "Premium UI Kit",
        creator: "UIDesignPro",
        price: 19.99,
        description: "Beautiful and responsive UI elements for your Roblox games. Includes buttons, menus, and HUD components.",
        image: "🎨"
    },
    {
        id: 3,
        name: "Animation Bundle",
        creator: "AnimatorX",
        price: 29.99,
        description: "High-quality animations for characters including walking, running, jumping, and special actions.",
        image: "🕹️"
    },
    {
        id: 4,
        name: "3D Model Pack",
        creator: "ModelMaker",
        price: 34.99,
        description: "Detailed 3D models for environments, vehicles, and props. Optimized for Roblox performance.",
        image: "🏗️"
    },
    {
        id: 5,
        name: "Sound Effects Library",
        creator: "AudioWizard",
        price: 14.99,
        description: "Royalty-free sound effects and background music perfect for any Roblox game genre.",
        image: "🎵"
    },
    {
        id: 6,
        name: "Game Template",
        creator: "GameDevPro",
        price: 39.99,
        description: "Complete game template with mechanics, UI, and assets to kickstart your Roblox development.",
        image: "🎮"
    }
];

// Global variables
let currentProduct = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    // Show loading animation
    showLoadingAnimation();
    
    // Load products
    loadProducts();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Hide loading animation after a short delay
    setTimeout(() => {
        hideLoadingAnimation();
    }, 1500);
}

// Show loading animation
function showLoadingAnimation() {
    const loading = document.getElementById('loading');
    loading.classList.remove('hidden');
}

// Hide loading animation
function hideLoadingAnimation() {
    const loading = document.getElementById('loading');
    loading.classList.add('hidden');
}

// Load products into the grid
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    
    card.innerHTML = `
        <div class="product-image">
            ${product.image}
        </div>
        <div class="product-content">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-creator">by ${product.creator}</p>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price}</div>
            <button class="quick-view-btn" onclick="openProductModal(${product.id})">Quick View</button>
        </div>
    `;
    
    return card;
}

// Initialize event listeners
function initializeEventListeners() {
    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeAllModals();
            }
        });
    });
    
    // Close modals with escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Buyer form submission
    const buyerForm = document.getElementById('buyerForm');
    buyerForm.addEventListener('submit', handlePurchase);
}

// Open product modal
function openProductModal(productId) {
    currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) return;
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="modal-product-image">
            ${currentProduct.image}
        </div>
        <h2 class="modal-product-title">${currentProduct.name}</h2>
        <p class="modal-product-creator">by ${currentProduct.creator}</p>
        <p class="modal-product-description">${currentProduct.description}</p>
        <div class="modal-product-price">$${currentProduct.price}</div>
        <button class="buy-button" onclick="openBuyerModal()">Buy Now</button>
    `;
    
    const modal = document.getElementById('productModal');
    modal.classList.add('active');
}

// Open buyer modal
function openBuyerModal() {
    closeAllModals();
    
    const modal = document.getElementById('buyerModal');
    modal.classList.add('active');
    
    // Reset form
    document.getElementById('buyerForm').reset();
}

// Close all modals
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
}

// Handle purchase form submission
function handlePurchase(event) {
    event.preventDefault();
    
    const buyerName = document.getElementById('buyerName').value.trim();
    
    if (!buyerName) {
        alert('Please enter your name');
        return;
    }
    
    if (!currentProduct) {
        alert('No product selected');
        return;
    }
    
    // Send order to Discord
    sendOrderToDiscord(buyerName, currentProduct);
}

// Send order to Discord via webhook
async function sendOrderToDiscord(buyerName, product) {
    try {
        // Show loading state
        const buyButton = document.querySelector('#buyerForm button[type="submit"]');
        const originalText = buyButton.textContent;
        buyButton.textContent = 'Processing...';
        buyButton.disabled = true;
        
        // For production, you would call your serverless function here
        // This is a mock implementation for frontend-only demo
        const success = await mockDiscordWebhookCall(buyerName, product);
        
        if (success) {
            // Show success message
            alert(`Thank you for your purchase, ${buyerName}! Your order for "${product.name}" has been received.`);
            closeAllModals();
        } else {
            alert('There was an error processing your order. Please try again.');
        }
        
        // Reset button
        buyButton.textContent = originalText;
        buyButton.disabled = false;
        
    } catch (error) {
        console.error('Error sending order to Discord:', error);
        alert('There was an error processing your order. Please try again.');
        
        // Reset button
        const buyButton = document.querySelector('#buyerForm button[type="submit"]');
        buyButton.textContent = 'Confirm Purchase';
        buyButton.disabled = false;
    }
}

// Mock Discord webhook call (replace with actual serverless function in production)
async function mockDiscordWebhookCall(buyerName, product) {
    // In a real implementation, you would call your serverless function
    // For this demo, we'll simulate a successful API call
    
    console.log('Sending order to Discord:');
    console.log(`Buyer: ${buyerName}`);
    console.log(`Product: ${product.name}`);
    console.log(`Price: $${product.price}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate random success (90% success rate for demo)
    return Math.random() < 0.9;
}

// Scroll to products section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

// Close modal event listeners (added to close buttons)
document.addEventListener('DOMContentLoaded', function() {
    // Add close functionality to all close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
});
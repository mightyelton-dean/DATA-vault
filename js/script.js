// Configuration
const API_URL = 'http://localhost:5000/api'; // Change to your backend URL

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    icon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

// Initialize theme on page load
initTheme();

// Create floating particles dynamically
function createParticles() {
    const bg = document.querySelector('.animated-bg');
    const colors = ['rgba(0, 240, 255, 0.4)', 'rgba(184, 41, 255, 0.3)', 'rgba(255, 215, 0, 0.3)'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 6 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = Math.random() * 10 + 15 + 's';
        bg.appendChild(particle);
    }
}

createParticles();

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fetch bundles from API
async function fetchBundles() {
    try {
        const response = await fetch(`${API_URL}/bundles`);
        const data = await response.json();

        if (data.success) {
            displayBundles(data.data);
        } else {
            showError('Failed to load bundles');
        }
    } catch (error) {
        console.error('Error fetching bundles:', error);
        showError('Using offline mode - Connect backend to see live bundles');
        displayStaticBundles();
    }
}

// Display bundles
function displayBundles(bundles) {
    const container = document.getElementById('bundlesContainer');
    container.innerHTML = '';

    bundles.forEach((bundle, index) => {
        const card = createBundleCard(bundle, index);
        container.appendChild(card);
    });
}

// Create bundle card element
function createBundleCard(bundle, index) {
    const card = document.createElement('div');
    card.className = 'bundle-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const badgeColors = {
        'hot': 'rgba(255, 68, 68, 0.1); border-color: #ff4444; color: #ff4444',
        'popular': 'rgba(0, 255, 136, 0.1); border-color: #00ff88; color: #00ff88',
        'best-value': 'rgba(0, 240, 255, 0.1); border-color: #00f0ff; color: #00f0ff',
        'premium': 'rgba(184, 41, 255, 0.1); border-color: #b829ff; color: #b829ff',
        'ultimate': 'rgba(255, 215, 0, 0.1); border-color: #ffd700; color: #ffd700',
        'enterprise': 'rgba(255, 255, 255, 0.1); border-color: #ffffff; color: #ffffff'
    };

    const badgeStyle = badgeColors[bundle.badge?.type] || badgeColors.popular;

    card.innerHTML = `
        <div class="bundle-header">
            <div class="bundle-size">${bundle.size}</div>
            <div class="bundle-badge" style="background: ${badgeStyle}">
                ${bundle.badge?.text || 'POPULAR'}
            </div>
        </div>
        <div class="bundle-price">
            GH₵ ${bundle.price.toFixed(2)} 
            <span>GH₵ ${bundle.originalPrice.toFixed(2)}</span>
        </div>
        <ul class="bundle-features">
            ${bundle.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <button class="buy-btn" onclick="purchaseBundle('${bundle._id}', '${bundle.name}', ${bundle.price})">
            Buy Now
        </button>
    `;

    return card;
}

// Display static bundles (fallback)
function displayStaticBundles() {
    const staticBundles = [
        {
            _id: '1',
            name: '1GB Weekly',
            size: '1GB',
            price: 3.50,
            originalPrice: 6.00,
            features: ['Valid for 7 days', 'Instant delivery (1-5 mins)', 'All networks supported', '24/7 customer support'],
            badge: { text: 'HOT DEAL', type: 'hot' }
        },
        {
            _id: '2',
            name: '5GB Monthly',
            size: '5GB',
            price: 15.00,
            originalPrice: 25.00,
            features: ['Valid for 30 days', 'Instant delivery (1-5 mins)', 'All networks supported', 'Priority customer support'],
            badge: { text: 'POPULAR', type: 'popular' }
        },
        {
            _id: '3',
            name: '10GB Monthly',
            size: '10GB',
            price: 28.00,
            originalPrice: 45.00,
            features: ['Valid for 30 days', 'Instant delivery (1-5 mins)', 'All networks supported', 'VIP support & rewards'],
            badge: { text: 'BEST VALUE', type: 'best-value' }
        }
    ];

    displayBundles(staticBundles);
}

// Show error message
function showError(message) {
    const container = document.getElementById('bundlesContainer');
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
            <p style="color: var(--text-secondary); font-size: 1.1rem;">${message}</p>
        </div>
    `;
}

// Purchase bundle
async function purchaseBundle(bundleId, bundleName, price) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        alert('Please login or register to purchase bundles.');
        return;
    }

    const phone = prompt(`Enter recipient phone number for ${bundleName}:`);
    if (!phone) return;

    const network = prompt('Enter network (MTN/AirtelTigo/Telecel):');
    if (!network) return;

    const btn = event.target;
    btn.disabled = true;
    btn.textContent = 'Processing...';

    try {
        const response = await fetch(`${API_URL}/bundles/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                bundleId,
                recipientPhone: phone,
                network: network,
                paymentMethod: 'momo'
            })
        });

        const data = await response.json();

        if (data.success) {
            if (data.data.authorizationUrl) {
                window.location.href = data.data.authorizationUrl;
            } else {
                alert('Payment initialized! Reference: ' + data.data.paymentReference);
            }
        } else {
            alert('Purchase failed: ' + data.message);
        }
    } catch (error) {
        console.error('Purchase error:', error);
        alert('Network error. Please try again.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Buy Now';
    }
}

// Load bundles when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchBundles();
});

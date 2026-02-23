// ===== CONFIGURATION =====
// 👇 Change to your Railway URL after deploying: e.g. 'https://ceedi-backend.up.railway.app/api'
const API_URL = 'http://localhost:5000/api';

// ===== DEMO AGENT ACCOUNTS (frontend-only until backend is ready) =====
// Remove these once the real backend is connected
const DEMO_AGENTS = [
    { email: 'agent@ceedi.com', password: 'agent123', name: 'Demo Agent' },
    { email: 'admin@ceedi.com', password: 'admin123', name: 'Admin Agent' }
];

// ===== AUTH HELPERS =====
function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

function getAgentName() {
    try {
        return JSON.parse(localStorage.getItem('agentData'))?.name || 'Agent';
    } catch { return 'Agent'; }
}

function setLoggedIn(name, email) {
    localStorage.setItem('authToken', 'demo-token-' + Date.now());
    localStorage.setItem('agentData', JSON.stringify({ name, email }));
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('agentData');
    updateAuthUI();
    displayStaticBundles(); // re-render with locked prices
    showToast('Logged out successfully.');
}

// ===== TOAST =====
function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== UPDATE HEADER UI BASED ON AUTH STATE =====
function updateAuthUI() {
    const loginBtn = document.querySelector('.login-btn');
    let statusBar = document.getElementById('agentStatusBar');

    if (isLoggedIn()) {
        // Change login button text
        if (loginBtn) {
            loginBtn.textContent = '🎛 Dashboard';
            loginBtn.onclick = () => { window.location.href = 'agent-dashboard.html'; };
        }
        // Show status bar in bundles section
        if (!statusBar) {
            statusBar = document.createElement('div');
            statusBar.id = 'agentStatusBar';
            statusBar.className = 'agent-status-bar';
            const bundlesSection = document.getElementById('bundles');
            if (bundlesSection) {
                bundlesSection.insertBefore(statusBar, bundlesSection.querySelector('.bundles-grid'));
            }
        }
        statusBar.innerHTML = `✅ Logged in as <strong>${getAgentName()}</strong> &nbsp;|&nbsp; <button onclick="logout()">Logout</button>`;
        statusBar.style.display = 'flex';
    } else {
        if (loginBtn) {
            loginBtn.textContent = 'Agent Login';
            loginBtn.onclick = openLoginModal;
        }
        if (statusBar) statusBar.style.display = 'none';
    }
}

// ===== TRANSLATION DICTIONARY =====
const translations = {
    en: {
        nav_bundles: 'Bundles', nav_features: 'Features', nav_services: 'Services',
        nav_contact: 'Contact', nav_login: 'Agent Login',
        hero_title: 'Affordable Data Bundles<br>All Networks • Non-Expiry',
        hero_description: 'Get instant data delivery for MTN, AirtelTigo & Telecel at unbeatable prices. Save up to 40% on every purchase.',
        bundles_title: 'Featured Data Bundles', bundles_subtitle: 'Choose the perfect bundle for your needs',
        features_title: 'Why Choose Ceedi-data?'
    },
    fr: {
        nav_bundles: 'Forfaits', nav_features: 'Caractéristiques', nav_services: 'Services',
        nav_contact: 'Contact', nav_login: 'Connexion Agent',
        hero_title: 'Affordable Data Bundles<br>All Networks • Non-Expiry',
        hero_description: 'Obtenez une livraison instantanée de forfaits de données pour MTN, AirtelTigo et Telecel à des prix imbattables. Économisez jusqu\'à 40% sur chaque achat.',
        bundles_title: 'Forfaits de Données en Vedette', bundles_subtitle: 'Choisissez le forfait parfait pour vos besoins',
        features_title: 'Pourquoi choisir Ceedi-data?'
    },
    es: {
        nav_bundles: 'Paquetes', nav_features: 'Características', nav_services: 'Servicios',
        nav_contact: 'Contacto', nav_login: 'Inicio de Sesión',
        hero_title: 'Affordable Data Bundles<br>All Networks • Non-Expiry',
        hero_description: 'Obtenga entrega instantánea de paquetes de datos para MTN, AirtelTigo y Telecel a precios inmejorable. Ahorre hasta el 40% en cada compra.',
        bundles_title: 'Paquetes de Datos en Destacado', bundles_subtitle: 'Elige el paquete perfecto para tus necesidades',
        features_title: '¿Por qué elegir Ceedi-data?'
    },
    pt: {
        nav_bundles: 'Pacotes', nav_features: 'Recursos', nav_services: 'Serviços',
        nav_contact: 'Contato', nav_login: 'Login do Agente',
        hero_title: 'Affordable Data Bundles<br>All Networks • Non-Expiry',
        hero_description: 'Obtenha entrega instantânea de pacotes de dados para MTN, AirtelTigo e Telecel com preços imbatíveis. Economize até 40% em cada compra.',
        bundles_title: 'Pacotes de Dados em Destaque', bundles_subtitle: 'Escolha o pacote perfeito para suas necessidades',
        features_title: 'Por que escolher Ceedi-data?'
    },
    ar: {
        nav_bundles: 'الحزم', nav_features: 'الميزات', nav_services: 'الخدمات',
        nav_contact: 'اتصل', nav_login: 'دخول الوكيل',
        hero_title: 'Affordable Data Bundles<br>All Networks • Non-Expiry',
        hero_description: 'احصل على تسليم فوري لحزم البيانات لـ MTN و AirtelTigo و Telecel بأسعار لا تُقبل المنافسة. توفير يصل إلى 40% على كل عملية شراء.',
        bundles_title: 'حزم البيانات المميزة', bundles_subtitle: 'اختر الحزمة المثالية لاحتياجاتك',
        features_title: 'لماذا تختار Ceedi-data؟'
    },
    zu: {
        nav_bundles: 'Ama-Bundle', nav_features: 'Izici', nav_services: 'Izinsizakalo',
        nav_contact: 'Xhumana Nathi', nav_login: 'Ukungena kwe-Agent',
        hero_title: 'Affordable Data Bundles<br>All Networks • Non-Expiry',
        hero_description: 'Thola ukuhlukunyelwa okushesha kwa-data bundles para MTN, AirtelTigo no-Telecel ngamanani angakuvikeli. Onga ngalingu-40%.',
        bundles_title: 'Ama-Bundle Adata Akhethiwe', bundles_subtitle: 'Khetha i-bundle efanele ngezidingo zakho',
        features_title: 'Ngubani ukuthi Ceedi-data?'
    },
    yo: {
        nav_bundles: 'Àwọṣẹ', nav_features: 'Àwọn ẹjẹ́ àkírí', nav_services: 'Àwọn ìṣẹ́',
        nav_contact: 'Ränṣọ pẹ̀lú wa', nav_login: 'Wọlé Aláàjọ',
        hero_title: 'Affordable Data Bundles<br>All Networks • Non-Expiry',
        hero_description: 'Gba fásífásì àwon bundle data fun MTN, AirtelTigo ati Telecel ni awon anfani ti ko nibaramu.',
        bundles_title: 'Àwọn Bundle Data To Yan', bundles_subtitle: 'Yan bundle to dara julo fun awon ikohun rẹ',
        features_title: 'Ìdí ta a yẹ kó yan Ceedi-data?'
    },
    ha: {
        nav_bundles: 'Kunsuri', nav_features: 'Sifofu', nav_services: 'Ayyukan',
        nav_contact: 'Tuntubo', nav_login: 'Shiga Wakili',
        hero_title: 'Affordable Data Bundles<br>All Networks • Non-Expiry',
        hero_description: 'Sami karɓa jimlace da sauri na kunsuri data don MTN, AirtelTigo da Telecel a farashi da ba za su iya dace ba.',
        bundles_title: 'Kunsuri Data da aka Fifida', bundles_subtitle: 'Zaɓi kunsuri mafi dacewa da bukatsunka',
        features_title: 'Me ya sa za ka zaɓi Ceedi-data?'
    }
};

function detectLanguage() {
    const saved = localStorage.getItem('selectedLanguage');
    if (saved) return saved;
    const browserLang = navigator.language.split('-')[0];
    return Object.keys(translations).includes(browserLang) ? browserLang : 'en';
}

let currentLanguage = detectLanguage();

function initLanguage() {
    const select = document.getElementById('languageSelect');
    if (select) select.value = currentLanguage;
    applyTranslations();
}

function applyTranslations() {
    const langData = translations[currentLanguage] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) element.innerHTML = langData[key];
    });
    document.documentElement.setAttribute('dir', currentLanguage === 'ar' ? 'rtl' : 'ltr');
    document.body.style.direction = currentLanguage === 'ar' ? 'rtl' : 'ltr';
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    applyTranslations();
}

// ===== AUTH MODALS =====
function openLoginModal() {
    document.getElementById('loginModal').classList.add('show');
}
function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
}
function openRegistrationModal() {
    document.getElementById('registrationModal').classList.add('show');
}
function closeRegistrationModal() {
    document.getElementById('registrationModal').classList.remove('show');
}
function switchToRegister(e) {
    e.preventDefault();
    closeLoginModal();
    openRegistrationModal();
}
function switchToLogin(e) {
    e.preventDefault();
    closeRegistrationModal();
    openLoginModal();
}

window.onclick = function(event) {
    if (event.target === document.getElementById('loginModal')) closeLoginModal();
    if (event.target === document.getElementById('registrationModal')) closeRegistrationModal();
};

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showToast('Please fill in all fields');
        return;
    }

    // Try demo accounts first (remove when backend is connected)
    const demoMatch = DEMO_AGENTS.find(a => a.email === email && a.password === password);
    if (demoMatch) {
        setLoggedIn(demoMatch.name, demoMatch.email);
        closeLoginModal();
        document.getElementById('loginForm').reset();
        showToast('✅ Login successful! Welcome, ' + demoMatch.name);
        updateAuthUI();
        displayStaticBundles(); // re-render with prices visible
        return;
    }

    // Try real backend
    loginAgent(email, password);
}

function handleRegistration(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const mtnSim = document.getElementById('regMtnSim').value;
    const bank = document.getElementById('regBank').value;
    const password = document.getElementById('regPassword').value;
    const password2 = document.getElementById('regPassword2').value;
    const terms = document.getElementById('regTerms').checked;

    if (!name || !email || !phone || !mtnSim || !bank || !password || !password2) {
        showToast('Please fill in all fields');
        return;
    }
    if (password !== password2) { showToast('Passwords do not match'); return; }
    if (!terms) { showToast('Please accept Terms & Conditions'); return; }

    registerAgent(name, email, phone, mtnSim, bank, password);
}

async function registerAgent(name, email, phone, mtnSim, bank, password) {
    try {
        const response = await fetch(`${API_URL}/agents/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, mtnSim, bankAccount: bank, password })
        });
        const data = await response.json();
        if (data.success) {
            showToast('Registration successful! Please check your email to verify.');
            closeRegistrationModal();
            document.getElementById('registrationForm').reset();
        } else {
            showToast('Registration failed: ' + (data.message || 'Try again'));
        }
    } catch (error) {
        // Backend not connected yet
        showToast('Backend not connected yet. Please contact admin to activate your account.');
    }
}

async function loginAgent(email, password) {
    try {
        const response = await fetch(`${API_URL}/agents/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('agentData', JSON.stringify(data.agent));
            showToast('Login successful!');
            closeLoginModal();
            document.getElementById('loginForm').reset();
            updateAuthUI();
            displayStaticBundles();
            setTimeout(() => { window.location.href = 'agent-dashboard.html'; }, 800);
        } else {
            showToast('Login failed: ' + (data.message || 'Invalid credentials'));
        }
    } catch (error) {
        showToast('Invalid credentials. (Use demo: agent@ceedi.com / agent123)');
    }
}

// ===== THEME =====
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
    const btn = document.getElementById('themeBtn');
    if (btn) btn.textContent = theme === 'dark' ? '🌙' : '☀️';
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    createParticles();
    fetchBundles();
    setupSmoothScroll();
    setupMobileNav();
    updateAuthUI();
});

// ===== PARTICLES & UI =====
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

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function setupMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('mainNav');
    if (!navToggle || !nav) return;

    navToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('show');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        navToggle.textContent = isOpen ? '✕' : '☰';
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                nav.classList.remove('show');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.textContent = '☰';
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            nav.classList.remove('show');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.textContent = '☰';
        }
    });
}

// ===== BUNDLES =====
async function fetchBundles() {
    try {
        const response = await fetch(`${API_URL}/bundles`);
        const data = await response.json();
        if (data.success) {
            displayBundles(data.data);
        } else {
            displayStaticBundles();
        }
    } catch (error) {
        displayStaticBundles();
    }
}

function displayBundles(bundles) {
    const container = document.getElementById('bundlesContainer');
    container.innerHTML = '';
    bundles.forEach((bundle, index) => {
        container.appendChild(createBundleCard(bundle, index));
    });
}

function createBundleCard(bundle, index) {
    const loggedIn = isLoggedIn();
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

    // Price HTML — blurred if not logged in
    let priceHtml;
    if (loggedIn) {
        priceHtml = `
            <div class="bundle-price">
                GH₵ ${bundle.price.toFixed(2)}
                <span>GH₵ ${bundle.originalPrice.toFixed(2)}</span>
            </div>`;
    } else {
        priceHtml = `
            <div class="bundle-price-wrapper">
                <div class="bundle-price price-blur">
                    GH₵ ${bundle.price.toFixed(2)}
                    <span>GH₵ ${bundle.originalPrice.toFixed(2)}</span>
                </div>
                <div class="lock-badge" onclick="openLoginModal()">🔒 Login to see price</div>
            </div>`;
    }

    // Buy button — disabled if not logged in
    const buyBtn = loggedIn
        ? `<button class="buy-btn" onclick="purchaseBundle('${bundle._id}', '${bundle.name}', ${bundle.price})">Buy Now</button>`
        : `<button class="buy-btn" onclick="openLoginModal()" style="opacity:0.7;">🔒 Login to Buy</button>`;

    card.innerHTML = `
        <div class="bundle-header">
            <div class="bundle-size">${bundle.size}</div>
            <div class="bundle-badge" style="background: ${badgeStyle}">${bundle.badge?.text || 'POPULAR'}</div>
        </div>
        ${priceHtml}
        <ul class="bundle-features">
            ${bundle.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        ${buyBtn}
    `;
    return card;
}

function displayStaticBundles() {
    const staticBundles = [
        {
            _id: '1', name: '1GB Weekly', size: '1GB', price: 3.50, originalPrice: 6.00,
            features: ['Valid for 7 days', 'Instant delivery (1-5 mins)', 'All networks supported', '24/7 customer support'],
            badge: { text: 'HOT DEAL', type: 'hot' }
        },
        {
            _id: '2', name: '5GB Monthly', size: '5GB', price: 15.00, originalPrice: 25.00,
            features: ['Valid for 30 days', 'Instant delivery (1-5 mins)', 'All networks supported', 'Priority customer support'],
            badge: { text: 'POPULAR', type: 'popular' }
        },
        {
            _id: '3', name: '10GB Monthly', size: '10GB', price: 28.00, originalPrice: 45.00,
            features: ['Valid for 30 days', 'Instant delivery (1-5 mins)', 'All networks supported', 'VIP support & rewards'],
            badge: { text: 'BEST VALUE', type: 'best-value' }
        }
    ];
    displayBundles(staticBundles);
}

function showError(message) {
    const container = document.getElementById('bundlesContainer');
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
            <p style="color: var(--text-secondary); font-size: 1rem;">${message}</p>
        </div>`;
}

// ===== PURCHASE =====
async function purchaseBundle(bundleId, bundleName, price) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        openLoginModal();
        return;
    }

    const phone = prompt(`Enter recipient phone number for ${bundleName}:`);
    if (!phone) return;

    const network = prompt('Enter network (MTN / AirtelTigo / Telecel):');
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
            body: JSON.stringify({ bundleId, recipientPhone: phone, network, paymentMethod: 'momo' })
        });
        const data = await response.json();
        if (data.success) {
            if (data.data.authorizationUrl) {
                window.location.href = data.data.authorizationUrl;
            } else {
                showToast('Payment initialized! Ref: ' + data.data.paymentReference);
            }
        } else {
            showToast('Purchase failed: ' + data.message);
        }
    } catch (error) {
        showToast('Backend not connected yet. Purchase will work once backend is live.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Buy Now';
    }
}

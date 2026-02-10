// Dashboard Script
// Check if user is authenticated
document.addEventListener('DOMContentLoaded', () => {
    checkAgentAuth();
    initTheme();
    loadAgentData();
    createParticles();
});

// Check Authentication
function checkAgentAuth() {
    const token = localStorage.getItem('authToken');
    const agentData = localStorage.getItem('agentData');
    
    if (!token || !agentData) {
        // Redirect to home page
        window.location.href = 'index.html';
        return;
    }
    
    // Load agent data
    const agent = JSON.parse(agentData);
    document.getElementById('agentName').textContent = agent.name || 'Agent';
}

// Load Agent Dashboard Data
async function loadAgentData() {
    const token = localStorage.getItem('authToken');
    const agentData = JSON.parse(localStorage.getItem('agentData'));
    
    // Populate profile form
    document.getElementById('profileName').value = agentData.name || '';
    document.getElementById('profileEmail').value = agentData.email || '';
    document.getElementById('profilePhone').value = agentData.phone || '';
    document.getElementById('profileMtnSim').value = agentData.mtnSim || '';
    document.getElementById('profileBank').value = agentData.bankAccount || '';
    
    // Generate referral code (using agent ID as base)
    const referralCode = 'CEE' + (agentData._id || Math.random().toString(36).substr(2, 9)).substring(0, 7).toUpperCase();
    document.getElementById('referralCode').value = referralCode;
    
    try {
        // Fetch agent stats from backend
        const response = await fetch(`http://localhost:5000/api/agents/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                updateDashboardStats(data.stats);
            }
        }
    } catch (error) {
        console.error('Error loading agent stats:', error);
        // Use default values
        updateDashboardStats({
            totalCommission: 0,
            totalSales: 0,
            activeClients: 0,
            monthlyEarnings: 0,
            recentTransactions: [],
            clients: []
        });
    }
}

// Update Dashboard Stats
function updateDashboardStats(stats) {
    // Update stat cards
    document.getElementById('totalCommission').textContent = `GH₵ ${(stats.totalCommission || 0).toFixed(2)}`;
    document.getElementById('totalSales').textContent = stats.totalSales || 0;
    document.getElementById('activeClients').textContent = stats.activeClients || 0;
    document.getElementById('monthlyEarnings').textContent = `GH₵ ${(stats.monthlyEarnings || 0).toFixed(2)}`;
    
    // Update sales view
    document.getElementById('salesCount').textContent = (stats.totalSales || 0) + ' bundles';
    document.getElementById('salesRevenue').textContent = `GH₵ ${(stats.totalRevenue || 0).toFixed(2)}`;
    document.getElementById('salesCommission').textContent = `GH₵ ${(stats.totalCommission || 0).toFixed(2)}`;
    
    const pendingPayout = (stats.totalCommission || 0) - (stats.withdrawnAmount || 0);
    document.getElementById('pendingPayout').textContent = `GH₵ ${pendingPayout.toFixed(2)}`;
    
    // Update recent transactions
    populateTransactionsTable(stats.recentTransactions || []);
    
    // Update clients table
    populateClientsTable(stats.clients || []);
}

// Populate Transactions Table
function populateTransactionsTable(transactions) {
    const tbody = document.getElementById('recentTransactions').querySelector('tbody');
    
    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    No transactions yet. Start selling!
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = transactions.map(tx => `
        <tr>
            <td>${new Date(tx.date).toLocaleDateString()}</td>
            <td>${tx.bundleName || 'Bundle'}</td>
            <td>GH₵ ${(tx.amount || 0).toFixed(2)}</td>
            <td>GH₵ ${(tx.commission || 0).toFixed(2)}</td>
        </tr>
    `).join('');
}

// Populate Clients Table
function populateClientsTable(clients) {
    const tbody = document.getElementById('clientsTable').querySelector('tbody');
    
    if (clients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    No clients yet
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = clients.map(client => `
        <tr>
            <td>${client.name || 'Unknown'}</td>
            <td>${client.phone || 'N/A'}</td>
            <td>${client.totalPurchases || 0}</td>
            <td>${new Date(client.dateAdded).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

// Switch Dashboard View
function switchDashboardView(viewName) {
    // Hide all views
    document.querySelectorAll('.dashboard-view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Remove active class from nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected view
    const viewElement = document.getElementById(viewName);
    if (viewElement) {
        viewElement.classList.add('active');
    }
    
    // Mark nav item as active
    event.target.classList.add('active');
}

// Update Agent Profile
async function updateAgentProfile(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('authToken');
    const phone = document.getElementById('profilePhone').value;
    
    if (!phone) {
        alert('Please enter a phone number');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:5000/api/agents/update-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ phone })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Profile updated successfully!');
            // Update local storage
            const agentData = JSON.parse(localStorage.getItem('agentData'));
            agentData.phone = phone;
            localStorage.setItem('agentData', JSON.stringify(agentData));
        } else {
            alert('Failed to update profile: ' + (data.message || 'Try again'));
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Network error. Please try again.');
    }
}

// Copy Referral Code
function copyReferralCode() {
    const code = document.getElementById('referralCode').value;
    navigator.clipboard.writeText(code).then(() => {
        alert('Referral code copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy. Please try again.');
    });
}

// Logout Agent
function logoutAgent(e) {
    e.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('agentData');
        window.location.href = 'index.html';
    }
}

// Delete Account
function deleteAccount() {
    if (confirm('Are you sure? This action cannot be undone.') && confirm('This will permanently delete your account and all data. Are you REALLY sure?')) {
        const token = localStorage.getItem('authToken');
        
        fetch('http://localhost:5000/api/agents/delete-account', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('agentData');
                window.location.href = 'index.html';
            } else {
                alert('Failed to delete account');
            }
        }).catch(error => {
            console.error('Error:', error);
            alert('Network error.');
        });
    }
}

// Particle Animation (reuse from main script)
function createParticles() {
    const bg = document.querySelector('.animated-bg');
    if (!bg) return;
    
    const colors = ['rgba(0, 240, 255, 0.4)', 'rgba(184, 41, 255, 0.3)', 'rgba(255, 215, 0, 0.3)'];
    
    for (let i = 0; i < 20; i++) {
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

// Theme Toggle (reuse from main script)
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('themeBtn');
    if (btn) {
        btn.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

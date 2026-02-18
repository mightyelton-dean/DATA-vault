// Dashboard Script
const BUNDLE_PRICES = [
    { size: '1 GB', price: 4.2 },
    { size: '2 GB', price: 8.4 },
    { size: '3 GB', price: 12.6 },
    { size: '4 GB', price: 16.8 },
    { size: '5 GB', price: 20.5 },
    { size: '6 GB', price: 26.0 },
    { size: '7 GB', price: 29.0 },
    { size: '8 GB', price: 33.0 },
    { size: '10 GB', price: 39.9 },
    { size: '15 GB', price: 58.0 },
    { size: '20 GB', price: 78.0 },
    { size: '25 GB', price: 98.0 },
    { size: '30 GB', price: 116.0 },
    { size: '40 GB', price: 154.0 },
    { size: '50 GB', price: 193.0 },
    { size: '100 GB', price: 385.0 }
];

document.addEventListener('DOMContentLoaded', () => {
    checkAgentAuth();
    initTheme();
    renderBundleCards();
    wireNetworkTabs();
    loadAgentData();
});

function checkAgentAuth() {
    const token = localStorage.getItem('authToken');
    const agentData = localStorage.getItem('agentData');

    if (!token || !agentData) {
        window.location.href = 'index.html';
        return;
    }

    const agent = JSON.parse(agentData);
    safeText('agentName', agent.name || 'Agent');
}

function safeText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function safeValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}

function renderBundleCards() {
    const grid = document.getElementById('bundleGrid');
    if (!grid) return;

    grid.innerHTML = BUNDLE_PRICES.map(item => `
        <article class="bundle-card">
            <span class="bundle-network">● MTN</span>
            <div class="bundle-size">${item.size}</div>
            <div class="bundle-price">GH₵${item.price.toFixed(2)}</div>
            <div class="bundle-sub">One-time payment</div>
            <button class="buy-btn">🛒 Add to Cart</button>
            <button class="pay-btn">💳 Pay with Paystack</button>
        </article>
    `).join('');
}

function wireNetworkTabs() {
    document.querySelectorAll('.network-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.network-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

async function loadAgentData() {
    const token = localStorage.getItem('authToken');
    const agentData = JSON.parse(localStorage.getItem('agentData') || '{}');

    safeValue('profileName', agentData.name || '');
    safeValue('profileEmail', agentData.email || '');
    safeValue('profilePhone', agentData.phone || '');
    safeValue('profileMtnSim', agentData.mtnSim || '');
    safeValue('profileBank', agentData.bankAccount || '');

    const fallbackId = Math.random().toString(36).substring(2, 9).toUpperCase();
    safeValue('referralCode', `CEE${(agentData._id || fallbackId).substring(0, 7).toUpperCase()}`);

    try {
        const response = await fetch('http://localhost:5000/api/agents/stats', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                updateDashboardStats(data.stats);
                return;
            }
        }
    } catch (error) {
        console.error('Error loading agent stats:', error);
    }

    updateDashboardStats({
        totalCommission: 0,
        totalSales: 0,
        activeClients: 0,
        monthlyEarnings: 0,
        totalRevenue: 0,
        withdrawnAmount: 0,
        recentTransactions: [],
        clients: []
    });
}

function updateDashboardStats(stats) {
    safeText('totalCommission', `GH₵ ${(stats.totalCommission || 0).toFixed(2)}`);
    safeText('totalSales', stats.totalSales || 0);
    safeText('activeClients', stats.activeClients || 0);
    safeText('monthlyEarnings', `GH₵ ${(stats.monthlyEarnings || 0).toFixed(2)}`);

    safeText('salesCount', (stats.totalSales || 0) + ' bundles');
    safeText('salesRevenue', `GH₵ ${(stats.totalRevenue || 0).toFixed(2)}`);
    safeText('salesCommission', `GH₵ ${(stats.totalCommission || 0).toFixed(2)}`);

    const pendingPayout = (stats.totalCommission || 0) - (stats.withdrawnAmount || 0);
    safeText('pendingPayout', `GH₵ ${pendingPayout.toFixed(2)}`);
    safeText('pendingPayoutMirror', `GH₵ ${pendingPayout.toFixed(2)}`);

    populateTransactionsTable(stats.recentTransactions || []);
    populateClientsTable(stats.clients || []);
}

function populateTransactionsTable(transactions) {
    const table = document.getElementById('recentTransactions');
    if (!table) return;
    const tbody = table.querySelector('tbody');

    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No transactions yet.</td></tr>';
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

function populateClientsTable(clients) {
    const table = document.getElementById('clientsTable');
    if (!table) return;
    const tbody = table.querySelector('tbody');

    if (clients.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No clients yet.</td></tr>';
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

function switchDashboardView(viewName, e) {
    document.querySelectorAll('.dashboard-view').forEach(view => view.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));

    const view = document.getElementById(viewName);
    if (view) view.classList.add('active');

    if (e && e.currentTarget) e.currentTarget.classList.add('active');
}

async function updateAgentProfile(e) {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    const phone = document.getElementById('profilePhone')?.value;

    if (!phone) {
        alert('Please enter a phone number');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/agents/update-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ phone })
        });

        const data = await response.json();

        if (data.success) {
            alert('Profile updated successfully!');
            const agentData = JSON.parse(localStorage.getItem('agentData') || '{}');
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

function copyReferralCode() {
    const code = document.getElementById('referralCode')?.value || '';
    navigator.clipboard.writeText(code).then(() => {
        alert('Referral code copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy. Please try again.');
    });
}

function logoutAgent(e) {
    e.preventDefault();

    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('agentData');
        window.location.href = 'index.html';
    }
}

function deleteAccount() {
    if (confirm('Are you sure? This action cannot be undone.') && confirm('This will permanently delete your account and all data. Are you REALLY sure?')) {
        const token = localStorage.getItem('authToken');

        fetch('http://localhost:5000/api/agents/delete-account', {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
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

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

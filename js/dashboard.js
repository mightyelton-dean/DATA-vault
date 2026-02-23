// 👇 Change to your Railway URL after deploying
const API_URL = 'http://localhost:5000/api';

// ─── Bundle prices per network ────────────────────────────────
const BUNDLE_PRICES = {
  'MTN': [
    { size: '1 GB',   price: 4.20  },
    { size: '2 GB',   price: 8.40  },
    { size: '3 GB',   price: 12.60 },
    { size: '4 GB',   price: 16.80 },
    { size: '5 GB',   price: 20.50 },
    { size: '6 GB',   price: 26.00 },
    { size: '7 GB',   price: 29.00 },
    { size: '8 GB',   price: 33.00 },
    { size: '10 GB',  price: 39.90 },
    { size: '15 GB',  price: 58.00 },
    { size: '20 GB',  price: 78.00 },
    { size: '25 GB',  price: 98.00 },
    { size: '30 GB',  price: 116.00 },
    { size: '40 GB',  price: 154.00 },
    { size: '50 GB',  price: 193.00 },
    { size: '100 GB', price: 385.00 }
  ],
  'AIRTELTIGO ISHARE': [
    { size: '1 GB',  price: 3.50  },
    { size: '2 GB',  price: 6.80  },
    { size: '3 GB',  price: 10.00 },
    { size: '5 GB',  price: 15.00 },
    { size: '10 GB', price: 28.00 },
    { size: '15 GB', price: 40.00 },
    { size: '20 GB', price: 52.00 },
    { size: '30 GB', price: 75.00 },
    { size: '50 GB', price: 120.00 }
  ],
  'AIRTELTIGO BIGTIME': [
    { size: '1 GB',  price: 4.00  },
    { size: '2 GB',  price: 7.50  },
    { size: '3 GB',  price: 11.00 },
    { size: '5 GB',  price: 17.00 },
    { size: '10 GB', price: 32.00 },
    { size: '20 GB', price: 60.00 },
    { size: '50 GB', price: 140.00 }
  ],
  'TELECEL': [
    { size: '1 GB',  price: 4.00  },
    { size: '2 GB',  price: 7.80  },
    { size: '3 GB',  price: 11.50 },
    { size: '5 GB',  price: 16.00 },
    { size: '10 GB', price: 30.00 },
    { size: '15 GB', price: 43.00 },
    { size: '20 GB', price: 55.00 },
    { size: '50 GB', price: 130.00 }
  ]
};

let activeNetwork = 'MTN';

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  checkAgentAuth();
  initTheme();
  renderBundleCards(activeNetwork);
  wireNetworkTabs();
  loadAgentData();
  checkPaymentReturn();
});

// ─── AUTH CHECK + NAME FIX ────────────────────────────────────
function checkAgentAuth() {
  const token = localStorage.getItem('authToken');
  const agentData = localStorage.getItem('agentData');

  if (!token || !agentData) {
    window.location.href = 'index.html';
    return;
  }

  const agent = JSON.parse(agentData);

  // Show agent name in sidebar (replaces "Justice Enterprise")
  safeText('sidebarAgentName', agent.name  || 'Agent');
  safeText('sidebarAgentEmail', agent.email || '');
  safeText('agentName', agent.name || 'Agent');
}

// ─── NETWORK TABS ─────────────────────────────────────────────
function wireNetworkTabs() {
  document.querySelectorAll('.network-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.network-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeNetwork = tab.textContent.trim().toUpperCase();
      renderBundleCards(activeNetwork);
    });
  });
}

// ─── RENDER BUNDLE CARDS ──────────────────────────────────────
function renderBundleCards(network) {
  const grid = document.getElementById('bundleGrid');
  if (!grid) return;

  const bundles = BUNDLE_PRICES[network] || [];

  if (bundles.length === 0) {
    grid.innerHTML = `<p style="color:#8f9db2;padding:1rem;">No bundles for ${network}.</p>`;
    return;
  }

  const networkMeta = {
    'MTN':                { label: '● MTN',        color: '#f7b500' },
    'AIRTELTIGO ISHARE':  { label: '● AT iShare',  color: '#20b7ff' },
    'AIRTELTIGO BIGTIME': { label: '● AT BigTime', color: '#20b7ff' },
    'TELECEL':            { label: '● Telecel',    color: '#ff6b6b' }
  };
  const meta = networkMeta[network] || { label: network, color: '#aaa' };

  grid.innerHTML = bundles.map((item) => `
    <article class="bundle-card">
      <span class="bundle-network" style="color:${meta.color};border-color:${meta.color}40;">
        ${meta.label}
      </span>
      <div class="bundle-size">${item.size}</div>
      <div class="bundle-price">GH&#8373;${item.price.toFixed(2)}</div>
      <div class="bundle-sub">One-time payment</div>
      <button class="buy-btn" onclick="openOrderModal('${network}','${item.size}',${item.price})">
        🛒 Buy Now
      </button>
    </article>
  `).join('');
}

// ─── ORDER MODAL ──────────────────────────────────────────────
function openOrderModal(network, size, price) {
  const old = document.getElementById('orderModal');
  if (old) old.remove();

  const modal = document.createElement('div');
  modal.id = 'orderModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:9999;';

  modal.innerHTML = `
    <div style="background:#111620;border:1px solid #2eb8ff;border-radius:14px;padding:1.8rem;width:100%;max-width:420px;position:relative;font-family:Poppins,sans-serif;color:#dce3ef;">
      <button onclick="document.getElementById('orderModal').remove()" style="position:absolute;top:1rem;right:1rem;background:none;border:none;color:#8f9db2;font-size:1.4rem;cursor:pointer;">✕</button>
      <h3 style="margin:0 0 0.3rem;font-size:1.2rem;color:#20b7ff;">Place Order</h3>
      <p style="margin:0 0 1.2rem;color:#8f9db2;font-size:0.85rem;">${network} &bull; ${size} &bull; <strong style="color:#f7b500;">GH&#8373;${price.toFixed(2)}</strong></p>
      <label style="display:block;margin-bottom:0.3rem;font-size:0.85rem;">Recipient Phone Number</label>
      <input id="orderPhone" type="tel" placeholder="e.g. 0244123456" style="width:100%;padding:0.7rem;border-radius:8px;border:1px solid #2eb8ff40;background:#1a2230;color:#dce3ef;font-family:Poppins,sans-serif;font-size:0.95rem;margin-bottom:1rem;box-sizing:border-box;"/>
      <label style="display:block;margin-bottom:0.3rem;font-size:0.85rem;">Payment Method</label>
      <select id="orderPayment" style="width:100%;padding:0.7rem;border-radius:8px;border:1px solid #2eb8ff40;background:#1a2230;color:#dce3ef;font-family:Poppins,sans-serif;font-size:0.95rem;margin-bottom:1.4rem;box-sizing:border-box;">
        <option value="paystack">💳 Pay with Paystack (MoMo / Card)</option>
        <option value="wallet">👛 Pay from Wallet</option>
      </select>
      <button onclick="submitOrder('${network}','${size}',${price})" style="width:100%;padding:0.85rem;background:#f7b500;color:#1c1500;border:none;border-radius:9px;font-weight:700;font-size:1rem;cursor:pointer;font-family:Poppins,sans-serif;">
        Confirm Order — GH&#8373;${price.toFixed(2)}
      </button>
    </div>`;

  document.body.appendChild(modal);
  document.getElementById('orderPhone').focus();
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

// ─── SUBMIT ORDER ─────────────────────────────────────────────
async function submitOrder(network, size, price) {
  const phone   = document.getElementById('orderPhone')?.value.trim();
  const payment = document.getElementById('orderPayment')?.value;

  if (!phone || phone.length < 9) {
    showDashToast('⚠️ Please enter a valid phone number', 'warn');
    return;
  }

  const btn = document.querySelector('#orderModal button:last-child');
  if (btn) { btn.disabled = true; btn.textContent = 'Processing...'; }

  const networkMap = {
    'MTN': 'MTN',
    'AIRTELTIGO ISHARE':  'AirtelTigo-iShare',
    'AIRTELTIGO BIGTIME': 'AirtelTigo-BigTime',
    'TELECEL': 'Telecel'
  };

  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/bundles/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        bundleId: 'static',
        recipientPhone: phone,
        network: networkMap[network] || network,
        bundleSize: size,
        price,
        paymentMethod: payment
      })
    });

    const data = await response.json();
    if (data.success) {
      document.getElementById('orderModal')?.remove();
      if (data.data?.authorizationUrl) {
        window.location.href = data.data.authorizationUrl;
      } else {
        showDashToast('✅ Order placed! Bundle will be delivered shortly.', 'success');
        loadAgentData();
      }
    } else {
      showDashToast('❌ ' + (data.message || 'Order failed'), 'error');
      if (btn) { btn.disabled = false; btn.textContent = `Confirm Order — GH\u20B3${price.toFixed(2)}`; }
    }
  } catch (err) {
    document.getElementById('orderModal')?.remove();
    showDashToast('⚠️ Backend not connected yet. Contact admin to process order.', 'warn');
  }
}

// ─── LOAD AGENT DATA ──────────────────────────────────────────
async function loadAgentData() {
  const token     = localStorage.getItem('authToken');
  const agentData = JSON.parse(localStorage.getItem('agentData') || '{}');

  safeValue('profileName',  agentData.name        || '');
  safeValue('profileEmail', agentData.email       || '');
  safeValue('profilePhone', agentData.phone       || '');
  safeValue('profileMtnSim', agentData.mtnSim     || '');
  safeValue('profileBank',  agentData.bankAccount || '');

  const fallbackId = Math.random().toString(36).substring(2, 9).toUpperCase();
  safeValue('referralCode', 'CEE' + (agentData._id || fallbackId).substring(0, 7).toUpperCase());

  try {
    const response = await fetch(`${API_URL}/agents/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success) { updateDashboardStats(data.stats); return; }
    }
  } catch (err) {}

  updateDashboardStats({ totalCommission: 0, totalSales: 0, activeClients: 0, monthlyEarnings: 0, totalRevenue: 0, withdrawnAmount: 0, recentTransactions: [], clients: [] });
}

// ─── STATS ────────────────────────────────────────────────────
function updateDashboardStats(stats) {
  safeText('totalCommission',    'GH\u20B3 ' + (stats.totalCommission  || 0).toFixed(2));
  safeText('totalSales',          stats.totalSales    || 0);
  safeText('activeClients',       stats.activeClients || 0);
  safeText('monthlyEarnings',    'GH\u20B3 ' + (stats.monthlyEarnings  || 0).toFixed(2));
  safeText('salesCount',          (stats.totalSales   || 0) + ' bundles');
  safeText('salesRevenue',       'GH\u20B3 ' + (stats.totalRevenue     || 0).toFixed(2));
  safeText('salesCommission',    'GH\u20B3 ' + (stats.totalCommission  || 0).toFixed(2));

  const pending = (stats.totalCommission || 0) - (stats.withdrawnAmount || 0);
  safeText('pendingPayout',      'GH\u20B3 ' + pending.toFixed(2));
  safeText('pendingPayoutMirror','GH\u20B3 ' + pending.toFixed(2));

  populateTransactionsTable(stats.recentTransactions || []);
  populateClientsTable(stats.clients || []);
}

function populateTransactionsTable(transactions) {
  const table = document.getElementById('recentTransactions');
  if (!table) return;
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = transactions.length === 0
    ? '<tr><td colspan="4" style="color:#8f9db2;padding:0.8rem;">No transactions yet.</td></tr>'
    : transactions.map(tx => `<tr><td>${new Date(tx.date).toLocaleDateString()}</td><td>${tx.bundleName||tx.bundleSize||'Bundle'}</td><td>GH\u20B3 ${(tx.amount||0).toFixed(2)}</td><td>GH\u20B3 ${(tx.commission||0).toFixed(2)}</td></tr>`).join('');
}

function populateClientsTable(clients) {
  const table = document.getElementById('clientsTable');
  if (!table) return;
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = clients.length === 0
    ? '<tr><td colspan="4" style="color:#8f9db2;padding:0.8rem;">No clients yet.</td></tr>'
    : clients.map(c => `<tr><td>${c.name||'Unknown'}</td><td>${c.phone||'N/A'}</td><td>${c.totalPurchases||0}</td><td>${new Date(c.dateAdded).toLocaleDateString()}</td></tr>`).join('');
}

// ─── VIEW SWITCHING ───────────────────────────────────────────
function switchDashboardView(viewName, e) {
  document.querySelectorAll('.dashboard-view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
  const view = document.getElementById(viewName);
  if (view) view.classList.add('active');
  if (e && e.currentTarget) e.currentTarget.classList.add('active');
}

// ─── PROFILE UPDATE ───────────────────────────────────────────
async function updateAgentProfile(e) {
  e.preventDefault();
  const phone = document.getElementById('profilePhone')?.value;
  if (!phone) { showDashToast('Please enter a phone number', 'warn'); return; }
  try {
    const response = await fetch(`${API_URL}/agents/update-profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      body: JSON.stringify({ phone })
    });
    const data = await response.json();
    if (data.success) {
      showDashToast('✅ Profile updated!', 'success');
      const agentData = JSON.parse(localStorage.getItem('agentData') || '{}');
      agentData.phone = phone;
      localStorage.setItem('agentData', JSON.stringify(agentData));
    } else {
      showDashToast('Failed: ' + (data.message || 'Try again'), 'error');
    }
  } catch { showDashToast('⚠️ Backend not connected yet.', 'warn'); }
}

function copyReferralCode() {
  const code = document.getElementById('referralCode')?.value || '';
  navigator.clipboard.writeText(code)
    .then(() => showDashToast('✅ Referral code copied!', 'success'))
    .catch(() => showDashToast('Copy failed', 'error'));
}

// ─── LOGOUT ───────────────────────────────────────────────────
function logoutAgent(e) {
  e.preventDefault();
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('agentData');
    window.location.href = 'index.html';
  }
}

// ─── DELETE ACCOUNT ───────────────────────────────────────────
function deleteAccount() {
  if (!confirm('Permanently delete your account?')) return;
  if (!confirm('FINAL WARNING — this cannot be undone.')) return;
  fetch(`${API_URL}/agents/delete-account`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
  }).then(r => r.json()).then(data => {
    if (data.success) { localStorage.clear(); window.location.href = 'index.html'; }
    else showDashToast('Delete failed', 'error');
  }).catch(() => showDashToast('⚠️ Backend not connected yet.', 'warn'));
}

// ─── PAYMENT RETURN ───────────────────────────────────────────
function checkPaymentReturn() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('payment') === 'success') {
    showDashToast('✅ Payment successful! Bundle delivering shortly.', 'success');
    history.replaceState({}, '', window.location.pathname);
    loadAgentData();
  } else if (params.get('topup') === 'success') {
    const amt = params.get('amount') || '';
    showDashToast('✅ Wallet topped up' + (amt ? ' with GH\u20B3' + amt : '') + '!', 'success');
    history.replaceState({}, '', window.location.pathname);
    loadAgentData();
  } else if (params.get('payment') === 'failed' || params.get('topup') === 'failed') {
    showDashToast('❌ Payment was not completed.', 'error');
    history.replaceState({}, '', window.location.pathname);
  }
}

// ─── THEME ────────────────────────────────────────────────────
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}
function updateThemeIcon(theme) {
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'dark' ? '🌙' : '☀️';
}
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

// ─── TOAST ────────────────────────────────────────────────────
function showDashToast(msg, type = 'success') {
  let toast = document.getElementById('dashToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'dashToast';
    toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(100px);padding:0.85rem 1.8rem;border-radius:30px;font-size:0.9rem;font-weight:600;z-index:99999;transition:transform 0.4s ease;font-family:Poppins,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,0.4);white-space:nowrap;';
    document.body.appendChild(toast);
  }
  const colors = {
    success: { bg: '#111620', border: '#20b7ff', color: '#20b7ff' },
    warn:    { bg: '#2a1f00', border: '#f7b500', color: '#f7b500' },
    error:   { bg: '#1f0a0a', border: '#ff6565', color: '#ff6565' }
  };
  const c = colors[type] || colors.success;
  toast.style.background = c.bg;
  toast.style.border = '1px solid ' + c.border;
  toast.style.color = c.color;
  toast.textContent = msg;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.transform = 'translateX(-50%) translateY(100px)'; }, 3500);
}

// ─── HELPERS ──────────────────────────────────────────────────
function safeText(id, value) {
  const el = document.getElementById(id); if (el) el.textContent = value;
}
function safeValue(id, value) {
  const el = document.getElementById(id); if (el) el.value = value;
}

// ════════════════════════════════════════════════
//  NEW PAGE FUNCTIONS
// ════════════════════════════════════════════════

// ── Page title update on switch ─────────────────
const PAGE_TITLES = {
  dashboard: '🏠 Dashboard',
  orders:    '📦 Orders',
  wallet:    '💼 Wallet',
  afa:       '👥 AFA',
  store:     '🛒 Store',
  settings:  '⚙️ Settings',
  developer: '💻 Developer',
  support:   '❓ Support'
};

// Override switchDashboardView to also update page title + load data
const _origSwitch = switchDashboardView;
window.switchDashboardView = function(viewName, e) {
  _origSwitch(viewName, e);
  const title = document.getElementById('pageTitle');
  if (title) title.textContent = PAGE_TITLES[viewName] || viewName;
  // Lazy-load page data
  if (viewName === 'orders')  loadOrdersPage();
  if (viewName === 'wallet')  loadWalletPage();
  if (viewName === 'afa')     loadAfaPage();
  if (viewName === 'store')   loadStorePage();
  if (viewName === 'settings') loadSettingsPage();
};

// ── ORDERS PAGE ─────────────────────────────────
async function loadOrdersPage() {
  const token = localStorage.getItem('authToken');
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Loading...</td></tr>';

  try {
    const res  = await fetch(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();

    if (data.success && data.data.length > 0) {
      const orders = data.data;

      // Update stats
      const delivered  = orders.filter(o => o.deliveryStatus === 'delivered').length;
      const pending    = orders.filter(o => ['pending','processing'].includes(o.deliveryStatus)).length;
      const totalSpent = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.amount, 0);

      safeText('ordTotalCount',    orders.length);
      safeText('ordDeliveredCount', delivered);
      safeText('ordPendingCount',   pending);
      safeText('ordTotalSpent',    `GH₵${totalSpent.toFixed(2)}`);

      tbody.innerHTML = orders.map(o => `
        <tr>
          <td>${new Date(o.createdAt).toLocaleDateString()}</td>
          <td>${o.bundleSize || o.bundleName || '—'}</td>
          <td>${o.network || '—'}</td>
          <td>${o.recipientPhone}</td>
          <td>GH₵${(o.amount||0).toFixed(2)}</td>
          <td><span class="badge badge-${o.paymentStatus === 'paid' ? 'paid' : 'pending'}">${o.paymentStatus}</span></td>
          <td><span class="badge badge-${o.deliveryStatus}">${o.deliveryStatus}</span></td>
        </tr>`).join('');
    } else {
      setOrdersEmpty();
    }
  } catch {
    // Backend not connected — show demo rows
    setOrdersEmpty();
  }
}

function setOrdersEmpty() {
  safeText('ordTotalCount', '0');
  safeText('ordDeliveredCount', '0');
  safeText('ordPendingCount', '0');
  safeText('ordTotalSpent', 'GH₵0.00');
  const tbody = document.getElementById('ordersTableBody');
  if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="table-empty">No orders yet. Go to Dashboard to place your first order!</td></tr>';
}

function filterOrders() {
  // Re-load with filter (works when backend is connected)
  loadOrdersPage();
}

// ── WALLET PAGE ─────────────────────────────────
async function loadWalletPage() {
  const agent = JSON.parse(localStorage.getItem('agentData') || '{}');
  safeText('walletBalance', `GH₵ ${(agent.walletBalance || 0).toFixed(2)}`);

  const token = localStorage.getItem('authToken');
  try {
    const res  = await fetch(`${API_URL}/agents/stats`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.success) {
      const s = data.stats;
      safeText('walletBalance',  `GH₵ ${(s.walletBalance      || 0).toFixed(2)}`);
      safeText('totalCommission', `GH₵ ${(s.totalCommission    || 0).toFixed(2)}`);
      safeText('pendingPayout',   `GH₵ ${(s.totalCommission - (s.withdrawnAmount||0)).toFixed(2)}`);
      safeText('totalWithdrawn',  `GH₵ ${(s.withdrawnAmount   || 0).toFixed(2)}`);

      const walletTxBody = document.getElementById('walletTxBody');
      if (walletTxBody && s.recentTransactions?.length > 0) {
        walletTxBody.innerHTML = s.recentTransactions.map(tx => `
          <tr>
            <td>${new Date(tx.date).toLocaleDateString()}</td>
            <td><span class="badge badge-${tx.amount > 0 ? 'paid' : 'pending'}">${tx.amount > 0 ? 'Credit' : 'Debit'}</span></td>
            <td>${tx.bundleName || 'Transaction'}</td>
            <td style="color:${tx.amount > 0 ? '#00e676' : '#ff6565'}">GH₵ ${Math.abs(tx.amount||0).toFixed(2)}</td>
            <td>—</td>
            <td><span class="badge badge-delivered">Completed</span></td>
          </tr>`).join('');
      }
    }
  } catch {}
}

function openTopupModal() {
  const old = document.getElementById('topupModal');
  if (old) old.remove();

  const modal = document.createElement('div');
  modal.id = 'topupModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:9999;';
  modal.innerHTML = `
    <div style="background:#111620;border:1px solid #20b7ff;border-radius:14px;padding:1.8rem;width:100%;max-width:400px;position:relative;font-family:Poppins,sans-serif;color:#dce3ef;">
      <button onclick="document.getElementById('topupModal').remove()" style="position:absolute;top:1rem;right:1rem;background:none;border:none;color:#8f9db2;font-size:1.4rem;cursor:pointer;">✕</button>
      <h3 style="margin:0 0 0.5rem;color:#20b7ff;">💼 Top Up Wallet</h3>
      <p style="color:#8f9db2;font-size:0.85rem;margin:0 0 1.2rem;">Add funds via MoMo or Card (Paystack)</p>
      <label style="display:block;margin-bottom:0.3rem;font-size:0.85rem;">Amount (GH₵)</label>
      <input id="topupAmount" type="number" min="1" placeholder="e.g. 50" style="width:100%;padding:0.7rem;border-radius:8px;border:1px solid #20b7ff40;background:#1a2230;color:#dce3ef;font-family:Poppins,sans-serif;font-size:0.95rem;margin-bottom:1rem;box-sizing:border-box;">
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1.2rem;">
        ${[10,20,50,100].map(a => `<button onclick="document.getElementById('topupAmount').value=${a}" style="padding:0.4rem 0.8rem;background:#1a2230;border:1px solid #35435d;border-radius:6px;color:#dce3ef;cursor:pointer;font-family:Poppins,sans-serif;">GH₵${a}</button>`).join('')}
      </div>
      <button onclick="submitTopup()" style="width:100%;padding:0.85rem;background:#f7b500;color:#1c1500;border:none;border-radius:9px;font-weight:700;font-size:1rem;cursor:pointer;font-family:Poppins,sans-serif;">💳 Pay with Paystack</button>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

async function submitTopup() {
  const amount = parseFloat(document.getElementById('topupAmount')?.value);
  if (!amount || amount < 1) { showDashToast('⚠️ Enter a valid amount', 'warn'); return; }

  try {
    const res  = await fetch(`${API_URL}/payments/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      body: JSON.stringify({ amount })
    });
    const data = await res.json();
    if (data.success && data.data?.authorizationUrl) {
      window.location.href = data.data.authorizationUrl;
    } else {
      showDashToast('❌ ' + (data.message || 'Top-up failed'), 'error');
    }
  } catch {
    document.getElementById('topupModal')?.remove();
    showDashToast('⚠️ Backend not connected yet. Top-up will work after deployment.', 'warn');
  }
}

function openWithdrawModal() {
  showDashToast('ℹ️ Withdrawal requests — contact support on WhatsApp to process.', 'warn');
}

// ── AFA PAGE ────────────────────────────────────
function loadAfaPage() {
  const agent = JSON.parse(localStorage.getItem('agentData') || '{}');
  const code  = agent.referralCode || ('CEE' + Math.random().toString(36).substring(2,8).toUpperCase());
  const link  = `${window.location.origin}${window.location.pathname.replace('agent-dashboard.html','index.html')}?ref=${code}`;

  const display = document.getElementById('referralLinkDisplay');
  if (display) display.value = link;

  // Determine rank from total orders
  const orders = agent.totalOrders || 0;
  let rank = 'Starter';
  if (orders >= 500) rank = '🥇 Gold';
  else if (orders >= 200) rank = '🥈 Silver';
  else if (orders >= 50) rank = '🥉 Bronze';
  else rank = '🌱 Starter';

  safeText('afaRank', rank);
  safeText('afaReferralCount', '0');
  safeText('afaEarnings', 'GH₵ 0.00');
}

function copyReferralLink() {
  const val = document.getElementById('referralLinkDisplay')?.value;
  if (val) {
    navigator.clipboard.writeText(val)
      .then(() => showDashToast('✅ Referral link copied!', 'success'))
      .catch(() => showDashToast('Copy failed', 'error'));
  }
}

function shareOnWhatsApp() {
  const link = document.getElementById('referralLinkDisplay')?.value || '';
  const msg  = encodeURIComponent(`Join me on Ceedi-data — Ghana's best data bundle platform! Register using my link and start earning: ${link}`);
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}

function shareViaSMS() {
  const link = document.getElementById('referralLinkDisplay')?.value || '';
  window.open(`sms:?body=Join Ceedi-data and start selling data bundles! Register here: ${link}`, '_blank');
}

// ── STORE PAGE ──────────────────────────────────
function loadStorePage() {
  loadAgentData(); // reuses existing stats logic
}

// ── SETTINGS PAGE ───────────────────────────────
function loadSettingsPage() {
  const agent = JSON.parse(localStorage.getItem('agentData') || '{}');
  safeValue('profileName',  agent.name        || '');
  safeValue('profileEmail', agent.email       || '');
  safeValue('profilePhone', agent.phone       || '');
  safeValue('profileMtnSim', agent.mtnSim     || '');
  safeValue('profileBank',  agent.bankAccount || '');

  const code = agent.referralCode || ('CEE' + Math.random().toString(36).substring(2,8).toUpperCase());
  safeValue('referralCode', code);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeIcon(theme);
  showDashToast(`${theme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode activated`, 'success');
}

async function changePassword(e) {
  e.preventDefault();
  const current = document.getElementById('currentPassword')?.value;
  const next    = document.getElementById('newPassword')?.value;
  const confirm = document.getElementById('confirmPassword')?.value;

  if (!current || !next || !confirm) { showDashToast('⚠️ Please fill all fields', 'warn'); return; }
  if (next !== confirm) { showDashToast('❌ Passwords do not match', 'error'); return; }
  if (next.length < 6)  { showDashToast('⚠️ Password must be at least 6 characters', 'warn'); return; }

  try {
    const res  = await fetch(`${API_URL}/agents/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      body: JSON.stringify({ currentPassword: current, newPassword: next })
    });
    const data = await res.json();
    if (data.success) {
      showDashToast('✅ Password updated!', 'success');
      e.target.reset();
    } else {
      showDashToast('❌ ' + (data.message || 'Update failed'), 'error');
    }
  } catch {
    showDashToast('⚠️ Backend not connected yet.', 'warn');
  }
}

// ── DEVELOPER PAGE ──────────────────────────────
function showCodeTab(lang) {
  document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.code-block').forEach(b => b.classList.remove('active'));

  document.querySelector(`[onclick="showCodeTab('${lang}')"]`).classList.add('active');
  document.getElementById(`code${lang.charAt(0).toUpperCase()+lang.slice(1)}`).classList.add('active');
}

let _apiKeyRevealed = false;
function toggleShowKey() {
  const input = document.getElementById('apiKeyDisplay');
  const btn   = document.querySelector('[onclick="toggleShowKey()"]');
  if (!input) return;
  _apiKeyRevealed = !_apiKeyRevealed;
  input.type = _apiKeyRevealed ? 'text' : 'password';
  if (btn) btn.textContent = _apiKeyRevealed ? '🙈 Hide' : '👁️ Show';
}

function copyApiKey() {
  const val = document.getElementById('apiKeyDisplay')?.value;
  if (val) {
    navigator.clipboard.writeText(val)
      .then(() => showDashToast('✅ API key copied!', 'success'))
      .catch(() => showDashToast('Copy failed', 'error'));
  }
}

function copyBaseUrl() {
  const val = document.getElementById('baseUrlDisplay')?.value;
  if (val) {
    navigator.clipboard.writeText(val)
      .then(() => showDashToast('✅ URL copied!', 'success'))
      .catch(() => showDashToast('Copy failed', 'error'));
  }
}

function generateApiKey() {
  showDashToast('ℹ️ API key generation will be available after backend deployment.', 'warn');
}

// ── SUPPORT PAGE ────────────────────────────────
function submitSupportTicket(e) {
  e.preventDefault();
  const type    = document.getElementById('ticketType')?.value;
  const ref     = document.getElementById('ticketRef')?.value;
  const message = document.getElementById('ticketMessage')?.value;

  if (!message || message.trim().length < 10) {
    showDashToast('⚠️ Please describe your issue (at least 10 characters)', 'warn');
    return;
  }

  // Build WhatsApp message and open
  const agent = JSON.parse(localStorage.getItem('agentData') || '{}');
  const text  = encodeURIComponent(
    `*Support Ticket*\n` +
    `Agent: ${agent.name || 'Unknown'}\n` +
    `Email: ${agent.email || 'Unknown'}\n` +
    `Issue: ${type}\n` +
    `Ref: ${ref || 'N/A'}\n\n` +
    `Message: ${message}`
  );
  window.open(`https://wa.me/233XXXXXXXXX?text=${text}`, '_blank');
  showDashToast('✅ Redirecting to WhatsApp with your ticket details...', 'success');
  e.target.reset();
}

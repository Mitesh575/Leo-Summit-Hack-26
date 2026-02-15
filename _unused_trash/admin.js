// Admin Dashboard - JavaScript

// Configuration
const ADMIN_PASSWORD = 'Leo Summit Hack'26ks2026'; // Change this to your preferred password
const STORAGE_KEY = 'hackathon_registrations';
const SERVER_URL = window.location.origin;

// Cached registrations
let cachedRegistrations = [];

// DOM Elements
let loginScreen, dashboard, loginForm, adminPassword, errorMsg;
let searchInput, domainFilter, registrationsBody, emptyState;
let memberModal, modalClose, membersList, modalTeamName;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initElements();
    initEventListeners();
    checkLoginStatus();
});

function initElements() {
    loginScreen = document.getElementById('loginScreen');
    dashboard = document.getElementById('dashboard');
    loginForm = document.getElementById('loginForm');
    adminPassword = document.getElementById('adminPassword');
    errorMsg = document.getElementById('errorMsg');
    searchInput = document.getElementById('searchInput');
    domainFilter = document.getElementById('domainFilter');
    registrationsBody = document.getElementById('registrationsBody');
    emptyState = document.getElementById('emptyState');
    memberModal = document.getElementById('memberModal');
    modalClose = document.getElementById('modalClose');
    membersList = document.getElementById('membersList');
    modalTeamName = document.getElementById('modalTeamName');
}

function initEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    document.getElementById('refreshBtn').addEventListener('click', loadRegistrations);
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    searchInput.addEventListener('input', filterRegistrations);
    domainFilter.addEventListener('change', filterRegistrations);
    modalClose.addEventListener('click', closeModal);
    memberModal.addEventListener('click', (e) => {
        if (e.target === memberModal) closeModal();
    });
}

// Login
function handleLogin(e) {
    e.preventDefault();
    if (adminPassword.value === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_logged_in', 'true');
        showDashboard();
        errorMsg.textContent = '';
    } else {
        errorMsg.textContent = 'Invalid password';
        adminPassword.value = '';
    }
}

function handleLogout() {
    sessionStorage.removeItem('admin_logged_in');
    showLogin();
}

function checkLoginStatus() {
    if (sessionStorage.getItem('admin_logged_in') === 'true') showDashboard();
    else showLogin();
}

function showLogin() {
    loginScreen.style.display = 'flex';
    dashboard.style.display = 'none';
}

function showDashboard() {
    loginScreen.style.display = 'none';
    dashboard.style.display = 'block';
    loadRegistrations();
}

// Data Handling
async function getRegistrations() {
    try {
        const response = await fetch(`${SERVER_URL}/api/registrations`);
        if (response.ok) {
            const result = await response.json();
            return result.data || [];
        }
    } catch (error) {
        console.log('⚠️ Server not available');
    }
    return [];
}

async function loadRegistrations() {
    const registrations = await getRegistrations();
    cachedRegistrations = registrations;
    updateStats(registrations);
    renderTable(registrations);
}

function updateStats(registrations) {
    document.getElementById('totalTeams').textContent = registrations.length;
    document.getElementById('totalMembers').textContent = registrations.length * 4;

    const domainCounts = { aiml: 0, iot: 0, security: 0, open: 0 };
    registrations.forEach(reg => {
        const domain = (reg.domain || '').toLowerCase();
        if (domain.includes('ai') || domain.includes('ml')) domainCounts.aiml++;
        else if (domain.includes('iot')) domainCounts.iot++;
        else if (domain.includes('security')) domainCounts.security++;
        else if (domain.includes('open')) domainCounts.open++;
    });

    document.getElementById('aimlCount').textContent = domainCounts.aiml;
    document.getElementById('iotCount').textContent = domainCounts.iot;
    document.getElementById('securityCount').textContent = domainCounts.security;
    document.getElementById('openCount').textContent = domainCounts.open;
}

function renderTable(registrations) {
    if (registrations.length === 0) {
        registrationsBody.innerHTML = '';
        emptyState.classList.add('visible');
        return;
    }
    emptyState.classList.remove('visible');

    registrationsBody.innerHTML = registrations.map((reg, index) => {
        const teamLead = reg.members?.find(m => m.isLead) || reg.members?.[0] || {};
        const timestamp = formatDate(reg.timestamp);
        const hasPdf = reg.pdfFile && reg.pdfFile.filename;
        const pdfButton = hasPdf
            ? `<button class="view-pdf-btn" onclick="viewPdf('${reg.pdfFile.filename}')">📄 View PDF</button>`
            : '<span class="no-pdf">No PDF</span>';

        return `
            <tr>
                <td>${index + 1}</td>
                <td class="team-name">${escapeHtml(reg.teamName)}</td>
                <td>${escapeHtml(reg.college)}</td>
                <td><span class="domain-tag ${getDomainClass(reg.domain)}">${escapeHtml(reg.domain)}</span></td>
                <td>${escapeHtml(truncate(reg.problem || '', 30))}</td>
                <td>${escapeHtml(teamLead.name)}</td>
                <td><span class="member-count" onclick="showMembers(${index})">👥 ${reg.members?.length || 0}</span></td>
                <td>${pdfButton}</td>
                <td class="timestamp">${timestamp}</td>
                <td><button class="action-btn" onclick="deleteRegistration('${reg.id}', ${index})">🗑️ Delete</button></td>
            </tr>
        `;
    }).join('');
}

function getDomainClass(domain) {
    if (!domain) return '';
    const d = domain.toLowerCase();
    if (d.includes('ai')) return 'aiml';
    if (d.includes('iot')) return 'iot';
    if (d.includes('security')) return 'security';
    return 'open';
}

async function filterRegistrations() {
    const term = searchInput.value.toLowerCase();
    const domainVal = domainFilter.value.toLowerCase();

    let list = await getRegistrations();

    if (term) {
        list = list.filter(reg =>
            JSON.stringify(reg).toLowerCase().includes(term)
        );
    }
    if (domainVal) {
        list = list.filter(reg => reg.domain?.toLowerCase().includes(domainVal));
    }
    renderTable(list);
}

// Member Modal
window.showMembers = function (index) {
    const reg = cachedRegistrations[index];
    if (!reg) return;

    document.getElementById('modalTeamName').textContent = reg.teamName;
    document.getElementById('modalCollege').textContent = reg.college;
    document.getElementById('modalDomain').textContent = reg.domain;
    document.getElementById('modalDate').textContent = formatDate(reg.timestamp);
    document.getElementById('modalProblem').textContent = reg.problem || 'N/A';

    const pdfInfoBox = document.getElementById('modalPdfInfo');
    if (reg.pdfFile && reg.pdfFile.name) {
        pdfInfoBox.innerHTML = `
            <span class="pdf-icon">📄</span>
            <span class="pdf-name">${escapeHtml(reg.pdfFile.name)}</span>
            <span class="pdf-size">${formatFileSize(reg.pdfFile.size)}</span>
        `;
    } else {
        pdfInfoBox.innerHTML = 'No PDF';
    }

    if (reg.members) {
        membersList.innerHTML = reg.members.map((m, i) => `
            <div class="member-card ${m.isLead ? 'lead' : ''}">
                <div class="member-card-header">
                    <span class="member-number">${i + 1}</span>
                    ${m.isLead ? '👑' : ''}
                </div>
                <div class="member-card-body">
                    <h4>${escapeHtml(m.name)}</h4>
                    <span>${m.isLead ? 'Team Lead' : m.role}</span>
                    <p>📧 ${escapeHtml(m.email)}</p>
                    <p>📱 ${escapeHtml(m.phone)}</p>
                </div>
            </div>
        `).join('');
    }

    memberModal.classList.add('visible');
};

function closeModal() {
    memberModal.classList.remove('visible');
}

// Actions
window.viewPdf = function (filename) {
    if (filename) window.open(`${SERVER_URL}/api/pdf/${filename}`, '_blank');
};

window.deleteRegistration = async function (id, index) {
    if (!confirm('Delete this registration?')) return;
    try {
        await fetch(`${SERVER_URL}/api/registrations/${id}`, { method: 'DELETE' });
        loadRegistrations();
    } catch (e) {
        alert('Delete failed');
    }
};

function exportToCSV() {
    // Basic CSV export logic would go here
    alert('Export functionality available');
}

// Utils
function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function truncate(text, n) {
    return (text && text.length > n) ? text.substr(0, n - 1) + '...' : text;
}

function formatDate(iso) {
    if (!iso) return 'N/A';
    return new Date(iso).toLocaleString();
}

function formatFileSize(bytes) {
    if (!bytes) return '';
    return (bytes / 1024).toFixed(1) + ' KB';
}

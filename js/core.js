'use strict';

const STORAGE_KEY = 'ledgerHall.v1';
const defaultState = {
  version: 1,
  goals: [],
  debts: [],
  transactions: [],
  settings: { currency: 'VND', reminderLeadDays: 3, theme: 'dark' }
};
let state = loadState();
let activeView = 'dashboard';
let cloudReady = false;
let cloudDirty = false;
let cloudSaveTimer = null;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

document.addEventListener('DOMContentLoaded', init);

function init() {
  applyTheme();
  bindNavigation();
  bindForms();
  bindActions();
  $('#transactionDate').value = isoDate(new Date());
  $('#todayLabel').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date());
  renderAll();
  syncFromCloud();
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored || typeof stored !== 'object') return structuredClone(defaultState);
    return {
      ...structuredClone(defaultState),
      ...stored,
      settings: { ...defaultState.settings, ...(stored.settings || {}) },
      goals: Array.isArray(stored.goals) ? stored.goals : [],
      debts: Array.isArray(stored.debts) ? stored.debts : [],
      transactions: Array.isArray(stored.transactions) ? stored.transactions : []
    };
  } catch {
    return structuredClone(defaultState);
  }
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (cloudReady) scheduleCloudSave();
  else cloudDirty = true;
}
function uid(prefix) { return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8); }
function n(value) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : 0; }
function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
function isoDate(date) { const d = new Date(date); const tz = d.getTimezoneOffset(); return new Date(d.getTime() - tz * 60000).toISOString().slice(0, 10); }
function parseLocalDate(value) { if (!value) return null; const [y, m, d] = value.split('-').map(Number); return new Date(y, m - 1, d); }
function formatDate(value, options = { month: 'short', day: 'numeric', year: 'numeric' }) { const date = typeof value === 'string' ? parseLocalDate(value) : new Date(value); return date && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat(undefined, options).format(date) : '—'; }
function money(value, compact = false) {
  const currency = state.settings.currency || 'VND';
  const amount = n(value);
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency', currency,
      notation: compact && Math.abs(amount) >= 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: ['VND', 'JPY', 'KRW'].includes(currency) ? 0 : 2
    }).format(amount);
  } catch { return amount.toLocaleString(); }
}
function percent(value) { return clamp(n(value), 0, 100).toFixed(0) + '%'; }
function escapeHtml(value = '') { return String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[c])); }
function toast(message) { const el = document.createElement('div'); el.className = 'toast'; el.textContent = message; $('#toastRegion').appendChild(el); setTimeout(() => el.remove(), 2800); }

function normalizeState(candidate) {
  if (!candidate || typeof candidate !== 'object') return structuredClone(defaultState);
  return {
    ...structuredClone(defaultState),
    ...candidate,
    settings: { ...defaultState.settings, ...(candidate.settings || {}) },
    goals: Array.isArray(candidate.goals) ? candidate.goals : [],
    debts: Array.isArray(candidate.debts) ? candidate.debts : [],
    transactions: Array.isArray(candidate.transactions) ? candidate.transactions : []
  };
}

function setSyncStatus(mode, detail) {
  const title = $('#syncStatusTitle');
  const text = $('#syncStatusText');
  const dot = $('#syncStatusDot');
  if (!title || !text || !dot) return;
  const labels = {
    connecting: ['Cloudflare D1', detail || 'Connecting…'],
    synced: ['Cloudflare D1', detail || 'Synced across devices'],
    local: ['Local cache', detail || 'Cloud sync unavailable'],
    locked: ['Cloud sync locked', detail || 'Enable Cloudflare Access']
  };
  const current = labels[mode] || labels.local;
  title.textContent = current[0];
  text.textContent = current[1];
  dot.dataset.sync = mode;
}

async function syncFromCloud() {
  setSyncStatus('connecting');
  try {
    const response = await fetch('/api/state', { method: 'GET', headers: { Accept: 'application/json' }, cache: 'no-store' });
    if (response.status === 401 || response.status === 403) {
      cloudReady = false;
      setSyncStatus('locked', 'Sign in through Cloudflare Access');
      return;
    }
    if (!response.ok) throw new Error('Cloud sync unavailable');
    const payload = await response.json();
    cloudReady = true;

    if (payload.state && !cloudDirty) {
      state = normalizeState(payload.state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      renderAll();
    } else {
      await pushStateToCloud();
    }

    cloudDirty = false;
    setSyncStatus('synced', payload.updatedAt ? 'Last synced ' + formatCloudTime(payload.updatedAt) : 'Synced across devices');
  } catch (error) {
    cloudReady = false;
    setSyncStatus('local', 'Using browser storage only');
  }
}

function scheduleCloudSave() {
  cloudDirty = true;
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(pushStateToCloud, 250);
}

async function pushStateToCloud() {
  if (!cloudReady) return;
  try {
    const response = await fetch('/api/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ state })
    });
    if (response.status === 401 || response.status === 403) {
      cloudReady = false;
      setSyncStatus('locked', 'Sign in through Cloudflare Access');
      return;
    }
    if (!response.ok) throw new Error('Cloud save failed');
    const payload = await response.json();
    cloudDirty = false;
    setSyncStatus('synced', payload.updatedAt ? 'Last synced ' + formatCloudTime(payload.updatedAt) : 'Synced across devices');
  } catch (error) {
    cloudDirty = true;
    setSyncStatus('local', 'Saved locally; cloud retry pending');
  }
}

function formatCloudTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'recently';
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(date);
}

window.addEventListener('online', () => {
  if (cloudReady) pushStateToCloud();
  else syncFromCloud();
});

function bindNavigation() {
  $$('.nav-item').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.view)));
  $$('[data-jump]').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.jump)));
  $('#menuButton').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  document.addEventListener('keydown', event => {
    if (event.target.matches('input, select, textarea')) return;
    const view = ['dashboard','goals','debts','transactions','planner','reports'][Number(event.key) - 1];
    if (view) navigate(view);
  });
}
function navigate(view) {
  activeView = view;
  $$('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
  $$('[data-view-section]').forEach(section => section.classList.toggle('active', section.dataset.viewSection === view));
  const labels = {
    dashboard:['FINANCIAL OVERVIEW','Overview'], goals:['BUDGET TARGETS','Budget Goals'], debts:['LIABILITIES','Debt Management'],
    transactions:['MONEY MOVEMENT','Transactions'], planner:['PAYOFF STRATEGY','Payoff Planner'], reports:['EXPORT & PREFERENCES','Reports & Settings']
  };
  $('#viewEyebrow').textContent = labels[view][0]; $('#viewTitle').textContent = labels[view][1];
  $('#sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (view === 'reports') renderReport();
}

function bindForms() {
  $('#goalForm').addEventListener('submit', saveGoal);
  $('#debtForm').addEventListener('submit', saveDebt);
  $('#debtFrequency').addEventListener('change', toggleDueDay);
  $('#transactionForm').addEventListener('submit', saveTransaction);
  $('#plannerForm').addEventListener('submit', runPlanner);
  $('#settingsForm').addEventListener('submit', saveSettings);
  $('#transactionType').addEventListener('change', renderTransactionTargets);
  $('#transactionFilter').addEventListener('change', renderTransactions);
  $('#transactionSearch').addEventListener('input', renderTransactions);
  $('#cancelGoalEdit').addEventListener('click', resetGoalForm);
  $('#cancelDebtEdit').addEventListener('click', resetDebtForm);

  const paymentModalForm = $('#paymentModalForm');
  const paymentModalDebt = $('#paymentModalDebt');
  if (paymentModalForm) paymentModalForm.addEventListener('submit', savePaymentModal);
  if (paymentModalDebt) paymentModalDebt.addEventListener('change', updatePaymentModalBalance);
}
function bindActions() {
  $('#themeToggle').addEventListener('click', () => { state.settings.theme = state.settings.theme === 'light' ? 'dark' : 'light'; saveState(); applyTheme(); });
  $('#quickPaymentButton').addEventListener('click', () => openPaymentModal());
  $('#exportCsv').addEventListener('click', exportCsv);
  $('#exportJson').addEventListener('click', exportJson);
  $('#printReport').addEventListener('click', () => { renderReport(); window.print(); });
  $('#importJson').addEventListener('change', importJson);
  $('#resetData').addEventListener('click', resetAllData);
  const paymentModal = $('#paymentModal');
  const paymentModalClose = $('#paymentModalClose');
  const paymentModalCancel = $('#paymentModalCancel');
  if (paymentModalClose) paymentModalClose.addEventListener('click', closePaymentModal);
  if (paymentModalCancel) paymentModalCancel.addEventListener('click', closePaymentModal);
  if (paymentModal) paymentModal.addEventListener('click', event => { if (event.target === paymentModal) closePaymentModal(); });
  document.addEventListener('click', event => {
    const el = event.target.closest('[data-action]'); if (!el) return;
    const { action, id } = el.dataset;
    if (action === 'edit-goal') editGoal(id);
    if (action === 'delete-goal') deleteGoal(id);
    if (action === 'contribute-goal') quickGoalContribution(id);
    if (action === 'edit-debt') editDebt(id);
    if (action === 'delete-debt') deleteDebt(id);
    if (action === 'pay-debt') quickDebtPayment(id);
    if (action === 'delete-transaction') deleteTransaction(id);
  });
}
function applyTheme() { document.documentElement.dataset.theme = state.settings.theme || 'dark'; }
function renderAll() { renderSummary(); renderDebtProgress(); renderReminders(); renderGoalProgress(); renderActivityChart(); renderRecentTransactions(); renderGoals(); renderDebts(); renderTransactionTargets(); renderTransactions(); renderSettings(); renderReport(); }


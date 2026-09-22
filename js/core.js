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
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
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


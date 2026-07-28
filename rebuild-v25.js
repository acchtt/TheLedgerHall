(() => {
  'use strict';

  const UNIT_VALUE_VND = 500000;
  const STORAGE_KEY = 'ledgerHall:rebuild25';

  const defaults = {
    wagers: [
      {
        id: 'wisla-gks-025',
        match: 'Wisła Kraków vs GKS Katowice',
        pick: 'GKS Katowice +0.25',
        odds: 1.98,
        stakeUnits: 0.25,
        stakeVnd: 125000,
        status: 'Pending'
      }
    ],
    messages: [
      { who: 'You', time: '03:10', text: 'G2 is constantly applying pressure and KC is unable to get return kills.', type: 'user' },
      { who: 'Council', time: '03:11', text: 'The raw score understates G2’s control. KC +10.5 is withdrawn until the handicap expands.', type: 'council' },
      { who: 'Council · Official Bet Candidate', time: '03:19', text: 'KC have started generating return kills and the gold lead has narrowed.', bet: 'Karmine Corp +12.5 kills @1.886 · Stake: 0.25u', type: 'council official' },
      { who: 'You', time: '03:22', text: 'Confirmed. Karmine Corp +12.5 @1.778 — 0.5u.', type: 'user' },
      { who: 'Council · Result', time: 'Settled', text: 'KC +12.5 kills and Over 2.5 maps both won.', bet: 'Combined profit: +0.762u / +380,750 VND.', type: 'council' }
    ],
    results: [
      ['KC +12.5 kills (vs G2)', 'W'],
      ['Over 2.5 maps (G2 vs KC)', 'W'],
      ['Astralis vs HOTU Under 24.5', 'W'],
      ['Vietnam vs East Timor Over 3.0', 'L'],
      ['Herediano vs Puntarenas Over 1.75', 'L']
    ],
    odds: [
      ['KC +12.5 kills', '1.886'],
      ['G2 −12.5 kills', '1.886'],
      ['Over 29.5 kills', '2.389'],
      ['Under 29.5 kills', '1.546'],
      ['Over 30.0 min', '1.578'],
      ['Under 30.0 min', '2.344']
    ]
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function readSaved() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        messages: Array.isArray(parsed.messages) ? parsed.messages : [],
        wagers: Array.isArray(parsed.wagers) ? parsed.wagers : [],
        theme: parsed.theme === 'dusk' ? 'dusk' : 'day',
        hideMoney: Boolean(parsed.hideMoney),
        collapsed: parsed.collapsed && typeof parsed.collapsed === 'object' ? parsed.collapsed : {}
      };
    } catch (error) {
      console.warn('Could not read Ledger Hall saved data:', error);
      return { messages: [], wagers: [], theme: 'day', hideMoney: false, collapsed: {} };
    }
  }

  const saved = readSaved();
  const state = {
    messages: [...defaults.messages, ...saved.messages],
    wagers: [...defaults.wagers, ...saved.wagers]
  };

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function formatUnits(value) {
    const number = Number(value);
    const decimals = number < 1 ? 2 : 3;
    return `${number.toFixed(decimals).replace(/0+$/, '').replace(/\.$/, '')}u`;
  }

  function formatVnd(value) {
    return `${Math.round(Number(value)).toLocaleString('en-US')} VND`;
  }

  function pendingExposure() {
    return state.wagers.reduce((sum, wager) => sum + Number(wager.stakeUnits || 0), 0);
  }

  function renderWagers() {
    const host = $('#open-wagers');
    host.replaceChildren();

    state.wagers.forEach((wager) => {
      const article = make('article', 'wager-card');
      article.appendChild(make('strong', '', wager.match));

      const selection = make('div', 'selection');
      selection.append(
        document.createTextNode(wager.pick),
        document.createElement('br'),
        document.createTextNode(`@${Number(wager.odds).toFixed(3)}`)
      );
      article.appendChild(selection);

      const meta = make('div', 'wager-meta money', `${formatUnits(wager.stakeUnits)} · ${formatVnd(wager.stakeVnd)}`);
      article.appendChild(meta);

      const seal = make('span', 'wax');
      seal.appendChild(make('span', '', wager.status || 'Pending'));
      article.appendChild(seal);
      host.appendChild(article);
    });
  }

  function renderTrial() {
    const host = $('#trial-table');
    const rows = [
      ['Wins', '3'],
      ['Losses', '2'],
      ['Settled P/L', '+0.194u', true],
      ['Pending Exposure', formatUnits(pendingExposure()), true],
      ['Min Odds', '1.60']
    ];
    host.replaceChildren();

    rows.forEach(([label, value, money]) => {
      host.appendChild(make('dt', '', label));
      host.appendChild(make('dd', money ? 'money' : '', value));
    });

    $('#header-pending').textContent = formatUnits(pendingExposure());
  }

  function renderResults() {
    const host = $('#results-list');
    host.replaceChildren();
    defaults.results.forEach(([label, result]) => {
      const row = make('li');
      row.append(
        make('span', '', label),
        make('b', result === 'W' ? 'result-win' : 'result-loss', result)
      );
      host.appendChild(row);
    });
  }

  function renderOdds() {
    const host = $('#odds-list');
    host.replaceChildren();
    defaults.odds.forEach(([label, price], index) => {
      const row = make('div', 'odds-row');
      row.append(
        make('span', '', label),
        make('strong', index === 1 ? 'loss' : index === 0 ? 'win' : '', price)
      );
      host.appendChild(row);
    });
  }

  function renderMessage(message) {
    const article = make('article', `message ${message.type || 'user'}`);
    const meta = make('div', 'meta');
    meta.append(make('span', '', message.who), make('span', '', message.time));
    article.append(meta, make('div', '', message.text));
    if (message.bet) article.appendChild(make('div', 'bet-line money', message.bet));
    $('#messages').appendChild(article);
  }

  function renderMessages() {
    const host = $('#messages');
    host.replaceChildren();
    state.messages.forEach(renderMessage);
  }

  function parseStake(text) {
    const unitMatch = text.match(/(\d+(?:\.\d+)?)\s*u\b/i);
    if (unitMatch) {
      const units = Number(unitMatch[1]);
      return { units, vnd: units * UNIT_VALUE_VND };
    }

    const vndMatch = text.match(/([\d.,]+)\s*(?:VND|₫)\b/i);
    if (!vndMatch) return null;
    const normalized = vndMatch[1].replace(/[.,](?=\d{3}(?:\D|$))/g, '').replace(/,/g, '');
    const vnd = Number(normalized);
    if (!Number.isFinite(vnd) || vnd <= 0) return null;
    return { units: vnd / UNIT_VALUE_VND, vnd };
  }

  function parseWager(text) {
    const at = text.lastIndexOf('@');
    if (at < 1) return null;

    const pickText = text.slice(0, at)
      .replace(/^\s*(?:confirmed|bet|took|logged)\s*[.:,-]?\s*/i, '')
      .trim();
    const after = text.slice(at + 1).trim();
    const oddsMatch = after.match(/^(\d+(?:\.\d+)?)/);
    const stake = parseStake(after);
    if (!oddsMatch || !stake || !pickText) return null;

    let match = 'Council note wager';
    let pick = pickText;
    const separated = pickText.split(/\s*(?:—|–|\||→)\s*/).filter(Boolean);
    if (separated.length >= 2 && /\bvs\.?\b/i.test(separated[0])) {
      match = separated.shift();
      pick = separated.join(' — ');
    }

    return {
      id: `wager-${Date.now()}`,
      match,
      pick,
      odds: Number(oddsMatch[1]),
      stakeUnits: stake.units,
      stakeVnd: stake.vnd,
      status: 'Pending'
    };
  }

  function addDetectedWager(text) {
    const wager = parseWager(text);
    if (!wager) return false;

    const duplicate = state.wagers.some((existing) =>
      existing.pick.toLowerCase() === wager.pick.toLowerCase() &&
      Math.abs(Number(existing.odds) - wager.odds) < 0.0001 &&
      Math.abs(Number(existing.stakeUnits) - wager.stakeUnits) < 0.0001
    );
    if (duplicate) return false;

    state.wagers.push(wager);
    saved.wagers.push(wager);
    persist();
    renderWagers();
    renderTrial();
    $('#current-read').textContent = 'Wager Logged';
    return true;
  }

  function applyPreferences() {
    document.body.classList.toggle('dusk', saved.theme === 'dusk');
    document.body.classList.toggle('hide-money', saved.hideMoney);
    $('#money-btn').lastChild.textContent = saved.hideMoney ? 'Show $' : 'Hide $';

    $$('.wood-section').forEach((section) => {
      const id = section.id;
      const collapsed = Boolean(saved.collapsed[id]);
      section.classList.toggle('collapsed', collapsed);
      const button = $('.collapse', section);
      if (button) button.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  function wireControls() {
    $('#message-form').addEventListener('submit', (event) => {
      event.preventDefault();
      const input = $('#message-input');
      const text = input.value.trim();
      if (!text) return;

      const message = {
        who: 'You',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        text,
        type: 'user'
      };
      state.messages.push(message);
      saved.messages.push(message);
      persist();
      renderMessage(message);
      addDetectedWager(text);
      input.value = '';
      $('#messages').scrollTop = $('#messages').scrollHeight;
    });

    $('#theme-btn').addEventListener('click', () => {
      saved.theme = saved.theme === 'dusk' ? 'day' : 'dusk';
      persist();
      applyPreferences();
    });

    $('#money-btn').addEventListener('click', () => {
      saved.hideMoney = !saved.hideMoney;
      persist();
      applyPreferences();
    });

    $('#chamber-btn').addEventListener('click', () => {
      $('#hero').classList.remove('focus-flash');
      requestAnimationFrame(() => $('#hero').classList.add('focus-flash'));
    });

    $$('.collapse').forEach((button) => {
      button.addEventListener('click', () => {
        const section = button.closest('.wood-section');
        saved.collapsed[section.id] = !section.classList.contains('collapsed');
        persist();
        applyPreferences();
      });
    });

    $$('.footer-beam button').forEach((button) => {
      button.addEventListener('click', () => {
        $$('.footer-beam button').forEach((item) => item.classList.toggle('active', item === button));
        const target = document.getElementById(button.dataset.target);
        if (!target) return;
        target.classList.remove('focus-flash');
        requestAnimationFrame(() => target.classList.add('focus-flash'));
      });
    });

    $$('.help').forEach((button) => {
      button.addEventListener('click', () => window.alert(button.dataset.help || 'Ledger information'));
    });
  }

  renderWagers();
  renderTrial();
  renderResults();
  renderOdds();
  renderMessages();
  wireControls();
  applyPreferences();
})();

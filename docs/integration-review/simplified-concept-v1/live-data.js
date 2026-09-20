(function () {
  "use strict";

  const scriptElement = document.currentScript;
  const endpoint = scriptElement?.dataset.endpoint || "./live-data.json";
  const pollInterval = Math.max(5000, Number(scriptElement?.dataset.pollMs) || 15000);
  const crestPath = "assets/ledger-hall-emblem-production.png";
  const fallbackState = {
    updatedAt: "2026-08-01T02:30:00+07:00",
    lifetime: { pl: 2.882, settled: 9.234, roi: 31.2 },
    trial: { wins: 3, losses: 2, pl: 0.194, pending: 0.25, minOdds: 1.6 },
    wagers: [{ id: "wisla-gks-025", match: "Wisla Kraków vs GKS Katowice", pick: "GKS Katowice +0.25", odds: 1.98, stakeUnits: 0.25, stakeVnd: 125000, status: "Pending" }],
    results: [
      { label: "KC +12.5 kills (vs G2)", result: "W" },
      { label: "Over 2.5 maps (G2 vs KC)", result: "W" },
      { label: "Astralis vs HOTU Under 24.5", result: "W" },
      { label: "Vietnam vs East Timor Over 3.0", result: "L" },
      { label: "Herediano vs Puntarenas Over 1.75", result: "L" }
    ],
    messages: [
      { who: "You", time: "03:10", text: "G2 is constantly applying pressure and KC is unable to get return kills.", type: "user" },
      { who: "Council", time: "03:11", text: "The raw score understates G2's control. KC +10.5 is withdrawn until the handicap expands.", type: "council" },
      { who: "Council · Official Bet Candidate", time: "03:19", text: "KC have started generating return kills and the gold lead has narrowed.", detail: "Karmine Corp +12.5 kills @1.886 · Stake: 0.25u", type: "candidate" },
      { who: "You", time: "03:22", text: "Confirmed. Karmine Corp +12.5 @1.778 — 0.5u.", type: "user" },
      { who: "Council · Result", time: "Settled", text: "KC +12.5 kills and Over 2.5 maps both won.", detail: "Combined profit: +0.762u / +380,750 VND.", type: "council" }
    ],
    battle: { match: "G2 Esports vs Karmine Corp", event: "LEC 2026 Summer · Game 2", leftTeam: "G2", rightTeam: "KC", leftScore: 10, rightScore: 4, time: "19:45" },
    currentRead: ["Lean KC on kills. Gold nearly even.", "Tempo swings favor extended game."]
  };
  let state = JSON.parse(JSON.stringify(fallbackState));
  let localMessages = [];
  let pollTimer = null;

  const byId = id => document.getElementById(id);
  const one = selector => document.querySelector(selector);
  const patchBridge = byId("ledger-hall-live-patch");
  let lastPatchText = patchBridge?.value.trim() || "{}";

  function merge(base, patch) {
    if (Array.isArray(patch)) return patch.slice();
    if (!patch || typeof patch !== "object") return patch;
    const output = { ...(base && typeof base === "object" ? base : {}) };
    Object.entries(patch).forEach(([key, value]) => {
      output[key] = value && typeof value === "object" && !Array.isArray(value)
        ? merge(output[key], value)
        : Array.isArray(value) ? value.slice() : value;
    });
    return output;
  }

  function signed(value, digits, suffix) {
    const number = Number(value) || 0;
    const sign = number > 0 ? "+" : number < 0 ? "−" : "";
    return `${sign}${Math.abs(number).toFixed(digits)}${suffix}`;
  }

  function units(value, digits) {
    return `${Number(value || 0).toFixed(digits)}u`;
  }

  function setPolarity(element, value) {
    element.classList.toggle("positive", Number(value) >= 0);
    element.classList.toggle("negative", Number(value) < 0);
  }

  function renderSummaries() {
    const lifetime = state.lifetime || {};
    const trial = state.trial || {};
    const lifetimeCard = one(".summary-card--left");
    const trialCard = one(".summary-card--right");
    const lifetimePl = byId("live-lifetime-pl");
    const trialPl = byId("live-trial-summary-pl");

    lifetimePl.textContent = signed(lifetime.pl, 3, "u");
    lifetimeCard.querySelector("p:nth-of-type(2)").textContent = `Settled: ${units(lifetime.settled, 3)}`;
    lifetimeCard.querySelector("p:nth-of-type(3)").textContent = `ROI: ${signed(lifetime.roi, 1, "%")}`;
    setPolarity(lifetimePl, lifetime.pl);

    trialPl.textContent = signed(trial.pl, 3, "u");
    trialCard.querySelector("p:nth-of-type(2)").textContent = `Record: ${trial.wins || 0}W–${trial.losses || 0}L`;
    trialCard.querySelector("p:nth-of-type(3)").textContent = `Pending: ${units(trial.pending, 2)}`;
    setPolarity(trialPl, trial.pl);
  }

  function renderWager() {
    const wager = Array.isArray(state.wagers) ? state.wagers[0] : null;
    const container = byId("live-open-wager");
    if (!wager) {
      const empty = document.createElement("div");
      empty.textContent = "No open wagers";
      container.replaceChildren(empty);
      return;
    }
    const emblem = document.createElement("img");
    emblem.className = "mini-emblem";
    emblem.src = crestPath;
    emblem.alt = "";
    const content = document.createElement("div");
    const match = document.createElement("strong");
    const pick = document.createElement("b");
    const meta = document.createElement("small");
    match.textContent = wager.match;
    pick.textContent = `${wager.pick} @${Number(wager.odds).toFixed(3)}`;
    meta.textContent = `${units(wager.stakeUnits, 2)}  ·  ${Math.round(wager.stakeVnd).toLocaleString("en-US")} VND`;
    content.append(match, pick, meta);
    const status = document.createElement("i");
    status.className = "seal";
    status.textContent = wager.status || "Pending";
    container.replaceChildren(emblem, content, status);
  }

  function renderTrial() {
    const trial = state.trial || {};
    const rows = [
      ["Wins", trial.wins || 0],
      ["Losses", trial.losses || 0],
      ["Settled P/L", signed(trial.pl, 3, "u"), Number(trial.pl) >= 0 ? "positive" : "negative"],
      ["Pending Exposure", units(trial.pending, 2)],
      ["Min Odds", Number(trial.minOdds || 0).toFixed(2)]
    ];
    byId("live-trial-record").replaceChildren(...rows.map(([label, value, className]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      if (className) dd.className = className;
      row.append(dt, dd);
      return row;
    }));
  }

  function renderResults() {
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = "View all results →";
    const rows = (state.results || []).slice(0, 5).map(item => {
      const row = document.createElement("p");
      const label = document.createElement("span");
      const result = document.createElement("b");
      label.textContent = item.label;
      result.textContent = item.result;
      if (item.result !== "W") result.className = "negative";
      row.append(label, result);
      return row;
    });
    byId("live-recent-results").replaceChildren(...rows, link);
  }

  function makeMessage(message) {
    const article = document.createElement("article");
    article.className = "message";
    if (message.type === "user") article.classList.add("message--you");
    if (message.type === "candidate") article.classList.add("message--candidate");
    const emblem = document.createElement("img");
    emblem.className = "mini-emblem";
    emblem.src = crestPath;
    emblem.alt = "";
    const content = document.createElement("div");
    const header = document.createElement("header");
    const who = document.createElement("b");
    const time = document.createElement("time");
    const body = document.createElement("p");
    who.textContent = message.who;
    time.textContent = message.time;
    body.textContent = message.text;
    header.append(who, time);
    content.append(header, body);
    if (message.detail) {
      const detail = document.createElement("strong");
      detail.textContent = message.detail;
      content.appendChild(detail);
    }
    article.append(emblem, content);
    return article;
  }

  function renderMessages() {
    const sheet = byId("live-council-notes");
    const form = byId("live-message-form");
    sheet.querySelectorAll(".message").forEach(message => message.remove());
    [...(state.messages || []), ...localMessages].slice(-5).forEach(message => {
      sheet.insertBefore(makeMessage(message), form);
    });
  }

  function renderBattle() {
    const battle = state.battle || {};
    const card = one(".battle-card");
    card.querySelector("h3").textContent = battle.match || "";
    card.querySelector("small").textContent = battle.event || "";
    card.querySelector(".team-mark").textContent = battle.leftTeam || "";
    card.querySelector(".team-mark--blue").textContent = battle.rightTeam || "";
    card.querySelector(".scoreboard strong").textContent = `${battle.leftScore ?? 0} – ${battle.rightScore ?? 0}`;
    card.querySelector("time").textContent = battle.time || "";
  }

  function renderCurrentRead() {
    byId("live-current-read").replaceChildren(...(state.currentRead || []).slice(0, 2).map(line => {
      const paragraph = document.createElement("p");
      paragraph.textContent = line;
      return paragraph;
    }));
  }

  function render() {
    if (!state) return;
    renderSummaries();
    renderWager();
    renderTrial();
    renderResults();
    renderMessages();
    renderBattle();
    renderCurrentRead();
  }

  async function refresh() {
    if (typeof fetch !== "function") return state;
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) throw new Error(`Ledger data request failed: ${response.status}`);
    state = merge(state || {}, await response.json());
    render();
    return state;
  }

  function update(patch) {
    state = merge(state || {}, patch || {});
    render();
    return state;
  }

  function startPolling() {
    window.clearInterval(pollTimer);
    pollTimer = window.setInterval(() => {
      if (!document.hidden) refresh().catch(error => console.warn(error.message));
    }, pollInterval);
  }

  function readPatchBridge() {
    if (!patchBridge) return;
    const nextText = patchBridge.value.trim() || "{}";
    if (nextText === lastPatchText) return;
    lastPatchText = nextText;
    try {
      update(JSON.parse(nextText));
    } catch (error) {
      console.warn(`Ignored invalid Ledger Hall patch: ${error.message}`);
    }
  }

  byId("live-message-form").addEventListener("submit", event => {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input");
    const text = input.value.trim();
    if (!text) return;
    localMessages.push({ who: "You", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), text, type: "user" });
    localMessages = localMessages.slice(-5);
    input.value = "";
    renderMessages();
  });

  const api = {
    refresh,
    update,
    getState: () => state ? JSON.parse(JSON.stringify(state)) : null,
    endpoint,
    excluded: ["oddsSnapshot"]
  };
  document.addEventListener("ledgerhall:data", event => update(event.detail || {}));
  document.addEventListener("ledgerhall:refresh", () => refresh().catch(error => console.warn(error.message)));
  if (Object.isExtensible(window)) window.LedgerHallLiveData = api;

  render();
  window.setInterval(readPatchBridge, 250);
  if (typeof fetch === "function") refresh().then(startPolling).catch(error => console.error(error));
}());

const UNIT_VALUE_VND = 500000;
const STORAGE_KEY = "ledgerHall:v7";

const defaultState = {
  lifetime: { pl: -2.882, stake: 9.234, roi: -31.2 },
  trial: { wins: 3, losses: 2, pl: 0.194, pending: 0.25, minOdds: 1.60 },
  wagers: [
    {
      id: "wisla-gks-025",
      match: "Wisła Kraków vs GKS Katowice",
      pick: "GKS Katowice +0.25",
      odds: 1.98,
      stakeUnits: 0.25,
      stakeVnd: 125000,
      status: "Pending"
    }
  ],
  results: [
    ["KC +12.5 kills (vs G2)", "W"],
    ["Over 2.5 maps (G2 vs KC)", "W"],
    ["Astralis vs HOTU Under 24.5", "W"],
    ["Vietnam vs East Timor Over 3.0", "L"],
    ["Herediano vs Puntarenas Over 1.75", "L"]
  ],
  messages: [
    { who: "You", time: "03:10", text: "G2 is constantly applying pressure and KC is unable to get return kills.", type: "user" },
    { who: "Council", time: "03:11", text: "The raw score understates G2’s control. KC +10.5 is withdrawn until the handicap expands.", type: "council" },
    { who: "Council · Official Bet Candidate", time: "03:19", text: "KC have started generating return kills and the gold lead has narrowed.", bet: "Karmine Corp +12.5 kills @1.886 · Stake: 0.25u", type: "council official" },
    { who: "You", time: "03:22", text: "Confirmed. Karmine Corp +12.5 @1.778 — 0.5u.", type: "user" },
    { who: "Council · Result", time: "Settled", text: "KC +12.5 kills and Over 2.5 maps both won.", bet: "Combined profit: +0.762u / +380,750 VND.", type: "council" }
  ],
  odds: [
    ["KC +12.5 kills", "1.886"],
    ["G2 −12.5 kills", "1.886"],
    ["Over 29.5 kills", "2.389"],
    ["Under 29.5 kills", "1.546"],
    ["Over 30.0 min", "1.578"],
    ["Under 30.0 min", "2.344"]
  ]
};

function readSavedState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      userMessages: Array.isArray(parsed.userMessages) ? parsed.userMessages : [],
      customWagers: Array.isArray(parsed.customWagers) ? parsed.customWagers : [],
      preferences: {
        hideMoney: Boolean(parsed.preferences?.hideMoney),
        dusk: Boolean(parsed.preferences?.dusk),
        collapsed: parsed.preferences?.collapsed && typeof parsed.preferences.collapsed === "object"
          ? parsed.preferences.collapsed
          : {}
      }
    };
  } catch {
    return { userMessages: [], customWagers: [], preferences: { hideMoney: false, dusk: false, collapsed: {} } };
  }
}

const saved = readSavedState();
const state = {
  ...defaultState,
  wagers: [...defaultState.wagers, ...saved.customWagers],
  messages: [...defaultState.messages, ...saved.userMessages]
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

function formatVnd(value) {
  return `${Math.round(value).toLocaleString("en-US")} VND`;
}

function formatUnits(value) {
  return `${Number(value).toFixed(value < 1 ? 2 : 3).replace(/0+$/, "").replace(/\.$/, "")}u`;
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderOpenWagers() {
  const container = $("#open-wagers");
  container.replaceChildren();

  state.wagers.forEach(wager => {
    const card = makeElement("article", "wager-card");
    card.appendChild(makeElement("strong", "", wager.match));

    const selection = makeElement("div", "selection");
    selection.append(document.createTextNode(wager.pick), document.createElement("br"), document.createTextNode(`@${Number(wager.odds).toFixed(3)}`));
    card.appendChild(selection);

    const meta = makeElement("div", "wager-meta");
    const money = makeElement("span", "money", `${formatUnits(wager.stakeUnits)} · ${formatVnd(wager.stakeVnd)}`);
    const badge = makeElement("span", "badge", wager.status || "Pending");
    meta.append(money, badge);
    card.appendChild(meta);
    container.appendChild(card);
  });
}

function pendingExposure() {
  return state.wagers.reduce((sum, wager) => sum + Number(wager.stakeUnits || 0), 0);
}

function renderTrialRecord() {
  const trial = $("#trial-details");
  trial.replaceChildren();
  const rows = [
    ["Wins", state.trial.wins],
    ["Losses", state.trial.losses],
    ["Settled P/L", `+${state.trial.pl.toFixed(3)}u`, true],
    ["Pending Exposure", formatUnits(pendingExposure()), true],
    ["Min Odds", state.trial.minOdds.toFixed(2)]
  ];

  rows.forEach(([label, value, isMoney]) => {
    trial.appendChild(makeElement("dt", "", label));
    const dd = makeElement("dd");
    dd.appendChild(makeElement("span", isMoney ? "money" : "", String(value)));
    trial.appendChild(dd);
  });

  $("#trial-pending").textContent = formatUnits(pendingExposure());
}

function renderResults() {
  const list = $("#recent-results");
  list.replaceChildren();
  state.results.forEach(([name, result]) => {
    const item = makeElement("li");
    item.append(
      makeElement("span", "", name),
      makeElement("b", result === "W" ? "result-win" : "result-loss", result)
    );
    list.appendChild(item);
  });
}

function renderMessage(message) {
  const article = makeElement("article", `message ${message.type || "user"}`);
  const meta = makeElement("div", "meta");
  meta.append(makeElement("span", "", message.who), makeElement("span", "", message.time));
  article.append(meta, makeElement("div", "", message.text));
  if (message.bet) article.appendChild(makeElement("div", "bet-line money", message.bet));
  $("#chat-feed").appendChild(article);
}

function renderMessages() {
  const feed = $("#chat-feed");
  feed.replaceChildren();
  state.messages.forEach(renderMessage);
}

function renderOdds() {
  const list = $("#odds-list");
  list.replaceChildren();
  state.odds.forEach(([market, price]) => {
    const row = makeElement("div", "odds-row");
    row.append(makeElement("span", "", market), makeElement("strong", "", price));
    list.appendChild(row);
  });
}

function parseStake(raw) {
  const unitMatch = raw.match(/(\d+(?:\.\d+)?)\s*u\b/i);
  if (unitMatch) {
    const units = Number(unitMatch[1]);
    return { units, vnd: units * UNIT_VALUE_VND };
  }

  const vndMatch = raw.match(/([\d.,]+)\s*(?:VND|₫)\b/i);
  if (vndMatch) {
    const vnd = Number(vndMatch[1].replace(/[.,](?=\d{3}(?:\D|$))/g, "").replace(/,/g, ""));
    if (Number.isFinite(vnd) && vnd > 0) return { units: vnd / UNIT_VALUE_VND, vnd };
  }

  return null;
}

function parseWagerFromMessage(text) {
  const atIndex = text.lastIndexOf("@");
  if (atIndex < 1) return null;

  const beforeOdds = text.slice(0, atIndex)
    .replace(/^\s*(?:confirmed|bet|took|logged)\s*[.:,-]?\s*/i, "")
    .trim();
  const afterOdds = text.slice(atIndex + 1).trim();
  const oddsMatch = afterOdds.match(/^(\d+(?:\.\d+)?)/);
  const stake = parseStake(afterOdds);
  if (!oddsMatch || !stake) return null;

  let match = "Council note wager";
  let pick = beforeOdds;
  const separated = beforeOdds.split(/\s*(?:—|–|\||→)\s*/).filter(Boolean);
  if (separated.length >= 2 && /\bvs\.?\b/i.test(separated[0])) {
    match = separated.shift();
    pick = separated.join(" — ");
  }

  if (!pick || pick.length < 2) return null;
  return {
    id: `wager-${Date.now()}`,
    match,
    pick,
    odds: Number(oddsMatch[1]),
    stakeUnits: stake.units,
    stakeVnd: stake.vnd,
    status: "Pending"
  };
}

function addDetectedWager(text) {
  const wager = parseWagerFromMessage(text);
  if (!wager) return false;

  const duplicate = state.wagers.some(existing =>
    existing.pick.toLowerCase() === wager.pick.toLowerCase() &&
    Math.abs(Number(existing.odds) - wager.odds) < 0.0001 &&
    Math.abs(Number(existing.stakeUnits) - wager.stakeUnits) < 0.0001
  );
  if (duplicate) return false;

  state.wagers.push(wager);
  saved.customWagers.push(wager);
  saveState();
  renderOpenWagers();
  renderTrialRecord();

  const currentRead = $(".current-read strong");
  if (currentRead) currentRead.textContent = "Wager Logged";
  return true;
}

function applyPreferences() {
  document.body.classList.toggle("hide-money", saved.preferences.hideMoney);
  document.body.classList.toggle("theme-dusk", saved.preferences.dusk);
  $("#money-button").lastChild.textContent = saved.preferences.hideMoney ? "Show $" : "Hide $";

  $$(".wood-panel").forEach(panel => {
    const heading = panel.querySelector(".panel-heading h2")?.textContent.trim();
    const button = panel.querySelector(".panel-heading button");
    if (!heading || !button) return;
    const collapsed = Boolean(saved.preferences.collapsed[heading]);
    [...panel.children].forEach(child => {
      if (!child.classList.contains("panel-heading")) child.hidden = collapsed;
    });
    button.textContent = collapsed ? "+" : "−";
    button.setAttribute("aria-expanded", String(!collapsed));
  });
}

function wirePanelControls() {
  $$(".wood-panel .panel-heading button").forEach(button => {
    button.addEventListener("click", () => {
      const panel = button.closest(".wood-panel");
      const heading = panel.querySelector(".panel-heading h2")?.textContent.trim();
      if (!heading) return;
      const nextCollapsed = !Boolean(saved.preferences.collapsed[heading]);
      saved.preferences.collapsed[heading] = nextCollapsed;
      saveState();
      applyPreferences();
    });
  });
}

function wireNavigation() {
  const targets = {
    "Council Notes": ".chat-panel",
    "Open Wagers": ".left-column .wood-panel:nth-child(1)",
    "Closed Ledgers": ".recent-panel",
    "Battle Reports": ".battle-panel",
    "Chamber Settings": ".masthead"
  };

  $$(".bottom-nav button").forEach(button => {
    button.addEventListener("click", () => {
      const label = button.textContent.trim();
      const target = document.querySelector(targets[label]);
      if (!target) return;
      $$(".bottom-nav button").forEach(item => item.classList.toggle("active", item === button));
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function wireHelp() {
  const helpCopy = [
    "Lifetime figures cover all settled wagers currently recorded in the hall.",
    "Trial figures cover the current tracked phase. Pending exposure updates when a wager is detected."
  ];
  $$(".help-dot").forEach((button, index) => {
    button.title = helpCopy[index] || "Ledger information";
    button.addEventListener("click", () => window.alert(button.title));
  });
}

$("#message-form").addEventListener("submit", event => {
  event.preventDefault();
  const input = $("#message-input");
  const text = input.value.trim();
  if (!text) return;

  const message = {
    who: "You",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    text,
    type: "user"
  };
  state.messages.push(message);
  saved.userMessages.push(message);
  saveState();
  renderMessage(message);

  const wagerAdded = addDetectedWager(text);
  input.value = "";
  $("#chat-feed").scrollTop = $("#chat-feed").scrollHeight;
  input.placeholder = wagerAdded ? "Wager detected and added to Open Wagers" : "Write your message…";
  window.setTimeout(() => { input.placeholder = "Write your message…"; }, 2200);
});

$("#money-button").addEventListener("click", () => {
  saved.preferences.hideMoney = !saved.preferences.hideMoney;
  saveState();
  applyPreferences();
});

$("#theme-button").addEventListener("click", () => {
  saved.preferences.dusk = !saved.preferences.dusk;
  saveState();
  applyPreferences();
});

$("#chamber-button")?.addEventListener("click", () => {
  $(".masthead").scrollIntoView({ behavior: "smooth", block: "start" });
});

renderOpenWagers();
renderTrialRecord();
renderResults();
renderMessages();
renderOdds();
wirePanelControls();
wireNavigation();
wireHelp();
applyPreferences();

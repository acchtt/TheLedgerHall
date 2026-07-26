const state = {
  lifetime: { pl: -2.882, stake: 9.234, roi: -31.2 },
  trial: { wins: 3, losses: 2, pl: 0.194, pending: 0.25, minOdds: 1.60 },
  wagers: [
    { match: "Wisła Kraków vs GKS Katowice", pick: "GKS Katowice +0.25", odds: 1.98, stake: "0.25u · 125,000 VND", status: "Pending" }
  ],
  results: [
    ["KC +12.5 kills (vs G2)", "W"],
    ["Over 2.5 maps (G2 vs KC)", "W"],
    ["Astralis vs HOTU Under 24.5", "W"],
    ["Vietnam vs East Timor Over 3.0", "L"],
    ["Herediano vs Puntarenas Over 1.75", "L"]
  ],
  messages: [
    { who:"You", time:"03:10", text:"G2 is constantly applying pressure and KC is unable to get return kills.", type:"user" },
    { who:"Council", time:"03:11", text:"The raw score understates G2’s control. KC +10.5 is withdrawn until the handicap expands.", type:"council" },
    { who:"Council · Official Bet Candidate", time:"03:19", text:"KC have started generating return kills and the gold lead has narrowed.", bet:"Karmine Corp +12.5 kills @1.886 · Stake: 0.25u", type:"council official" },
    { who:"You", time:"03:22", text:"Confirmed. Karmine Corp +12.5 @1.778 — 0.5u.", type:"user" },
    { who:"Council · Result", time:"Settled", text:"KC +12.5 kills and Over 2.5 maps both won.", bet:"Combined profit: +0.762u / +380,750 VND.", type:"council" }
  ],
  odds: [
    ["KC +12.5 kills","1.886"],["G2 −12.5 kills","1.886"],["Over 29.5 kills","2.389"],
    ["Under 29.5 kills","1.546"],["Over 30.0 min","1.578"],["Under 30.0 min","2.344"]
  ]
};

const $ = s => document.querySelector(s);
const openWagers = $("#open-wagers");
state.wagers.forEach(w => {
  openWagers.insertAdjacentHTML("beforeend", `
    <article class="wager-card">
      <strong>${w.match}</strong>
      <div class="selection">${w.pick}<br>@${w.odds.toFixed(3)}</div>
      <div class="wager-meta"><span class="money">${w.stake}</span><span class="badge">${w.status}</span></div>
    </article>`);
});

const trial = $("#trial-details");
[
  ["Wins",state.trial.wins],["Losses",state.trial.losses],
  ["Settled P/L",`<span class="money">+${state.trial.pl.toFixed(3)}u</span>`],
  ["Pending Exposure",`<span class="money">${state.trial.pending.toFixed(2)}u</span>`],
  ["Min Odds",state.trial.minOdds.toFixed(2)]
].forEach(([k,v]) => trial.insertAdjacentHTML("beforeend",`<dt>${k}</dt><dd>${v}</dd>`));

state.results.forEach(([name,r]) => $("#recent-results").insertAdjacentHTML("beforeend",
  `<li><span>${name}</span><b class="${r==="W"?"result-win":"result-loss"}">${r}</b></li>`));

function renderMessage(m){
  $("#chat-feed").insertAdjacentHTML("beforeend",`
    <article class="message ${m.type}">
      <div class="meta"><span>${m.who}</span><span>${m.time}</span></div>
      <div>${m.text}</div>
      ${m.bet?`<div class="bet-line money">${m.bet}</div>`:""}
    </article>`);
}
state.messages.forEach(renderMessage);

state.odds.forEach(([market,price]) => $("#odds-list").insertAdjacentHTML("beforeend",
  `<div class="odds-row"><span>${market}</span><strong>${price}</strong></div>`));

$("#message-form").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("#message-input");
  const text = input.value.trim();
  if(!text) return;
  renderMessage({who:"You",time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}),text,type:"user"});
  input.value="";
  $("#chat-feed").scrollTop=$("#chat-feed").scrollHeight;
});
$("#money-button").addEventListener("click",()=>document.body.classList.toggle("hide-money"));
$("#theme-button").addEventListener("click",()=>document.body.classList.toggle("theme-dusk"));

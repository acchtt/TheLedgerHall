function renderSummary() {
  const totalOriginal = state.debts.reduce((s,d) => s + n(d.originalBalance), 0);
  const totalDebt = state.debts.reduce((s,d) => s + n(d.balance), 0);
  const debtPaid = Math.max(0, totalOriginal - totalDebt);
  const goalTarget = state.goals.reduce((s,g) => s + n(g.target), 0);
  const goalSaved = state.goals.reduce((s,g) => s + n(g.current), 0);
  const monthKey = isoDate(new Date()).slice(0,7);
  const monthPayments = state.transactions.filter(t => t.type === 'debt-payment' && t.date.startsWith(monthKey)).reduce((s,t) => s+n(t.amount),0);
  const monthlyScheduled = state.debts.reduce((s,d) => s + scheduledMonthlyAmount(d),0);
  const metrics = [
    ['Total debt', money(totalDebt), totalOriginal ? percent((debtPaid/totalOriginal)*100) + ' reduced' : 'No debt accounts'],
    ['Paid this month', money(monthPayments), monthlyScheduled ? money(monthlyScheduled) + ' scheduled / month' : 'No payment schedule'],
    ['Goal savings', money(goalSaved), goalTarget ? percent((goalSaved/goalTarget)*100) + ' of targets funded' : 'No budget goals'],
    ['Net this month', money(monthNet(monthKey)), 'Income minus expenses & allocations']
  ];
  $('#summaryMetrics').innerHTML = metrics.map(([label,value,sub]) => `<article class="metric"><div class="metric-label"><span>${escapeHtml(label)}</span><span>●</span></div><div class="metric-value">${escapeHtml(value)}</div><div class="metric-sub">${escapeHtml(sub)}</div></article>`).join('');
}
function monthNet(monthKey) { return state.transactions.filter(t => t.date.startsWith(monthKey)).reduce((sum,t) => t.type === 'income' ? sum+n(t.amount) : sum-n(t.amount),0); }

function renderDebtProgress() {
  const list = [...state.debts].sort((a,b) => n(b.balance)-n(a.balance)).slice(0,5);
  $('#debtProgressList').innerHTML = list.length ? list.map(d => {
    const original = Math.max(n(d.originalBalance), n(d.balance), 1); const reduced = clamp(((original-n(d.balance))/original)*100,0,100);
    return `<div class="progress-row"><div class="progress-head"><strong>${escapeHtml(d.name)}</strong><span>${money(d.balance)} remaining</span></div><div class="progress-track"><i style="width:${reduced}%"></i></div><div class="progress-meta"><span>${percent(reduced)} paid</span><span>${money(Math.max(0,original-n(d.balance)))} reduced</span></div></div>`;
  }).join('') : emptyState('No debts yet','Add a debt account to track reduction.');
}

function buildReminders() {
  const today = new Date(); const lead = clamp(Number(state.settings.reminderLeadDays)||0,0,30); const reminders = [];
  state.debts.filter(d => n(d.balance)>0 && n(d.scheduledPayment)>0).forEach(debt => {
    if (debt.frequency === 'daily') {
      const paidToday = paymentsForDebt(debt.id).filter(t => t.date===isoDate(today)).reduce((s,t)=>s+n(t.amount),0);
      if (paidToday + .0001 < n(debt.scheduledPayment)) reminders.push({debt,date:today,status:'Due today',amount:Math.max(0,n(debt.scheduledPayment)-paidToday)});
      return;
    }
    const due = safeDate(today.getFullYear(),today.getMonth(),clamp(Number(debt.dueDay)||1,1,31));
    const monthKey = isoDate(today).slice(0,7); const paidMonth = paymentsForDebt(debt.id).filter(t=>t.date.startsWith(monthKey)).reduce((s,t)=>s+n(t.amount),0); const remaining = Math.max(0,n(debt.scheduledPayment)-paidMonth);
    if (!remaining) return; const days = Math.ceil((due-startOfDay(today))/86400000);
    if (days<0) reminders.push({debt,date:due,status:'Overdue',amount:remaining}); else if (days<=lead) reminders.push({debt,date:due,status:days===0?'Due today':'Due in '+days+'d',amount:remaining});
  });
  return reminders.sort((a,b)=>a.date-b.date);
}
function renderReminders() {
  const reminders=buildReminders(); $('#reminderCount').textContent=reminders.length+' due';
  $('#reminderList').innerHTML = reminders.length ? reminders.slice(0,6).map(r=>`<div class="reminder"><div class="reminder-date"><div><b>${r.date.getDate()}</b><small>${formatDate(r.date,{month:'short'})}</small></div></div><div><strong>${escapeHtml(r.debt.name)}</strong><small>${money(r.amount)} scheduled</small></div><span class="due">${escapeHtml(r.status)}</span></div>`).join('') : emptyState('Nothing due soon','Upcoming scheduled payments will appear here.');
}
function safeDate(year,month,day){const last=new Date(year,month+1,0).getDate();return new Date(year,month,Math.min(day,last));}
function startOfDay(date){return new Date(date.getFullYear(),date.getMonth(),date.getDate());}

function renderGoalProgress() {
  const goals=[...state.goals].sort((a,b)=>progressOfGoal(b)-progressOfGoal(a)).slice(0,5);
  $('#goalProgressList').innerHTML=goals.length?goals.map(g=>{const p=progressOfGoal(g),rem=Math.max(0,n(g.target)-n(g.current));return `<div class="progress-row"><div class="progress-head"><strong>${escapeHtml(g.name)}</strong><span>${money(g.current)} / ${money(g.target)}</span></div><div class="progress-track"><i style="width:${p}%"></i></div><div class="progress-meta"><span>${percent(p)} funded</span><span>${rem?money(rem)+' to go':'Target reached'}</span></div></div>`;}).join(''):emptyState('No budget goals yet','Create a target to start tracking progress.');
}
function progressOfGoal(g){return n(g.target)>0?clamp((n(g.current)/n(g.target))*100,0,100):0;}

function renderActivityChart(){
  const days=[];for(let i=13;i>=0;i--){const date=new Date();date.setDate(date.getDate()-i);const key=isoDate(date);let incoming=0,outgoing=0;state.transactions.filter(t=>t.date===key).forEach(t=>{if(t.type==='income')incoming+=n(t.amount);else outgoing+=n(t.amount)});days.push({date,incoming,outgoing});}
  const max=Math.max(1,...days.flatMap(d=>[d.incoming,d.outgoing]));
  $('#activityChart').innerHTML=days.map(d=>`<div class="chart-day" title="${formatDate(d.date)} — In ${money(d.incoming)}, Out ${money(d.outgoing)}"><div class="chart-bars"><i class="chart-bar in" style="height:${Math.max(d.incoming?3:0,(d.incoming/max)*100)}%"></i><i class="chart-bar out" style="height:${Math.max(d.outgoing?3:0,(d.outgoing/max)*100)}%"></i></div><label>${formatDate(d.date,{day:'numeric'})}</label></div>`).join('');
}
function renderRecentTransactions(){const items=sortedTransactions().slice(0,7);$('#recentTransactions').innerHTML=items.length?items.map(t=>transactionRow(t,false)).join(''):tableEmpty(5,'No transactions logged yet.');}


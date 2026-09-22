function renderTransactionTargets(){const type=$('#transactionType').value,field=$('#transactionTargetField'),select=$('#transactionTarget'),previous=select.value,needs=type==='debt-payment'||type==='goal-contribution';field.classList.toggle('hidden',!needs);if(!needs){select.innerHTML='';return;}const items=type==='debt-payment'?state.debts:state.goals,label=type==='debt-payment'?'Select debt':'Select goal';select.innerHTML=`<option value="">${label}</option>`+items.map(x=>`<option value="${x.id}">${escapeHtml(x.name)}</option>`).join('');if(items.some(x=>x.id===previous))select.value=previous;}
function saveTransaction(event){event.preventDefault();const type=$('#transactionType').value,needs=type==='debt-payment'||type==='goal-contribution',targetId=needs?$('#transactionTarget').value:'',amount=n($('#transactionAmount').value),date=$('#transactionDate').value;if(!amount||amount<=0||!date)return toast('Enter an amount and date.');if(needs&&!targetId)return toast('Select an account for this entry.');if(type==='debt-payment'){const d=state.debts.find(x=>x.id===targetId);if(!d)return toast('Debt account not found.');d.balance=Math.max(0,n(d.balance)-amount);}if(type==='goal-contribution'){const g=state.goals.find(x=>x.id===targetId);if(!g)return toast('Budget goal not found.');g.current=n(g.current)+amount;}state.transactions.unshift({id:uid('tx'),type,targetId,amount,date,description:$('#transactionDescription').value.trim(),createdAt:Date.now()});saveState();const keep=type;$('#transactionForm').reset();$('#transactionType').value=keep;$('#transactionDate').value=isoDate(new Date());renderAll();$('#transactionType').value=keep;renderTransactionTargets();toast('Transaction added.');}
function deleteTransaction(id){const t=state.transactions.find(x=>x.id===id);if(!t||!confirm('Delete this transaction? Linked balances will be adjusted.'))return;if(t.type==='debt-payment'){const d=state.debts.find(x=>x.id===t.targetId);if(d)d.balance=n(d.balance)+n(t.amount);}if(t.type==='goal-contribution'){const g=state.goals.find(x=>x.id===t.targetId);if(g)g.current=Math.max(0,n(g.current)-n(t.amount));}state.transactions=state.transactions.filter(x=>x.id!==id);saveState();renderAll();toast('Transaction deleted.');}
function sortedTransactions(){return [...state.transactions].sort((a,b)=>(b.date||'').localeCompare(a.date||'')||n(b.createdAt)-n(a.createdAt));}
function renderTransactions(){const filter=$('#transactionFilter').value,q=$('#transactionSearch').value.trim().toLowerCase();const items=sortedTransactions().filter(t=>(filter==='all'||t.type===filter)&&(!q||[t.description,transactionTargetName(t),transactionTypeLabel(t.type),t.date].join(' ').toLowerCase().includes(q)));$('#transactionsTable').innerHTML=items.length?items.map(t=>transactionRow(t,true)).join(''):tableEmpty(6,'No matching transactions.');}
function transactionRow(t,actions){const incoming=t.type==='income',sign=incoming?'+':'−',target=transactionTargetName(t)||(t.type==='income'?'Income':t.type==='expense'?'Expense':'Archived account');return `<tr><td>${formatDate(t.date,{month:'short',day:'numeric',year:'2-digit'})}</td><td><span class="type-pill">${escapeHtml(transactionTypeLabel(t.type))}</span></td><td><strong>${escapeHtml(t.description||transactionTypeLabel(t.type))}</strong></td><td>${escapeHtml(target)}</td><td class="numeric ${incoming?'amount-in':'amount-out'}">${sign}${money(t.amount)}</td>${actions?`<td class="numeric"><button class="row-delete" data-action="delete-transaction" data-id="${t.id}">Delete</button></td>`:''}</tr>`;}
function transactionTargetName(t){if(t.type==='debt-payment')return state.debts.find(d=>d.id===t.targetId)?.name||'';if(t.type==='goal-contribution')return state.goals.find(g=>g.id===t.targetId)?.name||'';return '';}
function transactionTypeLabel(type){return {'debt-payment':'Debt payment','goal-contribution':'Goal contribution','income':'Income','expense':'Expense'}[type]||type;}
function tableEmpty(cols,msg){return `<tr><td colspan="${cols}"><div class="empty-state">${escapeHtml(msg)}</div></td></tr>`;}
function emptyState(title,text){return `<div class="empty-state"><strong>${escapeHtml(title)}</strong>${escapeHtml(text)}</div>`;}



function openPaymentModal(preselectedId=''){
  const activeDebts=state.debts.filter(d=>n(d.balance)>0);
  if(!activeDebts.length){toast('Add a debt with a remaining balance before logging a payment.');return;}
  const modal=$('#paymentModal'),select=$('#paymentModalDebt');
  select.innerHTML=activeDebts.map(d=>`<option value="${d.id}">${escapeHtml(d.name)}</option>`).join('');
  if(preselectedId&&activeDebts.some(d=>d.id===preselectedId))select.value=preselectedId;
  $('#paymentModalDate').value=isoDate(new Date());
  $('#paymentModalAmount').value='';
  $('#paymentModalNote').value='';
  updatePaymentModalBalance();
  modal.showModal();
  setTimeout(()=>$('#paymentModalAmount').focus(),50);
}

function closePaymentModal(){
  const modal=$('#paymentModal');
  if(modal.open)modal.close();
  $('#paymentModalForm').reset();
  $('#paymentModalBalance').innerHTML='';
}

function updatePaymentModalBalance(){
  const debt=state.debts.find(d=>d.id===$('#paymentModalDebt').value);
  if(!debt){$('#paymentModalBalance').innerHTML='';return;}
  const cadence=debt.frequency==='daily'?'per day':'per month';
  $('#paymentModalBalance').innerHTML=`<span>Remaining balance</span><strong>${money(debt.balance)}</strong><small>Planned: ${money(debt.scheduledPayment)} ${cadence}</small>`;
}

function savePaymentModal(event){
  event.preventDefault();
  const targetId=$('#paymentModalDebt').value;
  const debt=state.debts.find(d=>d.id===targetId);
  const amount=n($('#paymentModalAmount').value);
  const date=$('#paymentModalDate').value;
  const note=$('#paymentModalNote').value.trim();
  if(!debt)return toast('Select a debt account.');
  if(!amount||amount<=0||!date)return toast('Enter a payment amount and date.');
  if(amount>n(debt.balance)+0.0001)return toast('Payment cannot be larger than the remaining balance.');
  debt.balance=Math.max(0,n(debt.balance)-amount);
  state.transactions.unshift({id:uid('tx'),type:'debt-payment',targetId,amount,date,description:note||'Debt payment',createdAt:Date.now()});
  saveState();
  closePaymentModal();
  renderAll();
  toast('Payment logged.');
}

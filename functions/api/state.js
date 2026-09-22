const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store'
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function getAccessEmail(request) {
  return request.headers.get('cf-access-authenticated-user-email')?.trim().toLowerCase() || '';
}

function validState(value) {
  return value &&
    typeof value === 'object' &&
    Array.isArray(value.goals) &&
    Array.isArray(value.debts) &&
    Array.isArray(value.transactions) &&
    value.settings &&
    typeof value.settings === 'object';
}

function requireEnvironment(request, env) {
  if (!env.LEDGER_DB) return { error: json({ error: 'D1 binding LEDGER_DB is not configured.' }, 503) };
  const email = getAccessEmail(request);
  if (!email) return { error: json({ error: 'Cloudflare Access authentication is required.' }, 401) };
  return { email };
}

export async function onRequestGet({ request, env }) {
  const access = requireEnvironment(request, env);
  if (access.error) return access.error;

  const row = await env.LEDGER_DB
    .prepare('SELECT payload, updated_at FROM user_state WHERE user_email = ?')
    .bind(access.email)
    .first();

  if (!row) return json({ state: null, updatedAt: null });

  try {
    return json({ state: JSON.parse(row.payload), updatedAt: row.updated_at });
  } catch {
    return json({ error: 'Stored state is invalid.' }, 500);
  }
}

export async function onRequestPut({ request, env }) {
  const access = requireEnvironment(request, env);
  if (access.error) return access.error;

  const raw = await request.text();
  if (raw.length > 1_000_000) return json({ error: 'State payload is too large.' }, 413);

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'Invalid JSON.' }, 400);
  }

  if (!validState(body.state)) return json({ error: 'Invalid ledger state.' }, 400);

  const payload = JSON.stringify(body.state);

  await env.LEDGER_DB.prepare(`
    INSERT INTO user_state (user_email, payload, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_email) DO UPDATE SET
      payload = excluded.payload,
      updated_at = CURRENT_TIMESTAMP
  `).bind(access.email, payload).run();

  const row = await env.LEDGER_DB
    .prepare('SELECT updated_at FROM user_state WHERE user_email = ?')
    .bind(access.email)
    .first();

  return json({ ok: true, updatedAt: row?.updated_at || null });
}

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

export async function createUser(payload) {
  const res = await fetch(`${API}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function getUsers() {
  const res = await fetch(`${API}/users`);
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API}/users/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function getToday() {
  const res = await fetch(`${API}/today`);
  return res.json();
}

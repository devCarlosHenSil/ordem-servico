const API_URL = 'http://localhost:5000/api/ordens';

export async function getOrdens() {
  const response = await fetch(API_URL);
  return response.json();
}

export async function criarOrdem(ordem) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ordem)
  });
  return response.json();
}

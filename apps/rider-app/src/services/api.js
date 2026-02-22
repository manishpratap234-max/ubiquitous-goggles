const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function estimateFare(payload) {
  const response = await fetch(`${API_URL}/rides/estimate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer REPLACE_WITH_TOKEN'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error('Failed to estimate fare');
  return response.json();
}

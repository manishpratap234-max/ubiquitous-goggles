const API_URL = process.env.EXPO_PUBLIC_API_URL;
let authToken = null;

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
  };
}

export function setToken(token) {
  authToken = token;
}

async function request(path, options = {}) {
  if (!API_URL) throw new Error('EXPO_PUBLIC_API_URL is not configured');

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers || {}) }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export function sendOtp(phone, name = 'Rider') {
  return request('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, role: 'RIDER', name })
  });
}

export async function verifyOtp(phone, otp) {
  const result = await request('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, otp })
  });
  setToken(result.data.token);
  return result;
}

export function getProfile() {
  return request('/user/profile');
}

export function updateProfile(payload) {
  return request('/user/profile', { method: 'PUT', body: JSON.stringify(payload) });
}

export function estimateFare(payload) {
  return request('/rides/estimate', { method: 'POST', body: JSON.stringify(payload) });
}

export function getNearbyDrivers(lat, lng, serviceType) {
  const params = { lat: String(lat), lng: String(lng) };
  if (serviceType) params.serviceType = serviceType;
  const query = new URLSearchParams(params).toString();
  return request(`/drivers/nearby?${query}`);
}

export function bookRide(payload) {
  return request('/rides/book', { method: 'POST', body: JSON.stringify(payload) });
}

export function getRide(rideId) {
  return request(`/rides/${rideId}`);
}

export function getRideHistory() {
  return request('/rides/history');
}

const API_BASE_URL = 'http://localhost:8080';

async function request(path, options = {}) {
  const token = localStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      // ignore json parse errors
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;

  try {
    return await res.json();
  } catch {
    return null;
  }
}

// Auth APIs
export function login(credentials) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function registerUser(data) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Venues
export function getPublicVenues() {
  return request('/api/venues/public/all');
}

export function getMyVenues() {
  return request('/api/venues/my-venues');
}

export function createVenue(data) {
  return request('/api/venues', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateVenue(id, data) {
  return request(`/api/venues/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteVenue(id) {
  return request(`/api/venues/${id}`, {
    method: 'DELETE',
  });
}

// Bookings
export function createBooking(data) {
  return request('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function confirmBookingPayment(data) {
  return request('/api/bookings/confirm-payment', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getMyBookings() {
  return request('/api/bookings/my-bookings');
}

// Availabilities
export function createAvailability(data) {
  return request('/api/availabilities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getAvailabilitiesForVenue(venueId) {
  return request(`/api/availabilities/venue/${venueId}`);
}

export function getPublicAvailabilitiesForVenue(venueId) {
  return request(`/api/availabilities/public/venue/${venueId}`);
}

export function deleteAvailability(id) {
  return request(`/api/availabilities/${id}`, {
    method: 'DELETE',
  });
}

export default request;


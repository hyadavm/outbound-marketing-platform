const BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('outbound_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  async get(url: string) {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'GET',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API Error');
    return data;
  },

  async post(url: string, body?: any) {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API Error');
    return data;
  },

  async put(url: string, body?: any) {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API Error');
    return data;
  },

  async patch(url: string, body?: any) {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API Error');
    return data;
  },

  async delete(url: string) {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API Error');
    return data;
  }
};

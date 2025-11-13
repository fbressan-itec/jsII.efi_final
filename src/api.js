export const API_URL = "http://localhost:5000"; 

const api = {
  
  async get(path, token = null) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`; 
    
    const res = await fetch(`${API_URL}${path}`, { headers });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({})); 
        const error = new Error(`Error ${res.status}`);
        error.response = { status: res.status, data: errorData };
        throw error;
    }
    
    return res.json();
  },

  async post(path, data, token = null) {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API_URL}${path}`, {
          method: "POST",
          headers,
          body: JSON.stringify(data),
      });
      
      if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const error = new Error(`Error ${res.status}`);
          error.response = { status: res.status, data: errorData };
          throw error;
      }
      return res.json();
  },

};

export default api;
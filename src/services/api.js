import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Crear instancia de axios
const api = axios.create({
    baseURL: API_URL
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Servicios de autenticación
export const authService = {
    login: async (usuario, contrasena) => {
        try {
            const response = await api.post('/auth/login', { usuario, contrasena });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Error en el servidor' };
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Error en el servidor' };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// Servicios de usuarios
export const userService = {
    getAll: async () => {
        try {
            const response = await api.get('/usuarios');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Error en el servidor' };
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Error en el servidor' };
        }
    },

    update: async (id, userData) => {
        try {
            const response = await api.put(`/usuarios/${id}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Error en el servidor' };
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Error en el servidor' };
        }
    }
};

export default api; 
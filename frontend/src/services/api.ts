import axios from 'axios';
import {
    Task,
    CreateTaskRequest,
    UpdateTaskRequest,
    TasksResponse,
    TaskResponse,
    SearchFilters
} from '../types';

// Configurazione base di Axios
const api = axios.create({
    baseURL: 'http://localhost:3001/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor per gestire errori globalmente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = error.response?.data?.error ||
            error.response?.data?.errors?.join(', ') ||
            error.message ||
            'Si è verificato un errore';

        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data
        });
    }
);

export const taskService = {
    // Ottieni tutti i task con paginazione
    async getTasks(filters: SearchFilters = {}): Promise<TasksResponse> {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        );

        const response = await api.get<TasksResponse>('/tasks', {
            params: cleanFilters
        });
        return response.data;
    },

    // Ottieni un singolo task
    async getTask(id: number): Promise<Task> {
        const response = await api.get<TaskResponse>(`/tasks/${id}`);
        return response.data.task;
    },

    // Crea un nuovo task
    async createTask(taskData: CreateTaskRequest): Promise<Task> {
        const response = await api.post<TaskResponse>('/tasks', {
            task: taskData
        });
        return response.data.task;
    },

    // Aggiorna un task esistente
    async updateTask(id: number, taskData: UpdateTaskRequest): Promise<Task> {
        const response = await api.patch<TaskResponse>(`/tasks/${id}`, {
            task: taskData
        });
        return response.data.task;
    },

    // Elimina un task
    async deleteTask(id: number): Promise<void> {
        await api.delete(`/tasks/${id}`);
    },

    // Toggle stato completato
    async toggleComplete(id: number, completed: boolean): Promise<Task> {
        return this.updateTask(id, { completed });
    }
};

// Helper per gestire errori in modo consistente
export const handleApiError = (error: any): string => {
    if (error.message) return error.message;
    if (error.response?.data?.error) return error.response.data.error;
    if (error.response?.data?.errors) return error.response.data.errors.join(', ');
    return 'Si è verificato un errore imprevisto';
};

export default api;

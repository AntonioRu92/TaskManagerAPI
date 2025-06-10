import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { taskService } from '../services/api';
import {
    Task,
    TaskState,
    CreateTaskRequest,
    UpdateTaskRequest,
    SearchFilters,
    TasksResponse
} from '../types';

// Stato iniziale
const initialState: TaskState = {
    tasks: [],
    currentTask: null,
    loading: {
        fetchTasks: 'idle',
        fetchTask: 'idle',
        createTask: 'idle',
        updateTask: 'idle',
        deleteTask: 'idle',
        toggleComplete: 'idle'
    },
    error: null,
    meta: null,
    filters: {
        page: 1,
        per_page: 10
    }
};

// Async thunks
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (filters: SearchFilters = {}) => {
        const response = await taskService.getTasks(filters);
        return response;
    }
);

export const fetchTask = createAsyncThunk(
    'tasks/fetchTask',
    async (id: number) => {
        const response = await taskService.getTask(id);
        return response;
    }
);

export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (taskData: CreateTaskRequest) => {
        const response = await taskService.createTask(taskData);
        return response;
    }
);

export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, ...taskData }: UpdateTaskRequest & { id: number }) => {
        const response = await taskService.updateTask(id, taskData);
        return response;
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (id: number) => {
        await taskService.deleteTask(id);
        return id;
    }
);

export const toggleTaskComplete = createAsyncThunk(
    'tasks/toggleTaskComplete',
    async ({ id, completed }: { id: number; completed: boolean }) => {
        const response = await taskService.toggleComplete(id, completed);
        return response;
    }
);

// Slice
const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentTask: (state, action: PayloadAction<Task>) => {
            state.currentTask = action.payload;
        },
        clearCurrentTask: (state) => {
            state.currentTask = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading.fetchTasks = 'loading';
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<TasksResponse>) => {
                state.loading.fetchTasks = 'idle';
                state.tasks = action.payload.tasks;
                state.meta = action.payload.meta;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading.fetchTasks = 'idle';
                state.error = action.error.message || 'Errore nel caricamento dei task';
            })

            // Fetch single task
            .addCase(fetchTask.pending, (state) => {
                state.loading.fetchTask = 'loading';
                state.error = null;
            })
            .addCase(fetchTask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.loading.fetchTask = 'idle';
                state.currentTask = action.payload;
            })
            .addCase(fetchTask.rejected, (state, action) => {
                state.loading.fetchTask = 'idle';
                state.error = action.error.message || 'Errore nel caricamento del task';
            })

            // Create task
            .addCase(createTask.pending, (state) => {
                state.loading.createTask = 'loading';
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.loading.createTask = 'idle';
                state.tasks.unshift(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading.createTask = 'idle';
                state.error = action.error.message || 'Errore nella creazione del task';
            })

            // Update task
            .addCase(updateTask.pending, (state) => {
                state.loading.updateTask = 'loading';
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.loading.updateTask = 'idle';
                const index = state.tasks.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
                if (state.currentTask?.id === action.payload.id) {
                    state.currentTask = action.payload;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading.updateTask = 'idle';
                state.error = action.error.message || 'Errore nell\'aggiornamento del task';
            })

            // Delete task
            .addCase(deleteTask.pending, (state) => {
                state.loading.deleteTask = 'loading';
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading.deleteTask = 'idle';
                state.tasks = state.tasks.filter(task => task.id !== action.payload);
                if (state.currentTask?.id === action.payload) {
                    state.currentTask = null;
                }
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading.deleteTask = 'idle';
                state.error = action.error.message || 'Errore nell\'eliminazione del task';
            })

            // Toggle task complete
            .addCase(toggleTaskComplete.pending, (state) => {
                state.loading.toggleComplete = 'loading';
                state.error = null;
            })
            .addCase(toggleTaskComplete.fulfilled, (state, action: PayloadAction<Task>) => {
                state.loading.toggleComplete = 'idle';
                const index = state.tasks.findIndex(task => task.id === action.payload.id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
                if (state.currentTask?.id === action.payload.id) {
                    state.currentTask = action.payload;
                }
            })
            .addCase(toggleTaskComplete.rejected, (state, action) => {
                state.loading.toggleComplete = 'idle';
                state.error = action.error.message || 'Errore nel cambio di stato del task';
            });
    }
});

export const { clearError, setCurrentTask, clearCurrentTask } = tasksSlice.actions;
export default tasksSlice.reducer;

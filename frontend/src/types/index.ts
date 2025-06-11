export interface Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
    highlighted_title?: string;
    description_excerpt?: string;
}

export interface CreateTaskRequest {
    title: string;
    description?: string;
    completed?: boolean;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    completed?: boolean;
}

export interface TasksResponse {
    tasks: Task[];
    meta: {
        current_page: number;
        total_pages: number;
        total_count: number;
        per_page: number;
    };
    filters?: {
        search_query?: string;
        completed?: string;
        sort_by?: string;
        sort_direction?: string;
        [key: string]: string | undefined;
    };
}

export interface TaskResponse {
    task: Task;
}

export interface ErrorResponse {
    error?: string;
    errors?: string[];
}

export interface SearchFilters {
    page?: number;
    per_page?: number;
    q?: string;
    completed?: string;
    sort_by?: string;
    sort_direction?: string;
}

export type LoadingState = 'idle' | 'loading';

export interface TaskLoadingStates {
    fetchTasks: LoadingState;
    fetchTask: LoadingState;
    createTask: LoadingState;
    updateTask: LoadingState;
    deleteTask: LoadingState;
    toggleComplete: LoadingState;
}

export interface TaskState {
    tasks: Task[];
    currentTask: Task | null;
    loading: TaskLoadingStates;
    error: string | null;
    meta: TasksResponse['meta'] | null;
    filters: SearchFilters;
}

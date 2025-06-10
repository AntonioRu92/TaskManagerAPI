import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
    fetchTasks,
    deleteTask,
    toggleTaskComplete,
    clearError
} from '../store/tasksSlice';
import TaskCard from '../components/TaskCard';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import { showToast } from '../components/ToastContainer';
import { PlusIcon } from '@heroicons/react/24/outline';

const TaskList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { tasks, loading, error, meta } = useAppSelector(state => state.tasks);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

    const isLoadingTasks = loading.fetchTasks === 'loading';

    useEffect(() => {
        dispatch(fetchTasks({ page: 1, per_page: 10 }));
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            showToast(error, 'error');
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleToggleComplete = async (id: number, completed: boolean) => {
        try {
            await dispatch(toggleTaskComplete({ id, completed })).unwrap();
            showToast(
                completed ? 'Task marked as completed!' : 'Task marked as in progress!',
                'success'
            );
        } catch (error) {
            showToast('Failed to update task', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (showDeleteConfirm === id) {
            try {
                await dispatch(deleteTask(id)).unwrap();
                showToast('Task deleted successfully!', 'success');
                setShowDeleteConfirm(null);
            } catch (error) {
                showToast('Failed to delete task', 'error');
            }
        } else {
            setShowDeleteConfirm(id);
            setTimeout(() => {
                setShowDeleteConfirm(null);
            }, 5000);
        }
    };

    const handlePageChange = (page: number) => {
        dispatch(fetchTasks({ page, per_page: 10 }));
    };

    if (isLoadingTasks && tasks.length === 0) {
        return <Loading size="large" text="Loading tasks..." />;
    }

    const showEmptyState = tasks.length === 0 && !isLoadingTasks;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
                    {meta && (
                        <p className="mt-1 text-sm text-gray-600">
                            {meta.total_count} task{meta.total_count !== 1 ? 's' : ''} total
                        </p>
                    )}
                </div>
                <Link
                    to="/tasks/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New Task
                </Link>
            </div>

            {/* Loading indicator */}
            {isLoadingTasks && tasks.length > 0 && (
                <div className="text-center py-4">
                    <Loading size="small" text="Updating tasks..." />
                </div>
            )}

            {/* Empty state */}
            {showEmptyState && (
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating your first task!</p>
                    <div className="mt-6">
                        <Link
                            to="/tasks/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Create your first task
                        </Link>
                    </div>
                </div>
            )}

            {/* Tasks list */}
            {!showEmptyState && (
                <>
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggleComplete={handleToggleComplete}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {meta && meta.total_pages > 1 && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={meta.current_page}
                                totalPages={meta.total_pages}
                                totalCount={meta.total_count}
                                perPage={meta.per_page}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TaskList;

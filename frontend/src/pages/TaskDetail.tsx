import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import {
    fetchTask,
    deleteTask,
    toggleTaskComplete,
    clearCurrentTask,
    clearError
} from '../store/tasksSlice';
import Loading from '../components/Loading';
import { showToast } from '../components/ToastContainer';
import {
    PencilIcon,
    TrashIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

const TaskDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentTask, loading, error } = useAppSelector(state => state.tasks);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Extract specific loading states
    const isLoadingTask = loading.fetchTask === 'loading';

    useEffect(() => {
        if (id) {
            dispatch(fetchTask(parseInt(id)));
        }

        return () => {
            dispatch(clearCurrentTask());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (error) {
            showToast(error, 'error');
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleToggleComplete = async () => {
        if (currentTask) {
            try {
                await dispatch(toggleTaskComplete({
                    id: currentTask.id,
                    completed: !currentTask.completed
                })).unwrap();
                showToast(
                    !currentTask.completed ? 'Task marked as completed!' : 'Task marked as in progress!',
                    'success'
                );
            } catch (error) {
                showToast('Failed to update task', 'error');
            }
        }
    };

    const handleDelete = async () => {
        if (currentTask) {
            try {
                await dispatch(deleteTask(currentTask.id)).unwrap();
                showToast('Task deleted successfully!', 'success');
                navigate('/tasks');
            } catch (error) {
                showToast('Failed to delete task', 'error');
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoadingTask) {
        return <Loading size="large" text="Loading task details..." />;
    }

    if (!currentTask && !isLoadingTask) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-center py-12">
                    <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Task not found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        The task you're looking for doesn't exist or has been deleted.
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/tasks"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Back to Tasks
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentTask) {
        return null; // This will be handled by the loading state above
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <div className="mb-6">
                <Link
                    to="/tasks"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Back to Tasks
                </Link>
            </div>

            {/* Task Details */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header */}
                <div className={`px-6 py-4 border-l-4 ${currentTask.completed ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'
                    }`}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                            <button
                                onClick={handleToggleComplete}
                                className={`mt-1 transition-colors ${currentTask.completed
                                    ? 'text-green-600 hover:text-green-700'
                                    : 'text-gray-400 hover:text-green-600'
                                    }`}
                            >
                                {currentTask.completed ? (
                                    <CheckCircleIconSolid className="h-8 w-8" />
                                ) : (
                                    <CheckCircleIcon className="h-8 w-8" />
                                )}
                            </button>

                            <div className="flex-1 min-w-0">
                                <h1 className={`text-2xl font-bold ${currentTask.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                                    }`}>
                                    {currentTask.title}
                                </h1>

                                <div className="flex items-center mt-2 space-x-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentTask.completed
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {currentTask.completed ? 'Completed' : 'In Progress'}
                                    </span>

                                    <div className="flex items-center text-sm text-gray-500">
                                        <ClockIcon className="h-4 w-4 mr-1" />
                                        <span>Created {formatDate(currentTask.created_at)}</span>
                                    </div>

                                    {currentTask.updated_at !== currentTask.created_at && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span>• Updated {formatDate(currentTask.updated_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                            <Link
                                to={`/tasks/${currentTask.id}/edit`}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit
                            </Link>

                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    {currentTask.description ? (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                            <div className="prose prose-sm max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {currentTask.description}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 italic">No description provided</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <div>
                            <p>Task ID: #{currentTask.id}</p>
                        </div>
                        <div className="text-right">
                            <p>Created: {formatDate(currentTask.created_at)}</p>
                            {currentTask.updated_at !== currentTask.created_at && (
                                <p>Last updated: {formatDate(currentTask.updated_at)}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-5">Delete Task</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Are you sure you want to delete this task? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex justify-center space-x-4 mt-4">
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-900 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDetail;

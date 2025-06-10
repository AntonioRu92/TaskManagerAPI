import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../types';
import {
    CheckCircleIcon,
    ClockIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

interface TaskCardProps {
    task: Task;
    onToggleComplete: (id: number, completed: boolean) => void;
    onDelete: (id: number) => void;
    showActions?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onToggleComplete,
    onDelete,
    showActions = true
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateText = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 ${task.completed ? 'border-green-500' : 'border-blue-500'
            }`}>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                        <button
                            onClick={() => onToggleComplete(task.id, !task.completed)}
                            className={`mt-1 transition-colors ${task.completed
                                    ? 'text-green-600 hover:text-green-700'
                                    : 'text-gray-400 hover:text-green-600'
                                }`}
                        >
                            {task.completed ? (
                                <CheckCircleIconSolid className="h-6 w-6" />
                            ) : (
                                <CheckCircleIcon className="h-6 w-6" />
                            )}
                        </button>

                        <div className="flex-1 min-w-0">
                            <h3 className={`text-lg font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                                }`}>
                                {task.highlighted_title ? (
                                    <span dangerouslySetInnerHTML={{ __html: task.highlighted_title }} />
                                ) : (
                                    task.title
                                )}
                            </h3>

                            {task.description && (
                                <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    {task.description_excerpt ? (
                                        <span dangerouslySetInnerHTML={{ __html: task.description_excerpt }} />
                                    ) : (
                                        truncateText(task.description)
                                    )}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.completed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                        {task.completed ? 'Completed' : 'In Progress'}
                    </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>Created {formatDate(task.created_at)}</span>
                        {task.updated_at !== task.created_at && (
                            <span className="ml-2">• Updated {formatDate(task.updated_at)}</span>
                        )}
                    </div>

                    {showActions && (
                        <div className="flex items-center space-x-2">
                            <Link
                                to={`/tasks/${task.id}`}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                title="View Details"
                            >
                                <EyeIcon className="h-4 w-4" />
                            </Link>
                            <Link
                                to={`/tasks/${task.id}/edit`}
                                className="text-gray-400 hover:text-yellow-600 transition-colors"
                                title="Edit Task"
                            >
                                <PencilIcon className="h-4 w-4" />
                            </Link>
                            <button
                                onClick={() => onDelete(task.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete Task"
                            >
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;

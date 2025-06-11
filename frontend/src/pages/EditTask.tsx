import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchTask, updateTask, clearCurrentTask, clearError } from '../store/tasksSlice';
import Loading from '../components/Loading';
import { showToast } from '../components/ToastContainer';
import { ArrowLeftIcon, PencilIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const EditTask: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentTask, loading, error } = useAppSelector(state => state.tasks);

    // Extract specific loading states
    const isLoadingTask = loading.fetchTask === 'loading';
    const isUpdating = loading.updateTask === 'loading';

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        completed: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchTask(parseInt(id)));
        }

        return () => {
            dispatch(clearCurrentTask());
        };
    }, [id, dispatch]);

    useEffect(() => {
        if (currentTask && !isInitialized) {
            setFormData({
                title: currentTask.title,
                description: currentTask.description || '',
                completed: currentTask.completed
            });
            setIsInitialized(true);
        }
    }, [currentTask, isInitialized]);

    useEffect(() => {
        if (error) {
            showToast(error, 'error');
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Il titolo è obbligatorio';
        } else if (formData.title.trim().length < 3) {
            newErrors.title = 'Il titolo deve essere lungo almeno 3 caratteri';
        } else if (formData.title.trim().length > 200) {
            newErrors.title = 'Il titolo deve essere inferiore a 200 caratteri';
        }

        if (formData.description && formData.description.length > 1000) {
            newErrors.description = 'La descrizione deve essere inferiore a 1000 caratteri';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !currentTask) {
            return;
        }

        try {
            const taskData = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                completed: formData.completed
            };

            await dispatch(updateTask({ id: currentTask.id, data: taskData })).unwrap();
            showToast('Task aggiornato con successo!', 'success');
            navigate(`/tasks/${currentTask.id}`);
        } catch (error) {
            showToast('Errore nell\'aggiornamento del task', 'error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const hasChanges = () => {
        if (!currentTask) return false;

        return (
            formData.title !== currentTask.title ||
            formData.description !== (currentTask.description || '') ||
            formData.completed !== currentTask.completed
        );
    };

    if (isLoadingTask && !currentTask) {
        return <Loading size="large" text="Caricamento task..." />;
    }

    if (!currentTask && !isLoadingTask) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="text-center py-12">
                    <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Task non trovato</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Il task che stai cercando di modificare non esiste o è stato eliminato.
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/tasks"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Torna ai Task
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
        <div className="max-w-2xl mx-auto">
            {/* Navigation */}
            <div className="mb-6">
                <nav className="flex items-center space-x-2 text-sm">
                    <Link
                        to="/tasks"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Task
                    </Link>
                    <span className="text-gray-400">/</span>
                    <Link
                        to={`/tasks/${currentTask.id}`}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        #{currentTask.id}
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-900 font-medium">Modifica</span>
                </nav>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Modifica Task</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Apporta modifiche ai dettagli del tuo task qui sotto.
                </p>
            </div>

            {/* Form */}
            <div className="bg-white shadow-lg rounded-lg">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Titolo <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                                    }`}
                                placeholder="Inserisci il titolo del task..."
                                maxLength={200}
                            />
                            {errors.title && (
                                <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                {formData.title.length}/200 caratteri
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Descrizione
                        </label>
                        <div className="mt-1">
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
                                    }`}
                                placeholder="Inserisci la descrizione del task (opzionale)..."
                                maxLength={1000}
                            />
                            {errors.description && (
                                <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                {formData.description.length}/1000 caratteri
                            </p>
                        </div>
                    </div>

                    {/* Completed Status */}
                    <div className="flex items-center">
                        <input
                            id="completed"
                            name="completed"
                            type="checkbox"
                            checked={formData.completed}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="completed" className="ml-2 block text-sm text-gray-900">
                            Segna come completato
                        </label>
                    </div>

                    {/* Change Indicator */}
                    {hasChanges() && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Hai modifiche non salvate. Non dimenticare di salvare i tuoi aggiornamenti!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Link
                            to={`/tasks/${currentTask.id}`}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Annulla
                        </Link>
                        <button
                            type="submit"
                            disabled={isUpdating || !hasChanges()}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Salvataggio...
                                </>
                            ) : (
                                <>
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    Salva Modifiche
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Task Info */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <div>
                        <p>Task ID: #{currentTask.id}</p>
                    </div>
                    <div className="text-right">
                        <p>Creato: {new Date(currentTask.created_at).toLocaleDateString('it-IT')}</p>
                        <p>Ultimo aggiornamento: {new Date(currentTask.updated_at).toLocaleDateString('it-IT')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTask;

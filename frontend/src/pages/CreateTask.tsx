import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createTask, clearError } from '../store/tasksSlice';
import { showToast } from '../components/ToastContainer';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';

const CreateTask: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector(state => state.tasks);

    // Extract specific loading state for create operation
    const isCreating = loading.createTask === 'loading';

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        completed: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

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

        if (!validateForm()) {
            return;
        }

        try {
            const taskData = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                completed: formData.completed
            };

            const result = await dispatch(createTask(taskData)).unwrap();
            showToast('Task creato con successo!', 'success');
            navigate(`/tasks/${result.id}`);
        } catch (error) {
            showToast('Errore nella creazione del task', 'error');
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

    return (
        <div className="max-w-2xl mx-auto">
            {/* Navigation */}
            <div className="mb-6">
                <Link
                    to="/tasks"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Torna ai Task
                </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Crea Nuovo Task</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Aggiungi un nuovo task alla tua lista per tenere traccia del tuo lavoro.
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

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <Link
                            to="/tasks"
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Annulla
                        </Link>
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creazione...
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    Crea Task
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Help Text */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                            Suggerimenti per creare task efficaci
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Usa titoli chiari e specifici che descrivono cosa deve essere fatto</li>
                                <li>Aggiungi descrizioni dettagliate per fornire contesto e requisiti</li>
                                <li>Suddividi task grandi in sottoattività più piccole e gestibili</li>
                                <li>Usa convenzioni di denominazione coerenti per tipi simili di task</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTask;

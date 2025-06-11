import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface SearchFilters {
    q?: string;
    completed?: string;
    sort_by?: string;
    sort_direction?: string;
    page?: number;
    per_page?: number;
}

interface TaskSearchProps {
    onFiltersChange: (filters: SearchFilters) => void;
    initialFilters?: SearchFilters;
    isLoading?: boolean;
}

const TaskSearch: React.FC<TaskSearchProps> = ({
    onFiltersChange,
    initialFilters = {},
    isLoading = false
}) => {
    const [filters, setFilters] = useState<SearchFilters>(initialFilters);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (searchDebounce) {
            clearTimeout(searchDebounce);
        }

        const timeout = setTimeout(() => {
            onFiltersChange(filters);
        }, 300);

        setSearchDebounce(timeout);

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [filters]);

    const handleSearchChange = (value: string) => {
        setFilters(prev => ({
            ...prev,
            q: value || undefined,
            page: 1 // Reset alla prima pagina quando si cerca
        }));
    };

    const handleFilterChange = (key: keyof SearchFilters, value: string | number | undefined) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset alla prima pagina quando si filtra
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            page: 1,
            per_page: filters.per_page || 10
        });
        setShowAdvancedFilters(false);
    };

    const hasActiveFilters = () => {
        return !!(filters.q || filters.completed ||
            (filters.sort_by && filters.sort_by !== 'created_at') ||
            (filters.sort_direction && filters.sort_direction !== 'desc'));
    };

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 mb-6">
            {/* Barra di ricerca principale */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Cerca task per titolo o descrizione..."
                        value={filters.q || ''}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        disabled={isLoading}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${showAdvancedFilters || hasActiveFilters()
                                ? 'border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100'
                                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                        disabled={isLoading}
                    >
                        <FunnelIcon className="h-4 w-4 mr-1" />
                        Filtri
                        {hasActiveFilters() && (
                            <span className="ml-1 bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-0.5">
                                attivi
                            </span>
                        )}
                    </button>

                    {hasActiveFilters() && (
                        <button
                            onClick={clearAllFilters}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={isLoading}
                        >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Rimuovi filtri
                        </button>
                    )}
                </div>
            </div>

            {/* Filtri avanzati */}
            {showAdvancedFilters && (
                <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Filtro stato */}
                        <div>
                            <label htmlFor="completed-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Stato
                            </label>
                            <select
                                id="completed-filter"
                                value={filters.completed || ''}
                                onChange={(e) => handleFilterChange('completed', e.target.value || undefined)}
                                disabled={isLoading}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                            >
                                <option value="">Tutti i task</option>
                                <option value="false">Da completare</option>
                                <option value="true">Completati</option>
                            </select>
                        </div>

                        {/* Ordinamento */}
                        <div>
                            <label htmlFor="sort-by-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Ordina per
                            </label>
                            <select
                                id="sort-by-filter"
                                value={filters.sort_by || 'created_at'}
                                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                                disabled={isLoading}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                            >
                                <option value="created_at">Data creazione</option>
                                <option value="updated_at">Ultima modifica</option>
                                <option value="title">Titolo</option>
                            </select>
                        </div>

                        {/* Direzione ordinamento */}
                        <div>
                            <label htmlFor="sort-direction-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Direzione
                            </label>
                            <select
                                id="sort-direction-filter"
                                value={filters.sort_direction || 'desc'}
                                onChange={(e) => handleFilterChange('sort_direction', e.target.value)}
                                disabled={isLoading}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                            >
                                <option value="desc">Decrescente</option>
                                <option value="asc">Crescente</option>
                            </select>
                        </div>

                        {/* Task per pagina */}
                        <div>
                            <label htmlFor="per-page-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Task per pagina
                            </label>
                            <select
                                id="per-page-filter"
                                value={filters.per_page || 10}
                                onChange={(e) => handleFilterChange('per_page', parseInt(e.target.value))}
                                disabled={isLoading}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>

                    {/* Riepilogo filtri attivi */}
                    {hasActiveFilters() && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                            <div className="text-sm text-blue-800">
                                <span className="font-medium">Filtri attivi:</span>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {filters.q && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                            Ricerca: "{filters.q}"
                                        </span>
                                    )}
                                    {filters.completed && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                            Stato: {filters.completed === 'true' ? 'Completati' : 'Da completare'}
                                        </span>
                                    )}
                                    {filters.sort_by && filters.sort_by !== 'created_at' && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                            Ordinamento: {
                                                filters.sort_by === 'title' ? 'Titolo' :
                                                    filters.sort_by === 'updated_at' ? 'Ultima modifica' :
                                                        'Data creazione'
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskSearch;

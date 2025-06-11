import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, ListBulletIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-white shadow-lg border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <ListBulletIcon className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">Task Manager</span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/tasks"
                            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            All Tasks
                        </Link>
                        <Link
                            to="/tasks/new"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors"
                        >
                            <PlusIcon className="h-4 w-4" />
                            <span>Nuovo Task</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

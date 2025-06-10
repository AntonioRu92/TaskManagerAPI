import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Navbar from './components/Navbar';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import { ToastContainer } from './components/ToastContainer';

function App() {
    return (
        <Provider store={store}>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <Routes>
                            <Route path="/" element={<TaskList />} />
                            <Route path="/tasks" element={<TaskList />} />
                            <Route path="/tasks/new" element={<CreateTask />} />
                            <Route path="/tasks/:id" element={<TaskDetail />} />
                            <Route path="/tasks/:id/edit" element={<EditTask />} />
                        </Routes>
                    </main>
                    <ToastContainer />
                </div>
            </Router>
        </Provider>
    );
}

export default App;

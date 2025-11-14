
import React, { useState, useEffect, useCallback } from 'react';
import { Task, User, UserRole, TaskStatus } from './types';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import TaskModal from './components/TaskModal';
import DeleteModal from './components/DeleteModal';
import { initialTasks, mockUser, mockAdmin } from './constants';

const App: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [sortMethod, setSortMethod] = useState<'createdAt' | 'priority'>('createdAt');

    const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
    
    useEffect(() => {
        // Simulate fetching user and tasks
        setTimeout(() => {
            setUser(mockAdmin); // Start as admin by default
            setTasks(initialTasks);
            setLoading(false);
        }, 500);
    }, []);

    const handleRoleChange = (newRole: UserRole) => {
        setUser(newRole === 'admin' ? mockAdmin : mockUser);
    };
    
    const handleLogout = () => {
        setLoading(true);
        setUser(null);
        // In a real app, you would redirect to a login page
        setTimeout(() => {
            alert("Você foi desconectado. Atualize a página para simular o login novamente.");
        }, 300);
    };

    const openAddTaskModal = useCallback(() => {
        setTaskToEdit(null);
        setIsTaskModalOpen(true);
    }, []);

    const openEditTaskModal = useCallback((task: Task) => {
        if (user?.role !== 'admin') return;
        setTaskToEdit(task);
        setIsTaskModalOpen(true);
    }, [user]);

    const closeTaskModal = useCallback(() => {
        setIsTaskModalOpen(false);
        setTaskToEdit(null);
    }, []);
    
    const openDeleteModal = useCallback((taskId: string) => {
        if (user?.role !== 'admin') return;
        setTaskToDeleteId(taskId);
        setIsDeleteModalOpen(true);
    }, [user]);

    const closeDeleteModal = useCallback(() => {
        setIsDeleteModalOpen(false);
        setTaskToDeleteId(null);
    }, []);
    
    const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'createdBy' | 'column'> & { id?: string }) => {
        if (taskData.id) { // Editing existing task
            setTasks(prevTasks => prevTasks.map(t => t.id === taskData.id ? { ...t, ...taskData } : t));
        } else { // Adding new task
            const newTask: Task = {
                ...taskData,
                id: `task-${Date.now()}`,
                createdAt: Date.now(),
                createdBy: user!.uid,
                column: 'col-pendente',
                priority: user?.role === 'admin' ? taskData.priority : '2',
            };
            setTasks(prevTasks => [newTask, ...prevTasks]);
        }
        closeTaskModal();
    };

    const handleDeleteTask = () => {
        if (!taskToDeleteId) return;
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskToDeleteId));
        closeDeleteModal();
    };

    const handleTaskColumnChange = useCallback((taskId: string, newColumn: TaskStatus) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, column: newColumn } : task
            )
        );
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-green-900 text-white">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-xl">A conectar...</p>
                </div>
            </div>
        );
    }

    if (!user) {
         return (
             <div className="flex items-center justify-center h-screen bg-gray-100">
                <p>Simulação de logout. Por favor, atualize a página.</p>
             </div>
        );
    }

    const visibleTasks = user.role === 'admin' 
        ? tasks 
        : tasks.filter(task => task.createdBy === user.uid);

    return (
        <div className="flex flex-col h-screen">
            <Header
                user={user}
                onLogout={handleLogout}
                onAddTask={openAddTaskModal}
                sortMethod={sortMethod}
                onSortChange={setSortMethod}
                onRoleChange={handleRoleChange}
            />
            <main className="flex-grow">
                 <KanbanBoard 
                    tasks={visibleTasks}
                    userRole={user.role}
                    sortMethod={sortMethod}
                    onEditTask={openEditTaskModal}
                    onDeleteTask={openDeleteModal}
                    onColumnChange={handleTaskColumnChange}
                 />
            </main>
            {isTaskModalOpen && (
                <TaskModal
                    isOpen={isTaskModalOpen}
                    onClose={closeTaskModal}
                    onSave={handleSaveTask}
                    taskToEdit={taskToEdit}
                    userRole={user.role}
                />
            )}
            {isDeleteModalOpen && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDeleteTask}
                />
            )}
        </div>
    );
};

export default App;

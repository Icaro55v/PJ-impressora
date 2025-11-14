import React, { useState, useEffect, useCallback } from 'react';
import { Task, User, Priority, TaskStatus } from './types';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import TaskModal from './components/TaskModal';
import DeleteModal from './components/DeleteModal';
import { auth, db, appId } from './firebase';

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
        const unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                const userRef = db.ref(`/artifacts/${appId}/users/${firebaseUser.uid}`);
                const snapshot = await userRef.once('value');
                const dbUser = snapshot.val();

                const currentUser: User = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    name: firebaseUser.email?.split('@')[0] || 'Utilizador',
                    role: dbUser?.role || 'user',
                };
                setUser(currentUser);

                const tasksRef = db.ref(`/artifacts/${appId}/public/data/allPrintJobs`);
                tasksRef.on('value', (snapshot) => {
                    const tasksData = snapshot.val();
                    const tasksList: Task[] = [];
                    if (tasksData) {
                        for (const id in tasksData) {
                            tasksList.push({ id, ...tasksData[id] });
                        }
                    }
                    setTasks(tasksList);
                    setLoading(false);
                }, (error) => {
                    console.error("Firebase read failed:", error);
                    alert("Não foi possível carregar os pedidos.");
                    setLoading(false);
                });

            } else {
                window.location.href = 'login.html';
            }
        });

        return () => {
            unsubscribeAuth();
            const tasksRef = db.ref(`/artifacts/${appId}/public/data/allPrintJobs`);
            tasksRef.off();
        };
    }, []);
    
    const handleLogout = () => {
        auth.signOut();
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
        const tasksRef = db.ref(`/artifacts/${appId}/public/data/allPrintJobs`);
        
        if (taskData.id) { // Editing existing task
            const { id, ...dataToUpdate } = taskData;
            tasksRef.child(id).update(dataToUpdate);
        } else { // Adding new task
            const newTaskData = {
                ...taskData,
                createdAt: window.firebase.database.ServerValue.TIMESTAMP,
                createdBy: user!.uid,
                column: 'col-pendente' as TaskStatus,
                priority: user?.role === 'admin' ? taskData.priority : '2' as Priority,
            };
            tasksRef.push(newTaskData);
        }
        closeTaskModal();
    };

    const handleDeleteTask = () => {
        if (!taskToDeleteId) return;
        db.ref(`/artifacts/${appId}/public/data/allPrintJobs/${taskToDeleteId}`).remove();
        closeDeleteModal();
    };

    const handleTaskColumnChange = useCallback((taskId: string, newColumn: TaskStatus) => {
        db.ref(`/artifacts/${appId}/public/data/allPrintJobs/${taskId}/column`).set(newColumn);
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
         return null; // Should be redirected by useEffect
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
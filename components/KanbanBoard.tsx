
import React from 'react';
import { Task, UserRole, TaskStatus } from '../types';
import KanbanColumn from './KanbanColumn';
import { COLUMNS } from '../constants';

interface KanbanBoardProps {
    tasks: Task[];
    userRole: UserRole;
    sortMethod: 'createdAt' | 'priority';
    onEditTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
    onColumnChange: (taskId: string, newColumn: TaskStatus) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, userRole, sortMethod, onEditTask, onDeleteTask, onColumnChange }) => {

    const sortedTasks = [...tasks].sort((a, b) => {
        if (sortMethod === 'priority') {
            return parseInt(a.priority) - parseInt(b.priority);
        }
        return b.createdAt - a.createdAt;
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {COLUMNS.map(column => (
                <KanbanColumn
                    key={column.id}
                    column={column}
                    tasks={sortedTasks.filter(task => task.column === column.id)}
                    userRole={userRole}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onColumnChange={onColumnChange}
                />
            ))}
        </div>
    );
};

export default KanbanBoard;


import React from 'react';
import { Task, UserRole } from '../types';
import { PRIORITY_MAP } from '../constants';

interface TaskCardProps {
    task: Task;
    userRole: UserRole;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, userRole, onEdit, onDelete }) => {
    const priorityInfo = PRIORITY_MAP[task.priority] || { text: 'N/A', bg: 'bg-gray-500', border: 'border-gray-400' };
    const pieceDisplayName = task.pieceSelect === 'Outra' ? (task.pieceOther || 'Outra') : task.pieceSelect;
    const isAdmin = userRole === 'admin';
    const cursorClass = isAdmin ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200' : 'cursor-default';

    const handleCardClick = () => {
        if (isAdmin) {
            onEdit(task);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(task.id);
    };

    return (
        <div
            data-task-id={task.id}
            className={`task-card bg-white p-4 rounded-lg shadow-md border-l-4 ${priorityInfo.border} ${cursorClass} group relative`}
            onClick={handleCardClick}
        >
            {isAdmin && (
                <button
                    onClick={handleDeleteClick}
                    className="delete-task-btn absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Excluir Pedido"
                >
                    ✕
                </button>
            )}

            <p className="text-base font-semibold text-gray-800 pr-4">{pieceDisplayName || 'Sem Título'}</p>
            <p className="text-sm text-gray-600 mt-1">{task.requesterName || 'Sem Solicitante'}</p>
            <p className="text-xs text-gray-500 font-medium uppercase mt-1" title="Área">{task.area || 'Sem Área'}</p>

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityInfo.bg} text-white`}>
                    {priorityInfo.text}
                </span>
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-700">{task.material || 'N/A'}</span>
                    <span
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: task.color || '#CCC' }}
                    ></span>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;

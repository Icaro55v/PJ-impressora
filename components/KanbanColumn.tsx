import React from 'react';
import { Task, UserRole, TaskStatus } from '../types';
import TaskCard from './TaskCard';
// FIX: Use a default import and destructure the component to avoid SyntaxError.
import SortableJS from 'react-sortablejs';
const { ReactSortable } = SortableJS;


interface KanbanColumnProps {
    column: { id: TaskStatus; title: string; color: string };
    tasks: Task[];
    userRole: UserRole;
    onEditTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
    onColumnChange: (taskId: string, newColumn: TaskStatus) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, tasks, userRole, onEditTask, onDeleteTask, onColumnChange }) => {
    
    const onDrop = (evt: any) => {
        const taskId = evt.item.dataset.taskId;
        if(taskId) {
            onColumnChange(taskId, column.id);
        }
    };
    
    // SortableJS requires a state setter, but we handle state update via onColumnChange.
    // We provide a dummy setter and manage the list immutably.
    const setTaskList = () => {};

    return (
        <div className="kanban-column bg-white rounded-xl shadow-lg flex flex-col">
            <div className={`p-4 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-xl sticky top-[124px] z-10`}>
                <div className="flex items-center space-x-3">
                    <span className={`w-3 h-3 bg-${column.color}-500 rounded-full`}></span>
                    <h3 className={`font-semibold text-${column.color}-600 uppercase text-sm`}>{column.title}</h3>
                </div>
                <span className="px-2.5 py-0.5 bg-gray-200 text-gray-700 rounded-full font-semibold text-xs">
                    {tasks.length}
                </span>
            </div>
            <ReactSortable
                list={tasks}
                setList={setTaskList}
                group="kanban"
                animation={150}
                ghostClass="sortable-ghost"
                chosenClass="sortable-chosen"
                onAdd={onDrop}
                disabled={userRole !== 'admin'}
                className="p-4 space-y-4 kanban-column-body flex-grow min-h-[200px]"
                tag="div"
            >
                 {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        userRole={userRole}
                        onEdit={onEditTask}
                        onDelete={onDeleteTask}
                    />
                ))}
            </ReactSortable>
        </div>
    );
};

export default KanbanColumn;
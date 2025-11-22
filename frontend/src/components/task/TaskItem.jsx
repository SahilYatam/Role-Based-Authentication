import { Check, Edit2, Trash2 } from "lucide-react";

const TaskItem = ({ task, userRole, onToggleComplete, onEdit, onDelete }) => {
    const canEdit = userRole === 'admin' || userRole === 'editor';
    const canDelete = userRole === 'admin';

    return (
        <div
            className={`p-4 rounded-lg border transition-all ${task.completed
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-white/5 border-white/10 hover:border-purple-500/30'
                }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    <button
                        onClick={() => onToggleComplete(task.id)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all mt-1 shrink-0 ${task.completed
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-400 hover:border-purple-500'
                            }`}
                    >
                        {task.completed && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <div className="flex-1">
                        <p className={`font-semibold text-lg ${task.completed ? 'text-gray-400 line-through' : 'text-white'
                            }`}>
                            {task.title}
                        </p>
                        <p className={`text-sm mt-1 ${task.completed ? 'text-gray-500' : 'text-gray-300'
                            }`}>
                            {task.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Created by: {task.createdBy}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {canEdit && (
                        <button
                            onClick={() => onEdit(task)}
                            className="p-2 text-orange-400 hover:bg-orange-500/10 rounded-lg transition-all"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    )}
                    {canDelete && (
                        <button
                            onClick={() => onDelete(task.id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskItem
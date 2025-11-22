import { Clock } from "lucide-react";
import TaskItem from "./TaskItem.jsx";

const TaskList = ({ tasks, userRole, onToggleComplete, onEdit, onDelete }) => {
    const activeTasks = tasks.filter(t => !t.completed).length;

    if (tasks.length === 0) {
        return (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Tasks</h2>
                <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">
                        No tasks yet. {userRole === 'admin' ? 'Create your first task!' : 'Check back later.'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
                Tasks ({activeTasks} active)
            </h2>
            <div className="space-y-3">
                {tasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        userRole={userRole}
                        onToggleComplete={onToggleComplete}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default TaskList
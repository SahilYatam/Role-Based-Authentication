import { Edit2 } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button.jsx";

const EditTaskModal = ({ task, onUpdate, onClose }) => {
    const [editedTask, setEditedTask] = useState(task);

    const handleSave = () => {
        onUpdate(editedTask);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-white/10 rounded-xl p-6 max-w-2xl w-full">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Edit2 className="w-5 h-5" />
                    Edit Task
                </h2>
                <div className="space-y-3">
                    <input
                        type="text"
                        value={editedTask.taskName}
                        onChange={(e) => setEditedTask({ ...editedTask, taskName: e.target.value })}
                        placeholder="Task title..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <textarea
                        value={editedTask.taskDescription}
                        onChange={(e) => setEditedTask({ ...editedTask, taskDescription: e.target.value })}
                        placeholder="Task description..."
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                    <div className="flex gap-3">
                        <Button
                            onClick={handleSave}
                            className="flex-1 px-6 py-3 bg-linear-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all"
                        >
                            Save Changes
                        </Button>
                        <Button
                            onClick={onClose}
                            className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal
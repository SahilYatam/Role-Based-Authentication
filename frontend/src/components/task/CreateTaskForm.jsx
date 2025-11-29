import { Plus } from "lucide-react";
import Button from "../ui/Button.jsx";

const CreateTaskForm = ({ newTask, setNewTask, onCreateTask }) => {
  return (
    <div className="mb-8 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Create New Task
      </h2>
      <div className="space-y-3">
        <input
          type="text"
          value={newTask.taskName}
          onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
          placeholder="Task title..."
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <textarea
          value={newTask.taskDescription}
          onChange={(e) => setNewTask({ ...newTask, taskDescription: e.target.value })}
          placeholder="Task description..."
          rows={3}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
        <Button
          onClick={onCreateTask}
          className="px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </Button>
      </div>
    </div>
  );
};

export default CreateTaskForm
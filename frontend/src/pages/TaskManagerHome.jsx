import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Header from "../layouts/Header.jsx";
import CreateTaskForm from "../components/task/CreateTaskForm.jsx";
import TaskList from "../components/task/TaskList.jsx";
import EditTaskModal from "../components/task/EditTaskModal.jsx";
import RoleRequestDropdown from "../components/task/RoleRequestDropdown.jsx";
import RoleInfoCard from "../components/task/RoleInfoCard.jsx";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import {
    addTask,
    updateTask,
    deleteTask,
    getAllTask,
    markTaskAsCompleted,
} from "../features/task/taskThunks.js";
import { applyRoleRequest } from "../features/roleRequest/roleRequestThunks.js";

import { logoutUser } from "../features/auth/authThunks.js";

export default function TaskManagerHome() {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { user } = useSelector((state) => state.auth || {});

    const userRole = user?.role?.key;

    // Task state from redux
    const { task: tasks = [], loading, error } = useSelector((state) => state.task || {});

    const [newTask, setNewTask] = useState({ taskName: "", taskDescription: "" });
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        dispatch(getAllTask());

        const pollInterval = setInterval(() => {
            dispatch(getAllTask());
        }, 5000);

        return () => clearInterval(pollInterval);
    }, [dispatch]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleCreateTask = () => {
        if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") return;
        if (!newTask.taskName.trim()) return;

        dispatch(addTask({
            taskName: newTask.taskName,
            taskDescription: newTask.taskDescription
        }));

        setNewTask({ taskName: "", taskDescription: "" });
    }

    const handleUpdateTask = (updatedTask) => {
        if (userRole === "ADMIN" || userRole === "SUPER_ADMIN" || userRole === "EDITOR") {
            dispatch(updateTask({
                id: updatedTask._id,
                taskName: updatedTask.taskName,
                taskDescription: updatedTask.taskDescription
            }));

            setEditingTask(null);
        }
    };

    const handleToggleComplete = (taskId) => {
        dispatch(markTaskAsCompleted(taskId));
    }

    const handleDeleteTask = (taskId) => {
        if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
            dispatch(deleteTask(taskId));
        }
    };

    const handleRequestRole = (requestedRole) => {
        dispatch(applyRoleRequest(requestedRole));
    };

    const handleLogout = () => {
        dispatch(logoutUser())
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
            <Header user={user} />

            {/* Logout Button - Top Right */}
            <div className="max-w-6xl mx-auto px-6 pt-4">
                <div className="flex justify-end">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-lg"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>


            <main className="max-w-6xl mx-auto px-6 py-4">
                {userRole === "MEMBER" && (
                    <RoleRequestDropdown onRequestRole={handleRequestRole} />
                )}

                {(userRole === "ADMIN" || userRole === "SUPER_ADMIN") && (
                    <CreateTaskForm
                        newTask={newTask}
                        setNewTask={setNewTask}
                        onCreateTask={handleCreateTask}
                        loading={loading}
                    />
                )}

                {editingTask && (
                    <EditTaskModal
                        task={editingTask}
                        onUpdate={handleUpdateTask}
                        onClose={() => setEditingTask(null)}
                    />
                )}

                {error && (
                    <div className="text-red-400 text-sm mb-4">
                        {error}
                    </div>
                )}

                <TaskList
                    tasks={tasks}
                    userRole={userRole}
                    onToggleComplete={handleToggleComplete}
                    onEdit={setEditingTask}
                    onDelete={handleDeleteTask}
                />

                <RoleInfoCard role={userRole} />
            </main>
        </div>
    );
}
import SignupPage from "./pages/SignupPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import ForgetPasswordPage from "./pages/ForgetPasswordPage.jsx"
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx"
import TaskManagerHome from "./pages/TaskManagerHome.jsx"
import AdminDashbord from "./pages/AdminDashboard.jsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute.jsx"

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <TaskManagerHome/>
            </ProtectedRoute>
        )
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <AdminDashbord/>
            </ProtectedRoute>
        )
    },
    {
        path: "/signup",
        element: <SignupPage/>
    },
    {
        path: "/login",
        element: <LoginPage/>
    },
    {
        path: "/forget-password",
        element: <ForgetPasswordPage/>
    },
    {
        path: "/reset-password/:token",
        element: <ResetPasswordPage/>,
        errorElement: <div>Error loading reset password page</div>  
    },
])



function App() {

  return (
    <>
      <RouterProvider router={router}/>  
    </>
  )
}

export default App

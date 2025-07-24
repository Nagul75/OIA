import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

const Router = [
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/",
        element: <Dashboard />
    }
]

export default Router
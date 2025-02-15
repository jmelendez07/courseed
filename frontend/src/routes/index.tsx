import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Page404 from "@/pages/404";
import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Logout from "@/pages/auth/Logout";
import Courses from "@/pages/Courses";
import Course from "@/pages/Course";
import Profile from "@/pages/auth/Profile";
import DashboardAdmin from "@/pages/auth/admin/Dashboard";
import Users from "@/pages/auth/admin/users/Users";
import CoursesAdmin from "@/pages/auth/admin/courses/Courses";
import ReviewsAdmin from "@/pages/auth/admin/Reviews";
import DashboardUser from "@/pages/auth/user/Dashboard";
import Likes from "@/pages/auth/user/Likes";
import ReviewsUser from "@/pages/auth/user/Reviews";
import ProtectedAuthRoute from "./ProtectedAuthRoute";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import ProtectedUserRoute from "./ProtectedUserRoute";
import CreateCourse from "@/pages/auth/admin/courses/CreateCourse";

function Routes() {

    const routesForNotAuthenticated = [
        {
            path: '',
            element: <Landing/>
        },
        {
            path: '/acceso',
            element: <Login/>
        },
        {
            path: '/registro',
            element: <Register/>
        },
        {
            path: '/cursos',
            element: <Courses />
        },
        {
            path: '/curso/:id',
            element: <Course />
        }
    ];

    const routesForAuthenticated = [
        {
            path: '/',
            element: <ProtectedAuthRoute />,
            children: [
                {
                    path: '/salir',
                    element: <Logout />
                },
                {
                    path: '/perfil',
                    element: <Profile />
                }
            ]
        }
    ]

    const routesForAdmin = [
        {
            path: '/administrador',
            // element: <ProtectedAdminRoute />,
            children: [
                {
                    path: '',
                    element: <DashboardAdmin />
                },
                {
                    path: 'usuarios',
                    element: <Users />
                },
                {
                    path: 'cursos',
                    element: <CoursesAdmin />
                },
                {
                    path: 'reseñas',
                    element: <ReviewsAdmin />
                },
                {
                    path: 'cursos/nuevo',
                    element: <CreateCourse />
                }
            ]
        }
    ]

    const routesForUser = [
        {
            path: '/usuario',
            element: <ProtectedUserRoute />,
            children: [
                {
                    path: '',
                    element: <DashboardUser />
                },
                {
                    path: 'likes',
                    element: <Likes />
                },
                {
                    path: 'reseñas',
                    element: <ReviewsUser />
                },
            ]
        }
    ]

    const router = createBrowserRouter([
        {
            path: '/',
            errorElement: <Page404/>,
            children: [
                ...routesForNotAuthenticated,
                ...routesForAuthenticated,
                ...routesForAdmin,
                ...routesForUser
            ]
        }
    ]);

    return <RouterProvider router={router}/>
}

export default Routes;
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';

import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Board from './pages/Board/Board';
import NotFound from './pages/NotFound/NotFound';
import InternalError from './pages/InternalError/InternalError';
import AppLayout from './layouts/AppLayout';
import { userStore } from './services/store/userStore';

const ProtectedRoute = ({ user, redirectPath = '/login', children }) => {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <div>{children}</div>;
};

function App() {
  const { user, refreshUser, isLoggedIn } = userStore();

  useEffect(() => {
    if (isLoggedIn()) refreshUser();
  }, [isLoggedIn, refreshUser]);

  const theme = {
    borderRadius: 10,
    colorPrimary: '#4318FF'
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <h1>Landing</h1>
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          path: 'board',
          element: (
            <ProtectedRoute user={user}>
              <Board />
            </ProtectedRoute>
          )
        },
        {
          path: 'backlog',
          element: (
            <ProtectedRoute user={user}>
              <h1>Backlog</h1>
            </ProtectedRoute>
          )
        },
        {
          path: 'reports',
          element: (
            <ProtectedRoute user={user}>
              <h1>Reports</h1>
            </ProtectedRoute>
          )
        },
        {
          path: 'settings',
          element: (
            <ProtectedRoute user={user}>
              <h1>Settings</h1>
            </ProtectedRoute>
          )
        },
        {
          path: '500',
          element: <InternalError />
        },
        {
          path: '*',
          element: <NotFound />
        }
      ]
    }
  ]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: theme.colorPrimary,
          borderRadius: theme.borderRadius
        }
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;

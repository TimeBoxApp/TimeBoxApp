import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { SkeletonTheme } from 'react-loading-skeleton';

import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Board from './pages/Board/Board';
import NotFound from './pages/NotFound/NotFound';
import InternalError from './pages/InternalError/InternalError';
import AppLayout from './layouts/AppLayout';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Settings from './pages/Settings/Settings';
import Backlog from './pages/Backlog/Backlog';
import Calendar from './pages/Calendar/Calendar';
import Landing from './pages/Landing/Landing';
import { useCurrentUser, useCurrentUserActions } from './services/store/useCurrentUserStore';

const ProtectedRoute = ({ user, redirectPath = '/login', feature, children }) => {
  const { userHasFeature } = useCurrentUserActions();

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  if (feature && !userHasFeature(feature)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <div>{children}</div>;
};

function App() {
  const currentUser = useCurrentUser();
  const { updateCurrentUser, initStore } = useCurrentUserActions();

  /**
   * Update user data on each page refresh
   */
  useEffect(() => {
    const path = window.location.pathname;
    void initStore();

    if (['/login', '/signup', '/'].includes(path)) {
      if (!currentUser?.id) return;
    }

    void updateCurrentUser();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = {
    borderRadius: 10,
    colorPrimary: '#2b3674',
    textPrimary: '#2b3674',
    textSecondary: '#8f9bba',
    colorBorder: '#e0e5f2',
    primaryGrey: '#e9edf7',
    lightGrey: '#f8fafc',
    background: '#f4f7fe'
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Landing />
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
            <ProtectedRoute user={currentUser}>
              <Board />
            </ProtectedRoute>
          )
        },
        {
          path: 'repository',
          element: (
            <ProtectedRoute user={currentUser}>
              <Backlog />
            </ProtectedRoute>
          )
        },
        {
          path: 'calendar',
          element: (
            <ProtectedRoute user={currentUser}>
              <Calendar />
            </ProtectedRoute>
          )
        },
        {
          path: 'settings',
          element: (
            <ProtectedRoute user={currentUser}>
              <Settings />
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
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          token: {
            colorBorder: theme.colorBorder,
            colorPrimary: theme.colorPrimary,
            borderRadius: theme.borderRadius,
            controlHeight: 40,
            controlOutline: 'none',
            colorText: theme.textPrimary
          },
          components: {
            DatePicker: {
              colorBgContainer: theme.background,
              colorText: theme.textPrimary
            },
            Button: { fontWeight: 500 },
            Select: {
              multipleItemBg: 'transparent',
              selectorBg: theme.background,
              clearBg: theme.background,
              optionSelectedBg: theme.primaryGrey,
              controlItemBgHover: theme.lightGrey
            },
            Input: {
              activeBg: theme.background,
              colorBgContainer: theme.background,
              colorText: theme.textPrimary,
              colorTextPlaceholder: theme.textSecondary,
              activeShadow: theme.primaryGrey,
              hoverBorderColor: theme.textSecondary,
              activeBorderColor: theme.textSecondary
            }
          }
        }}
      >
        <SkeletonTheme baseColor="#e9edf7" highlightColor="#f4f7fe" borderRadius={'20px'}>
          <RouterProvider router={router} />
        </SkeletonTheme>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;

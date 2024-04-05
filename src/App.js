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
    void initStore();

    if (currentUser && currentUser.id) void updateCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.id]);

  const theme = {
    borderRadius: 10,
    textPrimary: '#2b3674',
    textSecondary: '#8f9bba',
    colorPrimary: '#2b3674',
    colorBorder: '#e0e5f2',
    primaryGrey: '#e9edf7',
    background: '#f4f7fe'
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <h1>Landing1</h1>
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
            // fontFamily: 'DM Sans',
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
              selectorBg: theme.background,
              clearBg: theme.background,
              optionSelectedBg: theme.primaryGrey
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

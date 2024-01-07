import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './services/i18n';
import reportWebVitals from './reportWebVitals';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';

import './styles/main.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <p>Landing</p>
  },
  {
    path: 'app',
    element: <p>App</p>
  },
  {
    path: 'login',
    element: <Login />
  },
  {
    path: 'signup',
    element: <Signup />
  }
]);

const theme = {
  borderRadius: 10,
  colorPrimary: '#4318FF'
};

root.render(
  <React.StrictMode>
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
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

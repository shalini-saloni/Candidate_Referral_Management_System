import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ReferralForm from './components/ReferralForm';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/refer"
              element={
                <PrivateRoute>
                  <ReferralForm />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

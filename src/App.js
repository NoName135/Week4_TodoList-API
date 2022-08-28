import * as React from 'react';
import { useState } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import './App.css';

import {AuthContext, useAuth} from './components/Context';
import Login from './components/Login';
import SignUp from './components/SignUp';
import TodoList from './components/TodoList';


const ProtectedTodoList = ({ children }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const NotFound = () => {
  return (
    <>
      <main>
        <p>Nothing in here !</p>
      </main>
    </>
  );
}

function App() {
  const [token, setToken] = useState(null);
  return (
    <div className="App">
      <AuthContext.Provider value={{ token, setToken }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="signUp" element={<SignUp />} />
          <Route element={<ProtectedTodoList />}>
            <Route path="todoList" element={<TodoList />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthContext.Provider>
    </div>
  );
}

export default App;

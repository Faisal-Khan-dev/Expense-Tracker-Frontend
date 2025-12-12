
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/Auth/SignUp'
import Login from './pages/Auth/Login'
import DashboarHome from "./pages/Dashboard/Home";
import Income from './pages/Dashboard/Income'
import Expense from "./pages/Dashboard/Expense";
import AuthRoutes from './pages/Routes/AuthRoutes'
import PrivateRoutes from './pages/Routes/PrivateRoutes'


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthRoutes />}>
          <Route path="/" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />
          </Route>
          <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" exact element={<DashboarHome />} />
          <Route path="/income" exact element={<Income />} />
          <Route path="/expense" exact element={<Expense />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App

import React from 'react';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Register from './pages/Register';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import { AuthProvider } from './context/authContext';


function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Register/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/product/:id" element={<ProductDetail/>} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar.jsx';
import Home from './components/Home/Home.jsx';
import Footer from './components/Footer/Footer.jsx';
import Services from './components/Services/Services.jsx';
import Features from './components/Features/Features.jsx';
import Login from './components/Login/Login.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/features" element={<Features />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home'; //Will import home page if we edit it
import ResetPassword from './components/ResetPassword';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import MoviePage from './components/MoviePage';
// import Header from './components/Header';

function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
      </Routes>
    </Router>
    {/* <Header />
    <MoviePage /> */}
    </div>
  );
}

export default App;

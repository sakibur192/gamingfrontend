// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Lobby from './pages/Lobby';
// import Navbar from './components/Navbar';
// import GameLobby from "./pages/FastSpin";


// function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <Routes>
//          <Route path="/" element={<GameLobby />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/lobby" element={<GameLobby />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
// export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Lobby from './pages/Lobby';
import FastSpin from './pages/FastSpin';
import Profile from './pages/Profile';
import PPGames from './pages/pp';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<FastSpin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lobby" element={<PPGames />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

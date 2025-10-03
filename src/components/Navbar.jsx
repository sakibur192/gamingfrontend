import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-black text-white px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-orange-500">🎰 My Casino</h1>
      <div className="space-x-4">
        <Link to="/lobby">Lobby</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;

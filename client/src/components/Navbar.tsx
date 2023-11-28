import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext';

type LinkClassProps = {
  isActive: boolean;
};

const Navbar = () => {
  const { currentUser: user, logout } = useUser();

  const linkClass = ({ isActive }: LinkClassProps) =>
    isActive
      ? 'text-gray-700 font-semibold tracking-widest text-lg border-b-4 border-yellow-500 rounded transition duration-300 ease-in-out'
      : 'text-gray-500 font-medium tracking-widest text-lg hover:text-gray-300 rounded transition duration-300 ease-in-out';
  return (
    <nav className="flex items-center justify-evenly p-4 md:px-6 bg-white bg-opacity-30 backdrop-blur-lg w-full rounded-lg shadow-lg">
      {user ? (
        <>
          <NavLink to="/" className={linkClass}>
            Persons
          </NavLink>
          <NavLink to="/create" className={linkClass}>
            Create new
          </NavLink>
          <NavLink to="/edit" className={linkClass}>
            Change number
          </NavLink>
          <button
            onClick={logout}
            className="text-gray-400 font-medium tracking-widest text-lg hover:text-gray-200 rounded transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
          <NavLink to="/register" className={linkClass}>
            Register
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default Navbar;

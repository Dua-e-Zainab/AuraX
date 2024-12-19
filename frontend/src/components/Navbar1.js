import { FaUserAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar1">
      <header className="flex justify-between w-full px-8 py-4 text-indigo-900 bg-white">
        {/* Make Logo Clickable */}
        <Link to="/NewPage">
          <img src="Logo - AuraX 22.png" alt="AuraX Logo" className="h-18" />
        </Link>
        
        <div className="flex items-center space-x-8">
          <Link to="/myprojects" className="hover:underline">
            My Projects
          </Link>
          <Link to="/help" className="hover:underline">
            Help
          </Link>
          <button
            aria-label="User Profile"
            className="w-8 h-8 flex items-center justify-center"
          >
            <FaUserAlt className="mr-2 text-lg justify-center" />
          </button>
        </div>
      </header>
    </nav>
  );
};

export default Navbar;

import { 
  FiHome, 
  FiUsers, 
  FiBookOpen, 
  FiAward, 
  FiBarChart2, 
  FiMessageSquare, 
  FiCalendar, 
  FiSettings,
  FiUser,
  FiLogOut
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import './SideBar.scss';
import { useAuth } from '../../Context/AuthContext';
import { ROUTES } from '../../Constants/Routes';

const SideBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { icon: FiHome, label: 'Dashboard', path: ROUTES.HOME },
    { icon: FiUsers, label: 'Students', path: ROUTES.STUDENTS },
    { icon: FiBookOpen, label: 'Courses', path: ROUTES.COURSES },
    { icon: FiAward, label: 'Instructors', path: ROUTES.INSTRUCTORS },
    { icon: FiBarChart2, label: 'Analytics', path: ROUTES.ANALYTICS },
    { icon: FiMessageSquare, label: 'Messages', path: ROUTES.MESSAGES },
    { icon: FiCalendar, label: 'Calendar', path: ROUTES.CALENDAR },
    { icon: FiUser, label: 'User Roles', path: ROUTES.USER_ROLES },
    { icon: FiSettings, label: 'Settings', path: ROUTES.SETTINGS }



  ];

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      {/* Logo/Brand Section */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">S20</div>
        <span className="sidebar__logo-text">Super 20</span>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar__nav">
        {navigationItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={index} 
              className={`sidebar__nav-item ${isActive(item.path) ? 'sidebar__nav-item--active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item.path);
              }}
            >
              <IconComponent className="sidebar__nav-icon" />
              <span className="sidebar__nav-label">{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="sidebar__profile">
        <div className="sidebar__profile-avatar">
          <FiUser />
        </div>
        <div className="sidebar__profile-info">
          <div className="sidebar__profile-name">{user?.name || 'Admin User'}</div>
          <div className="sidebar__profile-email">{user?.email || 'admin@super20.com'}</div>
        </div>
        <button 
          className="sidebar__logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <FiLogOut />
        </button>
      </div>
    </div>
  );
};

export default SideBar;
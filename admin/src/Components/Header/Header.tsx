import { FiSearch, FiBell } from 'react-icons/fi';
import './Header.scss';

const Header = () => {
  return (
    <header className="header">
      <div className="header__left">
        <h1 className="header__title">Dashboard</h1>
        <p className="header__subtitle">Welcome back, Admin</p>
      </div>
      
      <div className="header__right">
        <div className="header__search">
          <FiSearch className="header__search-icon" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="header__search-input"
          />
        </div>
        
        <div className="header__notifications">
          <FiBell className="header__bell-icon" />
          <div className="header__notification-badge"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;

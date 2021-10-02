import React from 'react';
import { Link } from 'react-router-dom';
const Navigation = ({ userObj }) => (
  <>
    <nav>
      <ul>
        <li>
          <Link to="/">mywitter</Link>
        </li>
        <li>
          <Link to="/profile">{userObj.displayName}의 Profile</Link>
        </li>
      </ul>
    </nav>
    <div className="nav-blank"></div>
  </>
);

export default Navigation;

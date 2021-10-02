import { authService } from 'fbase';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useState } from 'react/cjs/react.development';

const Profile = ({ refreshUser, userObj }) => {
  const histoty = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.newDisplayName);

  const onLogOutClick = () => {
    authService.signOut();
    histoty.push('/');
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <h4>이메일 : {userObj.email}</h4>
        <h4>이름 : {userObj.displayName}</h4>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        />
        <input type="submit" value="Update profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;

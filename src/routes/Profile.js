import { authService } from 'fbase';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default () => {
  const histoty = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    histoty.push('/');
  };

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

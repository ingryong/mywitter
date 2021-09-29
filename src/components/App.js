import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser); // useState(currentUser)를 통해 로그인 상태 여부 확인
  useEffect(() => {
    // hooks
    authService.onAuthStateChanged((user) => {
      // onAuthStateChanged -> 유저의 로그인 상태를 지속적으로 체크함
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : 'Initiializing...'}
      <footer>&copy;{new Date().getFullYear()} mywitter</footer>
    </>
  );
}

export default App;

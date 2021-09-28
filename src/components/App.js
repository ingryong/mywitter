import React, { useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser); // useState(currentUser)를 통해 로그인 상태 여부 확인
  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />
      <footer>&copy;{new Date().getFullYear()} mywitter</footer>
    </>
  );
}

export default App;

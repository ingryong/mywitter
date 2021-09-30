import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';

function App() {
  const [init, setInit] = useState(false);
  // useState(currentUser)를 통해 로그인 상태 여부 확인
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    // useEffect-> react 컴포넌트가 랜더링 될 때마다 아래 작업을 실행하는 Hook
    authService.onAuthStateChanged((user) => {
      // onAuthStateChanged -> 유저의 로그인 상태를 체크함
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    // init에 기본값으로 false를 넣어 확인중...을 보여주면서 useEffect의 처리를 통해 로그인 상태와 아닌 상태를 판별 후
    // src/components/Router.js 에 있는 설정대로 login페이지로, 아닐경우 '/'페이지 이동
    <>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        '확인중...'
      )}
      <footer>&copy;{new Date().getFullYear()} mywitter</footer>
    </>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import 'assets/css/Style.scss';

function App() {
  const [init, setInit] = useState(false);
  // useState(currentUser)를 통해 로그인 상태 여부 확인
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    // useEffect-> react 컴포넌트가 랜더링 될 때마다 아래 작업을 실행하는 Hook
    authService.onAuthStateChanged((user) => {
      // onAuthStateChanged -> 유저의 로그인 상태를 체크함
      if (user) {
        setUserObj({
          email: user.email,
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      email: user.email,
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    // init에 기본값으로 false를 넣어 확인중...을 보여주면서 useEffect의 처리를 통해 로그인 상태와 아닌 상태를 판별 후
    // src/components/Router.js 에 있는 설정대로 login페이지로, 아닐경우 '/'페이지 이동
    <div className="container">
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        '확인중...'
      )}
    </div>
  );
}

export default App;

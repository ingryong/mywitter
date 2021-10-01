import React from 'react';
import { authService, firebaseInstance } from 'fbase';
import AuthForm from 'components/AuthForm';

const Auth = () => {
  // 소셜로그인
  const onSocialClick = async (event) => {
    // await을 만나기 전까지 진행
    const {
      target: { name },
    } = event; // 이벤트를 실행한 타겟의 name태그를 찾는다.

    let provider;

    if (name === 'google') {
      // 구글을 클릭했을 경우, provider 안에 firebase의 구글 소셜로그인 api를 담는다.
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === 'github') {
      // 깃헙을 클릭했을 경우, provider 안에 firebase의 깃헙 소셜로그인 api를 담는다.
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    // await을 통해 async의 순서(provider에 값이 담길 때까지)를 기다린 후 signInWithPopup(팝업형태의 signIn) 진행
    // data값을 콘솔 로그에서 확인하기 위해 data 값에 담기게 함. 원치 않는다면 `const data =`와 `console.log(data);` 삭제
    const data = await authService.signInWithPopup(provider);
    console.log(data);
  };

  return (
    <div>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name="google">
          Continue with Google
        </button>
        <button onClick={onSocialClick} name="github">
          Continue with Github
        </button>
      </div>
    </div>
  );
};

export default Auth;

import React, { useState } from 'react';
import { authService, firebaseInstance } from 'fbase';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');

  const onChange = (event) => {
    // input에 들어오는 value값을 email과 password 변수에 담아두어 onSubmit에 사용
    const {
      target: { name, value },
    } = event;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault(); // preventDefault -> 해당 이벤트의 기본 이벤트를 취소한다. input의 경우 입력 취소
    try {
      let data;
      if (newAccount) {
        // 계정생성
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        // 로그인
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };
  // setNewAccount로 newAccount의 값을 true와 false로 토글시켜 form의 submit과 해당 이벤트의 값을 변화시킴
  const toggleAccount = () => setNewAccount((prev) => !prev);

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
    const data = await authService.signInWithPopup(provider);
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? 'Create Account' : 'Log In'} />
        <div>{error}</div>
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? 'Sign In' : 'Create Account'}
      </span>
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

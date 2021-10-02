import { authService } from 'fbase';
import React from 'react';
import { useState } from 'react/cjs/react.development';
const AuthForm = () => {
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
      console.log(error);
      if (error.code === 'auth/weak-password') {
        return setError(
          <>
            <span className="error">6자 이상의 비밀번호를 입력해 주세요</span>
          </>
        );
      } else if (error.code === 'auth/invalid-email') {
        return setError(
          <>
            <span className="error">이메일 형식이 올바르지 않습니다.</span>
          </>
        );
      } else if (error.code === 'auth/email-already-in-use') {
        return setError(
          <>
            <span className="error">
              해당 이메일 주소로 가입된 계정이 존재합니다.
            </span>
          </>
        );
      }
    }
  };
  // setNewAccount로 newAccount의 값을 true와 false로 토글시켜 form의 submit과 해당 이벤트의 값을 변화시킴
  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          className="input"
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          className="input"
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input
          className="Button medium fullWidth"
          type="submit"
          value={newAccount ? '계정 생성하기' : '로그인'}
        />
        <div>{error}</div>
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? (
          <>
            아이디가 있으신가요? <strong>로그인</strong>
          </>
        ) : (
          <>
            계정이 없으신가요? <strong>회원가입</strong>
          </>
        )}
      </span>
    </>
  );
};

export default AuthForm;

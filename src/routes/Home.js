import { dbService } from 'fbase';
import React, { useEffect } from 'react';
import { useState } from 'react/cjs/react.development';

const Home = ({ userObj }) => {
  const [mweet, setMweet] = useState('');
  const [mweets, setMweets] = useState([]);

  useEffect(() => {
    dbService.collection('mweets').onSnapshot((snapshot) => {
      const mweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMweets(mweetArray);
    });
  }, []);

  // 글쓰기
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection('mweets').add({
      // firestore의 mweets라는 콜렉션`(collection('mweets'))`에 아래 데이터들을 삽입`(add({~~~}))`
      text: mweet, // 아래 input의 value={mweet}의 값을 가져와 삽입
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setMweet('');
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setMweet(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={mweet}
          onChange={onChange}
          type="text"
          placeholder="What's on yout mind?"
          maxLength={120}
        />
        <input type="submit" value="Mweet" />
      </form>
      <div>
        {mweets.map(
          (
            mweet // db에서 mweets 값 불러오기
          ) => (
            <div key={mweet.id}>
              <h4>{mweet.text}</h4>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Home;

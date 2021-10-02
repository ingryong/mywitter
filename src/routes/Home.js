import Mweet from 'components/Mweet';
import { dbService } from 'fbase';
import React, { useEffect } from 'react';
import { useState } from 'react/cjs/react.development';
import MweetFactory from 'components/MweetFactory';

const Home = ({ userObj }) => {
  const [mweets, setMweets] = useState([]);

  useEffect(() => {
    dbService.collection('mweets').onSnapshot((snapshot) => {
      // onSnapshot을 통해 mweets의 콜렉션에서 변화가 있을때마다 실시간으로 해당 데이터를 가져옴
      const mweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMweets(mweetArray);
    });
  }, []);

  return (
    <div>
      <MweetFactory userObj={userObj} />
      <div>
        {mweets.map(
          (
            mweet // db에서 mweets 값 불러오기
          ) => (
            <Mweet
              key={mweet.id}
              mweetObj={mweet}
              isOwner={mweet.creatorId === userObj.uid}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Home;

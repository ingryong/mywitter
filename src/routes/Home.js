import Mweet from 'components/Mweet';
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from 'fbase';
import React, { useEffect } from 'react';
import { useState } from 'react/cjs/react.development';

const Home = ({ userObj }) => {
  const [mweet, setMweet] = useState('');
  const [mweets, setMweets] = useState([]);
  const [attachment, setAttachment] = useState('');

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

  // 글쓰기
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = ''; // if문 안과 밖에 모두 쓰이므로 let을 선언함
    if (attachment != '') {
      // 사진 없이 글을 게시할 수 있도록 attachment값이 비어있지 않을 때 사진이 업로드 되도록 함
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, 'data_url');
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const mweetObj = {
      // firestore의 mweets라는 콜렉션`(collection('mweets'))`에 아래 데이터들을 삽입`(add({~~~}))`
      text: mweet, // 아래 input의 value={mweet}의 값을 가져와 삽입
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection('mweets').add(mweetObj);
    setMweet('');
    setAttachment('');
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  // 이미지 업로드 전 미리보기 이미지 삭제하기
  const onClearAttachment = () => setAttachment('');

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
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Mweet" />
        {attachment && (
          <div>
            <img src={attachment} width="100px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
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

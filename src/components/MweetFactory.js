import { dbService, storageService } from 'fbase';
import React from 'react';
import { useState } from 'react/cjs/react.development';

import { v4 as uuidv4 } from 'uuid';

const MweetFactory = ({ userObj }) => {
  const [mweet, setMweet] = useState('');
  const [attachment, setAttachment] = useState('');

  // 글쓰기
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = ''; // if문 안과 밖에 모두 쓰이므로 let을 선언함
    if (attachment !== '') {
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
      creatorEmail: userObj.email,
      creatorName: userObj.displayName,
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
  );
};
export default MweetFactory;

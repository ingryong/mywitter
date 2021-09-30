import { dbService } from 'fbase';
import React, { useState } from 'react';

const Mweet = ({ mweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false); // edit 모드인지 아닌지 토글하기위함
  const [newMweet, setNewMweet] = useState(mweetObj.text); // 실제 edit이 이루어짐

  const onDeleteClick = () => {
    // 클릭 시 정말 삭제하겠냐는 선택지를 보여준 후 확인을 누르면 삭제
    const ok = window.confirm('정말 해당 mweet을 삭제하시겠습니까?');
    if (ok) {
      dbService.doc(`mweets/${mweetObj.id}`).delete();
    }
  };

  const tolggleEditing = () => setEditing((prev) => !prev); // edit
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`mweets/${mweetObj.id}`).update({
      text: newMweet,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewMweet(value);
  };

  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit your mweet"
                  value={newMweet}
                  required
                  onChange={onChange}
                />
                <input type="submit" value="Update Mweet" />
              </form>
              <button onClick={tolggleEditing}>Cancel</button>{' '}
            </>
          )}
        </>
      ) : (
        <>
          <h4>{mweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Mweet</button>
              <button onClick={tolggleEditing}>Edit Mweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Mweet;

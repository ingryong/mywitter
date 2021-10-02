import { dbService, storageService } from 'fbase';
import React, { useState } from 'react';

const Mweet = ({ mweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false); // edit 모드인지 아닌지 토글하기위함
  const [newMweet, setNewMweet] = useState(mweetObj.text); // 실제 edit이 이루어짐

  const onDeleteClick = async () => {
    // 클릭 시 정말 삭제하겠냐는 선택지를 보여준 후 확인을 누르면 삭제
    const ok = window.confirm('정말 해당 mweet을 삭제하시겠습니까?');
    if (ok) {
      await dbService.doc(`mweets/${mweetObj.id}`).delete();
      await storageService.refFromURL(mweetObj.attachmentUrl).delete();
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
            <div className="Card-container">
              <form onSubmit={onSubmit}>
                <textarea
                  type="text"
                  placeholder="Edit your mweet"
                  value={newMweet}
                  required
                  onChange={onChange}
                />
                <input type="submit" value="Update Mweet" />
              </form>
              <button onClick={tolggleEditing}>Cancel</button>{' '}
            </div>
          )}
        </>
      ) : (
        <div className="Card-container">
          <div className="padding">
            <div className="edit">
              {isOwner && (
                <>
                  <button
                    className="Button verysmall gray outline"
                    onClick={tolggleEditing}
                  >
                    수정
                  </button>
                  <button
                    className="Button verysmall pink outline"
                    onClick={onDeleteClick}
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
            <h4>{mweetObj.text}</h4>
            {mweetObj.attachmentUrl && (
              <img src={mweetObj.attachmentUrl} width="100px" />
            )}
            <>
              <span>{mweetObj.creatorName} </span>
              <span> {mweetObj.createdAt}</span>
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mweet;

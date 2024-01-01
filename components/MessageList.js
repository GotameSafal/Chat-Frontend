"use client";
import { Avatar, AvatarBadge } from "@chakra-ui/react";
import { useLazyFetchMessageQuery, useStartConvoMutation } from "@redux/api";
import { setChatId, setMessageData, setSelectedUserInfo } from "@redux/message";
import { timeConverter } from "@utils/timeConverter";
import { useDispatch, useSelector } from "react-redux";
const MessageList = ({ chats }) => {
  const dispatch = useDispatch();
  const [startConvo] = useStartConvoMutation();
  const [fetchMessage] = useLazyFetchMessageQuery();
  const myId = useSelector((state) => state.myUserData._id);
  const clickHandler = (userInfo) => {
    dispatch(setSelectedUserInfo(userInfo));
    startConvo({ userId: userInfo._id })
      .unwrap()
      .then((data) => {
        let chatId = data.isChat._id;
        dispatch(setChatId(chatId));
        fetchMessage(chatId)
          .unwrap()
          .then((response) => {
            dispatch(setMessageData(response?.message));
          })
          .catch((err) => console.log(err));
      })
      .catch(() => console.log("Error eastablishing chat connection"));
  };

  return chats ? (
    chats.length > 0 ? (
      chats.map((obj, index) => {
        let myFriend = obj.users.find((user) => user._id !== myId);
        if (myFriend) {
          return (
            <div
              onClick={() => clickHandler(myFriend)}
              key={index}
              className="flex  items-center gap-3 py-2 px-2 border-b-2 border-b-gray-300"
            >
              <Avatar src={myFriend?.image.url} size="sm">
                <AvatarBadge
                  boxSize="1.25em"
                  bg={myFriend?.isOnline ? "green.500" : "gray.500"}
                />
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{myFriend?.username}</h3>
                  <p className="text-xs flex gap-2">
                    {timeConverter(myFriend.updatedAt)}
                  </p>
                </div>
                <p className="text-xs text-justify">
                  {obj.latestMessage
                    ? obj.latestMessage.length > 30
                      ? obj.latestMessage.slice(0, 30) + "..."
                      : obj.latestMessage
                    : "Start your first conversation"}
                </p>
              </div>
            </div>
          );
        } else return null;
      })
    ) : (
      <p className="text-gray-500 text-lg font-semibold">No chats yet</p>
    )
  ) : (
    <></>
  );
};

export default MessageList;

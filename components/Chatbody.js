"use client";
import { Button } from "@chakra-ui/react";
import { RiSendPlaneFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
// import { FiMic } from "react-icons/fi";
import { Avatar, AvatarBadge } from "@chakra-ui/react";
import { useSendMessageMutation } from "@redux/api";
import {
  clearMessageData,
  selectMessage,
  setMessageData,
} from "@redux/message";
import { selectMyData } from "@redux/myUserData";
import { socket } from "@utils/socket";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactScrollableFeed from "react-scrollable-feed";
const Chatbody = () => {
  const dispatch = useDispatch();
  const userData = useSelector(selectMyData);
  
  const {
    message: messages,
    chatId,
    selectedUserInfo,
  } = useSelector(selectMessage);
  const [content, setContent] = useState("");
  const [submit] = useSendMessageMutation();
  useEffect(() => {
    if (socket) {
      // Attach event listener for "join_Chat"
      socket.on("join_Chat", (roomId) => {});

      // Clean up the event listener when the component unmounts
      return () => {
        socket.off("join_Chat");
      };
    }
  }, []);
  useEffect(() => {
    const handleReceivedMessage = (message) => {
      if (message.Chat._id !== chatId) {
        // this condition is used to received notification if other send us a message  and we are not connected to the other user, it's for notification purpose
      } else {
        dispatch(setMessageData([...messages, message]));
      }
    };

    if (socket) {
      socket.on("message_received", handleReceivedMessage);
    }

    return () => {
      if (socket) {
        socket.off("message_received", handleReceivedMessage);
      }
    };
  });

  const changeHandler = (e) => {
    setContent(e.target.value);
  };

  const submitHandler = () => {
    if (!content) return;
    let body = {
      content,
      chatId,
    };

    submit(body)
      .unwrap()
      .then((res) => {
        dispatch(setMessageData([...messages, res.message]));
        socket.emit("new_message", res.message);
        setContent("");
      })
      .catch((err) => console.error(err));
  };

  const keyHandler = (e) => {
    if (e.code === "Enter") {
      submitHandler();
    }
  };

  return messages ? (
    <div className="flex-1 p:2 w-full sm:relative absolute bottom-0 sm:p-6 justify-between flex z-10 bg-white flex-col h-[calc(100vh-64px)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <Avatar src={selectedUserInfo?.image.url} size="md">
              <AvatarBadge
                boxSize="1.25em"
                bg={selectedUserInfo.isOnline ? "green.500" : "gray.500"}
              />
            </Avatar>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-xl mt-1 flex items-center">
              <span className="text-gray-700 mr-3">
                {selectedUserInfo.username}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
          >
            {/* <BsFillCameraVideoFill /> */}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            onClick={() => dispatch(clearMessageData())}
          >
            <RxCross2 />
          </button>
        </div>
      </div>

      <div
        id="messages"
        className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        <ReactScrollableFeed>
          {messages.map((obj, index) => {
            if (obj.sender._id === userData?._id)
              return (
                <div key={index} className="chat-message">
                  <div className="flex items-end justify-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                      <div>
                        <span className="px-4 my-1 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                          {obj.message}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            else
              return (
                <div key={index} className="chat-message">
                  <div className="flex items-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                      <div>
                        <span className="px-4 my-1 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                          {obj?.message}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
          })}
        </ReactScrollableFeed>
      </div>

      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex">
          <span className="absolute inset-y-0 flex items-center">
            {/* <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <FiMic size={25} />
            </button> */}
          </span>
          <input
            type="text"
            onChange={changeHandler}
            value={content}
            onKeyDown={keyHandler}
            placeholder="Write your message!"
            className="w-full focus:outline-none  sm:pe-32 focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-2 bg-gray-200 rounded-md sm:py-3 py-2"
          />
          <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
            <Button
              rightIcon={<RiSendPlaneFill />}
              type="button"
              colorScheme="twitter"
              onClick={submitHandler}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full sm:flex hidden items-center justify-center">
      <p className="font-semibold">Please select user to start convo</p>
    </div>
  );
};

export default Chatbody;

"use client";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import {
  useLazyFetchAllChatQuery,
  useLazyFetchMyDataQuery,
  useLazyFriendRequestQuery,
  useLazyGetFriendsQuery,
  useLazyGetNewFriendsQuery,
} from "@redux/api";
import { selectToken } from "@redux/tokenStore";
import {
  AiFillMessage,
  FaUserFriends,
  GoPersonAdd,
  RiUserReceivedFill,
} from "@utils/iconsExport";
import { connectToSocket, socket } from "@utils/socket";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { FriendRequest, Friends, NewFriends } from "./ConditionalFriends";
import MessageList from "./MessageList";
const Friendlist = () => {
  const token = useSelector(selectToken);

  // redux queries to fetch the data
  const [getMyFriends, { data: myFriends, isLoading: isFetchingFriend }] =
    useLazyGetFriendsQuery();
  const [
    getMyFriendRequest,
    { data: friendRequest, isLoading: isFetchingRequest },
  ] = useLazyFriendRequestQuery();
  const [getNewFriends, { data: newFriends, isLoading: isFetchingNewFriends }] =
    useLazyGetNewFriendsQuery();
  const [getAllChats, { data: allChats, isLoading: isFetchingAllChats }] =
    useLazyFetchAllChatQuery();
  const[getMyData] = useLazyFetchMyDataQuery();

  // using redux lazy query inside useEffect
  useEffect(() => {
    if (token) {
      getMyFriendRequest();
      getMyFriends();
      getNewFriends();
      getAllChats();
    }
  }, [token]);

  const initializeSocket = useCallback(() => {
    connectToSocket();
    getMyData()
      .unwrap()
      .then((res) => {
        socket.emit("set up", res.user);
      });

    socket.on("update_my_friends", () => {
      getMyFriends();
    });

    socket.on("getUserOnline", (userId) => {
      getMyFriends();
      getAllChats();
    });

    socket.on("getUserOffline", (userId) => {
      getMyFriends();
      getAllChats();
    });
  }, [token]);

  useEffect(() => {
    if (token) {
      initializeSocket();
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [token, initializeSocket]);

  useEffect(() => {
    if (socket) {
      socket.on("update_chat_list", () => {
        getAllChats();
      });
      socket.on("refetch friends", () => {
        getMyFriends();
      });
      socket.on("update_my_chat_list", () => {
        getAllChats();
      });
      socket.on("accepted_refetch_friends", getMyFriends());
    }
  }, [getMyFriends]);
  return (
    <div className="md:w-[360px] w-full h-[calc(100vh-64px)] overflow-y-auto bg-[#f6f6f6] border-r px-4 drop-shadow-md">
      <Tabs isFitted>
        <TabList mb="1em">
          <Tab>
            <FaUserFriends size={25} />
          </Tab>
          <Tab>
            <GoPersonAdd size={25} />
          </Tab>
          <Tab>
            <RiUserReceivedFill size={25} />
          </Tab>
          <Tab>
            <AiFillMessage size={25} />
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Friends isLoading={isFetchingFriend} myFriends={myFriends} />
          </TabPanel>
          <TabPanel>
            <NewFriends isLoading={isFetchingNewFriends} people={newFriends} />
          </TabPanel>
          <TabPanel>
            <FriendRequest
              isLoading={isFetchingRequest}
              myRequests={friendRequest}
            />
          </TabPanel>
          <TabPanel>
            <MessageList chats={allChats} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Friendlist;

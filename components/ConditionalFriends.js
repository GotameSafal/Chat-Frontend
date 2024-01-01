import {
  Avatar,
  AvatarBadge,
  Button,
  Card,
  CardBody,
  Spinner,
} from "@chakra-ui/react";
import {
  useAddFriendMutation,
  useConfirmRequestMutation,
  useDeleteRequestMutation,
  useLazyFetchMessageQuery,
  useStartConvoMutation,
} from "@redux/api";
import { setChatId, setMessageData, setSelectedUserInfo } from "@redux/message";
import { socket } from "@utils/socket";
import toast from "react-hot-toast";
import { AiOutlineCheck, AiOutlineUserAdd } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch } from "react-redux";

export const Friends = ({ isLoading, myFriends }) => {
  const [startConvo] = useStartConvoMutation();
  const [fetchMessage] = useLazyFetchMessageQuery();
  const dispatch = useDispatch();
  const clickHandler = (userInfo) => {
    dispatch(setSelectedUserInfo(userInfo));
    startConvo({ userId: userInfo._id })
      .unwrap()
      .then(async (data) => {
        let chatId = data?.isChat?._id;
        dispatch(setChatId(chatId));
        fetchMessage(chatId)
          .unwrap()
          .then((response) => {
            dispatch(setMessageData(response?.message));
          })
          .catch((err) => console.log(err));
      })
      .catch(err => console.log("Error eastablishing chat connection", err));
  };
  return myFriends ? (
    isLoading ? (
      <div className="flex justify-center">
        <Spinner size="md" />
      </div>
    ) : myFriends.friends.length > 0 ? (
      myFriends.friends.map((frn, ind) => (
        <Card onClick={() => clickHandler(frn)} cursor="pointer" key={ind}>
          <CardBody p={2}>
            <div className="flex items-center gap-3">
              <Avatar src={frn.image.url} size="sm">
                <AvatarBadge
                  boxSize="1.25em"
                  bg={frn?.isOnline ? "green.500" : "gray.500"}
                />
              </Avatar>
              <h4>{frn.username}</h4>
            </div>
          </CardBody>
        </Card>
      ))
    ) : (
      <p className="text-gray-500 py-2 flex justify-center px-1 font-semibold text-lg">
        Please add some friends first
      </p>
    )
  ) : (
    <div className="text-gray-500 py-2 flex justify-center px-1 font-semibold text-lg">
      <Spinner size="md" />
    </div>
  );
};

export const NewFriends = ({ isLoading, people }) => {
  const [addFriend] = useAddFriendMutation();
  const addFriendHandler = (id) => {
    addFriend({ receiver: id })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
      })
      .catch((err) => console.error(err));
  };
  return people ? (
    isLoading ? (
      <div className="flex justify-center">
        <Spinner size="md" />
      </div>
    ) : people.newFriends.length > 0 ? (
      people.newFriends.map((friend, index) => (
        <Card key={index}>
          <CardBody p={2} className="flex p-1 justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={friend.image.url} size="sm"></Avatar>
              <h4 className="w-[80px] overflow-x-auto">{friend.username}</h4>
            </div>
            <Button
              colorScheme="twitter"
              size="xs"
              rightIcon={<AiOutlineUserAdd size={20} />}
              onClick={() => addFriendHandler(friend._id)}
            >
              Add
            </Button>
          </CardBody>
        </Card>
      ))
    ) : (
      <p className="text-gray-500 py-2 flex justify-center px-1 font-semibold text-lg">
        No new Friends
      </p>
    )
  ) : (
    <div className="text-gray-500 flex justify-center py-2 px-1 font-semibold text-lg">
      <Spinner size="md" />
    </div>
  );
};

export const FriendRequest = ({ isLoading, myRequests }) => {
  const [confirmRequest] = useConfirmRequestMutation();
  const [rejectRequest] = useDeleteRequestMutation();
  const confirmHandler = (id) => {
    confirmRequest({ id })
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        socket.emit("friend_request_accepted",id);
      })
      .catch((err) => console.error(err));
  };
  const rejectHandler = (id) => {
    rejectRequest({ id })
      .unwrap()
      .then((res) => toast.success(res.message))
      .catch((err) => console.error(err));
  };
  return myRequests ? (
    isLoading ? (
      <div className="flex justify-center">
        <Spinner size="md" />
      </div>
    ) : myRequests.requestList.length > 0 ? (
      myRequests.requestList.map((friend, index) => (
        <Card key={index}>
          <CardBody p={2} className="flex p-1 justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={friend.sender.image.url} size="sm">
                <AvatarBadge boxSize="1.25em" bg="green.500" />
              </Avatar>
              <h4 className="w-[80px] overflow-x-auto">{friend.sender.username}</h4>
            </div>
            <div className="flex gap-2">
              <Button
                colorScheme="red"
                size="xs"
                onClick={() => rejectHandler(friend.sender._id)}
              >
                <RxCross1 />
              </Button>
              <Button
                colorScheme="twitter"
                size="xs"
                onClick={() => confirmHandler(friend.sender._id)}
              >
                <AiOutlineCheck />
              </Button>
            </div>
          </CardBody>
        </Card>
      ))
    ) : (
      <p className="text-gray-500 py-2 flex justify-center px-1 font-semibold text-lg">
        No any request
      </p>
    )
  ) : (
    <div className="text-gray-500 flex justify-center py-2 px-1 font-semibold text-lg">
      <Spinner size="md" />
    </div>
  );
};

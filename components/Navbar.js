"use client";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { useLazyFetchMyDataQuery, useLazySearchQuery } from "@redux/api";
import { clearMessageData } from "@redux/message";
import { clearUserData, setUserData } from "@redux/myUserData";
import { clearToken, selectToken, setToken } from "@redux/tokenStore";
import { FiLogOut, IoSearch } from "@utils/iconsExport";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const Navbar = ({ cookie }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const loggedin = useSelector(selectToken);
  const [fetchData, { isLoading, data }] = useLazySearchQuery();
  const [getMyData] = useLazyFetchMyDataQuery();

  useEffect(() => {
    if (cookie?.value) {
      dispatch(setToken(cookie.value));
      getMyData()
        .unwrap()
        .then((data) => {
          dispatch(setUserData(data?.user));
        })
        .catch((err) => console.error("Error fetching data", err));

      router.push("/chat");
    }
  }, [cookie]);
  const logoutHandler = async () => {
    toast.success("Successfully logged out");
    router.push("/");
    dispatch(clearMessageData());
    dispatch(clearToken());
    Cookies.remove("LetsChat");
    dispatch(clearUserData());
  };

  const debouncer = (func, time) => {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, time);
    };
  };

  const searchFunction = debouncer((query) => {
    query.length > 0 ? fetchData(query) : fetchData(null);
  }, 800);

  const searchChangeHandler = (e) => {
    const { value } = e.target;
    searchFunction(value);
  };
  return (
    <nav
      id="header"
      className="w-full  bg-white shadow-lg border-b border-blue-400"
    >
      <div className="w-full flex justify-between items-center sm:px-6 px-1 py-2">
        <div className="w-full" id="menu">
          {loggedin ? (
            <nav>
              <div className="text-gray-600 relative flex items-center">
                <input
                  className="border-2 border-gray-300 bg-white h-10 px-5 py-1 rounded-l-lg text-sm focus:outline-none"
                  type="search"
                  name="search"
                  placeholder="Search friends"
                  onChange={searchChangeHandler}
                />
                <Button type="submit" roundedLeft="none" roundedRight="full">
                  <IoSearch size={20} />
                </Button>
                {data && (
                  <div
                    className={`absolute max-h-[480px] overflow-y-auto w-[233px] z-40 px-2 bg-white top-full left-0 rounded-b-sm`}
                  >
                    {isLoading ? (
                      <Spinner size="md" />
                    ) : (
                      data?.user?.map((friend, index) => (
                        <Card key={index}>
                          <CardBody p={2}>
                            <div className="flex items-center gap-3">
                              <Avatar src={friend.image.url} size="sm"></Avatar>
                              <h4>{friend.username}</h4>
                            </div>
                          </CardBody>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </div>
            </nav>
          ) : (
            <Link href="/">
              <Image
                src="https://res.cloudinary.com/dzat8mbl6/image/upload/v1702270021/letschat-high-resolution-logo-transparent_dsqywv.png"
                width={45}
                height={45}
                className="rounded-full"
                alt="Lets Chat Logo"
              />
            </Link>
          )}
        </div>

        {loggedin ? (
          <Tooltip label="logout" hasArrow placement="bottom-end">
            <Button
              type="button"
              onClick={logoutHandler}
              size="sm"
              rounded="full"
              colorScheme="gray"
            >
              <FiLogOut size={20} />
            </Button>
          </Tooltip>
        ) : (
          <div className="flex gap-x-4 items-center">
            {pathname !== "/signin" && (
              <Link href="/signin">
                <Button type="button" size="sm" colorScheme="gray">
                  Sign in
                </Button>
              </Link>
            )}
            {pathname !== "/signup" && (
              <Link href="signup">
                <Button type="button" size="sm" colorScheme="twitter">
                  Sign up
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

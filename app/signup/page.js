"use client";
import { Button } from "@chakra-ui/react";
import { useSignupMutation } from "@redux/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
const Register = () => {
  const [doRegister, { isLoading }] = useSignupMutation();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fileData, setFileData] = useState(null);
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const submitHandler = (e) => {
    e.preventDefault();

    const Fdata = new FormData();
    Fdata.append("username", formData.username);
    Fdata.append("email", formData.email);
    Fdata.append("password", formData.password);
    Fdata.append("confirmPassword", formData.confirmPassword);
    Fdata.append("profile", fileData);
    doRegister(Fdata)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        router.push("/signin");
      })
      .catch((err) => {
        toast.error(err.data.message);
      })
      .finally(() => {
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setFileData(null);
      });
  };
  return (
    <div className="h-screen overflow-auto bg-indigo-100 flex justify-center items-center">
      <div className="lg:w-2/5 md:w-1/2 w-full px-3">
        <form
          onSubmit={submitHandler}
          className="bg-white px-10 py-4 rounded-lg shadow-lg"
        >
          <h1 className="text-center text-2xl mb-6 text-gray-600 font-bold font-sans">
            Sign Up
          </h1>
          <div>
            <label
              className="text-gray-800 font-semibold block my-3 text-md"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
              type="text"
              name="username"
              id="username"
              placeholder="username"
              value={formData.username}
              onChange={changeHandler}
            />
          </div>
          <div>
            <label
              className="text-gray-800 font-semibold block my-3 text-md"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
              type="text"
              name="email"
              id="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={changeHandler}
            />
          </div>
          <div>
            <div>
              <label
                className="block my-3 text-sm font-medium text-gray-800 dark:text-gray-300"
                htmlFor="profile"
              >
                Upload file
              </label>
              <input
                className="block w-full py-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                id="profile"
                type="file"
                onChange={(e) => setFileData(e.target.files[0])}
              />
            </div>
          </div>
          <div>
            <label
              className="text-gray-800 font-semibold block my-3 text-md"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
              type="password"
              name="password"
              id="password"
              placeholder="password"
              value={formData.password}
              onChange={changeHandler}
            />
          </div>
          <div>
            <label
              className="text-gray-800 font-semibold block my-3 text-md"
              htmlFor="confirm"
            >
              Confirm password
            </label>
            <input
              className="w-full bg-gray-100 px-4 py-2 rounded-lg focus:outline-none"
              type="password"
              name="confirmPassword"
              id="confirm"
              placeholder="confirm password"
              value={formData.confirmPassword}
              onChange={changeHandler}
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-2"
            colorScheme="twitter"
            isLoading={isLoading}
          >
            Register
          </Button>
        <Link href="/signin">
          <button
            type="button"
            className="w-full mt-3 mb-3 bg-indigo-100 rounded-lg px-4 py-2 text-lg text-gray-800 tracking-wide font-semibold font-sans"
          >
            Sign In
          </button>
        </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;

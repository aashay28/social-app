import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

import AuthContext from '../store/AuthContext';
import { Link } from 'react-router-dom';
import { signupApi } from '../Api/Api';

const Signup = () => {
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const authCtx = useContext(AuthContext);
  const [error, setError] = useState([]);
  const [user, setUser] = useState(initialValues);
  const navigate = useNavigate();
  const getUserData = e => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const postData = async event => {
    event.preventDefault();
    const actualData = await signupApi(user);
    if (actualData.status === 'success') {
      authCtx.login(actualData.token);
      navigate('/login');
    } else {
      setError(
        actualData.errors.map(e => {
          return e.msg;
        })
      );
    }
  };

  return (
    <>
      <div className="flex flex-wrap w-full">
        <div className="flex flex-col w-full md:w-1/2 ">
          <div className="flex justify-center  pt-12 md:justify-start md:pl-12 md:-mb-24 ">
            <div className=" p-4 text-xl font-bold text-white bg-black">
              Social Media
            </div>
          </div>
          <div className="flex flex-col justify-center px-8 pt-8 my-auto md:justify-start md:pt-0 md:px-24 lg:px-32">
            <p className="text-3xl text-center">Welcome to Signin Page</p>
            <p className="text-xl text-center text-danger mt-2">
              {error ? error[0] : null}
            </p>
            <form className="flex flex-col pt-3 md:pt-8" onSubmit={postData}>
              <div className="flex flex-col pt-4">
                <div className="flex relative ">
                  <span className=" inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      width="20"
                      fill="currentColor"
                    >
                      <path d="M10 9.979Q8.583 9.979 7.625 9.021Q6.667 8.062 6.667 6.646Q6.667 5.229 7.625 4.271Q8.583 3.312 10 3.312Q11.417 3.312 12.375 4.271Q13.333 5.229 13.333 6.646Q13.333 8.062 12.375 9.021Q11.417 9.979 10 9.979ZM3.271 16.667V14.271Q3.271 13.542 3.646 12.958Q4.021 12.375 4.625 12.083Q5.896 11.479 7.26 11.156Q8.625 10.833 10 10.833Q11.375 10.833 12.75 11.156Q14.125 11.479 15.375 12.083Q15.979 12.375 16.354 12.958Q16.729 13.542 16.729 14.271V16.667ZM5.021 14.917H14.979V14.271Q14.979 14.042 14.875 13.875Q14.771 13.708 14.604 13.667Q13.521 13.146 12.333 12.865Q11.146 12.583 10 12.583Q8.854 12.583 7.667 12.875Q6.479 13.167 5.396 13.667Q5.229 13.75 5.125 13.896Q5.021 14.042 5.021 14.271ZM10 8.229Q10.688 8.229 11.135 7.781Q11.583 7.333 11.583 6.646Q11.583 5.958 11.135 5.51Q10.688 5.062 10 5.062Q9.312 5.062 8.865 5.51Q8.417 5.958 8.417 6.646Q8.417 7.333 8.865 7.781Q9.312 8.229 10 8.229ZM10 6.646Q10 6.646 10 6.646Q10 6.646 10 6.646Q10 6.646 10 6.646Q10 6.646 10 6.646Q10 6.646 10 6.646Q10 6.646 10 6.646Q10 6.646 10 6.646Q10 6.646 10 6.646ZM10 14.917Q10 14.917 10 14.917Q10 14.917 10 14.917Q10 14.917 10 14.917Q10 14.917 10 14.917Q10 14.917 10 14.917Q10 14.917 10 14.917Q10 14.917 10 14.917Q10 14.917 10 14.917Z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className=" flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    name="name"
                    placeholder="Enter Your name"
                    value={user.name}
                    onChange={e => getUserData(e)}
                  />
                </div>
              </div>
              <div className="flex flex-col pt-4">
                <div className="flex relative ">
                  <span className=" inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                    <svg
                      width="15"
                      height="15"
                      fill="currentColor"
                      viewBox="0 0 1792 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z"></path>
                    </svg>
                  </span>
                  <input
                    id="design-login-email"
                    className=" flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    type="email"
                    name="email"
                    placeholder="Enter Your Email"
                    value={user.email}
                    onChange={getUserData}
                  />
                </div>
              </div>
              <div className="flex flex-col pt-4">
                <div className="flex relative ">
                  <span className=" inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                    <svg
                      width="15"
                      height="15"
                      fill="currentColor"
                      viewBox="0 0 1792 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z"></path>
                    </svg>
                  </span>
                  <input
                    id="design-login-password"
                    className=" flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    type="password"
                    name="password"
                    placeholder="Enter Your Password"
                    value={user.password}
                    onChange={e => getUserData(e)}
                  />
                </div>
              </div>
              <div className="flex flex-col pt-4 mb-12">
                <div className="flex relative ">
                  <span className=" inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                    <svg
                      width="15"
                      height="15"
                      fill="currentColor"
                      viewBox="0 0 1792 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z"></path>
                    </svg>
                  </span>
                  <input
                    id="design-login-password"
                    className=" flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    type="password"
                    name="confirmPassword"
                    placeholder="Enter Your Confirm Password"
                    value={user.confirmPassword}
                    onChange={e => getUserData(e)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-black shadow-md hover:text-black hover:bg-white focus:outline-none focus:ring-2"
              >
                <span className="w-full">Signup</span>
              </button>
            </form>
            <div className="pt-12 pb-12 text-center">
              <p>
                Already have an account ?
                <div className="font-semibold underline">
                  <Link to="/login">Sign in.</Link>
                </div>
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/2 shadow-2xl">
          <img
            alt="title"
            className="hidden object-cover w-full h-screen md:block"
            src="https://images.unsplash.com/photo-1613980790147-f4f449df0dd9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          />
        </div>
      </div>
    </>
  );
};
export default Signup;

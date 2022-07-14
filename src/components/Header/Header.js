import { useState } from 'react';

import AddProfile from '../profile/AddProfile';
import AddPost from '../Post/AddPost';
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
  isEnabled as isDarkReaderEnabled,
} from 'darkreader';
import { searchUserApi } from '../../Api/Api';
import AuthContext from '../../store/AuthContext';
import { useContext } from 'react';

const Header = () => {
  const [profileShow, setProfileShow] = useState(false);
  const [showSearchData, setShowSearchData] = useState(false);

  const [searchData, setSearchData] = useState([]);
  const authCtx = useContext(AuthContext);
  const searchUser = async e => {
    const data = await searchUserApi(authCtx.token, e.target.value);
    if (e.target.value.length > 0) {
      setSearchData(data.data);
      setShowSearchData(true);
    } else {
      setSearchData('');
      setShowSearchData(false);
    }
  };

  const showProfileHandler = () => {
    setProfileShow(true);
  };
  const hideProfileHandler = () => {
    setProfileShow(false);
  };
  const [postShow, setPostShow] = useState(false);

  const showPostHandler = () => {
    setPostShow(true);
  };
  const hidePostHandler = () => {
    setPostShow(false);
  };

  const changeTheme = () => {
    if (isDarkReaderEnabled()) {
      return disableDarkMode();
    } else {
      return enableDarkMode({
        brightness: 100,
        contrast: 100,
        sepia: 30,
      });
    }
  };
  return (
    <>
      <div>
        <nav className="bg-white dark:bg-gray-800  shadow fixed w-full z-40 ">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center justify-center  h-16 ">
              <div className=" flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10"
                    src="https://cdn-icons-png.flaticon.com/512/3249/3249935.png"
                    alt="icon"
                  />
                </div>
                <div className="text-gray-800 px-3 py-2 rounded-md text-base font-medium">
                  Social Media
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex  items-baseline space-x-4">
                    <div className="container relative left-0 z-50 flex w-3/4 h-auto h-full ">
                      <div className="relative flex items-center w-full lg:w-64 h-full group">
                        <svg
                          className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                        </svg>
                        <input
                          type="text"
                          onChange={e => searchUser(e)}
                          className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100  text-gray-400 aa-input"
                          placeholder="Search"
                        />
                        <div className="absolute right-0 hidden h-auto px-2 py-1 mr-2 text-xs text-gray-400 border border-gray-300 rounded-2xl md:block">
                          +
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-800  hover:text-gray-800 dark:hover:text-gray-800 px-3 py-2 rounded-md text-base font-medium">
                      Home
                    </div>
                    <div
                      onClick={showPostHandler}
                      className="text-gray-500  hover:text-gray-800 dark:hover:text-gray-800 px-3 py-2 rounded-md text-base font-medium"
                    >
                      Post
                    </div>
                    {postShow && <AddPost onClose={hidePostHandler} />}
                    <div
                      onClick={showProfileHandler}
                      className="text-gray-500  hover:text-gray-800 dark:hover:text-gray-800 px-3 py-2 rounded-md text-base font-medium"
                    >
                      Profile
                    </div>
                    {profileShow && <AddProfile onClose={hideProfileHandler} />}
                    <div>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          name="toggle"
                          id="Indigo"
                          className="checked:bg-indigo-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full  border-4 appearance-none cursor-pointer"
                          onClick={() => changeTheme()}
                        />
                        <label
                          htmlFor="Indigo"
                          className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                        ></label>
                      </div>
                    </div>
                  </div>
                  <div>
                    {showSearchData && (
                      <div className="absolute ml-20 z-20 w-56 py-2 mt-3 overflow-hidden bg-white rounded-md shadow-xl ">
                        {searchData &&
                          searchData.map((user, i) => {
                            return (
                              <div
                                key={i}
                                className="block px-4 py-3 text-sm text-gray-900 capitalize transition-colors duration-200 transform  hover:bg-gray-800 hover:text-gray-200  "
                              >
                                {user.name}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="block">
                <div className="ml-4 flex items-center md:ml-6"></div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <button className="text-gray-800 dark:text-white hover:text-gray-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="h-8 w-8"
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="md:hidden ">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="text-gray-800 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Home
              </div>
              <div className="text-gray-300 dark:text-white block px-3 py-2 rounded-md text-base font-medium">
                Search
              </div>
              <div className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Post
              </div>
              <div className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                Profile
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};
export default Header;

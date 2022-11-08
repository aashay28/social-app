// import classes from './User.module.css';
import React from 'react';
import { socket } from '../Socket';
// import { useNavigate } from 'react-router-dom';
// import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import { useEffect, useContext } from 'react';
import AuthContext from '../../store/AuthContext';
import UserContext from '../../store/UserContext';
import { getAllUserApi, getMsgPostApi } from '../../Api/Api';

// import Avatar from '@mui/material/Avatar';

// import { db } from '../../store/firebase-config';
// import { collection, query, where, onSnapshot } from 'firebase/firestore';

const User = props => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  // const navigate = useNavigate();
  const imgPath = 'http://192.168.1.241:8000';

  useEffect(() => {
    postData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postData = async () => {
    const actualData = await getAllUserApi(authCtx.token);
    userCtx.setUserList(actualData.data);
  };

  useEffect(() => {
    socket.on('isOnline', data => {
      postData();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleReciver = async user => {
    userCtx.setReceiver(user);
    const values = { senderid: userCtx.userData._id, receiverid: user._id };

    const actualData = await getMsgPostApi(authCtx.token, values);

    userCtx.setMessageList(actualData);
  };

  return (
    <div style={{ marginTop: '4rem ' }}>
      <div
        style={{ height: '45rem' }}
        className="h-screen w-full flex antialiased text-gray-800 bg-inherit overflow-hidden fixed "
      >
        <div className="flex-1 flex flex-col">
          <main className="flex-grow flex flex-row min-h-0">
            <section className="flex flex-col flex-none overflow-auto w-100 hover:w-50 group lg:max-w-sm md:w-2/5 transition-all duration-300 ease-in-out">
              <div className="search-box p-4 flex-none ">
                <form>
                  <div className="relative">
                    <label>
                      <input
                        className="rounded-full py-2 pr-6 pl-10 w-full border border-gray-200 focus:border-gray-900 bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-800 focus:shadow-md transition duration-300 ease-in"
                        type="text"
                        placeholder="Search Messenger"
                      />
                      <span className="absolute top-0 left-0 mt-2 ml-3 inline-block">
                        <svg viewBox="0 0 24 24" className="w-6 h-6">
                          <path
                            fill="#bbb"
                            d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                          />
                        </svg>
                      </span>
                    </label>
                  </div>
                </form>
              </div>

              <div className="contacts p-2 flex-1 overflow-y-scroll">
                {userCtx.userList
                  ? userCtx.userList.map((user, i) => {
                      if (user?._id !== userCtx.userData?._id) {
                        return (
                          <div
                            className="flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg relative hover:text-gray-800 "
                            onClick={() => handleReciver(user)}
                            key={i}
                          >
                            <div className="w-16 h-16 relative flex flex-shrink-0  ">
                              <img
                                className="shadow-md rounded-full w-full h-full object-cover"
                                src={imgPath + user.image}
                                alt=""
                              />
                            </div>
                            <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                              <p>{user.name}</p>
                              <div className="flex items-center text-sm text-gray-600">
                                <div className="min-w-0">
                                  <p className="truncate">
                                    {user.lastMessage ? user.lastMessage : null}
                                  </p>
                                </div>
                                <p className="ml-2 whitespace-no-wrap">
                                  {user.isOnline === true
                                    ? 'Online'
                                    : 'Offline'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return '';
                    })
                  : null}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};
export default User;

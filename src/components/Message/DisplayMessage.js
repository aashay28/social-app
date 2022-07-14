import React from 'react';
import { useContext } from 'react';
import { useState, useEffect } from 'react';
import { socket } from '../Socket';
import DeleteChat from './DeleteChat';
import ScrollToBottom from 'react-scroll-to-bottom';
import mongoose from 'mongoose';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../../store/UserContext';
import AuthContext from '../../store/AuthContext';
import { deleteAmessageApi, getAllUserApi } from '../../Api/Api';
function DisplayMessage(props) {
  const userCtx = useContext(UserContext);
  const authCtx = useContext(AuthContext);
  const imgPath = 'http://192.168.1.241:8000';

  const hiddenFileInput = React.useRef(null);
  const sendDocuments = event => {
    hiddenFileInput.current.click();
  };
  const handleSendDocuments = event => {
    const fileUploaded = event.target.files[0];
    console.log(fileUploaded);
  };
  const [currentMessage, setCurrentMessage] = useState('');

  const notify = msg =>
    toast(msg, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const getAllUser = async () => {
    const actualData = await getAllUserApi(authCtx.token);
    userCtx.setUserList(actualData.data);
  };

  const sendLike = () => {
    const sendMessage = {
      messageId: new mongoose.Types.ObjectId().toHexString(),
      senderid: userCtx.userData._id,
      sendername: userCtx.userData.name,
      receiverid: userCtx.receiver._id,
      username: userCtx.receiver.name,
      message: (
        <svg viewBox="0 0 20 20" className="w-10 h-10 fill-current">
          <path d="M11.0010436,0 C9.89589787,0 9.00000024,0.886706352 9.0000002,1.99810135 L9,8 L1.9973917,8 C0.894262725,8 0,8.88772964 0,10 L0,12 L2.29663334,18.1243554 C2.68509206,19.1602453 3.90195042,20 5.00853025,20 L12.9914698,20 C14.1007504,20 15,19.1125667 15,18.000385 L15,10 L12,3 L12,0 L11.0010436,0 L11.0010436,0 Z M17,10 L20,10 L20,20 L17,20 L17,10 L17,10 Z" />
        </svg>
      ),
      time: new Date().getTime(),
      room: [userCtx.userData._id, userCtx.receiver._id]
        .sort()
        .toString()
        .replace(',', '_'),
    };
    console.log(sendMessage);
    userCtx.setRecentMsg(sendMessage.message);
    socket.emit('sendMessage', sendMessage);
    userCtx.setMessageList(list => [...list, sendMessage]);
    getAllUser();
  };
  const postData = e => {
    if (currentMessage !== '') {
      const sendMessage = {
        messageId: new mongoose.Types.ObjectId().toHexString(),
        senderid: userCtx.userData._id,
        sendername: userCtx.userData.name,
        receiverid: userCtx.receiver._id,
        username: userCtx.receiver.name,
        message: currentMessage,
        time: new Date().getTime(),
        room: [userCtx.userData._id, userCtx.receiver._id]
          .sort()
          .toString()
          .replace(',', '_'),
      };

      userCtx.setRecentMsg(sendMessage.message);
      socket.emit('sendMessage', sendMessage);
      userCtx.setMessageList(list => [...list, sendMessage]);
      getAllUser();
      setCurrentMessage('');
    }
  };
  useEffect(() => {
    socket.on('receiveMessage', receiveMessage => {
      getAllUser();
      userCtx.setMessageList(list => [...list, receiveMessage]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);
  useEffect(() => {
    socket.on('receiveChatMessage', () => {
      console.log('chat message recive');
      getAllUser();
      notify('Helo mamma');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // const checkIsMessageDeleted = (item, deletedMessage) => {
  //   if (item.messageId === deletedMessage.messageId) {
  //     console.log('deleted message: ', item);
  //   }
  // };

  useEffect(() => {
    socket.on('deletedMessage', deletedMessage => {
      getAllUser();
      userCtx.setMessageList(prev =>
        prev.filter(item => item.messageId !== deletedMessage.messageId)
      );
      // setMessageList(prev =>
      //   prev.filter(item => checkIsMessageDeleted(item, deletedMessage))
      // );
      // userCtx.setDelMsgId(deletedMessage.messageId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const getSavedData = () => {
    userCtx.messageList.map(data => {
      return data;
    });
  };

  const checkMessage = async messageContent => {
    await deleteAmessageApi(authCtx.token, messageContent.messageId);
  };

  useEffect(() => {
    async function fetch() {
      getSavedData();
      socket.emit('leaveChat');
      socket.emit(
        'joinChat',
        [userCtx.userData?._id, userCtx.receiver?._id]
          .sort()
          .toString()
          .replace(',', '_')
      );
    }
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCtx.receiver, socket]);
  return (
    <div>
      <div
        style={{ height: '46rem', marginTop: '4rem' }}
        className="w-full flex antialiased text-gray-900 bg-gray-100 overflow-hidden "
      >
        <div className="flex-1 flex flex-col">
          <main className="flex-grow flex flex-row min-h-0">
            <section className="flex flex-col flex-auto  border-gray-800">
              <div className="chat-header px-6 py-4 flex flex-row flex-none justify-between items-center shadow h-20">
                <div className="flex">
                  <div className="w-12 h-12 mr-4 relative flex flex-shrink-0">
                    <img
                      className="shadow-md rounded-full w-full h-full object-cover"
                      src={imgPath + userCtx.receiver.image}
                      alt=""
                    />
                  </div>
                  <div className="text-sm">
                    <p className="font-bold">{userCtx.receiver.name}</p>
                    <p>Active 1h ago</p>
                  </div>
                </div>
                <div>
                  <DeleteChat
                    senderid={userCtx.userData._id}
                    receiverid={userCtx.receiver._id}
                  />
                </div>
              </div>

              <ScrollToBottom>
                <div
                  className="chat-body p-4 flex-1 "
                  style={{ height: '36rem' }}
                >
                  {userCtx.messageList
                    ? userCtx.messageList.map((messageContent, i) => {
                        if (
                          messageContent.senderid === userCtx.userData._id ||
                          messageContent.fromSelf === true
                        ) {
                          return (
                            <div
                              className="flex flex-row justify-end m-2"
                              key={i}
                            >
                              <div className="messages text-sm text-white grid grid-flow-row gap-2">
                                <div className="flex items-center flex-row-reverse group">
                                  <p className="px-6 py-3 rounded-t-full rounded-l-full bg-blue-700 max-w-xs lg:max-w-md">
                                    {messageContent.message}
                                  </p>
                                  <p className="text-xs text-gray-400 m-3">
                                    {new Date(
                                      messageContent.time
                                    ).toLocaleString('en-us', {
                                      minute: 'numeric',
                                      hour: 'numeric',
                                    })}
                                  </p>
                                  <button
                                    type="button"
                                    className="hidden group-hover:block flex flex-shrink-0 focus:outline-none mx-2 block rounded-full text-gray-800 hover:text-gray-100 hover:bg-gray-700 bg-gray-200 w-8 h-8 p-2"
                                    onClick={() => checkMessage(messageContent)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      className="w-full h-full fill-current"
                                    >
                                      <path d="M6.75 15.75H13.25Q13.25 15.75 13.25 15.75Q13.25 15.75 13.25 15.75V7.708H6.75V15.75Q6.75 15.75 6.75 15.75Q6.75 15.75 6.75 15.75ZM4.125 5.083V3.333H7.062L7.896 2.5H12.104L12.938 3.333H15.875V5.083ZM6.75 17.5Q6.021 17.5 5.51 16.99Q5 16.479 5 15.75V5.958H15V15.75Q15 16.479 14.49 16.99Q13.979 17.5 13.25 17.5ZM6.75 15.75H13.25Q13.25 15.75 13.25 15.75Q13.25 15.75 13.25 15.75H6.75Q6.75 15.75 6.75 15.75Q6.75 15.75 6.75 15.75Z" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    className="hidden group-hover:block flex flex-shrink-0 focus:outline-none mx-2 block rounded-full text-gray-800 hover:text-gray-100 hover:bg-gray-700 bg-gray-200 w-8 h-8 p-2"
                                  >
                                    <svg
                                      viewBox="0 0 20 20"
                                      className="w-full h-full fill-current"
                                    >
                                      <path d="M19,16.685c0,0-2.225-9.732-11-9.732V2.969L1,9.542l7,6.69v-4.357C12.763,11.874,16.516,12.296,19,16.685z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              className="flex flex-row justify-start m-2"
                              key={i}
                            >
                              <div className="w-8 h-8 relative flex flex-shrink-0 mr-4">
                                <img
                                  className="shadow-md rounded-full w-full h-full object-cover"
                                  src={imgPath + userCtx.receiver.image}
                                  alt=""
                                />
                              </div>
                              <div className="messages text-sm text-gray-700 grid grid-flow-row gap-2">
                                <div className="flex items-center group">
                                  <p className="px-6 py-3 rounded-t-full rounded-r-full bg-gray-800 max-w-xs lg:max-w-md text-gray-200">
                                    {messageContent.message}
                                  </p>
                                  <p className="text-xs text-gray-400 m-3">
                                    {new Date(
                                      messageContent.time
                                    ).toLocaleString('en-us', {
                                      minute: 'numeric',
                                      hour: 'numeric',
                                    })}
                                  </p>
                                  <button
                                    type="button"
                                    className="hidden group-hover:block flex flex-shrink-0 focus:outline-none mx-2 block rounded-full text-gray-800 hover:text-gray-100 hover:bg-gray-700 bg-gray-200 w-8 h-8 p-2"
                                  >
                                    <svg
                                      viewBox="0 0 20 20"
                                      className="w-full h-full fill-current"
                                    >
                                      <path
                                        d="M10.001,7.8C8.786,7.8,7.8,8.785,7.8,10s0.986,2.2,2.201,2.2S12.2,11.215,12.2,10S11.216,7.8,10.001,7.8z
                                    M3.001,7.8C1.786,7.8,0.8,8.785,0.8,10s0.986,2.2,2.201,2.2S5.2,11.214,5.2,10S4.216,7.8,3.001,7.8z M17.001,7.8
                                    C15.786,7.8,14.8,8.785,14.8,10s0.986,2.2,2.201,2.2S19.2,11.215,19.2,10S18.216,7.8,17.001,7.8z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    className="hidden group-hover:block flex flex-shrink-0 focus:outline-none mx-2 block rounded-full text-gray-800 hover:text-gray-100 hover:bg-gray-700 bg-gray-200 w-8 h-8 p-2"
                                  >
                                    <svg
                                      viewBox="0 0 20 20"
                                      className="w-full h-full fill-current"
                                    >
                                      <path d="M19,16.685c0,0-2.225-9.732-11-9.732V2.969L1,9.542l7,6.69v-4.357C12.763,11.874,16.516,12.296,19,16.685z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })
                    : null}

                  {/* <p className="p-4 text-center text-sm text-gray-500">
                  FRI 3:04 PM
                </p> */}
                </div>
              </ScrollToBottom>
              <div className="chat-footer flex-none">
                <div className="flex flex-row items-center p-4">
                  <button
                    type="button"
                    className="flex flex-shrink-0 focus:outline-none mx-2 block text-blue-600 hover:text-blue-700 w-6 h-6"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="w-full h-full fill-current"
                    >
                      <path d="M10,1.6c-4.639,0-8.4,3.761-8.4,8.4s3.761,8.4,8.4,8.4s8.4-3.761,8.4-8.4S14.639,1.6,10,1.6z M15,11h-4v4H9  v-4H5V9h4V5h2v4h4V11z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex flex-shrink-0 focus:outline-none mx-2 block text-blue-600 hover:text-blue-700 w-6 h-6"
                    onClick={sendDocuments}
                  >
                    <input
                      type="file"
                      ref={hiddenFileInput}
                      onChange={handleSendDocuments}
                      style={{ display: 'none' }}
                    />
                    <svg
                      viewBox="0 0 20 20"
                      className="w-full h-full fill-current"
                    >
                      <path d="M11,13 L8,10 L2,16 L11,16 L18,16 L13,11 L11,13 Z M0,3.99406028 C0,2.8927712 0.898212381,2 1.99079514,2 L18.0092049,2 C19.1086907,2 20,2.89451376 20,3.99406028 L20,16.0059397 C20,17.1072288 19.1017876,18 18.0092049,18 L1.99079514,18 C0.891309342,18 0,17.1054862 0,16.0059397 L0,3.99406028 Z M15,9 C16.1045695,9 17,8.1045695 17,7 C17,5.8954305 16.1045695,5 15,5 C13.8954305,5 13,5.8954305 13,7 C13,8.1045695 13.8954305,9 15,9 Z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex flex-shrink-0 focus:outline-none mx-2 block text-blue-600 hover:text-blue-700 w-6 h-6"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="w-full h-full fill-current"
                    >
                      <path d="M0,6.00585866 C0,4.89805351 0.893899798,4 2.0048815,4 L5,4 L7,2 L13,2 L15,4 L17.9951185,4 C19.102384,4 20,4.89706013 20,6.00585866 L20,15.9941413 C20,17.1019465 19.1017876,18 18.0092049,18 L1.99079514,18 C0.891309342,18 0,17.1029399 0,15.9941413 L0,6.00585866 Z M10,16 C12.7614237,16 15,13.7614237 15,11 C15,8.23857625 12.7614237,6 10,6 C7.23857625,6 5,8.23857625 5,11 C5,13.7614237 7.23857625,16 10,16 Z M10,14 C11.6568542,14 13,12.6568542 13,11 C13,9.34314575 11.6568542,8 10,8 C8.34314575,8 7,9.34314575 7,11 C7,12.6568542 8.34314575,14 10,14 Z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex flex-shrink-0 focus:outline-none mx-2 block text-blue-600 hover:text-blue-700 w-6 h-6"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="w-full h-full fill-current"
                    >
                      <path d="M9,18 L9,16.9379599 C5.05368842,16.4447356 2,13.0713165 2,9 L4,9 L4,9.00181488 C4,12.3172241 6.6862915,15 10,15 C13.3069658,15 16,12.314521 16,9.00181488 L16,9 L18,9 C18,13.0790094 14.9395595,16.4450043 11,16.9378859 L11,18 L14,18 L14,20 L6,20 L6,18 L9,18 L9,18 Z M6,4.00650452 C6,1.79377317 7.79535615,0 10,0 C12.209139,0 14,1.79394555 14,4.00650452 L14,8.99349548 C14,11.2062268 12.2046438,13 10,13 C7.790861,13 6,11.2060545 6,8.99349548 L6,4.00650452 L6,4.00650452 Z" />
                    </svg>
                  </button>
                  <div className="relative flex-grow ">
                    <label className="w-full">
                      <input
                        className="rounded-full py-2 pl-3 pr-10 w-full border border-gray-200 focus:border-gray-200 bg-gray-200 focus:bg-gray-100 focus:outline-none text-gray-900 focus:shadow-md transition duration-300 ease-in"
                        type="text"
                        placeholder="Aa"
                        label="Start Your Chat Here"
                        onChange={e => setCurrentMessage(e.target.value)}
                        value={currentMessage}
                        autoComplete="off"
                        onKeyPress={event => {
                          event.key === 'Enter' && postData();
                        }}
                      />
                    </label>
                  </div>
                  <button
                    onClick={postData}
                    type="button"
                    className="flex flex-shrink-0 focus:outline-none mx-2 block text-blue-600 hover:text-blue-700 w-6 h-6"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full fill-current"
                    >
                      <path d="M3 20V4L22 12ZM5 17 16.85 12 5 7V10.5L11 12L5 13.5ZM5 17V12V7V10.5V13.5Z" />
                    </svg>
                    {/* <svg
                      viewBox="0 0 20 20"
                      className="w-full h-full fill-current"
                    >
                      <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM6.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2.16 3a6 6 0 0 1-11.32 0h11.32z" />
                    </svg> */}
                  </button>
                  <button
                    type="button"
                    className="flex flex-shrink-0 focus:outline-none mx-2 block text-blue-600 hover:text-blue-700 w-6 h-6"
                    onClick={sendLike}
                  >
                    <svg
                      viewBox="0 0 20 20"
                      className="w-full h-full fill-current"
                    >
                      <path d="M11.0010436,0 C9.89589787,0 9.00000024,0.886706352 9.0000002,1.99810135 L9,8 L1.9973917,8 C0.894262725,8 0,8.88772964 0,10 L0,12 L2.29663334,18.1243554 C2.68509206,19.1602453 3.90195042,20 5.00853025,20 L12.9914698,20 C14.1007504,20 15,19.1125667 15,18.000385 L15,10 L12,3 L12,0 L11.0010436,0 L11.0010436,0 Z M17,10 L20,10 L20,20 L17,20 L17,10 L17,10 Z" />
                    </svg>
                  </button>
                  <ToastContainer
                    position="top-right"
                    theme="dark"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                  />
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default DisplayMessage;

import React from 'react';

const UserContext = React.createContext({
  userData: {},
  setUserData: () => {},
  receiver: {},
  setReceiver: () => {},
  recentMsg: {},
  setRecentMsg: () => {},
  messageList: {},
  setMessageList: () => {},
  userList: {},
  setUserList: () => {},
});
export const UserContextProvider = props => {
  const [userData, setUserData] = React.useState();
  const [receiver, setReceiver] = React.useState();
  const [recentMsg, setRecentMsg] = React.useState();
  const [messageList, setMessageList] = React.useState([]);
  const [userList, setUserList] = React.useState([]);
  const contextValue = {
    userData,
    setUserData,
    receiver,
    setReceiver,
    recentMsg,
    setRecentMsg,
    messageList,
    setMessageList,
    userList,
    setUserList,
  };
  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  );
};
export default UserContext;

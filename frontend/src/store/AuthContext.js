import React, { useState } from 'react';
const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: token => {},
  logout: () => {},
});
export const AuthContextProvider = props => {
  const initialToken = sessionStorage.getItem('token');
  const [token, setToken] = useState(initialToken);
  const userLoggedIn = !!token;

  const logoutHandler = () => {
    setToken(null);
    sessionStorage.removeItem('token');
  };
  const loginHandler = token => {
    setToken(token);
    sessionStorage.setItem('token', token);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;

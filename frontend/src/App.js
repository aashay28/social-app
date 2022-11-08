import { Routes, Route, Navigate } from 'react-router-dom';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';

import { useContext } from 'react';
import AuthContext from './store/AuthContext';
import HomePage from './pages/HomePage';
import UserPost from './components/Post/UserPost';
import MessageBox from './components/Message/MessageBox';

function App() {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <Navigate to="/login" />
            ) : (
              <Navigate to="/home/feed" />
            )
          }
        />
        {isLoggedIn && (
          <>
            <Route path="/home" element={<HomePage />}>
              <Route path="userpost" element={<UserPost />}></Route>
              <Route path="feed" element={<Feed />}></Route>
              <Route path="messagebox" element={<MessageBox />} />
            </Route>
            <Route path="*" element={<Navigate to="/home/feed" replace />} />
          </>
        )}

        {!isLoggedIn && <Route path="/signup" element={<Signup />}></Route>}
        {!isLoggedIn && <Route path="/login" element={<Login />}></Route>}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;

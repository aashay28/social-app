import { useState, useEffect, useContext } from 'react';

import AuthContext from '../../store/AuthContext';

import Display from './Display';
import { socket } from '../../components/Socket';
import { userPostApi } from '../../Api/Api';
const UserPost = props => {
  // const postCollectionRef = collection(db, 'post');
  // const [displayPost, setDisplayPost] = useState([]);
  const authCtx = useContext(AuthContext);

  const [post, setPost] = useState([]);

  const loadData = async () => {
    const response = await userPostApi(authCtx.token);
    setPost(response.posts);

    socket.on('posts', data => {
      if (data.action === 'create') {
        setPost(prevData => {
          return [...prevData, data.data];
        });
      }
    });
  };
  useEffect(() => {
    loadData();
  }, []);

  return <Display post={post} setPost={setPost} />;
};
export default UserPost;

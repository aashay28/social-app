import { useState, useEffect, useContext } from 'react';
import { postApi } from '../../Api/Api';

import { socket } from '../../components/Socket';
import AuthContext from '../../store/AuthContext';

import Display from './Display';

const Post = props => {
  const authCtx = useContext(AuthContext);

  const [post, setPost] = useState([]);

  const loadData = async () => {
    // socket.emit('isOnline', usrCtx.userData._id);
    const response = await postApi(authCtx.token);
    setPost(response.posts);
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    socket.on('posts', data => {
      if (data.action === 'create') {
        setPost(prevData => {
          return [data.data, ...prevData];
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return <Display post={post} setPost={setPost} />;
};
export default Post;

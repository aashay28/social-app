import { useState, useEffect, useContext } from 'react';
import { postApi } from '../../Api/Api';
import AuthContext from '../../store/AuthContext';
// import { storage } from '../store/firebase-config';

// import { ref } from 'firebase/storage';

const TotalPost = props => {
  const authCtx = useContext(AuthContext);

  let count = 0;
  const [post, setPost] = useState({
    name: '',
  });
  const loadData = async () => {
    const actualData = await postApi(authCtx.token);
    setPost(actualData.posts);
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {post?.length
        ? post.map(item => {
            if (item.creator?.name === props.userData) {
              count = count + 1;
            }
            return '';
          })
        : null}
      {count}
    </>
  );
};
export default TotalPost;

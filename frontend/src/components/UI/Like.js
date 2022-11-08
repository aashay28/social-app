import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import AuthContext from '../../store/AuthContext';
import { useState, useContext } from 'react';
const Like = props => {
  // const [unlike, setUnlike] = useState(true);
  const [isLike, setIsLike] = useState(props.isLike);
  const [total, setTotal] = useState(props.totalLike);

  const authCtx = useContext(AuthContext);

  const getLikeData = async postId => {
    await fetch(`http://192.168.1.241:8000/api/like/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${authCtx.token}`, // notice the Bearer before your token
      },
      body: JSON.stringify(),
    });
    setIsLike(!isLike);
    if (!isLike === true) {
      setTotal(total + 1);
    } else {
      setTotal(total - 1);
    }
  };

  return (
    <div onClick={() => getLikeData(props.itemId)}>
      {isLike ? (
        <>
          <FavoriteRoundedIcon style={{ fill: '#B22222' }} />
          <span>{total}</span>
        </>
      ) : (
        <>
          <FavoriteRoundedIcon style={{ fill: '#bdbdbd' }} />
          <span>{total}</span>
        </>
      )}
    </div>
  );
};
export default Like;

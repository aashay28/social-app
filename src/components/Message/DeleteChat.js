import React from 'react';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import AuthContext from '../../store/AuthContext';
import UserContext from '../../store/UserContext';
import { useContext } from 'react';
const DeleteChat = props => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const clearChat = async () => {
    await fetch(`http://192.168.1.241:8000/api/message/delete/chats`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${authCtx.token}`, // notice the Bearer before your token
      },
      body: JSON.stringify({
        senderid: props.senderid,
        receiverid: props.receiverid,
      }),
    });
    userCtx.setMessageList([]);
  };
  return (
    <>
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <MenuIcon />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => clearChat()}>Clear Chat</MenuItem>
        </Menu>
      </div>
    </>
  );
};
export default DeleteChat;

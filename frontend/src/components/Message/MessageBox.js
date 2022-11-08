import DisplayMessage from './DisplayMessage';

import * as React from 'react';

import UserContext from '../../store/UserContext';

import { useContext } from 'react';
import { Grid } from '@mui/material';
import User from '../../components/Users/User';
const MessageBox = () => {
  const userCtx = useContext(UserContext);

  return (
    <div className="flex">
      <Grid item xs={12} sm={6} md={8}>
        {userCtx.receiver ? <DisplayMessage /> : null}
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <User />
      </Grid>
    </div>
  );
};

export default MessageBox;

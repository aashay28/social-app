import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import { useEffect, useContext } from 'react';
import { Grid } from '@material-ui/core';
import AuthContext from '../store/AuthContext';
import UserContext from '../store/UserContext';
import { Outlet } from 'react-router-dom';
import { loggedInUserApi } from '../Api/Api';

const HomePage = () => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  const loadData = async () => {
    const actualData = await loggedInUserApi(authCtx.token);
    userCtx.setUserData(actualData.data);
  };
  // window.onclose = async () => {
  //   await fetch('http://192.168.1.241:8000/api/logout', {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${authCtx.token}`,
  //     },
  //     body: JSON.stringify(),
  //   });
  //   authCtx.logout();
  // };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid container style={{ width: '100%' }}>
      <Grid item xs={12} sm={12} md={12}>
        <header>
          <Header />
        </header>
      </Grid>
      <Grid item xs={12} sm={4} md={2}>
        <Sidebar />
      </Grid>

      <Grid item xs={12} sm={6} md={10}>
        <Outlet />
      </Grid>
    </Grid>
  );
};
export default HomePage;

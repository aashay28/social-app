import classes from './Sidebar.module.css';
import { useContext } from 'react';
import AuthContext from '../../store/AuthContext';
import TotalPost from '../Post/TotalPost';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import UserContext from '../../store/UserContext';
import { isOnline } from '../IsOnline';
import { logoutApi } from '../../Api/Api';
const Sidebar = () => {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const isLoggedIn = authCtx.isLoggedIn;

  const imgPath = 'http://192.168.1.241:8000';

  const logoutHandler = async () => {
    await logoutApi(authCtx.token);
    authCtx.logout();
  };

  window.onload = function () {
    isOnline(userCtx.userData?._id);
  };

  return (
    <>
      <div className="relative bg-white ">
        <div className="flex flex-col sm:flex-row sm:justify-around fixed mt-5">
          <div className="w-72 h-screen">
            <div className="flex items-center justify-start mx-6 mt-10 text-center">
              <img className="h-10" src="/icons/rocket.svg" alt="" />
              <span className=" flex flex-column text-gray-600  ml-4 text-lg font-bold">
                <Avatar
                  alt="Profile"
                  src={`${imgPath}${userCtx.userData?.image}`}
                  sx={{ width: 150, height: 150 }}
                  className={classes.profileimg}
                />
                <span>{userCtx.userData?.name}</span>
                <span>{userCtx.userData?.email}</span>
              </span>
            </div>
            <nav className="mt-10 px-6 ">
              <Link to="/home/feed">
                <div className="hover:text-gray-800 border-r-2 border-gray-600 bg-gray-100 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors  duration-200  text-gray-600   ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    width="20"
                    fill="currentColor"
                  >
                    <path d="M3.333 17.5V7.521L10 2.5L16.667 7.521V17.5H11.25V11.854H8.729V17.5Z" />
                  </svg>
                  <span className="mx-4 text-lg font-normal">Feed</span>
                  <span className="flex-grow text-right"></span>
                </div>
              </Link>
              <Link to="/home/userpost">
                <div
                  className="hover:text-gray-800 hover:border-r-2 hover:border-gray-600 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors  duration-200   text-gray-800 "
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    width="20"
                    fill="currentColor"
                  >
                    <path d="M4.5 17.083Q3.833 17.083 3.375 16.625Q2.917 16.167 2.917 15.5V4.5Q2.917 3.833 3.375 3.375Q3.833 2.917 4.5 2.917H9.333V17.083ZM10.667 17.083V10H17.083V15.5Q17.083 16.167 16.625 16.625Q16.167 17.083 15.5 17.083ZM10.667 8.667V2.917H15.5Q16.167 2.917 16.625 3.375Q17.083 3.833 17.083 4.5V8.667Z" />
                  </svg>
                  <span className="mx-4 text-lg font-normal"> Post</span>
                  <span className="flex-grow text-right">
                    <button
                      type="button"
                      className="w-6 h-6 text-xs  rounded-full text-white bg-blue-500"
                    >
                      <span className="p-1">
                        <TotalPost userData={userCtx.userData?.name} />
                      </span>
                    </button>
                  </span>
                </div>
              </Link>
              <Link to="/home/messagebox">
                <div className="hover:text-gray-800 hover:border-r-2 hover:border-gray-600 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors  duration-200  text-gray-600   ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    width="20"
                    fill="currentColor"
                  >
                    <path d="M4.583 7.125 2.604 4.896Q2.312 4.562 2.49 4.156Q2.667 3.75 3.125 3.75H16.333Q17 3.75 17.458 4.208Q17.917 4.667 17.917 5.333V14.667Q17.917 15.333 17.458 15.792Q17 16.25 16.333 16.25H6.167Q5.5 16.25 5.042 15.792Q4.583 15.333 4.583 14.667ZM7.5 10.667H15Q15.271 10.667 15.469 10.469Q15.667 10.271 15.667 10Q15.667 9.729 15.469 9.531Q15.271 9.333 15 9.333H7.5Q7.229 9.333 7.031 9.531Q6.833 9.729 6.833 10Q6.833 10.271 7.031 10.469Q7.229 10.667 7.5 10.667ZM7.5 13.167H12.5Q12.771 13.167 12.969 12.969Q13.167 12.771 13.167 12.5Q13.167 12.229 12.969 12.031Q12.771 11.833 12.5 11.833H7.5Q7.229 11.833 7.031 12.031Q6.833 12.229 6.833 12.5Q6.833 12.771 7.031 12.969Q7.229 13.167 7.5 13.167ZM7.5 8.167H15Q15.271 8.167 15.469 7.969Q15.667 7.771 15.667 7.5Q15.667 7.229 15.469 7.031Q15.271 6.833 15 6.833H7.5Q7.229 6.833 7.031 7.031Q6.833 7.229 6.833 7.5Q6.833 7.771 7.031 7.969Q7.229 8.167 7.5 8.167Z" />
                  </svg>
                  <span className="mx-4 text-lg font-normal">Messages</span>
                  <span className="flex-grow text-right">
                    <button
                      type="button"
                      className="w-6 h-6 text-xs  rounded-full text-white bg-red-500"
                    >
                      <span className="p-1">7</span>
                    </button>
                  </span>
                </div>
              </Link>
              {userCtx.userData?.isAdmin === true && (
                <a href="http://192.168.1.241:8000/api/user/xls" download>
                  <div className="hover:text-gray-800 hover:border-r-2 hover:border-gray-600 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors  duration-200  text-gray-600   ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      width="20"
                      fill="currentColor"
                    >
                      <path d="M4.583 7.125 2.604 4.896Q2.312 4.562 2.49 4.156Q2.667 3.75 3.125 3.75H16.333Q17 3.75 17.458 4.208Q17.917 4.667 17.917 5.333V14.667Q17.917 15.333 17.458 15.792Q17 16.25 16.333 16.25H6.167Q5.5 16.25 5.042 15.792Q4.583 15.333 4.583 14.667ZM7.5 10.667H15Q15.271 10.667 15.469 10.469Q15.667 10.271 15.667 10Q15.667 9.729 15.469 9.531Q15.271 9.333 15 9.333H7.5Q7.229 9.333 7.031 9.531Q6.833 9.729 6.833 10Q6.833 10.271 7.031 10.469Q7.229 10.667 7.5 10.667ZM7.5 13.167H12.5Q12.771 13.167 12.969 12.969Q13.167 12.771 13.167 12.5Q13.167 12.229 12.969 12.031Q12.771 11.833 12.5 11.833H7.5Q7.229 11.833 7.031 12.031Q6.833 12.229 6.833 12.5Q6.833 12.771 7.031 12.969Q7.229 13.167 7.5 13.167ZM7.5 8.167H15Q15.271 8.167 15.469 7.969Q15.667 7.771 15.667 7.5Q15.667 7.229 15.469 7.031Q15.271 6.833 15 6.833H7.5Q7.229 6.833 7.031 7.031Q6.833 7.229 6.833 7.5Q6.833 7.771 7.031 7.969Q7.229 8.167 7.5 8.167Z" />
                    </svg>
                    <span className="mx-4 text-lg font-normal">Report</span>
                  </div>
                </a>
              )}
              {isLoggedIn && (
                <div
                  className="hover:text-gray-800 hover:border-r-2 hover:border-gray-600 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors  duration-200  text-gray-600   "
                  onClick={logoutHandler}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    width="20"
                    fill="currentColor"
                  >
                    <path d="M7.438 9H13.938L11.833 6.896L13.229 5.521L17.729 10.021L13.229 14.521L11.833 13.146L14 11H7.438ZM10.021 2.333V4.312H4.25Q4.25 4.312 4.25 4.312Q4.25 4.312 4.25 4.312V15.688Q4.25 15.688 4.25 15.688Q4.25 15.688 4.25 15.688H10.021V17.667H4.25Q3.417 17.667 2.844 17.094Q2.271 16.521 2.271 15.688V4.312Q2.271 3.479 2.844 2.906Q3.417 2.333 4.25 2.333Z" />
                  </svg>

                  <span className="mx-4 text-lg font-normal">Logout</span>
                  <span className="flex-grow text-right"></span>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* <Container>
        <div className={classes.sideBarContainer}>
          <div className={classes.profileImg}>
            <Avatar
              alt="Profile"
              src={`${imgPath}${userCtx.userData.image}`}
              sx={{ width: 150, height: 150 }}
              className={classes.profileimg}
            />
          </div>
          <div className={classes.profileHead}>
            <h5>{userCtx.userData.name}</h5>
            <p>{userCtx.userData.email}</p>
          </div>
          <div className={classes.profileDetailsNumber}>
            <span>
              <TotalPost userData={userCtx.userData.name} />
            </span>
            <span>100</span>
            <span>50</span>
          </div>
          <div className={classes.profileDetails}>
            <span>Post</span>
            <span>Followers</span>
            <span>following</span>
          </div>
          <div className={classes.profileIndex}>
            <div>
              <Link to="/home/feed">Feed</Link>
            </div>

            <div>
              <Link to="/home/userpost">Post</Link>
            </div>
            <div>
              <Link to="/home/feed">Notification</Link>
            </div>
            <div>
              <Link to="/home/messagebox">Messages</Link>
            </div>
            <div>
              <Link to="/home/feed">Direct</Link>
            </div>
            <div>
              <Link to="/home/feed">Stats</Link>
            </div>
            <div>
              <Link to="/home/feed">Settings</Link>
            </div>
            {isLoggedIn && <div onClick={logoutHandler}> Logout</div>}
          </div>
        </div>
      </Container> */}
    </>
  );
};
export default Sidebar;

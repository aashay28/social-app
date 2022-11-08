import Modal from '../UI/Modal';
import { Form } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import classes from './AddProfile.module.css';
import AuthContext from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddProfile = props => {
  const authCtx = useContext(AuthContext);
  const [user, setUser] = useState({
    name: '',
    email: '',
    image: '',
  });
  const navigate = useNavigate();
  const [image, setImage] = useState();
  const loadData = async () => {
    const response = await fetch('http://192.168.1.241:8000/api/user', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${authCtx.token}`, // notice the Bearer before your token
      },
      body: JSON.stringify(),
    });
    const actualData = await response.json();
    console.log(actualData);
    setUser({
      name: actualData.data.name,
      email: actualData.data.email,
      image: actualData.data.image,
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveImage = e => {
    const file = e.target.files[0];
    console.log(file);
    setImage(file);
  };
  const postData = async e => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append('image', image);
    await fetch('http://192.168.1.241:8000/api/user', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${authCtx.token}`, // notice the Bearer before your token
      },
      body: formdata,
    }).then(data => data.json());
    navigate('/');
  };

  return (
    <Modal onClose={props.onClose}>
      <h5>Add Profile</h5>
      <div>
        <Form className="m-1" onSubmit={postData}>
          <div className={classes.profileHead}>
            <div className="flex justify-center">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="" />
              ) : (
                <img src={` ${user.image}`} alt="" />
              )}
            </div>
            <Form.Group className="m-4">
              <Form.Label>Add Image</Form.Label>
              <Form.Control
                type="file"
                id="image"
                name="image"
                placeholder="choose image"
                onChange={e => saveImage(e)}
                accept="image/jpeg, image/png ,image/avif"
              />
            </Form.Group>
          </div>

          <Form.Group className="m-2">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter Username"
              defaultValue={user.name}
              disabled
            />
          </Form.Group>
          <Form.Group className="m-2">
            <Form.Label>email</Form.Label>
            <Form.Control
              type="text"
              name="email"
              placeholder="Enter email"
              defaultValue={user.email}
              disabled
            />
          </Form.Group>
          <div className={`${classes.profileHead} `}>
            <button
              onClick={props.onClose}
              className="px-4 py-2 m-4 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 "
            >
              Close
            </button>

            <button
              type="submit"
              className="px-4 py-2 m-4 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
            >
              Save
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};
export default AddProfile;

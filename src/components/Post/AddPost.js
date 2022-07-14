import Modal from '../UI/Modal';
import { Form, Container } from 'react-bootstrap';
import { useState, useContext } from 'react';

import AuthContext from '../../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { addPostApi } from '../../Api/Api';

const AddPost = props => {
  const authCtx = useContext(AuthContext);
  const [post, setPost] = useState({
    caption: '',
  });

  const navigate = useNavigate();
  const [isUploaded, setIsUploaded] = useState(false);
  const [image, setImage] = useState();
  const getUserData = e => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const saveImage = e => {
    const file = e.target.files[0];
    setImage(file);
    setIsUploaded(true);
  };

  const postData = async event => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append('image', image);
    formdata.append('caption', post.caption);
    await addPostApi(formdata, authCtx.token);
    navigate('/');
  };

  return (
    <>
      <Modal onClose={props.onClose}>
        <h5>Add Post</h5>
        <Container>
          <Form className="m-5 " onSubmit={postData}>
            <Form.Group className="m-4">
              <Form.Label>Add Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                id="image"
                placeholder="choose image"
                onChange={e => saveImage(e)}
                accept="image/jpeg, image/png ,image/avif"
              />
            </Form.Group>
            <Form.Group className="m-4">
              <Form.Label>Caption</Form.Label>
              <Form.Control
                name="caption"
                placeholder="Enter Caption"
                onChange={e => getUserData(e)}
              />
            </Form.Group>
            <button
              onClick={props.onClose}
              className="px-4 py-2 m-4 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 "
            >
              Close
            </button>
            {isUploaded && (
              <button className="px-4 py-2 m-4 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                Save
              </button>
            )}
          </Form>
        </Container>
      </Modal>
    </>
  );
};
export default AddPost;

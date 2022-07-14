/* eslint-disable react-hooks/rules-of-hooks */
//------------------------------------------------------------------------------------------------
//POST API
//------------------------------------------------------------------------------------------------

export const signupApi = async user => {
  return fetch('http://192.168.1.241:8000/api/signup', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  }).then(data => data.json());
};
export const loginApi = async user => {
  return fetch('http://192.168.1.241:8000/api/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  }).then(data => data.json());
};
export const logoutApi = async token => {
  return fetch('http://192.168.1.241:8000/api/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(),
  });
};
export const addPostApi = async (formdata, token) => {
  return fetch('http://192.168.1.241:8000/api/post', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formdata,
  }).then(data => data.json());
};

export const getMsgApi = async (values, token) => {
  return fetch('http://192.168.1.241:8000/api/message/getmsg', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  }).then(data => data.json());
};
export const getMsgPostApi = async (token, values) => {
  return fetch('http://192.168.1.241:8000/api/message/getmsg', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  }).then(data => data.json());
};
//------------------------------------------------------------------------------------------------
//GET API
//------------------------------------------------------------------------------------------------
export const loggedInUserApi = async token => {
  return fetch('http://192.168.1.241:8000/api/user', {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`, // notice the Bearer before your token
    },
    body: JSON.stringify(),
  }).then(data => data.json());
};
export const postApi = async token => {
  return fetch('http://192.168.1.241:8000/api/post', {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`, // notice the Bearer before your token
    },
    body: JSON.stringify(),
  }).then(data => data.json());
};
export const userPostApi = async token => {
  return fetch('http://192.168.1.241:8000/api/getUserPost', {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`, // notice the Bearer before your token
    },
    body: JSON.stringify(),
  }).then(data => data.json());
};
export const getAllUserApi = async token => {
  return fetch('http://192.168.1.241:8000/api/getallUser?lastMessage=true', {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`, // notice the Bearer before your token
    },
    body: JSON.stringify(),
  }).then(data => data.json());
};
export const searchUserApi = async (token, value) => {
  return fetch(` http://192.168.1.241:8000/api/getallUser?search=${value}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`, // notice the Bearer before your token
    },
    body: JSON.stringify(),
  }).then(data => data.json());
};

//------------------------------------------------------------------------------------------------
//Delete API
//------------------------------------------------------------------------------------------------
export const deletePostApi = async (id, token, senderid, receiverid) => {
  return fetch(`http://192.168.1.241:8000/api/delete/post/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`, // notice the Bearer before your token
    },
    body: JSON.stringify({
      senderid: senderid,
      receiverid: receiverid,
    }),
  });
};
export const deleteAmessageApi = async (token, messageId) => {
  return fetch(
    `http://192.168.1.241:8000/api/message/delete/chat/${messageId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`, // notice the Bearer before your token
      },
      body: JSON.stringify(),
    }
  );
};

import axios from 'axios';

const BASE_URL = 'https://sep6-6733b.ew.r.appspot.com';

const instance = axios.create({
  baseURL: BASE_URL,
});

async function login(email, password) {
  try {
    const response = await instance.post('/login', {
      email,
      password,
    });
    if (!response.data.uid) throw new Error('Invalid user');
    return response.data;
  } catch (error) {
    return false;
  } 
}

export {
  login,
};

import axios from 'axios';

const BASE_URL = 'https://sep6-6733b.ew.r.appspot.com';

const instance = axios.create({
  baseURL: BASE_URL,
});

// Auth
async function login(email, password) {
  try {
    const response = await instance.post('/login', {
      email,
      password,
    });
    if (!response.data.uid) throw new Error('Invalid user');
    return response.data;
  } catch (error) {
    console.log('login error:', error);
    return false;
  } 
}

async function signup(username, email, password) {
  try {
    const response = await instance.post('/signup', {
      'userName': username,
      email,
      password,
    });
    if (!response.data.uid) throw new Error('Unable to sign up');
    return response;
  } catch (error) {
    console.log('signup error:', error);
    return error;
  }
}

// Favorites
async function addToFavorites(uid, movie) {
  const JWT = sessionStorage.getItem('JWT');
  try {
    const response = await instance.post(`/user/${uid}/favorite`, {
      'movieId': movie.id,
      'imageUrl': movie.poster_path,
      'title': movie.title
    },
    {
      headers: {
        'Authorization': `Bearer ${JWT}`,
      },
    });
    return response;
  } catch (error) {
    console.log('add favorite error:', error);
    return false;
  }
}

async function getFavorites(uid) {
  const JWT = sessionStorage.getItem('JWT');
  try {
    const response = await instance.get(`/user/${uid}/favorite`, {
      headers: {
        'Authorization': `Bearer ${JWT}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('get favorites error:', error);
    return false;
  }
}

async function removeFavorite(uid, movie) {
  const JWT = sessionStorage.getItem('JWT');
  try {
    const response = await instance.delete(`/user/${uid}/favorite`, 
    {
      data: movie,
      headers: {
        'Authorization': `Bearer ${JWT}`,
      },
    });
    return response;
  } catch (error) {
    console.log('delete favorite error:', error);
    return false;
  }
}

// comments
async function addComment(uid, movieId, text) {
  const JWT = sessionStorage.getItem('JWT');
  const email = sessionStorage.getItem('email');
  try {
    const response = await instance.post(`/comments/${movieId}/`, {
      movieId,
      userId: uid,
      text,
      userName: email
    },
    {
      headers: {
        'Authorization': `Bearer ${JWT}`,
      },
    });
    return response;
  } catch (error) {
    return false;
  }
}

async function getComments(movieId) {
  try {
    const response = await instance.get(`/comments/${movieId}`);
    return response
  } catch (error) {
    return false;
  }
}

export {
  login,
  signup,
  addToFavorites,
  getFavorites,
  removeFavorite,
  addComment,
  getComments,
};

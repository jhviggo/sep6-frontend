import axios from 'axios';

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "0a4f417a73d715128e70e0b7ea481b72";

const instance = axios.create({
  baseURL: BASE_URL,
});

async function getPopularMovies(page) {
  const res = await instance.get(`/movie/popular?api_key=${API_KEY}&page=${page}`);
  return res.data.results;
}

async function searchMovies(term, page) {
  const res = await instance.get(`/search/movie?api_key=${API_KEY}&query=${term}&page=${page}`);
  return res.data.results;
}

async function getMovie(movieId) {
  const res = await instance.get(`/movie/${movieId}?api_key=${API_KEY}`);
  return res.data;
}

async function getCredits(movieId) {
  const res = await instance.get(`/movie/${movieId}/credits?api_key=${API_KEY}`);
  return res.data;
}

export {
  getPopularMovies,
  getMovie,
  getCredits,
  searchMovies
};

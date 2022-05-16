import axios from 'axios';

const BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = "0a4f417a73d715128e70e0b7ea481b72"

const instance = axios.create({
  baseURL: BASE_URL,
})

async function getPopularMovies() {
  const data = await instance.get(`/movie/popular?api_key=${API_KEY}`);
  return data.data.results;
}

async function searchMovies(term) {
  const data = await instance.get(`/search/movie?api_key=${API_KEY}&query=${term}`);
  console.log(data.data.results);
  return data.data.results;
}

export {
  getPopularMovies,
  searchMovies
};

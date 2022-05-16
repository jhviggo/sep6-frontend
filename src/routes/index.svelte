<script>
  import { onMount } from 'svelte';
  import Card from '../components/card.svelte';
  import { getPopularMovies, searchMovies } from '../lib/movieApi';

  let suggestedMovies = [];
  let movies = [];
  let searchTerm = '';

  onMount(async () => {
		movies = await getPopularMovies();
    suggestedMovies = movies;
	});

  async function searchMoviesButton() {
    movies = [];
    if (searchTerm === '') {
      movies = suggestedMovies;
    } else {
      movies = await searchMovies(searchTerm);
    }
  }

  function clearSearch() {
    movies = [];
    searchTerm = '';
    movies = suggestedMovies;
  }
</script>

<div class="container">
  <div class="row">
    <div class="col-6 mx-auto">
      <div class="input-group my-5">
        <input type="text" class="form-control" placeholder="Search for movies..." bind:value={searchTerm}/>
        <button class="btn btn-outline-secondary" type="button" on:click={clearSearch}>X</button>
        <button class="btn btn-success" type="button" on:click={searchMoviesButton}>Search!</button>
      </div>
    </div>
  </div>
  <div class="row">
    {#each movies as movie}
      <div class="col-2 mb-3">
        <Card image={movie.poster_path} title={movie.original_title} id={movie.id}></Card>
      </div>
    {/each}
  </div>
</div>

<style>
  h1 {
    color: blue;
  }
</style>
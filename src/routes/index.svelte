<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores'
  import Card from '../components/card.svelte';
  import { getPopularMovies, searchMovies } from '../lib/movieApi';

  let suggestedMovies = [];
  let movies = [];
  let searchTerm = '';
  let pageNumber = 1;

  onMount(async () => {
    if ($page.url.searchParams.has('page')) {
      pageNumber = Number($page.url.searchParams.get('page'));
    }
		if (searchTerm) {
      movies = await searchMoviesButton();
    } else {
      movies = await getPopularMovies(pageNumber);
    }
    suggestedMovies = movies;
	});

  async function searchMoviesButton() {
    movies = [];
    if (searchTerm === '') {
      movies = suggestedMovies;
    } else {
      movies = await searchMovies(searchTerm, pageNumber);
    }
  }

  async function updatePage(p) {
    console.log(p);
    pageNumber = Number(p);
    window.location.href = `/?page=${pageNumber}`;
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
  <div class="pagination">
    <button class="btn btn-outline-primary" on:click={() => updatePage(1)}>First</button>
    <button class="btn btn-outline-primary" on:click={() => updatePage(pageNumber - 1)}>Previous</button>
    <button disabled class="btn btn-outline-primary">{pageNumber}</button>
    <button class="btn btn-outline-primary" on:click={() => updatePage(pageNumber + 1)}>Next</button>
  </div>
</div>

<style>
  h1 {
    color: blue;
  }

  .pagination {
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
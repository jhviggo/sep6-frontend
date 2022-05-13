<script>
  import Card from '../components/card.svelte';
  import { getPopularMovies } from '../lib/movieApi';
</script>

<div class="container">
  <div class="row">
    <div class="col-6 mx-auto">
      <div class="input-group my-3">
        <input type="text" class="form-control" placeholder="Search for movies..." />
        <button class="btn btn-success" type="button" id="button-addon2">Search!</button>
      </div>
    </div>
  </div>
  <div class="row">
    {#await getPopularMovies() then movies}
      {#each movies as movie}
        <div class="col-2 mb-3">
          <Card image={movie.poster_path} title={movie.original_title} id={movie.id}></Card>
        </div>
      {/each}
    {/await}
  </div>
</div>

<style>
  h1 {
    color: blue;
  }
</style>
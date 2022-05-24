<script>
  import { onMount } from 'svelte';
  import Card from '../components/card.svelte';
  import { getFavorites, removeFavorite } from '../lib/sepApi';

  let favorites;
  let favoritesError;
  let loading = true;

  onMount(async() => {
    const uid = sessionStorage.getItem('uid');
    if (!uid) {
      favoritesError = "Please log in";
    }
    favorites = await getFavorites(uid);
    loading = false;
	});

  async function btnRemoveFavorite(favoriteMovie) {
    console.log('favoriteMovie', favoriteMovie);
    const uid = sessionStorage.getItem('uid');
    const response = await removeFavorite(uid, favoriteMovie);
    if (!response) {
      favoritesError = "Something went wrong!";
      return;
    }
    favorites = await getFavorites(uid);
  }
</script>

<div class="container">
  {#if !loading}
  <div class="row mt-5">
    {#each favorites as movie}
      <div class="col-2 mb-3">
        <Card image={movie.imageUrl} title={movie.title} id={movie.movieId}>
          <div>
            <button class="btn btn-outline-danger w-100" on:click|preventDefault={() => btnRemoveFavorite(movie)}>Remove favorite</button>
          </div>
        </Card>
      </div>
    {/each}
  </div>
  {:else}
  <div class="spinner">
    <div class="spinner-border mt-5" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  {/if}
  {#if favoritesError}
    <div class="alert alert-danger mt-5" role="alert">
      {favoritesError}
    </div>
  {/if}
  {#if !loading && !favorites.length}
    <div class="alert alert-warning mt-5" role="alert">
      Your top list appears to be empty, please head to the <a href="/">Home</a> page to find some movies!
    </div>
  {/if}
</div>

<style>
  .container {
    min-height: 70vh;
  }

  .spinner {
    display: flex;
    justify-content: center;
  }
</style>

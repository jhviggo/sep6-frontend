<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getMovie, getCredits } from '../../lib/movieApi';

  let movie;
  let actors;
  let actorsFolded = true;
  let directors;

  onMount(async () => {
		getMovie($page.params.id).then((value) => movie = value);
    getCredits($page.params.id)
      .then((value) => {
        actors = value.cast.sort((a,b) => b.popularity - a.popularity);
        directors = value.crew.filter((c) => c.job === 'Director');
        console.log(directors);
      });
	});

  function toggleFold() {
    actorsFolded = !actorsFolded;
  }
</script>

<div class="container">
  {#if movie}
    <h1>{movie.title}</h1>
    <div class="overview">
      <div>
        <div class="poster">
          <span class="sub-header">{movie.release_date.split('-')[0]} - {parseInt(movie.runtime / 60)}h {movie.runtime & 60}m</span>
          <img src="https://image.tmdb.org/t/p/w500/{movie.poster_path}" alt={movie.title} width="100%"/>
        </div>
        <div class="detail shadow p-2 mb-2 mt-2">
          {movie.overview}
        </div>
      </div>
      <div class="ps-2">
        <div class="detail shadow p-2 mb-2">
          <p class="detail-header">Actors</p>
          <div class="actors {actorsFolded ? 'folded' : ''}">
            {#if actors}
              {#each actors as actor}
                <div class="actor mt-1">
                  <div class="avatar">
                    <img src="https://image.tmdb.org/t/p/w200/{actor.profile_path}" alt={actor.name}/>
                  </div>
                  <div class="ms-1">
                    <p class="m-0">{actor.name}</p>
                    <p class="m-0">Playing:</p>
                    <p class="orangered">{actor.character}</p>
                  </div>
                </div>
              {/each}
            {:else}
              <div class="spinner">
                <div class="spinner-border mt-5" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            {/if}
          </div>
          <div class="btn-unfold" on:click={toggleFold}>
            See {actorsFolded ? 'more' : 'less'}
          </div>
        </div>
        <div class="detail shadow p-2 mb-2">
          <p class="detail-header">Director</p>
          <div class="actors">
            {#if directors}
              {#each directors as director}
                <div class="actor mt-1">
                  <div class="avatar">
                    <img src="https://image.tmdb.org/t/p/w200/{director.profile_path}" alt={director.name}/>
                  </div>
                  <div class="ms-1">
                    <p class="m-0">{director.name}</p>
                  </div>
                </div>
              {/each}
            {:else}
              <div class="spinner">
                <div class="spinner-border mt-5" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
      <div class="detail shadow p-2 ms-2">
        <p class="detail-header">Ratings</p>
      </div>
    </div>
    <div class="comments detail mt-2 p-2">
      <textarea type="text" placeholder="Add a comment..." cols="40" rows="5"/>
    </div>
  {:else}
    <div class="spinner">
      <div class="spinner-border mt-5" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .spinner {
    display: flex;
    width: 100%;
    justify-content: center;
  }

  h1 {
    text-align: center;
  }

  .overview {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
  }

  .poster {
    overflow: hidden;
    border-radius: 8px;
  }

  .sub-header {
    display: flex;
    justify-content: center;
    background-color: orange;
    width: 100%;
  }

  .detail-header {
    color: orangered;
    font-weight: bold;
  }

  .detail {
    background-color: white;
    border-radius: 8px;
  }

  .actors {
    display: grid;
    overflow: hidden;
    grid-template-columns: 1fr 1fr;
  }

  .actor {
    display: flex;
    flex-direction: row;
  }

  .avatar {
    display: flex;
    justify-content: center;
    height: 8rem;
    width: 5.2rem;
    border-radius: 8px;
    overflow: hidden;
    background-color: lightgrey;
  }

  .avatar img {
    height: 100%;
  }

  .orangered {
    color: orangered;
  }

  .folded {
    max-height: 25rem;
    mask-image: linear-gradient(180deg, #000 75%, transparent);
    -webkit-mask-image: linear-gradient(180deg, #000 75%, transparent);
  }

  .btn-unfold {
    display: flex;
    justify-content: center;
    user-select: none;
  }

  .btn-unfold:hover {
    cursor: pointer;
  }

  .comments {
    display: flex;
  }

  .comments textarea {
    border: none;
    border-bottom: 1px solid gray;
    width: 25%;
  }

  .comments textarea:focus {
    outline: none;
  }
</style>

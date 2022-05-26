<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getMovie, getCredits } from '../../lib/movieApi';
  import { addToFavorites, addComment, getComments } from '../../lib/sepApi';

  let movie;
  let actors;
  let directors;
  let favoriteError;
  let text;
  let comments = [];

  // polling
  setInterval(async () => {
    await updateComments();
  }, 5000);

  onMount(async () => {
		getMovie($page.params.id).then(async(value) => {
      movie = value
    });
    getCredits($page.params.id)
      .then((value) => {
        actors = value.cast.sort((a,b) => b.popularity - a.popularity);
        directors = value.crew.filter((c) => c.job === 'Director');
      });

    updateComments();
	});

  async function updateComments() {
    const response = await getComments($page.params.id);
    if (response) {
      // cheeky sort, since firebase doesn't order
      comments = response.data?.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
    }
  }

  async function btnAddToFavorites() {
    const uid = sessionStorage.getItem('uid');
    if (!uid) {
      favoriteError = "Please login first";
      return;
    }
    const response = await addToFavorites(uid, movie);

    if (!response) {
      favoriteError = "Something went wrong!";
      return;
    }

    favoriteError = '';
  }

  async function btnAddComment() {
    if (text?.length <= 0) {
      return;
    }
    const uid = sessionStorage.getItem('uid');
    await addComment(uid, movie.id, text);
    updateComments();
    text = '';
  }

  function displayDateTime(timestamp) {
    const dt = new Date(timestamp);
    return `${dt.getDay()}/${dt.getMonth()}-${dt.getFullYear()} ${dt.getHours()}:${dt.getMinutes() || '00'}`;
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
        <div class="detail shadow p-2 mt-2">
          {movie.overview}
        </div>
      </div>
      <div class="ps-2">
        <div class="detail shadow p-2 mb-2" style="height: 69%;">
          <p class="detail-header">Actors</p>
          <div class="actors">
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
        </div>
        <div class="detail shadow p-2" style="height: 30%;">
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
      <div class="ms-2">
        <div class="info-panel detail shadow p-2 mb-2">
          <p class="detail-header">Add as a favorite!</p>
          <p>You can add movies to your personal top list! Doing this will make it easier to find later, simply navigate to the <a href="/top-list">top list page</a>.</p>
          <button class="btn btn-outline-success" on:click={btnAddToFavorites}>Add to favorite</button>
          {#if favoriteError}
            <p class="alert alert-danger mt-3" role="alert">{favoriteError}</p>
          {/if}
        </div>
        <div class="info-panel detail shadow p-2">
          <p class="detail-header">Ratings</p>
          <div class="stars-container">
            <p class="stars" style="width: {movie.vote_average * 10}%;">⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐</p>
          </div>
          <p><span class="orangered">Stars:</span> {movie.vote_average}/10</p>
          <p><span class="orangered">Ratings:</span>{movie.vote_count}</p>
        </div>
      </div>
    </div>
    <div class="comments detail shadow mt-3 p-2">
      <textarea type="text" placeholder="Add a comment..." cols="40" rows="5" bind:value={text}/>
      <button class="btn btn-outline-success" on:click={btnAddComment}>Add comment</button>
    </div>
    <div class="comments detail shadow mt-2 p-2">
      {#each comments as comment}
        <div class="comment">
          <span class="user ps-2">{comment.userName}</span> <small>{displayDateTime(comment.timestamp)}</small>
          <p>{comment.text}</p>
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

  .info-panel {
    height: 49.5%;
  }

  .actors {
    display: grid;
    overflow-y: scroll;
    grid-template-columns: 1fr 1fr;
    scrollbar-width: thin;
    max-height: 23rem;
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

  .comments {
    display: flex;
    flex-direction: column;
    width: 45%;
  }

  .comments textarea {
    border: none;
    border-bottom: 1px solid gray;
    width: 100%;
  }

  .comments textarea:focus {
    outline: none;
  }

  .comment:not(:last-child) {
    border-bottom: 1px solid lightgray;
  }

  .stars-container {
    width: fit-content;
  }

  .stars {
    overflow: hidden;
  }

  .user {
    color: orangered;
    text-decoration: underline;
  }
</style>

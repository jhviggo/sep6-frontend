<script>
  export let image;
  export let title;
  export let id
</script>

<a class="card shadow" href="/movie/{id}">
  <img src="https://image.tmdb.org/t/p/w300/{image}" class="card-img-top" alt="{title}" width="100%">
  <div class="card-body">
    <span class="card-title">{title}</span>
    <slot></slot>
  </div>
</a>

<style>
  .card {
    text-decoration: none;
    color: black;
    height: 100%;
  }

  .card-title {
    display: flex;
    flex-direction: column;
  }
</style>
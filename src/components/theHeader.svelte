<script>
  import { onMount } from 'svelte';
  import { login } from '../lib/userApi';
  
  let loginIsHidden = true;
  let email;
  let password;
  let isLoggedIn = false;

  onMount(() => {
		const JWT = sessionStorage.getItem('JWT');
    const uid = sessionStorage.getItem('uid');

    if (JWT && uid) {
      isLoggedIn = true;
    }
	});

  function toggleLogin() {
    loginIsHidden = !loginIsHidden;
  }

  function hideLogin() {
    loginIsHidden = true;
  }

  async function btnLogin() {
    const user = await login(email, password);
    if (!user) return;

    sessionStorage.setItem('email', email);
    sessionStorage.setItem('uid', user.uid);
    sessionStorage.setItem('JWT', user.accessToken);
    isLoggedIn = true;
    email = '';
    password = '';
  }

  function btnLogout() {
    sessionStorage.clear();
    isLoggedIn = false;
  }

  function clickOutside(node) {
    const handleClick = event => {
      if (node && !node.contains(event.target) && !event.defaultPrevented) {
        node.dispatchEvent(
          new CustomEvent('click_outside', node)
        )
      }
    }
    document.addEventListener('click', handleClick, true);
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    }
  }
</script>

<ul class="nav justify-content-center p-2">
  <li class="nav-item mx-1">
    <a class="nav-link" aria-current="page" href="/">Home</a>
  </li>
  <li class="nav-item mx-1">
    <a class="nav-link" aria-current="page" href="/profile">Profile</a>
  </li>
  <li class="nav-item mx-1">
    <a class="nav-link" aria-current="page" href="/top-list">Top list</a>
  </li>
  {#if !isLoggedIn}
    <li class="nav-item mx-1">
      <span class="nav-link login" on:click={toggleLogin}>login</span>
      <div class="login-form mt-2 p-3 shadow { loginIsHidden ? 'hidden' : '' }" use:clickOutside on:click_outside={hideLogin}>
        <label for="inp-email">Email</label>
        <input type="text" id="inp-email" bind:value={email}/>
        <label for="inp-passwd">Password</label>
        <input type="password" id="inp-passwd" bind:value={password}/>
        <button class="btn btn-success mt-3 mb-1" on:click={btnLogin}>Login</button>
        <a href="/signup">Sign up</a>
      </div>
    </li>
  {:else}
    <li class="nav-item mx-1">
      <span class="nav-link" on:click={btnLogout}>logout</span>
    </li>
  {/if}
</ul>

<style>
  .nav {
    background-color: orangered;
  }

  a, span {
    color: white;
  }

  a:hover, span:hover {
    color: black;
    cursor: pointer;
  }

  .login {
    position: relative;
  }

  .login-form a {
    color: black;
    text-decoration: none;
  }

  .login-form {
    z-index: 5;
    display: flex;
    flex-direction: column;
    position: absolute;
    background-color: white;
    border: 1px solid lightgray;
    border-radius: 0 0 8px 8px;
  }

  .hidden {
    display: none;
  }
</style>

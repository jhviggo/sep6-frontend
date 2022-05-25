<script>
  import { signup } from '../lib/sepApi';

  let username, email, password, rpassword;
  let errorText;

  function clear() {
    username = "";
    email = "";
    password = "";
    rpassword = "";
  }

  function validate() {
    if (!username) {
      errorText = "Please enter a username";
      return false;
    } else if (!email) {
      errorText = "Please enter an E-mail";
      return false;
    } else if (password !== rpassword) {
      errorText = "Passwords do not match";
      return false;
    }
    return true;
  }

  async function submit() {
    if (!validate()) {
      return;
    }
    const response = await signup(username, email, password);
    console.log('here', response);
    if (response?.response?.status === 400) {
      errorText = `Unable to sign up user because of ${response.response?.data?.replace('Firebase: ', '')}`;
      return;
    }
    errorText = '';
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('uid', response.data.uid);
    sessionStorage.setItem('JWT', response.data.accessToken);
    window.location.href = '/';
  }
</script>

<div class="container">
  <h1>Sign up</h1>
  <div class="col-4">
    <label for="inp-username">Username</label>
    <input type="text" id="inp-username" class="form-control" bind:value={username} />

    <label for="inp-signup-email">Email</label>
    <input type="text" id="inp-signup-email" class="form-control" bind:value={email} />

    <label for="inp-password">Password</label>
    <input type="password" id="inp-password" class="form-control" bind:value={password} />

    <label for="inp-password2">Repeat password</label>
    <input type="password" id="inp-password2" class="form-control" bind:value={rpassword} />

    <div class="mt-3">
      <button class="btn btn-outline-success" on:click={submit}>Sign up</button>
      <button class="btn btn-outline-secondary" on:click={clear}>Clear</button>
    </div>
  </div>
  {#if errorText}
  <div class="alert alert-danger mt-5" role="alert">
    {errorText}
  </div>
  {/if}
</div>

<style>
  .container {
    min-height: 70vh;
  }
</style>

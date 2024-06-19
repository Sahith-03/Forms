<script lang="ts">
  import type { ActionData } from './$types';
  export let form: ActionData;

</script>

<form method="POST">
  <input type="email" name="email" placeholder="Email" required />
  <input type="password" name="password" placeholder="Password" required />
  {#if form?.error}
    <p class="error">{form?.error}</p>
  {/if}
  <button type="submit">Login</button>
</form>

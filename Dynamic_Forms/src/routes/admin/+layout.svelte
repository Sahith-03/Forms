<script>
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    // Function to handle logout
    async function logout() {
        goto('/logout');
    }
</script>

<div>
    <nav>
        <!-- Navigation links can be added here -->
        <button on:click={logout}>Logout</button>
    </nav>
</div>

<slot></slot>

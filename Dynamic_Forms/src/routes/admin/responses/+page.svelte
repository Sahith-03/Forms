<script lang="ts">
    import { onMount } from 'svelte';
    import { writable, type Writable } from 'svelte/store';
    import { enhance } from '$app/forms';
    import '../../../app.css';

    import type { PageData } from './$types';

    export let data: PageData;

    const responses = writable([])

    responses.set(data.data)

    // console.log(data.data)

    // async function fetchResponses() {
    //     const res = await fetch('http://localhost:3000/api/form-data',{
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     });
    //     responses.set(await res.json());
    // }
    
    async function deleteResponses() {
        const res = await fetch('http://localhost:3000/api/form-data',{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        responses.set(await res.json());
        setTimeout(() => {
            window.location.reload(); // Reload the page
        }, 500);
    }

    // onMount(fetchResponses);
</script>

<p class="text-center font-bold text-5xl mt-4"> Responses </p>
<div class="flex justify-center mt-6 gap-5 my-auto">
{#each $responses as response}
    <div class="border border-black rounded-md p-2 m-2 h-max">
        {#each Object.entries(response["responses"]) as [key, value]}
        {#if key !== 'id'}
            <div class="flex">
            <div class="font-bold mr-1">{key}: </div>
            <div>{value}</div>
            </div>
        {/if}
        {/each}
    </div>
{/each}
</div>
<div class="flex justify-center">
    <button on:click={deleteResponses} class="mt-6 rounded-md w-max p-2 text-xl bg-black text-white"> Delete </button>
</div>

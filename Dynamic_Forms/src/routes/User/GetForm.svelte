<script lang="ts">
    // export let form
    import '../../app.css';
    // import type {PageData} from './$types';
    // export let data: PageData;
</script>

<style>
    input{
        @apply border border-black rounded-md p-2 h-12 w-full mx-auto ;
    }
    form{
        /* @apply flex flex-col gap-4 bg-white w-2/5 mx-auto p-4 rounded-lg; */
        @apply text-xl m-auto w-1/3 p-6 gap-y-4 flex flex-col border border-black rounded-lg bg-white;
    }

</style>

<h1 class="text-5xl text-center pt-5 mb-5">Form Details</h1>
<form action="?/getDetails" method="POST">
    <input type="email" name="email" placeholder="Admin Email" required/>
    <input type="text" name="formName" placeholder="Form Name" required />
    <button type="submit" class=" rounded-md h-11 mt-4 bg-violet-600 font-semibold text-white active:bg-violet-700">Get Form</button>
    
</form>
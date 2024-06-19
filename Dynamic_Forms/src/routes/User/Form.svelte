<script lang="ts">
    import { enhance } from '$app/forms';
    import type { Schema, Field } from '../../lib/types';
    
    export let schema: Schema = [];

    console.log("Schema",schema)

    let formData: { [key: string]: any } = {};

    function initializeFormData() {
        schema.forEach(field => {
            formData[field.field_name] = field.field_type === 'checkbox' ? [] : '';
        });
    }

    initializeFormData();
</script>

<style>
    input{
        @apply border border-black rounded-md p-2 h-10;
    }
    form div div div{
        @apply flex gap-1;
    }
    form div div div label{
        @apply my-auto ml-2 mt-1;
    }
    form div div input{
        @apply w-6;
    }
</style>

<h1 class="text-5xl text-center pt-5 mb-5">Dynamic Form</h1>

<form method="POST" action="?/formData" class="text-xl m-auto w-1/3 p-6 gap-y-2 flex flex-col border border-black rounded-lg bg-white">
    {#each schema as field}
        <div class="flex flex-col gap-1">
            <label for={`input-${field.field_name}`} class="label">{field["field_name"]}</label>
            {#if field["field_type"] === 'text'}
                <input type="text" name={field["field_name"]} bind:value={formData[field["field_name"]]} id={field["field_name"]} required />
            {:else if field["field_type"] === 'email'}
                <input type="email" name={field["field_name"]} bind:value={formData[field["field_name"]]} id={field["field_name"]} required />
            {:else if field["field_type"] === 'number'}
                <input type="number" name={field["field_name"]} bind:value={formData[field["field_name"]]} id={field["field_name"]} required />
            {:else if field.field_type === 'checkbox'}
                <div>
                    {#each field.options as option}
                    <div>
                        <input type="checkbox" id={option} bind:group={formData[field.field_name]} value={option} />    
                        <label for={option}>{option}</label>
                    </div>
                    {/each}
                </div>
            {:else if field.field_type === 'radio'}
                <div>
                    {#each field.options as option}
                    <div>
                        <input type="radio" id={option} bind:group={formData[field.field_name]} value={option}/>    
                        <label for={option}>{option}</label>
                    </div>
                    {/each}
                </div>
            {:else if field.field_type === 'select'}
                <select id={`input-${field.field_name}`} bind:value={formData[field.field_name]} name={`input-${field.field_name}`} class="border p-1 border-black rounded">
                    <option value="">---Please Select an Option---</option>
                    {#each field.options as option}
                        <option value={option}>{option}</option>
                    {/each}
                </select>
            {/if}
        </div>
    {/each}
    <button class=" rounded-md h-11 mt-4 bg-violet-600 font-semibold text-white active:bg-violet-700" type="submit">Submit</button>
</form>
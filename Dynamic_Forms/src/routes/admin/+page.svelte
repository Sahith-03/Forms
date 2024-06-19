<script lang="ts">
    // import { onMount } from 'svelte';
    import type { Schema, Field } from '../../lib/types';
    import '../../app.css';
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    import { redirect } from '@sveltejs/kit';

    export let data: PageData;
    
    let schema: Schema = [];
    let newField: Field = { field_name: '', field_type: 'text', options: [''] };
    let error: string | null = null;

    const form = data.response[0];
    schema = form.formSchema;

    function addField() {
        schema = [...schema, { ...newField }];
        newField = { field_name: '', field_type: 'text', options: [''] }; 
    }

    function ensureOptions(field: Field) {
        console.log("Field:",field.options);
        if (!field.options || field.options.length === 0) {
            field.options = [''];
        }
    }

    function response(){
        throw redirect(302,'/admin/response/')  
    }
</script>

<button on:click={response}>Responses</button>
<div class="min-h-screen bg-slate-300">
    <!-- <label for="formName" class="text-3xl m-0 bg-purple-500 ml-1 rounded-l-lg -mr-1">#</label>
    <input type="text" name="formName" id="formName" value="Untitled Form" class="bg-transparent text-3xl placeholder-black mt-2 p-1 border-black focus:outline-none"/> -->
    <h1 class="text-5xl font-semibold text-center pt-5">Form Builder</h1>
    <form method="POST" class="text-xl mt-3 w-max mx-auto flex flex-col">
        <div>
        <label for="formName" class="text-3xl m-0 bg-purple-500 ml-1 rounded-l-lg -mr-1">#</label>
        <input type="text" name="formName" id="formName" value={form.formName} class="bg-transparent text-3xl placeholder-black mt-2 p-1 border-black focus:outline-none"/>
        </div>
        {#each schema as field, i}
            <div class="text-xl mt-5 mx-auto p-6 gap-y-2 flex flex-col border border-black rounded-lg bg-white">
                <div class="flex">
                    <input class="border-b-2 border-black p-1 h-12 w-80 bg-slate-50 rounded-t"
                        type="text"
                        placeholder="Field Name"
                        bind:value={schema[i].field_name} />
                    <select bind:value={schema[i].field_type} class="border border-black rounded-md h-12 ml-2" on:change={() => ensureOptions(field)}>
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="select">Select</option>
                        <option value="radio">Radio</option>
                    </select>
                    <button type="button" class="h-12 rounded-full m-auto align-middle w-12 ml-5 hover:bg-slate-100 text-white pl-2"
                        on:click={() => schema = schema.filter((_, j) => i !== j)}>
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" height="32" class="fill-gray-700" viewBox="0 0 24 24">
                            <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                        </svg>
                    </button>
                </div>
                {#if field.field_type === 'select' || field.field_type === 'radio' || field.field_type === 'checkbox'}
                    <div class="mt-2">
                        <div class="flex flex-col gap-y-2">
                            {#each field.options as option, optionIndex}
                                <div class="flex items-center gap-2">
                                    <input class="border border-black rounded-md p-2 h-10 w-full"
                                        type="text"
                                        bind:value={field.options[optionIndex]} />
                                    {#if optionIndex === 0}
                                        <span class="text-gray-500 pl-2 pr-4 ">Default</span>
                                    {/if}
                                    {#if optionIndex > 0}
                                    <button type="button" class="border border-red-500 text-red-500 px-2 rounded-md hover:bg-red-500 hover:text-white"
                                        on:click={() => field.options = field.options.filter((_, k) => k !== optionIndex)}>
                                        Remove
                                    </button>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                        <button type="button" on:click={() => field.options = [...field.options, '']} class="border h-10 px-2 border-black rounded-lg bg-slate-700 hover:bg-slate-800 text-white mt-2">
                            Add Option
                        </button>
                    </div>
                {/if}
            </div>
        {/each}
        <div class="text-xl w-full mt-5 mx-auto p-6 gap-y-2 flex flex-col border border-black rounded-lg bg-white">
            <div class="flex justify-between">
                <input class="border-b-2 border-black p-2 h-12 w-96 bg-slate-50 focus:outline-none rounded-t"
                    type="text"
                    placeholder="Question"
                    bind:value={newField.field_name} />
                <select bind:value={newField.field_type} class="border border-black rounded-md h-12 ml-2">
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="select">Select</option>
                    <option value="radio">Radio</option>
                </select>
            </div>
            <button type="button" class="border h-10 px-2 mt-4 border-black rounded-lg bg-slate-700 hover:bg-slate-800 text-white"
                on:click={addField}>Add Field</button>
        </div>
        <input type="hidden" name="schema" value={JSON.stringify(schema)} />
        <button class="rounded-md h-11 mt-6 mb-10 bg-violet-600 font-semibold text-white active:bg-violet-700"
            type="submit">Save Schema</button>
    </form>
</div>



<!-- <div class="min-h-screen bg-slate-300">
    <h1 class="text-5xl font-semibold text-center pt-5">Form Builder</h1>
    <div class="text-xl mt-3 w-max mx-auto flex flex-col">
    {#each schema as field, i}
        <div class="text-xl mt-5 mx-auto p-6 gap-y-2 flex flex-col border border-black rounded-lg bg-white">
            <div class="flex">
            <input class="border-b-2 border-black p-1 h-12 w-80 bg-slate-50 rounded-t"
                type="text"
                placeholder="Field Name"
                bind:value={schema[i].field_name} />
            <select bind:value={schema[i].field_type} class="border border-black rounded-md h-12 ml-2" on:change={() => ensureOptions(field)}>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="checkbox">Checkbox</option>
                <option value="select">Select</option>
                <option value="radio">Radio</option>
            </select>
            <button class="h-12 rounded-full m-auto align-middle w-12 ml-5 hover:bg-slate-100 text-white pl-2"
                on:click={() => schema = schema.filter((_, j) => i !== j)}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" height="32" class="fill-gray-700" viewBox="0 0 24 24">
                    <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                </svg>
            </button>
            </div>
            {#if field.field_type === 'select' || field.field_type === 'radio' || field.field_type === 'checkbox'}
                <div class="mt-2">
                    <div class="flex flex-col gap-y-2">
                    {#each field.options as option, optionIndex}
                        <div class="flex items-center gap-2">
                            <input class="border border-black rounded-md p-2 h-10 w-full"
                                type="text"
                                bind:value={field.options[optionIndex]} />
                            {#if optionIndex === 0}
                                <span class="text-gray-500 pl-2 pr-4 ">Default</span>
                            {/if}
                            {#if optionIndex > 0}
                            <button class="border border-red-500 text-red-500 px-2 rounded-md hover:bg-red-500 hover:text-white"
                                on:click={() => field.options = field.options.filter((_, k) => k !== optionIndex)}>
                                Remove
                            </button>
                            {/if}
                        </div>
                    {/each}
                    </div>
                    <button on:click={() => field.options = [...field.options, '']} class="border h-10 px-2 border-black rounded-lg bg-slate-700 hover:bg-slate-800 text-white mt-2">
                        Add Option
                    </button>
                </div>
            {/if}
            
        </div>
    {/each}
    <div class="text-xl w-full mt-5 mx-auto p-6 gap-y-2 flex flex-col border border-black rounded-lg bg-white">
        <div class="flex justify-between">
        <input class="border-b-2 border-black p-2 h-12 w-96 bg-slate-50 focus:outline-none rounded-t"
            type="text"
            placeholder="Question" required
            bind:value={newField.field_name} />
        <select bind:value={newField.field_type} class="border border-black rounded-md h-12 ml-2">
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="email">Email</option>
            <option value="checkbox">Checkbox</option>
            <option value="select">Select</option>
            <option value="radio">Radio</option>
        </select>
        </div>
        <button class="border h-10 px-2 mt-4 border-black rounded-lg bg-slate-700 hover:bg-slate-800 text-white"
            on:click={addField}>Add Field</button>
    </div>
    <button class="rounded-md h-11 mt-6 mb-10 bg-violet-600 font-semibold text-white active:bg-violet-700"
        on:click={saveSchema}>Save Schema</button>
    </div>
</div> -->

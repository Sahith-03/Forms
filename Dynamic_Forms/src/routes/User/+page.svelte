<script lang="ts">
    // import { onMount } from 'svelte';
    import type { Schema, Field } from '../../lib/types';
    import '../../app.css';
    
    import GetForm from './GetForm.svelte'
    import Form from './Form.svelte'
    
    import type { PageData, ActionData} from './$types';
    // import { actions } from './proxy+page.server';
    export let data: PageData;
    // export let actionData: ActionData;

    let schema: Schema = [];
    
    schema = data.schema["formSchema"];
    const formId = data.schema.id;
    // if(actionData?.message=="Details fetched successfully"){        
    //     schema = data.schema["formSchema"];
    //     const formId = data.schema.id;
    // }
    
    // console.log(schema);

    // console.log("Data",data)
    // console.log("\nSchema",schema)
</script>





<div class="w-screen h-screen bg-slate-200" >
    
    <GetForm/>
    {#if data && data.message=="Form schema not found"}
        <p class="text-center text-red-500">{data.message}</p>
    {/if}
    <Form {schema}/>

</div>
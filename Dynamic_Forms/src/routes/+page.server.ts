import type { Schema, Field } from '../lib/types';
import type { PageServerLoad , Actions } from './$types';

let schema: Schema = [];


export const load: PageServerLoad = async ({ fetch }) => {
    const res = await fetch('http://localhost:3000/api/form-schema');
    const schema = await res.json();
    return { schema };
};

// export const actions: Actions ={
//     default: async ({ request }) => {
//         const data = await request.formData();
        
//         let labels = document.getElemen

//         console.log(data);

//         // if (typeof formData !== 'string') {
//         //     return json({ message: 'Invalid form data' }, { status: 400 });
//         // }

//         // // const formData = JSON.parse(formDataString);
//         // console.log(formData);

//         // const res = await fetch('http://localhost:3000/api/form-data', {
//         //     method: 'POST',
//         //     headers: {
//         //         'Content-Type': 'application/json'
//         //     },
//         //     body: JSON.stringify( formData )
//         // });

//         // if (!res.ok) {
//         //     const errorData = await res.json();
//         //     return json({ message: `Failed to save responses: ${errorData.message}` }, { status: 500 });
//         // }

//         // return json({ message: 'Responses saved successfully' });        
//     }
// }

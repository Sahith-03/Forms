import type { Schema, Field } from '../../lib/types';
import type { PageServerLoad,Actions } from './$types';
import { json } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
    const res = await fetch('http://localhost:3000/api/form-schema');
    const schema = await res.json();
    return { schema };
};

function emptyField(field: Field): boolean {
    if (!field.field_name.trim()) {
        console.log('Field name cannot be empty');
        return false;
    }
    return true;
}


export const actions: Actions = {
    default: async ({ request }) => {
      console.log('Saving Schema');
      const data = await request.formData();
      const schemaString = data.get('schema');
  
      if (typeof schemaString !== 'string') {
        return json({ message: 'Invalid schema data' }, { status: 400 });
      }
  
      let schema: Schema = [];
  
      try {
        schema = JSON.parse(schemaString);
      } catch (error) {
        console.error('Error parsing schema JSON:', error);
        return json({ message: 'Invalid JSON format' }, { status: 400 });
      }
  
      console.log(schema);
  
      if (schema.some(field => !emptyField(field))) {
        console.error('Please fill all the fields!!');
        return json({ message: 'Please fill all the fields' }, { status: 400 });
      }
  
      const optionFieldTypes = ['select', 'radio', 'checkbox'];
  
      if (schema.some(field => 
        optionFieldTypes.includes(field.field_type) &&
        field.options.some(option => option.trim() === '')
      )) {
        console.error('Please check all the options are filled!!');
        return json({ message: 'Please check all the options are filled!!' }, { status: 400 });
      }
  
      try {
        const res = await fetch('http://localhost:3000/api/form-schema', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ schema })
        });
  
        if (!res.ok) {
          const errorData = await res.json();
          console.error('Failed to save schema:', errorData.message);
          return json({ message: `Failed to save schema: ${errorData.message}` }, { status: 500 });
        }
  
        return json({ message: 'Schema saved successfully' });
      } catch (error) {
        console.error('Error saving schema:', error);
        return json({ message: 'Error saving schema' }, { status: 500 });
      }
    }
  };


// export const actions: Actions = {
//     default: async ({ request }) => {
//         console.log('Saving Schema')
//         const data = await request.formData();
//         const schemaString = data.get('schema');

//         if (typeof schemaString !== 'string') {
//             return json({ message: 'Invalid schema data' }, { status: 400 });
//         }

//         let schema: Schema = [];

//         schema = JSON.parse(schemaString);

//         console.log(schema)

//         if (schema.some(field => !emptyField(field))) {
//             console.error('Please fill all the fields!!');
//             return;
//         }

//         const optionFieldTypes = ['select', 'radio', 'checkbox'];
        
//         if(schema.some(field => optionFieldTypes.includes(field.field_type) && 
//             (field.options.some(option => option.trim() === ''))
//         )){
//             console.error('Please check all the options are filled!!');
//             return json({ message: 'Please check all the options are filled!!' }, { status: 400 });
//         }

//         try {
//             const res = await fetch('http://localhost:3000/api/form-schema', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json'
//               },
//               body: JSON.stringify({ schema })
//             });
      
//             if (!res.ok) {
//               const errorData = await res.json();
//               console.error('Failed to save schema:', errorData.message);
//               return json({ message: `Failed to save schema: ${errorData.message}` }, { status: 500 });
//             }
      
//             return json({ message: 'Schema saved successfully' });
//           } catch (error) {
//             console.error('Error saving schema:', error);
//             return json({ message: 'Error saving schema' }, { status: 500 });
//           }
//     }
// };



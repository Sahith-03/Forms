import type { Schema, Field } from '../../lib/types';
import type { PageServerLoad,Actions } from './$types';
import { json, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch,locals }) => {
  const user = locals.user;
  // console.log('User:', user);
  if(!user || user.role !== 'admin'){
    console.log('User not logged in');
    throw redirect(302,'/login')
  }
  const userId = user.userId;
  const res = await fetch(`http://localhost:3000/api/form-schema/${userId}`);
  const response = await res.json();
  console.log(response);
  // const schema = response[0].formSchema;
  // console.log('Response:', response[0].formSchema);
  // console.log('Schema:', schema[0].formSchema);
  return { user ,response };
};

function emptyField(field: Field): boolean {
    if (!field.field_name.trim()) {
        console.log('Field name cannot be empty');
        return false;
    }
    return true;
}

export const actions: Actions = {
    default: async ({ request, locals }) => {
      console.log('Saving Schema');
      const data = await request.formData();
      const formName = data.get('formName');
      const schemaString = data.get('schema');

      console.log('Form Name:', formName);

      if(!locals.user){
        return { message: 'Unauthorized' , status: 401 };
      }
      const userId = locals.user.userId;
  
      if (typeof schemaString !== 'string') {
        return { message: 'Invalid schema data' , status: 400 };
      }
  
      let schema: Schema;
  
      try {
        schema = JSON.parse(schemaString);
      } catch (error) {
        console.error('Error parsing schema JSON:', error);
        return { message: 'Invalid JSON format' , status: 400 };
      }
  
      // console.log(schema);
  
      if (schema.some(field => !emptyField(field))) {
        console.error('Please fill all the fields!!');
        return { "message": 'Please fill all the fields', "status": 400 };
      }
  
      const optionFieldTypes = ['select', 'radio', 'checkbox'];
  
      if (schema.some(field => 
        optionFieldTypes.includes(field.field_type) &&
        field.options.some(option => option.trim() === '')
      )) {
        console.error('Please check all the options are filled!!');
        return { message: 'Please check all the options are filled!!' , status: 400 };
      }

      try {
        const res = await fetch('http://localhost:3000/api/form-schema', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({formName,schema,userId})
        });
  
        if (!res.ok) {
          const errorData = await res.json();
          console.error('Failed to save schema:', errorData.message);
          return { message: `Failed to save schema: ${errorData.message}` , status: 500 };
        }
  
        return { message: 'Schema saved successfully' };
      } catch (error) {
        console.error('Error saving schema:', error);
        return { message: 'Error saving schema' , status: 500 };
      }
    }
};
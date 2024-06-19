import type { Schema, Field } from '../../lib/types';
import type { PageServerLoad,Actions } from './$types';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { redirect } from '@sveltejs/kit';
import type { AnyNode } from 'postcss';

let schema: any = [];
let adminEmail: string;
let formName: string;

export const load: PageServerLoad = async ({ fetch,locals }) => {
    const user = locals.user;
    // console.log(user)
    if(user){
      if(adminEmail && formName){
        // console.log("Admin Name and Form Name are present");
        try{
          console.log('User:', adminEmail,"\nformName:",formName);
          const res = await fetch(`http://localhost:3000/api/form-schema/${adminEmail}/${formName}`);
          const response = await res.json();
          // console.log("\n\n",response)
          schema = response[0];
          // console.log("\n\n",schema);
          if (!schema) {
            return { message: 'Form schema not found' , status: 404 };
          }
          return { user, schema };
        }
        catch (error) {
          console.error('Error fetching form schema:', error);
          return { message: 'Error fetching form schema' , status: 500 };
        }
        
      }
    }
    else{
        console.log('User not logged in');
        throw redirect(302,'/login'); 
    }
};

function getResponses(data: any): any {
    let formData: any = {};
    // const formSchema: Schema = schema.formSchema;
    schema.formSchema.forEach((field: Field) => {
        const field_name = field.field_name;
        const value = data.get(field_name);
        formData[field_name] = value;
    });
    return formData;
}

export const actions: Actions ={
    getDetails: async ({request,locals}) => {
      if(!locals.user){
        return { message: 'Unauthorized' , status: 401 };
      }
      const data = await request.formData();
      adminEmail = data.get('email') as string;
      formName = data.get('formName') as string;
      return { message: 'Details fetched successfully' };
    },

    formData: async ({ request,locals }) => {
        if(!locals.user){
            return { message: 'Unauthorized' , status: 401 };
        }
        
        const data = await request.formData();
        // console.log("Data",data.get('Name'));
        let formData = getResponses(data);
        
        
        const formId = schema.id;

        console.log("\n\nForm ID",formId);

        

        // try {
        //     formData = JSON.parse(formData);
        //   } catch (error) {
        //     console.error('Error parsing schema JSON:', error);
        //     return { message: 'Invalid JSON format' , status: 400 };
        // }

        // if (typeof formData === 'string') {
        //     return { message: 'Invalid form data' ,  status: 400 };
        // }

        console.log("\n\nForm Data",formData);
        
        try {
            const res = await fetch('http://localhost:3000/api/form-data', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ formData,formId })
            });

            if (!res.ok) {
              const errorData = await res.json();
              console.error('Failed to save Data:', errorData.message);
              return { message: `Failed to save Data: ${errorData.message}` , status: 500 };
            }
      
            return { message: 'Data sent successfully' };
          } catch (error) {
            console.error('Error saving Data:', error);
            return { message: 'Error saving Data' , status: 500 };
          }
    }
}

import { writable } from 'svelte/store';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

let responses = writable([]);

export const load: PageServerLoad = async ({ fetch,locals }) => {
    if(!locals.user || locals.user.role !== 'admin'){
        console.log('User not logged in');
        throw redirect(302,'/login')
    }
    const res = await fetch('http://localhost:3000/api/form-data');
    const data = await res.json();
    console.log("data:", data);
    responses = data.data;
    return { data };
};

export const actions: Actions = {
    delete: async () => {
        const res = await fetch('http://localhost:3000/api/form-data', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            return json({ success: true });
        } else {
            const errorData = await res.json();
            return json({ success: false, message: errorData.message });
        }
    }
};
import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message };
    }

    throw redirect(302, '/login');
  }
};

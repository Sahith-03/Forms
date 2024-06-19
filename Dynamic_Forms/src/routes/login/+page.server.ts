import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export async function load({locals}){
  if (locals.user) {
      if (locals.user.role === 'admin') {
          throw redirect(302, '/admin');
      }
      throw redirect(302, '/User');
  }
  return {};
}

export const actions: Actions = {
  default: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message };
    }

    cookies.set('token', data.token, { path: '/', httpOnly: true, maxAge:60 * 10,sameSite:'strict'});

    const { role } = JSON.parse(atob(data.token.split('.')[1]));

    if (role === 'admin') {
      throw redirect(302, '/admin');
    } else {
      throw redirect(302, '/User');
    }
  }
};

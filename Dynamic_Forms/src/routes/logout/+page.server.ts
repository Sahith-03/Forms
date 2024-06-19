import { redirect } from "@sveltejs/kit";

export function load({cookies}) {
    console.log('Logging out...');
    cookies.set('token', '', { path: '/',maxAge: 0,httpOnly: true});
    throw redirect(302,'/login');
}
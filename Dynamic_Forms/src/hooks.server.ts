import type { Handle } from '@sveltejs/kit';
import type { JwtPayload } from 'jsonwebtoken';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JWT_SECRET } from '$env/static/private';

dotenv.config();

// Define roles for different routes
const adminRoutes = ['/admin', '/admin/*'];
const userRoutes = ['/User', '/User/*'];

const verifyToken = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded);
        });
    });
};


export const handle: Handle = async ({ event, resolve }) => {
    // const cookies = parse(event.request.headers.get('cookie') || '');
    const authToken = event.cookies.get("token");
    // const token = cookies['auth-token'];
    let user: JwtPayload;
    
    if (authToken) {
        try {
            // user = jwt.verify(authToken, JWT_SECRET);
            user = await verifyToken(authToken);
            event.locals.user = user; // Storing user info in locals

            const matchRoutes = (path: string, routes: string[]) => {
                return routes.some(route => new RegExp(`^${route.replace('*', '.*')}$`).test(path));
            };
        
            // Ensure admin routes are only accessible by admin users
            if (matchRoutes(event.url.pathname, adminRoutes)) {
                if (!user || user.role !== 'admin') {
                    return new Response('Unauthorized', { status: 401 });
                }
            }
        
            // Ensure user routes are only accessible by authenticated users
            if (matchRoutes(event.url.pathname, userRoutes)) {
                if (!user) {
                    return new Response('Unauthorized', { status: 401 });
                }
            }

        } catch (err) {
            console.log('Invalid token:', err);
        }
    }
    else{
        event.locals.user = undefined;
    }
    const response = await resolve(event);
    return response;
};

export const handleError = async ({ error, event }) => {
    console.error('Error occurred:', error);
    // Optionally customize error handling
    return {
        message: 'Internal Server Error',
        code: 500
    };
};

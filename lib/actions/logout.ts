'use server'
import { cookies } from 'next/headers';

export async function logoutAction() {
    try {
        const cookieStore = await cookies();

        const isLocal = process.env.APP_ENV === 'local';

        cookieStore.set('jwt-token', '', {
            secure: !isLocal,
            sameSite: 'lax',
            path: '/',
            httpOnly: true,
            expires: new Date(0),
        });
        
        return { success : true, hasToken: false };
    } catch (err) {
        console.error('Logout error:', err);
        return { success : false, hasToken: true };
    }
}
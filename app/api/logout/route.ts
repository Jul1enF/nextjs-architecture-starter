import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();

        const isLocal = process.env.NODE_ENV !== 'production';

        // HAS TO BE SAME CONFIG AS THE BACK
        const sameSite: 'lax' | 'none' = isLocal ? 'lax' : 'none'
        const cookieOptions = {
            secure: !isLocal,
            sameSite,
            path: '/',
        };

        cookieStore.set('jwtToken', '', {
            ...cookieOptions,
            httpOnly: true,
            expires: new Date(0),
        });

        cookieStore.set('csrf-token', '', {
            ...cookieOptions,
            expires: new Date(0),
        });

        return Response.json({ success: true });
    } catch (err) {
        console.error(err)
    }
}

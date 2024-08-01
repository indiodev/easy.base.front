import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export function middleware(request: NextRequest) {

    let cookie = request.cookies.get('gbd-user')


    if (!cookie)
        return NextResponse.redirect(new URL('/login', request.url))

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!register|api|reset-password|login|form|_next/*|$).*)"],
};
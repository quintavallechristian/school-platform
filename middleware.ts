import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const { pathname } = url

  // --- Logging sicuro anche su Vercel ---
  console.log("🔥 Middleware HIT", {
    host: request.headers.get("host"),
    xfh: request.headers.get("x-forwarded-host"),
    pathname,
    full: url.href
  })

  // --- Headers per hostname ---
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    ""

  const hostname = host.split(",")[0].trim().split(":")[0].toLowerCase()

  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1")

  const isVercel = hostname.endsWith(".vercel.app")

  // --- IGNORA percorsi che non vogliamo riscrivere ---
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/media") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.[a-zA-Z0-9]+$/.test(pathname) // file statici
  ) {
    return NextResponse.next()
  }

  // --- 1. Gestione Vercel subdomain: nomeScuola.project.vercel.app ---
  if (isVercel) {
    const [maybeSubdomain, project] = hostname.split(".")

    const isRealSubdomain =
      maybeSubdomain &&
      maybeSubdomain !== project &&
      !maybeSubdomain.includes("vercel")

    if (isRealSubdomain) {
      if (!pathname.startsWith(`/${maybeSubdomain}`)) {
        const rewrite = url.clone()
        rewrite.pathname = `/${maybeSubdomain}${pathname}`

        console.log("➡️  REWRITE Vercel →", rewrite.pathname)
        return NextResponse.rewrite(rewrite)
      }
    }

    return NextResponse.next()
  }

  // --- 2. Multi-tenant custom domain: nomeScuola.scuoleinfanzia.eu ---
  if (!isLocalhost && !isVercel) {
    const parts = hostname.split(".")
    if (parts.length >= 3) {
      const sub = parts[0]

      if (sub !== "www" && sub !== "admin") {
        if (!pathname.startsWith(`/${sub}`)) {
          const rewrite = url.clone()
          rewrite.pathname = `/${sub}${pathname}`

          console.log("➡️  REWRITE Custom →", rewrite.pathname)
          return NextResponse.rewrite(rewrite)
        }
      }
    }
  }

  // --- 3. Default: niente rewrite ---
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next|api|admin|media|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
}

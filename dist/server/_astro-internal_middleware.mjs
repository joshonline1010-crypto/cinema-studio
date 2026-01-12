import { d as defineMiddleware, s as sequence } from './chunks/index_DVnEmTQN.mjs';
import { g as getSessionCookie, f as findSessionById, a as findUserById } from './chunks/db_CvyCu46H.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_DwYuWI9g.mjs';
import 'piccolore';
import './chunks/astro/server_D9cEOE7x.mjs';
import 'clsx';

const PROTECTED_ROUTES = ["/dashboard", "/settings", "/projects"];
const AUTH_ROUTES = ["/login", "/register"];
const onRequest$1 = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const sessionId = getSessionCookie(context.cookies);
  let user = null;
  if (sessionId) {
    const session = await findSessionById(sessionId);
    if (session) {
      user = await findUserById(session.userId);
    }
  }
  context.locals.user = user;
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtectedRoute && !user) {
    return context.redirect("/login");
  }
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);
  if (isAuthRoute && user) {
    return context.redirect("/dashboard");
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };

/* empty css                                  */
import { e as createComponent, f as createAstro } from '../chunks/astro/server_BJ9NHA2f.mjs';
import 'piccolore';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const user = Astro2.locals.user;
  if (user) {
    return Astro2.redirect("/dashboard");
  } else {
    return Astro2.redirect("/login");
  }
}, "C:/Users/yodes/Documents/n8n/video-studio/src/pages/index.astro", void 0);

const $$file = "C:/Users/yodes/Documents/n8n/video-studio/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

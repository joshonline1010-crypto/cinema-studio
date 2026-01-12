import { e as createComponent, f as createAstro, ah as renderHead, ai as renderSlot, r as renderTemplate } from './astro/server_D9cEOE7x.mjs';
import 'piccolore';
import 'clsx';
/* empty css                             */

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title} | Video Studio</title>${renderHead()}</head> <body class="min-h-screen bg-vs-dark text-white"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/yodes/Documents/n8n/video-studio/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };

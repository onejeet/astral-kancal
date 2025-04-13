if (!self.define) {
  let e,
    s = {};
  const a = (a, i) => (
    (a = new URL(a + '.js', i).href),
    s[a] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, t) => {
    const c = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[c]) return;
    let n = {};
    const f = (e) => a(e, c),
      o = { module: { uri: c }, exports: n, require: f };
    s[c] = Promise.all(i.map((e) => o[e] || f(e))).then((e) => (t(...e), n));
  };
}
define(['./workbox-f52fd911'], function (e) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: 'c90075d610b6f2e9a1017b43344b5849' },
        {
          url: '/_next/static/chunks/4bd1b696-67ee12fb04071d3b.js',
          revision: 'fWuVs1h9VS3aoAGTFXoeG',
        },
        { url: '/_next/static/chunks/684-a270c3014ac83aa7.js', revision: 'fWuVs1h9VS3aoAGTFXoeG' },
        {
          url: '/_next/static/chunks/app/_not-found/page-f08302ee705a96b1.js',
          revision: 'fWuVs1h9VS3aoAGTFXoeG',
        },
        {
          url: '/_next/static/chunks/app/layout-bdbe140bdb538ffa.js',
          revision: 'fWuVs1h9VS3aoAGTFXoeG',
        },
        {
          url: '/_next/static/chunks/app/page-687dfdffc8d1b6e5.js',
          revision: 'fWuVs1h9VS3aoAGTFXoeG',
        },
        {
          url: '/_next/static/chunks/framework-f593a28cde54158e.js',
          revision: 'fWuVs1h9VS3aoAGTFXoeG',
        },
        { url: '/_next/static/chunks/main-60fa2419f6b2928b.js', revision: 'fWuVs1h9VS3aoAGTFXoeG' },
        {
          url: '/_next/static/chunks/main-app-aa817437dd743e29.js',
          revision: 'fWuVs1h9VS3aoAGTFXoeG',
        },
        {
          url: '/_next/static/chunks/pages/_app-da15c11dea942c36.js',
          revision: 'fWuVs1h9VS3aoAGTFXoeG',
        },
        {
          url: '/_next/static/chunks/pages/_error-cc3f077a18ea1793.js',
          revision: 'fWuVs1h9VS3aoAGTFXoeG',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-67fef5717b543d4d.js',
          revision: 'fWuVs1h9VS3aoAGTFXoeG',
        },
        { url: '/_next/static/css/7e4d81eac1cae1df.css', revision: '7e4d81eac1cae1df' },
        {
          url: '/_next/static/fWuVs1h9VS3aoAGTFXoeG/_buildManifest.js',
          revision: '56313a2fa41efe17a9286c47ac6aacba',
        },
        {
          url: '/_next/static/fWuVs1h9VS3aoAGTFXoeG/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/media/0484562807a97172-s.p.woff2',
          revision: 'b550bca8934bd86812d1f5e28c9cc1de',
        },
        {
          url: '/_next/static/media/a1386beebedccca4-s.woff2',
          revision: 'd3aa06d13d3cf9c0558927051f3cb948',
        },
        {
          url: '/_next/static/media/b957ea75a84b6ea7-s.p.woff2',
          revision: '0bd523f6049956faaf43c254a719d06a',
        },
        {
          url: '/_next/static/media/c3bc380753a8436c-s.woff2',
          revision: '5a1b7c983a9dc0a87a2ff138e07ae822',
        },
        {
          url: '/_next/static/media/eafabf029ad39a43-s.p.woff2',
          revision: '43751174b6b810eb169101a20d8c26f8',
        },
        {
          url: '/_next/static/media/fe0777f1195381cb-s.woff2',
          revision: 'f2a04185547c36abfa589651236a9849',
        },
        { url: '/file.svg', revision: 'd09f95206c3fa0bb9bd9fefabfd0ea71' },
        { url: '/globe.svg', revision: '2aaafa6a49b6563925fe440891e32717' },
        { url: '/next.svg', revision: '8e061864f388b47f33a1c3780831193e' },
        { url: '/vercel.svg', revision: 'c0af2f507b369b085b35ef4bbe3bcf1e' },
        { url: '/window.svg', revision: 'a2760511c65806022ad20adf74370ff3' },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: s, event: a, state: i }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, { status: 200, statusText: 'OK', headers: s.headers })
                : s,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)/,
      new e.CacheFirst({
        cacheName: 'image-cache',
        plugins: [new e.ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 2592e3 })],
      }),
      'GET'
    );
});

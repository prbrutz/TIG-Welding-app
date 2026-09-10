/* TIG Console — offline service worker
   Caches the app so it opens with no network at all.
   Bump VERSION whenever you upload new HTML. */
"use strict";

var VERSION = "tig-console-v2.2";
var CORE    = VERSION + "-core";
var FONTS   = VERSION + "-fonts";

var CORE_URLS = ["./", "./index.html", "./app.html", "./manifest.json"];

var FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CORE).then(function (c) {
      // add individually so one 404 can't abort the whole install
      return Promise.all(
        CORE_URLS.map(function (u) {
          return c.add(new Request(u, { cache: "reload" })).catch(function () {});
        })
      );
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (k) {
          if (k.indexOf(VERSION) !== 0) return caches.delete(k);
        })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

function isFont(url) {
  return FONT_HOSTS.indexOf(url.hostname) !== -1;
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }

  // 1. Page loads: network first (so updates land), cache as backup when offline.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CORE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || caches.match("./app.html") || caches.match("./index.html") || caches.match("./");
        });
      })
    );
    return;
  }

  // 2. Google Fonts: cache first, they never change.
  if (isFont(url)) {
    e.respondWith(
      caches.match(req).then(function (hit) {
        if (hit) return hit;
        return fetch(req).then(function (res) {
          var copy = res.clone();
          caches.open(FONTS).then(function (c) { c.put(req, copy); });
          return res;
        }).catch(function () { return hit; });
      })
    );
    return;
  }

  // 3. Everything else same-origin: cache first, refresh in background.
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then(function (hit) {
        var net = fetch(req).then(function (res) {
          var copy = res.clone();
          caches.open(CORE).then(function (c) { c.put(req, copy); });
          return res;
        }).catch(function () { return hit; });
        return hit || net;
      })
    );
  }
});

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open("offline").then(function(cache) {
      return cache.addAll(["/", "/offline.html"]);
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request).then(function(cached) {
        return cached || caches.match("/offline.html");
      });
    })
  );
  event.waitUntil(
    caches.open("offline").then(function(cache) {
      return fetch(event.request).then(function(response) {
        return cache.put(event.request, response);
      }).catch(function() {});
    })
  );
});
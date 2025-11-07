self.addEventListener("push", event => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Notificación", {
      body: data.body || "Mensaje recibido",
      icon: "/vite.svg"
    })
  );
});

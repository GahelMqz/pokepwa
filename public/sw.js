// self.addEventListener("push", event => {
//   const data = event.data?.json() || {};
//   event.waitUntil(
//     self.registration.showNotification(data.title || "Notificación", {
//       body: data.body || "Mensaje recibido",
//       icon: "/vite.svg"
//     })
//   );
// });


const registration = await navigator.serviceWorker.ready;
registration.showNotification("¡Has lanzado una Pokéball!", {
  body: "¡Un Pokémon salvaje apareció!",
  icon: "/vite.svg"
});

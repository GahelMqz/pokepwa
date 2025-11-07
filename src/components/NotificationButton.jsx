import React from "react";

export default function NotificationButton() {
  // const handleClick = async () => {
  //   // 1. Pedir permiso
  //   const permission = await Notification.requestPermission();
  //   if (permission !== "granted") {
  //     alert("Permiso denegado para notificaciones");
  //     return;
  //   }

  //   // 2. Mostrar notificación local
  //   new Notification("Haz lanzado una Pokeball", {
  //     body: "Esta es una notificación generada al hacer click",
  //     icon: "/pokemon.png"
  //   });
  // };

  const handleClick = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("Permiso denegado para notificaciones");
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  registration.showNotification("¡Has lanzado una Pokéball! 🎉", {
    body: "¡Un Pokémon salvaje apareció!",
    icon: "/vite.svg"
  });
};


  return (
    <button className="pokeball" onClick={handleClick}>
      <span className="pokeball-button"></span>
    </button>
  );
}

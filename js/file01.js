"use strict";

// --- Cliente de IAG: Función de Auto-Ejecución (IIFE) ---
// La IIFE original que ejecuta el código al cargar.
// @returns {void} No devuelve ningún valor.
(() => {
    alert("¡Bienvenido a la página!");
    console.log("Mensaje de bienvenida mostrado.");
})();

/**
 * Muestra una notificación 'toast' en pantalla añadiendo la clase 'md:block' 
 * al elemento con el ID 'toast-interactive', si este existe.
 * * @returns {void} No devuelve ningún valor.
 */
const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};

/**
 * Agrega un evento 'click' al elemento con el ID 'demo'. 
 * Al hacer clic, abre un video de YouTube en una nueva pestaña.
 * * @returns {void} No devuelve ningún valor.
 */
const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

// --- Invocación de las funciones ---

/**
 * Función de auto-ejecución principal (IIFE) para iniciar la lógica de la página.
 * Llama a showToast y showVideo para inicializar la interacción.
 * * @returns {void} No devuelve ningún valor.
 */
(() => {
    showToast();
    showVideo();
})();

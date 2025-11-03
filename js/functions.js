// js/functions.js
"use strict";

/**
 * Realiza una petición HTTP GET para obtener datos JSON.
 * @param {string} url - La URL de la API de productos.
 * @returns {Promise<{success: boolean, body: Object | string}>} Un objeto con el estado y los datos o mensaje de error.
 */
const fetchProducts = (url) => {
    return fetch(url)
        .then(response => {
            // Usa la estructura if con la condición !response.ok para lanzar un error.
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            // Retorna response.json() para procesar los datos en el siguiente bloque.
            return response.json();
        })
        .then(data => {
            // Retorna un objeto con las claves success (valor true) y body (contenido de data).
            return { success: true, body: data };
        })
        .catch(error => {
            // Retorna un objeto con las claves success (valor false) y body (mensaje de error).
            return { success: false, body: error.message };
        });
};

/**
 * Realiza una petición HTTP GET de forma asíncrona para obtener y parsear un documento XML.
 * @param {string} url - La URL de la API XML de categorías.
 * @returns {Promise<{success: boolean, body: XMLDocument | string}>} Un objeto con el estado y los datos XML o mensaje de error.
 */
const fetchCategories = async (url) => {
    // Defina un bloque try / catch
    try {
        // Almacene en response el resultado de esperar la resolución de await fetch(url).
        const response = await fetch(url);
        
        // Use la estructura if con la condición !response.ok para lanzar un error.
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // Si la respuesta es correcta:
        // En la variable text espere por la resolución de await response.text().
        const text = await response.text();
        
        // En la constante parser cree una nueva instancia de DOMParser().
        const parser = new DOMParser();
        
        // En la variable data asigne el resultado de convertir el texto a un objeto XML.
        const data = parser.parseFromString(text, "application/xml");
        
        // Manejo básico de error de parseo de XML
        if (data.getElementsByTagName("parsererror").length) {
             throw new Error("Error al parsear el documento XML.");
        }

        // Retorna un objeto con las claves success (valor true) y body (contenido de data).
        return { success: true, body: data };

    } catch (error) {
        // En el bloque catch, retorne un objeto con las claves success (valor false) y body (mensaje de error).
        return { success: false, body: error.message };
    }
};

// Exporte las funciones
export { fetchProducts, fetchCategories };
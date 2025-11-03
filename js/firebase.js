import { initializeApp } from "https://www.gstatic.com/firebasejs/x.y.z/firebase-app.js";
import { getDatabase, ref, set, push, get, child } from "https://www.gstatic.com/firebasejs/x.y.z/firebase-database.js";

// 1. Objeto de configuración de Firebase
// Accede a las variables definidas en tu archivo .env (ej. .env.local)

const firebaseConfig = {
    
    // Obteniendo el API Key
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY, 
    
    // Obteniendo el dominio de autenticación
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, 
    
    // Obteniendo el ID del proyecto
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    
    // Obteniendo el Storage Bucket
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    
    // Obteniendo el ID del remitente de mensajes
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, 
    
    // Obteniendo el ID de la aplicación
    appId: import.meta.env.VITE_FIREBASE_APP_ID, 
    
    // (Opcional) La URL de Realtime Database, a menudo construida automáticamente por Firebase
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL // Agrega esto si es una variable separada
};

// 2. Inicialización de la Aplicación (Mantiene la conexión)
const firebaseApp = initializeApp(firebaseConfig);

// 3. Inicialización del Realtime Database
const db = getDatabase(firebaseApp);


/**
 * Guarda un voto para un producto en la colección 'votes' de la Realtime Database.
 *
 * @param {string} productID - El ID del producto por el que se está votando.
 * @param {object} dbInstance - La instancia de la Realtime Database (objeto 'db').
 * @param {function} refFn - La función 'ref' de Firebase.
 * @param {function} setFn - La función 'set' de Firebase.
 * @param {function} pushFn - La función 'push' de Firebase.
 * @returns {Promise<{state: string, message: string}>} Una promesa con el resultado de la operación.
 */
// Define una función flecha saveVote, que reciba un parámetro productID.
const saveVote = (productID, dbInstance, refFn, setFn, pushFn) => {
    // 1.b.i. Obtenga una referencia a la colección votes de la base de datos, con la función ref().
    const votesRef = refFn(dbInstance, 'votes');

    // 1.b.ii. Crea una nueva referencia para un usuario utilizando la función push().
    const newVoteRef = pushFn(votesRef);

    // Los datos a guardar
    const data = {
        productID: productID,
        date: new Date().toISOString() // La fecha actual
    };
    
    // 1.b.iii. Guarda los datos (productID y la fecha actual) en la base de datos con la función set().
    // 1.b.iv. Maneje el resultado de la función set() como una promesa, devuelva un objeto con un estado y mensaje.
    return setFn(newVoteRef, data)
        .then(() => {
            return {
                state: 'success',
                message: 'Voto guardado exitosamente.'
            };
        })
        .catch((error) => {
            return {
                state: 'error',
                message: `Error al guardar el voto: ${error.message}`
            };
        });
};

// 1.c. Exporta la función saveVote para que pueda ser utilizada en otros archivos.
export { saveVote };
"use strict";

// 1. Al inicio del documento js/file01.js, importe la función fetchProducts desde functions.js.
import { saveVote } from './firebase.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/9/firebase-database.js";
import { fetchProducts, fetchCategories } from './functions.js';
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

/**
 * Inicializa la funcionalidad de colapsar/expandir el menú móvil de la Navbar.
 * @returns {void} No devuelve ningún valor.
 */
const setupNavbarToggle = () => {
    const button = document.querySelector('[data-collapse-toggle="navbar-default"]');
    const menu = document.getElementById('navbar-default');

    if (button && menu) {
        button.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            const isExpanded = button.getAttribute('aria-expanded') === 'true' || false;
            button.setAttribute('aria-expanded', !isExpanded);
        });
    }
};



// ----------------------------------------------------------------------
// --- renderProducts (Actualizada para la Tarea 5) ---

/**
 * Realiza la llamada a la API de productos, procesa el resultado y renderiza los primeros 6 productos.
 * @returns {void} No devuelve ningún valor.
 */
// 2. Agregue una función flecha renderProducts...
const renderProducts = () => {
    // 3. Llama a la función fetchProducts
    fetchProducts('https://data-dawm.github.io/datum/reseller/products.json')
        .then(result => {
            // 4. Estructura condicional para verificar result.success
            if (result.success) {
                // --- TAREA 5: CASO TRUE ---

                // 5.a. Almacene en container la referencia al elemento con id "products-container"...
                const container = document.getElementById('products-container');
                
                if (!container) {
                    console.error("No se encontró el elemento #products-container en el HTML.");
                    return;
                }

                // Elimine cualquier contenido anterior
                container.innerHTML = ''; 
                container.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'gap-6', 'p-4');

                // 5.b. Almacene en products el contenido de result.body, Seleccione solo los primeros 6 productos con slice.
                const products = result.body.slice(0, 6);
                
                // 5.d.i. Plantilla base con marcadores de posición
                const CARD_TEMPLATE = `
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-xl">
                        <img src="[PRODUCT.IMG_URL]" alt="[PRODUCT.TITLE]" class="w-full h-48 object-cover">
                        <div class="p-4">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">[PRODUCT.TITLE]</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Categoría: [PRODUCT.CATEGORY_ID]</p>
                            <div class="mt-4 flex justify-between items-center">
                                <span class="text-xl font-bold text-blue-600 dark:text-blue-400">$[PRODUCT.PRICE]</span>
                                <a href="[PRODUCT.URL]" target="_blank" class="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Ver Producto</a>
                            </div>
                        </div>
                    </div>
                `;

                // 5.c. Recorra el arreglo products utilizando el método forEach.
                products.forEach(product => {
                    let productHTML = CARD_TEMPLATE; // Inicializamos con la plantilla
                    
                    // 5.d.ii. Reemplace los marcadores de posición en productHTML con replaceAll
                    
                    // Lógica para cortar el título si es muy largo, según el ejemplo
                    const truncatedTitle = product.title.length > 20 
                        ? product.title.substring(0, 20) + "..." 
                        : product.title;

                    productHTML = productHTML.replaceAll('[PRODUCT.TITLE]', truncatedTitle);
                    productHTML = productHTML.replaceAll('[PRODUCT.CATEGORY_ID]', product.category_id || 'N/A');
                    
                    // Reemplazos adicionales
                    productHTML = productHTML.replaceAll('[PRODUCT.IMG_URL]', product.imgUrl || 'https://placehold.co/400x300');
                    productHTML = productHTML.replaceAll('[PRODUCT.PRICE]', (product.price || 0).toFixed(2));
                    productHTML = productHTML.replaceAll('[PRODUCT.URL]', product.productURL || '#');

                    // 5.d.iii. Del objeto container, utilice la propiedad innerHTML para concatenar productHTML.
                    // Nota: Concatenar dentro del forEach es posible, aunque menos eficiente que fuera. 
                    // Si se desea seguir la instrucción al pie de la letra (usando container.innerHTML), se hace así:
                    container.innerHTML += productHTML; 
                });


            } else {
                // --- TAREA 6: CASO FALSE ---
                // 6. En caso que es false, muestre una alerta con el mensaje de error.
                alert(`Error al cargar los datos: ${result.body}`);
                console.error('Error al cargar los productos:', result.body);

                // Opcional: Mostrar el error en el HTML
                const container = document.getElementById('products-container');
                if (container) {
                    container.innerHTML = `<p class="text-red-500 p-4">Error al cargar los datos: ${result.body}</p>`;
                }
            }
        });
};

const renderCategories = async () => {
    const URL_CATEGORIES = 'https://data-dawm.github.io/datum/reseller/categories.xml';
    
    // 3. Defina un bloque try / catch
    try {
        // 4. Almacene en result el resultado de esperar la resolución de await fetchCategories(...)
        const result = await fetchCategories(URL_CATEGORIES);

        // 5. Utilice una estructura condicional para verificar si result.success es true o false.
        if (result.success) {
            // 6. En caso que es true:

            // 6.a. Almacene en container la referencia al elemento con id "categories"
            const container = document.getElementById('categories');

            if (!container) {
                console.error("No se encontró el elemento #categories en el HTML.");
                return;
            }
            
            // 6.b. Reemplace el contenido anterior con la opción predeterminada deshabilitada.
            container.innerHTML = `<option selected disabled>Seleccione una categoría</option>`;

            // c. Almacene en categoriesXML el contenido de result.body. (Asumimos que result.body ya es el XMLDocument)
            const categoriesXML = result.body;

            // d. Obtener una colección de elementos 'category'
            const categories = categoriesXML.getElementsByTagName('category');

            // e. Recorra la lista de elementos en categories
            for (let category of categories) {
                // f. En el bloque for:
                
                // f.i. Plantilla base con marcadores de posición
                let categoryHTML = `<option value="[ID]">[NAME]</option>`;

                // f.ii. Extraer el valor de id y name usando getElementsByTagName y textContent
                const id = category.getElementsByTagName('id')[0].textContent;
                const name = category.getElementsByTagName('name')[0].textContent;
                
                // f.iii. Reemplace los marcadores de posición
                categoryHTML = categoryHTML.replaceAll('[ID]', id);
                categoryHTML = categoryHTML.replaceAll('[NAME]', name);

                // f.iv. Del objeto container, utilice la propiedad innerHTML para concatenar categoryHTML.
                container.innerHTML += categoryHTML;
            }

        } else {
            // 7. En caso que es false, muestre una alerta con el mensaje de error.
            alert(`Error al cargar las categorías (API): ${result.body}`);
            console.error('Error al cargar las categorías:', result.body);
        }

    } catch (error) {
        // Bloque catch: maneja errores de red o errores lanzados dentro del try
        // 7. Muestre una alerta con el mensaje de error.
        alert(`Error fatal de ejecución al cargar categorías: ${error.message}`);
        console.error('Error en renderCategories:', error);
    }
};


// 2.a. Define la función flecha enableForm (antes de la función de autoejecución).
/**
 * Inicializa el manejo del formulario de votación, capturando el evento submit.
 * @returns {void} No devuelve ningún valor.
 */
const enableForm = () => {
    // Obtenga una referencia al formulario HTML con el identificador 'form_voting'.
    const formVoting = document.getElementById('form_voting');

    if (!formVoting) {
        console.error("No se encontró el formulario con el ID 'form_voting'.");
        return;
    }

    // 2.c. Con la referencia al formulario, utilice addEventListener para el evento 'submit'
    formVoting.addEventListener('submit', (event) => {
        
        // 2.c.i. Use el evento del callback para prevenir el comportamiento por defecto del formulario.
        event.preventDefault();

        // 2.c.ii. Obtenga la referencia al elemento con identificador 'select_product' y extraiga el valor.
        const selectProductElement = document.getElementById('select_product');
        
        if (!selectProductElement) {
             alert('Error: No se encontró el campo de selección del producto.');
             return;
        }

        const productID = selectProductElement.value;
        
        // Comprobación simple para evitar votos vacíos
        if (productID === 'Seleccione una categoría') { 
            alert('Por favor, seleccione un producto válido antes de votar.');
            return;
        }

        // 2.c.iii. Llame a la función saveVote con el valor obtenido.
        // Maneje la promesa y muestre el resultado con un mensaje de alerta.
        // *Nota: Aquí pasamos 'db', 'ref', 'set', 'push' como dependencias a saveVote
        saveVote(productID, db, ref, set, push) 
            .then(result => {
                alert(`Resultado de la votación: ${result.message}`);
                console.log('Resultado de Firebase:', result);
                
                // Opcional: Reiniciar el formulario después de un éxito
                if (result.state === 'success') {
                    formVoting.reset();
                }
            })
            .catch(error => {
                // Manejo de errores de red o errores internos no capturados por saveVote
                alert(`Ocurrió un error inesperado al votar: ${error.message}`);
                console.error('Error en la promesa de saveVote:', error);
            });
    });
    
    console.log("Manejador de submit para 'form_voting' inicializado.");
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
    setupNavbarToggle(); 

    // Llama a la función que trae los datos de la API
    renderProducts();
    renderCategories();
    enableForm();
})();

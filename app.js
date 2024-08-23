document.addEventListener('DOMContentLoaded', function() {
    AOS.init();

    const catalog = document.getElementById('catalog');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const cartButton = document.getElementById('cartButton');
    const cartModal = document.createElement('div');
    const cart = [];
    let products = [];

    let controller = new AbortController();
    const { signal } = controller;

    async function loadProducts() {
        try {
            const response = await fetch('products.json', { signal });
            if (!response.ok) throw new Error('Error al cargar productos');
            products = await response.json();
            displayMusicProducts(products);
            const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
            savedCart.forEach(item => cart.push(item));
            updateCartButton();
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Solicitud abortada');
            } else {
                console.error('Error:', error);
                alert('No se pudieron cargar los productos. Inténtalo de nuevo más tarde.');
            }
        }
    }

    function displayMusicProducts(productsToDisplay) {
        catalog.innerHTML = '';
        const searchTerm = searchInput.value.toLowerCase();
        const type = typeFilter.value;

        const filteredProducts = productsToDisplay.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchTerm);
            const matchesType = type === 'all' || product.type === type;
            return matchesSearch && matchesType;
        });

        filteredProducts.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.setAttribute('data-aos', 'fade-up');

            let content = `<h2>${product.title}</h2>`;
            if (product.type === 'Album') {
                content += `<p>Artista: ${product.artist}</p><p>Género: ${product.genre}</p>`;
            } else if (product.type === 'Merchandise') {
                content += `<p>Artista: ${product.artist}</p>`;
            } else if (product.type === 'Instrument') {
                content += `<p>Instrumento</p>`;
            } else if (product.type === 'Accessory') {
                content += `<p>Accesorio</p>`;
            }

            content += `
                <p>Precio: $${product.price.toFixed(2)}</p>
                <img src="${product.imageURL}" alt="${product.title}">
                <button class="add-to-cart" onclick="addToCart(${product.id})">Añadir al Carrito</button>
            `;

            productDiv.innerHTML = content;
            catalog.appendChild(productDiv);
        });
    }

    window.addToCart = async function(productId) {
        try {
            const product = products.find(p => p.id === productId);
            if (product) {
                cart.push(product);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartButton();
            }
        } catch (error) {
            console.error('Error al añadir al carrito:', error);
        }
    };

    function showCart() {
        cartModal.innerHTML = '<h2>Carrito</h2>';

        const groupedCart = cart.reduce((acc, product) => {
            if (!acc[product.id]) {
                acc[product.id] = { ...product, quantity: 0 };
            }
            acc[product.id].quantity += 1;
            return acc;
        }, {});

        if (Object.keys(groupedCart).length === 0) {
            cartModal.innerHTML += '<p>El carrito está vacío.</p>';
        } else {
            Object.values(groupedCart).forEach(product => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                
                const totalPrice = product.price * product.quantity;
                
                cartItem.innerHTML = `
                    <h3>${product.title}</h3>
                    <p>Cantidad: ${product.quantity}</p>
                    <p>Precio Total: $${totalPrice.toFixed(2)}</p>
                    <button onclick="removeFromCart(${product.id})">Eliminar</button>
                `;
                cartModal.appendChild(cartItem);
            });
        }
        cartModal.innerHTML += '<button onclick="closeCart()">Cerrar</button>';
        cartModal.classList.add('cart-modal');
        document.body.appendChild(cartModal);
    }

    window.removeFromCart = function(productId) {
        const index = cart.findIndex(p => p.id === productId);
        if (index > -1) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartButton();
            showCart();
        }
    };

    window.closeCart = function() {
        document.body.removeChild(cartModal);
    };

    function updateCartButton() {
        cartButton.textContent = `Ver Carrito (${cart.length})`;
    }

    cartButton.addEventListener('click', showCart);

    typeFilter.addEventListener('change', function() {
        displayMusicProducts(products);
    });

    searchInput.addEventListener('input', function() {
        displayMusicProducts(products);
    });

    loadProducts();

    function abortFetch() {
        controller.abort();
    }
});

window.showProductDetails = async function(productId) {
    try {
        const product = products.find(p => p.id === productId);
        if (product) {
            alert(`Detalles del producto:\nTítulo: ${product.title}\nArtista: ${product.artist || 'N/A'}\nGénero: ${product.genre || 'N/A'}\nPrecio: $${product.price.toFixed(2)}`);
        }
    } catch (error) {
        console.error('Error al mostrar detalles del producto:', error);
    }
};

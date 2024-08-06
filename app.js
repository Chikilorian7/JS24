document.addEventListener('DOMContentLoaded', function() {
    const catalog = document.getElementById('catalog');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const cartButton = document.createElement('button');
    const cartModal = document.createElement('div');
    const cart = [];

    async function loadProducts() {
        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }
            const products = await response.json();
            displayMusicProducts(products);
            const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
            savedCart.forEach(item => cart.push(item));
            updateCartButton();
        } catch (error) {
            console.error(error);
        }
    }

    function displayMusicProducts(products) {
        catalog.innerHTML = '';
        const searchTerm = searchInput.value.toLowerCase();
        const type = typeFilter.value;
        
        const filteredProducts = products.filter(product => {
            const matchesSearch = product.title.toLowerCase().includes(searchTerm);
            const matchesType = type === 'all' || product.type === type;
            return matchesSearch && matchesType;
        });

        filteredProducts.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            
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
                <button onclick="addToCart(${product.id})">Añadir al Carrito</button>
                <button onclick="showProductDetails(${product.id})">Ver Detalles</button>
            `;

            productDiv.innerHTML = content;
            catalog.appendChild(productDiv);
        });
    }

    window.addToCart = function(productId) {
        fetch('products.json')
            .then(response => response.json())
            .then(products => {
                const product = products.find(p => p.id === productId);
                if (product) {
                    cart.push(product);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartButton();
                }
            })
            .catch(error => console.error('Error al añadir al carrito:', error));
    };

    function showCart() {
        cartModal.innerHTML = '<h2>Carrito</h2>';
        cart.forEach(product => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <h3>${product.title}</h3>
                <p>Precio: $${product.price.toFixed(2)}</p>
                <button onclick="removeFromCart(${product.id})">Eliminar</button>
            `;
            cartModal.appendChild(cartItem);
        });
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

    cartButton.id = 'cartButton';
    cartButton.textContent = 'Ver Carrito (0)';
    document.body.appendChild(cartButton);

    cartButton.addEventListener('click', showCart);

    typeFilter.addEventListener('change', function() {
        fetch('products.json')
            .then(response => response.json())
            .then(products => displayMusicProducts(products))
            .catch(error => console.error('Error al filtrar productos:', error));
    });

    searchInput.addEventListener('input', function() {
        fetch('products.json')
            .then(response => response.json())
            .then(products => displayMusicProducts(products))
            .catch(error => console.error('Error al buscar productos:', error));
    });

    loadProducts();
});

window.showProductDetails = function(productId) {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                alert(`Detalles del producto:\nTítulo: ${product.title}\nArtista: ${product.artist}\nGénero: ${product.genre}\nPrecio: $${product.price.toFixed(2)}`);
            }
        })
        .catch(error => console.error('Error al mostrar detalles del producto:', error));
};
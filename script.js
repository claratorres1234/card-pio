document.addEventListener('DOMContentLoaded', function() {
    const categories = document.querySelectorAll('.category');
    const products = document.querySelectorAll('.products');

    // Show all products initially
    products.forEach(product => {
        product.style.display = 'block';
    });

    // Add active class to "Todos" category initially
    document.querySelector('[data-category="todos"]').classList.add('active');

    categories.forEach(category => {
        category.addEventListener('click', () => {
            // Remove active class from all categories
            categories.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked category
            category.classList.add('active');

            const categoryName = category.getAttribute('data-category');
            
            if (categoryName === 'todos') {
                products.forEach(product => {
                    product.style.display = 'block';
                });
            } else {
                products.forEach(product => {
                    product.style.display = 'none';
                });
                
                const selectedProducts = document.getElementById(categoryName);
                if (selectedProducts) {
                    selectedProducts.style.display = 'block';
                }
            }
        });
    });
});

let cart = [];
let cartCount = 0;

function addToCart(name, price) {
    cart.push({ name, price });
    cartCount++;
    updateCartCount();
    showAddedToCartMessage(name);
}

function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = cartCount;
}

function showAddedToCartMessage(productName) {
    alert(`${productName} foi adicionado ao carrinho!`);
}

document.querySelector('.cart-icon').addEventListener('click', showCart);
const modal = document.getElementById('cartModal');

function showCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name}</span>
            <span>R$ ${item.price.toFixed(2)}</span>
        `;
        cartItems.appendChild(cartItem);
        total += item.price;
    });

    document.getElementById('cartTotal').textContent = total.toFixed(2);
    modal.style.display = 'block';
}

// Close modal when clicking X
document.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

const cartModal = document.getElementById('cartModal');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutButton = document.getElementById('checkoutButton');
const closeCheckout = document.querySelector('.close-checkout');
const confirmOrder = document.getElementById('confirmOrder');

checkoutButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
    checkoutModal.style.display = 'block';
    displayCheckoutItems();
});

closeCheckout.addEventListener('click', () => {
    checkoutModal.style.display = 'none';
});

function displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    let total = 0;
    
    checkoutItems.innerHTML = '';
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>R$ ${item.price.toFixed(2)}</span>
        `;
        checkoutItems.appendChild(itemElement);
        total += item.price;
    });
    
    checkoutTotal.textContent = total.toFixed(2);
}

confirmOrder.addEventListener('click', () => {
    const street = document.getElementById('street').value;
    const number = document.getElementById('number').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const complement = document.getElementById('complement').value;
    const payment = document.querySelector('input[name="payment"]:checked');

    if (!street || !number || !neighborhood || !payment) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }

    // Format cart items for WhatsApp message
    let orderDetails = '*🛒 Novo Pedido*\n\n';
    orderDetails += '*Itens do Pedido:*\n';
    
    cart.forEach(item => {
        orderDetails += `▪️ ${item.name} - R$ ${item.price.toFixed(2)}\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    orderDetails += `\n*Total: R$ ${total.toFixed(2)}*\n\n`;
    orderDetails += '*Endereço de Entrega:*\n';
    orderDetails += `📍 ${street}, ${number}\n`;
    orderDetails += `📍 Bairro: ${neighborhood}\n`;
    if (complement) {
        orderDetails += `📍 Complemento: ${complement}\n`;
    }

    orderDetails += `\n*Forma de Pagamento:* ${payment.value.toUpperCase()}`;

    if (payment.value === 'cash') {
        const cashAmount = document.getElementById('cashAmount').value;
        const change = parseFloat(cashAmount) - total;
        if (change > 0) {
            orderDetails += `\n💰 Troco para: R$ ${cashAmount}`;
            orderDetails += `\n💰 Troco: R$ ${change.toFixed(2)}`;
        }
    }

    // Format the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(orderDetails);
    const whatsappNumber = '5514996350603'; // Updated WhatsApp number with country code
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Clear cart and close modal
    cart = [];
    cartCount = 0;
    updateCartCount();
    checkoutModal.style.display = 'none';

    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank');
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target === checkoutModal) {
        checkoutModal.style.display = 'none';
    }
});

document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const changeContainer = document.getElementById('changeContainer');
        if (e.target.value === 'cash') {
            changeContainer.style.display = 'block';
        } else {
            changeContainer.style.display = 'none';
        }
    });
});

document.getElementById('cashAmount').addEventListener('input', (e) => {
    const total = parseFloat(document.getElementById('checkoutTotal').textContent);
    const cashAmount = parseFloat(e.target.value) || 0;
    const change = cashAmount - total;
    document.getElementById('changeAmount').textContent = change > 0 ? change.toFixed(2) : '0.00';
});

document.getElementById('confirmOrder').addEventListener('click', () => {
    const street = document.getElementById('street').value;
    const number = document.getElementById('number').value;
    const neighborhood = document.getElementById('neighborhood').value;
    const payment = document.querySelector('input[name="payment"]:checked');

    if (!street || !number || !neighborhood || !payment) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
    }

    alert('Pedido confirmado! Obrigado pela compra.');
    cart = [];
    cartCount = 0;
    updateCartCount();
    checkoutModal.style.display = 'none';
});

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        const productName = product.querySelector('h4').textContent.toLowerCase();
        const productSection = product.closest('.products');
        
        if (productName.includes(searchTerm)) {
            product.style.display = 'flex';
            productSection.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });

    // Show "Todos" category and hide others
    document.querySelectorAll('.category').forEach(cat => cat.classList.remove('active'));
    document.querySelector('[data-category="todos"]').classList.add('active');
}

searchButton.addEventListener('click', searchProducts);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchProducts();
    }
});
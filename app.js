// variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const menuDOM = document.querySelector('.menu-center');

// cart 
let cart = [];

// buttons
let buttonsDOM = [];

// getting the menu items
class Menu {
    async getProducts() {
        try {
            let result = await fetch('products.json')
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image }; 
            })
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

// display menu
class UI {
    displayMenu(menu) {
        let result = '';
        menu.forEach(product => {
            result +=`
            <!-- single menu item -->
            <article class="menu-item">
                <div class="img-container">
                    <img src=${product.image} alt="Sandwich with cheese and salad" class="menu-item-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart">
                            add to order
                        </i>
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>€${product.price}</h4>
            </article>
            <!-- end of single menu item -->
            `
        });
        menuDOM.innerHTML = result;
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            }
           
            button.addEventListener('click', (event) => {
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                // get product from products (based on the id)
                let cartItem = {...Storage.getProduct(id),
                amount:1};
                // add product to the cart
                cart = [...cart, cartItem];
                // save cart in local storage
                Storage.saveCart(cart);
                // set cart values
                this.setCartValues(cart); 
                // display cart item
                this.addCartItem(cartItem);
                // show the cart
            });
        });
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item) {
          
    }
}

// local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id == id);
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const menu = new Menu();

    // get all products
    menu.getProducts().then((menu) => {
        ui.displayMenu(menu);
        Storage.saveProducts(menu);
    }).then(() => {
        ui.getBagButtons();
    });
})
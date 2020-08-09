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
}

// local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const menu = new Menu();

    // get all products
    menu.getProducts().then((menu) => {
        ui.displayMenu(menu);
        Storage.saveProducts(menu);
    });
})
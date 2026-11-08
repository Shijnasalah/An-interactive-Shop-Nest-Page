


let products = [];
let cart = [];
let selectedCategory = "All";




let productsContainer = document.getElementById("products-container");

let searchInput = document.getElementById("search-input");

let filterButtons = document.querySelectorAll(".filter-btn");

let noProducts = document.getElementById("no-products");

let cartItems = document.getElementById("cart-items");

let cartCount = document.getElementById("cart-count");

let cartTotal = document.getElementById("cart-total");


//FETCHING PRODUCTS 

async function getProducts() {

    try {

        let response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        products = await response.json();

        // Display products
        filterProducts();

        // Restore saved cart
        loadCart();

    }

    catch (error) {

        console.log("Error loading products:", error);

        productsContainer.innerHTML =
            "<p>Unable to load products. Please try again.</p>";

    }

}




function displayProducts(productList) {

    productsContainer.innerHTML = "";

    // Show or hide no products message
    if (productList.length === 0) {

        noProducts.style.display = "block";

    }

    else {

        noProducts.style.display = "none";

    }


    productList.forEach(function(product) {

        productsContainer.innerHTML += `

            <div class="product-card">

                <img
                    src="${product.imageUrl}"
                    alt="${product.name}"
                >

                <h3>${product.name}</h3>

                <p>⭐ ${product.rating}</p>

                <p>
                    ₹${product.price}

                    <del>₹${product.originalPrice}</del>
                </p>

                <button onclick="addToCart(${product.id})">

                    Add to Cart

                </button>

            </div>

        `;

    });

}



function filterProducts() {

    let searchValue = searchInput.value.toLowerCase();


    let filteredProducts = products.filter(function(product) {

        
        let matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;


       
        let matchesSearch =
            product.name.toLowerCase().includes(searchValue);


        
        return matchesCategory && matchesSearch;

    });


    displayProducts(filteredProducts);

}




searchInput.addEventListener("input", function() {

    filterProducts();

});



filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        
        selectedCategory = button.dataset.category;


       
        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        
        filterProducts();

    });

});




function addToCart(productId) {

   
    let existingProduct = cart.find(function(item) {

        return item.id === productId;

    });


    if (existingProduct) {

       
        existingProduct.quantity++;

    }

    else {

      
        let product = products.find(function(item) {

            return item.id === productId;

        });


       
        cart.push({

            ...product,

            quantity: 1

        });

    }


    // Save and display cart
    saveCart();

    displayCart();

}




function displayCart() {

    cartItems.innerHTML = "";


   
    if (cart.length === 0) {

        cartItems.innerHTML = "<p>Your cart is empty.</p>";

    }


   
    cart.forEach(function(item) {

        cartItems.innerHTML += `

            <div class="cart-item">

                <h3>${item.name}</h3>

                <p>Price: ₹${item.price}</p>


                <button onclick="decreaseQuantity(${item.id})">

                    -

                </button>


                <span>${item.quantity}</span>


                <button onclick="increaseQuantity(${item.id})">

                    +

                </button>


                <button onclick="removeFromCart(${item.id})">

                    Remove

                </button>

            </div>

        `;

    });


    
    updateCartTotal();

    updateCartCount();

}



function increaseQuantity(productId) {

    let product = cart.find(function(item) {

        return item.id === productId;

    });


    if (product) {

        product.quantity++;

    }


    saveCart();

    displayCart();

}




function decreaseQuantity(productId) {

    let product = cart.find(function(item) {

        return item.id === productId;

    });


    if (product) {

        if (product.quantity > 1) {

            product.quantity--;

        }

        else {

            removeFromCart(productId);

            return;

        }

    }


    saveCart();

    displayCart();

}


function removeFromCart(productId) {

    cart = cart.filter(function(item) {

        return item.id !== productId;

    });


    saveCart();

    displayCart();

}



function updateCartTotal() {

    let total = 0;


    cart.forEach(function(item) {

        total += item.price * item.quantity;

    });


    cartTotal.textContent = total;

}


function updateCartCount() {

    let count = 0;


    cart.forEach(function(item) {

        count += item.quantity;

    });


    cartCount.textContent = count;

}



function saveCart() {

    localStorage.setItem("cart", JSON.stringify(cart));

}


function loadCart() {

    let savedCart = localStorage.getItem("cart");


    if (savedCart) {

        try {

            cart = JSON.parse(savedCart);

        }

        catch (error) {

            console.log("Error loading saved cart:", error);

            cart = [];

        }

    }


    displayCart();

}




getProducts();

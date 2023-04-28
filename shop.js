const uuid = require('uuid').v4;
const products = require('./data');

const inventories = {
    'p001' : 3,
    'p002' : 2,
    'p003' : 3,
    'p004' : 4,
    'p005' : 2,
    'p006' : 3,
    'p007' : 10,
    'p008' : 8,
    'p009' : 5,
    'p010' : 6,
    'p011' : 12,
    'p012' : 2,
}

//Following comments are some initial data to show data format
const cartContents = {
    // 'admin' : {
    //     'p001' : 1, 
    //     'p002' : 2,
    // },
};

const cartSequences = {
    // 'admin' : [ 
    //     'p001',
    //     'p002'
    // ],
}

// const orderId1 = uuid();
// const orderId2 = uuid();
const orderDetails = {
    // [orderId1] : {
    //     orderId : orderId1,
    //     username : 'admin',
    //     items : {
    //         'p003' : 1, 
    //         'p004' : 2,
    //     },
    //     time : "2022-12-09 10:08:24",//if after parse
    //     total : 10,
    // },
    // [orderId2] : {
    //     orderId : orderId2,
    //     username : 'admin',
    //     items : {
    //         'p005' : 1, 
    //         'p006' : 2,
    //     },
    //     time : "2022-12-09 10:08:24",//if after parse
    //     total : 11,
    // }
}

const userOrders = {
    // 'admin' : [
    //     orderId1,
    //     orderId2,
    // ]
}

function contains(id) {
    return !!orderDetails[id];
}

function getUserCart(username) {
    if(!cartSequences[username]) {
        const emptyCart = {
            username,
            cartSequence : [],
            cartContent : {},
        }
        return emptyCart;
    }
    const cart = {
        username,
        cartSequence : cartSequences[username],
        cartContent : cartContents[username], 
    }
    return cart;
}

function updateUserCart(username, cart) {
    cartSequences[username] = cart.cartSequence;
    cartContents[username] = cart.cartContent;
    return getUserCart(username);
}

function getTotal(username) {
    let sum = 0;
    if(!cartContents[username]) {
        return sum;
    }
    const userCart = cartContents[username];
    for(let productId in userCart) {
        let subtotal = products[productId].price * userCart[productId];
        sum += subtotal;
    }
    return sum.toFixed(2);
}

function checkInventories(cartContent) {
    for(let productId in cartContent) {
        if (!inventories[productId] || cartContent[productId] > inventories[productId]) {
            return false;
        }
    }
    return true;
}

function reduceInventories(items) {
    for(let productId in items) {
        let originalQuantity = inventories[productId];
        let newQuantity = originalQuantity - items[productId];
        inventories[productId] = newQuantity; 
    }
}

function addInventories(items) {
    for(let productId in items) {
        let originalQuantity = inventories[productId];
        let newQuantity = originalQuantity + items[productId];
        inventories[productId] = newQuantity; 
    }
}

function addOrder(username) {
    const orderId = uuid();
    const items = cartContents[username];
    orderDetails[orderId] = {
        orderId,
        username,
        items,
        time : Date.now(),
        total : getTotal(username),
    };
    reduceInventories(items);
    if(!userOrders[username]){
        userOrders[username] = [];
    }
    userOrders[username].unshift(orderId); //newest order show at first
    delete cartSequences[username];
    delete cartContents[username];
    return orderId;
}

function getUserOrderlist(username) {
    const userOrderlist = [];
    const userOrder = userOrders[username];
    if(!userOrder){
        return userOrderlist;
    }
    for(let historyOlderId of userOrder) {   
        userOrderlist.push(orderDetails[historyOlderId]);
    }

    return userOrderlist;
}

function cancelOrder(username, orderId) {
    if(!contains(orderId)) {
        return;
    }
    let items = orderDetails[orderId].items;
    addInventories(items);
    delete orderDetails[orderId];
    userOrders[username].splice(userOrders[username].indexOf(orderId), 1);
    return orderId;
}

function getProductList() {
    const productsList = {};
    for(let productId in products) {
        productsList[productId] = {
            productId,
            name : products[productId].name,
            image : products[productId].image,
            price : products[productId].price,
            quantity : inventories[productId],
        }
    }
    return productsList;
}

module.exports = {
    getProductList,
    getUserCart,
    updateUserCart,
    checkInventories,
    getUserOrderlist,
    addOrder,
    cancelOrder,
};
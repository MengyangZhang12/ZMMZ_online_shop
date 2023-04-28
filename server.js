const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

const PORT = process.env.PORT || 3000;

const sessions = require('./sessions');
const users = require('./users');
const shop = require('./shop');


app.use(cookieParser());
app.use(express.static('./build'));
app.use(express.json());


// check for session
app.get('/api/session', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if(!sid || !users.isValid(username)) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }
    res.json({ username });
});


// login
app.post('/api/session', (req, res) => {
    const { username } = req.body;

    if(!users.isValid(username)) {
        res.status(400).json({ error: 'required-username' });
        return;
    }

    if(username === 'dog') {
        res.status(403).json({ error: 'auth-insufficient' });
        return;
    }

    const sid = sessions.addSession(username);
    const existingUserData = users.getUserData(username);

    if(!existingUserData) {
        users.addUserData(username, Date.now()); //register time
    }

    const productslist = shop.getProductList();
    res.cookie('sid', sid);
    res.json( productslist );
});

//logout
app.delete('/api/session', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';

    if(sid) {
        res.clearCookie('sid');
    }

    if(username) {
        sessions.deleteSession(sid);
    }

    res.json({ username }); 
});

//get products list
app.get('/api/products', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if(!sid || !users.isValid(username)) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }
    const productslist = shop.getProductList();
    res.json(productslist);
});

//get user cart
app.get('/api/carts', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if(!sid || !users.isValid(username)) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }
    const userCart = shop.getUserCart(username);
    res.json(userCart);
});

//post cart
app.post('/api/carts', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if (!sid || !username) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }
    const { cart } = req.body;

    const userCart = shop.updateUserCart(username, cart);
    res.json({username, userCart});
});


//get user order
app.get('/api/orders', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';

    if(!sid || !users.isValid(username)) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    const userOrder = shop.getUserOrderlist(username);
    res.json(userOrder);
});

//post order
app.post('/api/orders', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';

    if (!sid || !username) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }
    if(!shop.checkInventories(shop.getUserCart(username).cartContent)) {
        res.status(400).json({ error: 'lack-inventory' });
        return;
    }
    shop.addOrder(username);
    const orderlist = shop.getUserOrderlist(username);
    const userCart = shop.getUserCart(username);
    res.json({username, orderlist, userCart});
});

//delete order
app.delete('/api/orders/:id', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';

    if(!sid || !users.isValid(username)) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    const { id } = req.params;
    const orderId = shop.cancelOrder(username,id);

    res.json({ message: orderId ? `Succeed cancel order` : `Order not exist` });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
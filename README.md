# Final Project 
By Mengyang Zhang
## Topic
An online shop store for designed crystal products (Brand name: ZMMZ)
Picture licenses : all original
## Functions
### Login
+ Login page has a login form, which allows user to login by username. 
+ The input has restricted check for empty input, invalid characters and disallowed username(dog).  
### Products display (Home)
+ Products page shows every product with its picture, name, price and inventory quantity. 
+ At the end of every product, an add button can add this product to cart or add the product quantity in cart by 1. The button also can show the how many of the product in cart now.
+ The product quantity add to cart cannot exceed its inventory. If the inventory of product minus to zero, it will not show on the page.
### Cart
+ Cart page shows a list of the picture, name, quantity, subtotal prices of every product added to cart.
+ Every product has quantity change buttons, also, it cannot add over the inventory of the product and if the quantity reduce to zero, the product will remove from cart.
+ Both add buttons will disabled if chosen quantity larger than inventory.
+ At the bottom of cart page, it shows the current total price of all products in cart. 
+ A checkout button can submit the order, reduce the inventory and reset the cart. 
+ Back-end service has check for inventory when post checkout incase conflict between different users. (status code 400)
### Account
+ Account page records users history orders with content details.
+ Every order has a cancel order button, which allows user to cancel the order. The order will be deleted and the inventory of relevant products will recover.
### Logout
+ User can logout and login as other user with original data stored.

## Visual

+ Loading indicator
+ Error message on page
+ header and footer
+ Drop-down menu(only UI)

## Security
All service calls based on authorization.





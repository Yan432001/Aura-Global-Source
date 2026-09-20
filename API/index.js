// import plugin cors ដើម្បីឲ្យ react អាច access ប្រើប្រាស់បាន
const cors = require("cors");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

// import data by app folder real data 
require("./app/config/route/admin/borrower.route")(app);
require("./app/config/route/admin/categories.route")(app);
require("./app/config/route/admin/products.route")(app);
require("./app/config/route/admin/address.route")(app);
require("./app/config/route/admin/product.options.route")(app);
require("./app/config/route/admin/product.photo.route")(app);
require("./app/config/route/admin/product.price.route")(app);
require("./app/config/route/admin/product.rack.route")(app);
require("./app/config/route/admin/product.serials.route")(app);
require("./app/config/route/admin/product.units.route")(app);
require("./app/config/route/admin/product.variants.route")(app);
require("./app/config/route/admin/auth.route")(app);
require("./app/config/route/admin/setting.route")(app);
require("./app/config/route/admin/permissions.route")(app);


app.get("/api/home", (req, res) => {
    const data = [
        {
            key: 'products',
            title: 'Total Products',
            total: 1128,
            trend: 'up',
            trendValue: '10%',
        },
        {
            key: 'orders',
            title: 'Total Orders',
            total: 286,
            trend: 'up',
            trendValue: '5.2%',
        },
        {
            key: 'customers',
            title: 'Total Customers',
            total: 1234,
            male: 600,
            female: 634,
            trend: 'up',
            trendValue: '3.1%',
        },
        {
            key: 'revenue',
            title: 'Total Revenue',
            total: 112893,
            trend: 'down',
            trendValue: '2.5%',
        },
    ];

    res.json({
        list: data,
    })
})
const PORT = 8080;
app.listen(PORT, () => {
    console.log("http://localhost:" + PORT);

})
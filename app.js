const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

let P1 = require('./db/product');
let U1 = require('./db/user');
let product = require('./db/seed');

//register route
app.post('/register', async (req, res) => {
    let { rname, pass } = req.body;
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(pass, salt);
    await U1.create({ username: rname, password: hash });
    console.log("user registered successfully")
    res.redirect('/products');
});

app.get('/products', async (req, res) => {
    let p2 = await P1.find({});
    // console.log(p2);
    res.render('index', { p2 });
})

app.get('/product/new', (req, res) => {
    res.render('new');
})

app.post('/product', async (req, res) => {
    let { Pname, Pprice, Pdesc, Prating, Pqty, Pimg } = req.body;
    await P1.create({
        name: Pname, price: Pprice, desc: Pdesc, rating: Prating, qty: Pqty, img: Pimg
    });
    console.log('Product Added into db');
    res.redirect('/products');
})

app.get('/product/:id', async (req, res) => {
    let { id } = req.params;
    let p = await P1.findById(id);
    console.log(p);
    if (!p) res.send("product not found");
    res.render('show', { p });
});

app.get('/product/:id/edit', async (req, res) => {
    let { id } = req.params;
    let e = await P1.findById(id);
    if (!e) res.send("something went wrong");
    res.render('edit', { e });
});

app.put("/product/:id", async (req, res) => {
    let { Ename, Eprice, Edesc, Erating, Eqty, Eimg } = req.body;
    await P1.findByIdAndUpdate({ _id: req.params.id },
        { name: Ename, price: Eprice, desc: Edesc, rating: Erating, qty: Eqty, img: Eimg }
    );
    console.log('Update Successfully..');
    res.redirect('/products');
});

app.delete("/product/:id", async (req, res) => {
    let { id } = req.params;
    let deleteproduct = await P1.findByIdAndDelete(id);
    if (!deleteproduct) res.send("product id not found");
    console.log("product deleted successfully !! ");
    res.redirect('/products');
});

const connectdb = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/Ecom');
    console.log('Connected to DB');
}
connectdb();

let seeddb = async () => {
    await P1.insertMany(product);
    console.log('Seed Done');
}

// seeddb();
app.listen(3000, () => console.log('App is running at Port 3000'));
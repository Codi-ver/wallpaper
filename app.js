const express = require('express');
const app = express();
app.use(express.json());
const categoryRoute = require("./routes/category"); 
const adminRoute = require('./routes/admin');
const wallpaperRoute = require('./routes/wallpaper');

app.use('/category', categoryRoute);

app.use('/admin', adminRoute);

app.use('/wallpaper', wallpaperRoute);



module.exports = app;

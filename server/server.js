const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const userRoutes = require('./routes/user-routes');
const imageRoutes = require('./routes/image-upload');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.use('/api/', userRoutes);
app.use('/api/', imageRoutes);

app.listen(PORT, () =>
    console.log(`api server listening on port ${PORT}`)
);
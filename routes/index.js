const carRoutes = require('./car');
const authRoute = require('./auth')

const constructorMethod = (app) => {
    app.use('/', carRoutes);
    app.use('/', authRoute);
    // app.use('/additem', addProductRoute);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;
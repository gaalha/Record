let index = require('./controllers/index');
let userController = require('./controllers/api/userController');

module.exports = (app) => {
    app.use('/',                    index);
    app.use('/api/user',            userController);
}


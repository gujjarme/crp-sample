const authRouter = require('../routes/auth.routes');

class RoutesLoader{
    static initRoutes(app){
        app.use(`/api/auth`,authRouter);
    }
}

module.exports= {RoutesLoader};
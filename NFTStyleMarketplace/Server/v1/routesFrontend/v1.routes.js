import express from 'express';
const Router = express();

import Token from './token.routes';
import Admi from '../admin/router/admin.router';
Router.use('/token',Token);
Router.use('/admin',Admi)

import User from './User.routes';
Router.use('/user',User);
Router.get('/', (req, res) => {
    return res.send("V1 Service Working")
})
export default Router;

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize("heroku_421c6a8995ece09", "b1b10e6764c7ca", "7b7712e2", {
    host: "us-cdbr-east-05.cleardb.net",
    dialect: "mysql"
})


export default sequelize;

import Users from '../models/Users';


sequelize.sync({
    force: true
});

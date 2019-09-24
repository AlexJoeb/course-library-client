'use strict';

const Sequelize = require(`sequelize`);

const fs = require('fs');
const path = require(`path`);

const base  = path.basename(__filename);

// * Get the NODE_ENV status, tells us if app is "development", "production", "etc";
const env   = process.env.NODE_ENV || 'development';

/*
 * Returns the proper config section of config depending on the NODE_ENV status.
*/
const conf  = require(`${__dirname}/../config.json`)[env];

// * Database object for later export.
const database = {};

let sequelize;
if(conf.use_env_variable){
    sequelize = new Sequelize(process.env[conf.use_env_variable], conf);
} else{
    sequelize = new Sequelize(conf.database, conf.username, conf.password, conf);
}

fs  .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== base) && (file.slice(-3) === ".js");
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(model => {
    if(db[model].associate) {
        db[model].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
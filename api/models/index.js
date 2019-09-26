'use strict';

// * Import Sequelize
const Sequelize = require(`sequelize`);

// * Import File System ("FS")
// * Common use for the File System Module:
// *     Read files
// *     Create files
// *     Update files
// *     Delete files
// *     Rename files
// * https://www.w3schools.com/nodejs/nodejs_filesystem.asp

const fs = require('fs');

// * The Path module provides a way of working with directories and file paths.
// * https://www.w3schools.com/nodejs/ref_path.asp
const path = require(`path`);

// * The path.basename() method returns the filename part of a file path.
// * __dirname: The directory name of the current module.
const base  = path.basename(__filename);

// * Get the NODE_ENV status, tells us if app is "development", "production", "etc";
const env   = process.env.NODE_ENV || 'development';

// * Returns the proper config section of config depending on the NODE_ENV status.
// * If NODE_ENV is in developement, returns the `developement` JSON from config.
// * If NODE_ENV is in production, returns the `production` JSON from config.
const conf  = require(`${__dirname}/../config/config.json`)[env];

// * Database object for later export.
const db = {};

// * Initialize new Sequelize Object
let sequelize;
if(conf.use_env_variable){
    sequelize = new Sequelize(process.env[conf.use_env_variable], conf);
} else{
    sequelize = new Sequelize(conf.database, conf.username, conf.password, conf);
}

// * .readdirSync -> Read (Dir)ectory Sync
// *    - Reads the directory of __dirname. 
fs  .readdirSync(__dirname)
    // * Filters the all files in the __dirname directory.
    .filter(file => {
        // * (file.indexOf('.') !== 0) -> Filters out files such as `.env` file, with `.` at index of 0.
        // * (file !== base) -> Filters out this file. 
        // * (file.slice(-3) === ".js") -> Filters out files that don't end with `.js`, ensuring only reading JavaScript Files.
        return (file.indexOf('.') !== 0) && (file !== base) && (file.slice(-3) === ".js");
    })
    .forEach(file => {
        // * For each of the files return from filter, import the file's model.
        // * Set the Datebase object with the models name as key and model as the value.
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(model => {
    // * For each of the key values in the Database Object, register association.
    if(db[model].associate) {
        db[model].associate(db);
    }
});

// * Include sequelize and Sequelize in Database for export.
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// * Export database object.
module.exports = db;
import { Sequelize } from "sequelize";

const database = 'egaarysc';
const username = 'egaarysc';
const password = '44aLKwjC8RAhMPfwNt3ofHlg4Lojg-9Y';
const host = 'hattie.db.elephantsql.com';

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'postgres'
});

export default sequelize;
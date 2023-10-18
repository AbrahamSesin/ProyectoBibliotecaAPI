import mysqlConnection from 'mysql2/promise';

const properties = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Biblioteca-API'
};

export const pool = mysqlConnection.createPool(properties);
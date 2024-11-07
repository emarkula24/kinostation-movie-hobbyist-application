import pkg from 'pg';
const { Pool } = pkg;

const openDb = () => {
    const pool = new Pool ({
            user: "postgres",
            host: "localhost",
            database: "AWAP",
            password: "123456",
            port: 5432,
      
    })
    return pool;
};

const pool = openDb();

export { pool }
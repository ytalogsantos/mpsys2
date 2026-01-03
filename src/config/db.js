import 'dotenv/config';
import { Pool } from "pg";

try {

    const pool = new Pool({
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE
    });
    const res = await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id UUID,
        email varchar(80),
        password varchar(80),
        type varchar(80),
        active boolean
    );
    
`);
console.log(res.rows[0]);
} catch (error) {
    console.log(error.message);
}


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
        id UUID PRIMARY KEY,
        email varchar(80),
        password varchar(80),
        active boolean,
        created_at timestamp
    );

    CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        name varchar(80),
        role varchar(80)
    );

    CREATE TABLE IF NOT EXISTS maintenance_notes (
        id UUID PRIMARY KEY,
        priority varchar(80),
        title varchar(80),
        description varchar(80),
        profile_id UUID REFERENCES profiles(id),
        created_at timestamp
    );
    
`);
} catch (error) {
    console.log(error);
}

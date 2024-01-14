import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config()

const pool = new Pool({
    host: 'localhost',
    port: 5433,
    database: 'talkitive',
    user: 'postgres',
    password: 'Satyam12'
});

// const dblocal = `postgresql://${process.env.PGLOCAL_USER}:${process.env.PGLOCAL_PASSWORD}@${process.env.PGLOCAL_HOST}:${process.env.PGLOCAL_PORT}/${process.env.PGLOCAL_DATABASE}`
// const dbproduction ="postgres://wave_2a7r_user:0YNUue3cQUE6939JBnK5trvtmpJU3OUY@dpg-cmbu9pmn7f5s7393gbc0-a.oregon-postgres.render.com/wave_2a7r"


// const pool = new Pool({
//     connectionString : process.env.NODE_ENV === "production" ? dbproduction  : dblocal, 
//     ssl : {
//       rejectUnauthorized : false  
//     }
//   })

export default pool;
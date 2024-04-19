// imports here for express and pg
const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');
// static routes here (you only need these for deployment)
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_hr_db')
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')))
// app routes here
app.get('/api/employees', async (req, res, next) => {
    try {
        const SQL = `
        SELECT * from employees;
      `
        const response = await client.query(SQL)
        res.send(response.rows)
    } catch (ex) {
        next(ex)
    }
})

// create your init function
const init = async () => {
    await client.connect()
    const SQL = `
      DROP TABLE IF EXISTS employees;
      CREATE TABLE employees(
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
       admin BOOLEAN DEFAULT FALSE
      );
      INSERT INTO employees(name, admin) VALUES('Rob Steven', true);
      INSERT INTO employees(name, admin) VALUES('Geoge Obama', true);
     INSERT INTO employees(name) VALUES('Rob Wither');
    `
    await client.query(SQL)
    console.log('data seeded')
    const port = process.env.PORT || 3000
    app.listen(port, () => console.log(`listening on port ${port}`))
}

// init function invocation
init()
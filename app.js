// const express = require('express');
// const { Pool } = require('pg');


// const app = express();
// const port = 3000;

// // PostgreSQL connection setup
// const pool = new Pool({
//   user: 'postgres', // Replace with your PostgreSQL username
//   host: 'postgresql', // Replace with your PostgreSQL service name
//   database: 'mydb', // Replace with your PostgreSQL database name
//   password: 'yourpassword', // Replace with your PostgreSQL password
//   port: 5432, // Replace with your PostgreSQL port
// });

// // Initialize the connection pool
// pool.on('error', (err, client) => {
//   console.error('Unexpected error on idle client', err);
//   process.exit(-1);
// });
// console.log("Connection Pool initialized",pool);

// app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

// app.get('/hello', (req, res) => {
//   res.send('Hello, World!');
// });

// // Create an endpoint to store data in PostgreSQL
// app.post('/data/', async (req, res) => {
//   try {
//     // Data to be inserted into PostgreSQL (you should validate/sanitize this data)
//     const dataToInsert = {
//       name: 'John Doe',
//       age: 30,
//       // Add other data fields here
//     };

//     const query = {
//       text: 'INSERT INTO mydb.userinfoo(name, age) VALUES($1, $2) RETURNING *',
//       values: [dataToInsert.name, dataToInsert.age],
//     };

//     const { rows } = await pool.query(query);
//     res.status(201).json({ message: 'Data stored successfully', insertedData: rows[0] });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get('/get', async (req, res) => {
//   try {
//     const query = 'SELECT * FROM mydb.userinfoo';
//     const { rows } = await pool.query(query);

//     // Convert the rows to an HTML table
//     const tableHTML = generateHTMLTable(rows);

//     // Return the HTML table as the response
//     res.send(tableHTML);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// function generateHTMLTable(data) {
//   if (!Array.isArray(data) || data.length === 0) {
//     return '<p>No data available.</p>';
//   }

//   const headers = Object.keys(data[0]);
//   const tableRows = data.map(row => {
//     return `<tr>${headers.map(header => `<td>${row[header]}</td>`).join('')}</tr>`;
//   });

//   const tableHTML = `
//     <table border="1">
//       <thead>
//         <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
//       </thead>
//       <tbody>
//         ${tableRows.join('')}
//       </tbody>
//     </table>
//   `;

//   return tableHTML;
// }


require('dotenv').config();
const { ExpressLoader } = require('./loaders/express.loader');
const { DatabaseLoader } = require('./loaders/database.loader');
const { RoutesLoader } = require('./loaders/routes.loader');



const app= ExpressLoader.init();

DatabaseLoader.init();
DatabaseLoader.checkConnection();

RoutesLoader.initRoutes(app);

const port = 3000;

app.listen(port, () => {
  console.log(`Custom reporting app listening at http://localhost:${port}`);
});

module.exports=app;

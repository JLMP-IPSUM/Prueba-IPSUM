const { createServer } = require('node:http');
const fs = require('fs');
const sql = require('mssql');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const express = require("express");
const app = express();

const hostname = '127.0.0.1';
const port = 3000;

const sqlConfig = {
    user: 'PruebaIPSUM',
    password: 'IPSUMp2024!',
    database: 'master',
    server: 'localhost',
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  };

sql.connect(sqlConfig, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log("DB Connection Successful!");
});

const server = createServer((req, res) => {
    if (req.method === 'GET'){
        let filePath = __dirname + '/public/index.html';

        switch(req.url) {
            case '/login':
                filePath = __dirname + '/public/login.html';
                break;
            case '/user':
                filePath = __dirname + '/public/user.html';
                break;
            case '/admin':
                filePath = __dirname + '/public/admin.html';
                break;
            default:
                filePath = __dirname + '/public/index.html';
                break;
        }

        fs.readFile(filePath, (err, data) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data, 'utf8');
        })
    }
    else if (req.method === 'POST' && req.url === '/submit'){
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error processing form');
                return;
            }

            const sqlQuery = `
                INSERT INTO prueba_ipsum_users1 
                (UserID, FirstName, LastName, Email, Phone, County, FavFood, FavArtist, FavPlace, FavColor, Password) 
                VALUES (NEWID(), @fName, @lName, @Email, @Phone, @County, @FavFood, @FavArtist, @FavPlace, @FavColor, @Password)
                `;

            
            try {
                const pool = await sql.connect(sqlConfig);
                await pool.request()
                    .input('fName', sql.VarChar, fields.fName)
                    .input('lName', sql.VarChar, fields.lName)
                    .input('Email', sql.VarChar, fields.emailAdd)
                    .input('Phone', sql.VarChar, fields.phoneNum)
                    .input('County', sql.VarChar, fields.countryName)
                    .input('FavFood', sql.VarChar, fields.comidaFav)
                    .input('FavArtist', sql.VarChar, fields.artistaFav)
                    .input('FavPlace', sql.VarChar, fields.lugarFav)
                    .input('FavColor', sql.VarChar, fields.colorFav)
                    .input('Password', sql.VarChar, fields.firstPassword)
                    //.input('ProfilePic', sql.VarBinary, profilePicData)
                    .query(sqlQuery);
        
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Data inserted successfully');
            } catch (err) {
                console.error('Error inserting data:', err.stack);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error inserting data');
            }
            
        })
    }
});

  
//});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

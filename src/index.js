/*
    Essa classe é o entry point da aplicação, aqui é iniciado o servidor na instacia
    de app, iniciamos o "listen" do server e passamos o resto das responsabilidades para 
    routes.index   
*/

const express = require('express');

const app = express();

//Database
const db = require('./src/config/database')

//inicia a conexão com o banco
db.authenticate()
    .then(() => console.log('database connected...'))
    .catch(err => console.log('error: ' + err))

// Passa a nossa instancia de app para o routes.index ter acesso também.
require('./src/app/routes/routes.index')(app);


const port = process.env.LISTEN_PORT;
app.listen(port, () => {
    console.log("Listening at port " + port +"...")
});
/*
    Essa classe é o entry point da aplicação, aqui é iniciado o servidor na instacia
    de app, iniciamos o "listen" do server e passamos o resto das responsabilidades para 
    routes.index   

*/

const express = require('express');

const app = express();

// Passa a nossa instancia de app para o routes.index ter acesso também.
require('./src/routes/routes.index')(app);

app.listen(3000, () => {
    console.log("Listening at port 3000...")
});
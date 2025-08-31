const express = require("express");
const { PrismaClient } = require("@prisma/client");
const RouterEmprestimo = require("./router/RouterEmprestimo");
const app = express(); //recupera uma instancia de express
app.use(express.json()); //configura o express para entender json
app.use(express.urlencoded({ extended: true }));
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'));
const prisma = new PrismaClient(); //cria uma instancia do PrismaClient


const portaServico = 3000;

//inicia a espera por requisições http na porta 3000
app.listen(portaServico);
console.log("Api rodando no endereço: http:localhost:3000/");

app.use(RouterEmprestimo);

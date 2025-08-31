const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); //cria uma instancia do PrismaClient

const express = require("express");
const router = express.Router()

const fieldsValidate = require("../Utilities/utilitiesEmprestimo").fieldsValidate;
const numberToUs = require("../Utilities/utilitiesEmprestimo").numberToUs;
const selectLoanOptions = require("../Utilities/utilitiesEmprestimo").selectLoanOptions;

//rota: GET: /
exports.index = (req, res) => {
  return res.render('index',{msg:""});
};
exports.cadastro = async (req, res) => {
  const cpf = req.query.cpf ?? null;
  let values = {
    cpf: "",
    name: "",
    income: "",
    age: "",
    location: "",
    city: ""
  }

  if(cpf){
    const user = await prisma.User.findUnique({
      where: {
        cpf: cpf,
      },
    });

    if(user){
      values = {...values, ...user};
    }
  }
  
  return res.render('cadastro',{message:"" ,errors:"", values});
};

// Rota: POST /creditos
exports.enviaDados =
  ("/creditos",
  async (req, res) => {
    try {
      const userFields = {
        cpf: req.body.cpf,
        name: req.body.name,
        age: parseInt(req.body.age),
        income: numberToUs(req.body.income),
        city: req.body.city,
        location: req.body.location,
      };

      const isValid = fieldsValidate(userFields,res); // Valida os campos do usuário
      if(!isValid) return;

      const user = await prisma.User.create({
        data: userFields,
      });
      
      this.buscaDadosPorCPF(req, res);

    } catch (error) {
      if (error.code === "P2002") {
        return await this.alteraDados(req,res);
      }
    }
  });


// Rota: GET /creditos - por CPF
exports.buscaDadosPorCPF =
  ("/consulta",
  async (req, res) => {
    try {
      const cpf = req.query?.cpf ?? req.body?.cpf ?? '';
      const cpfCleaned = cpf.replace(/\D/g, "");

      if(cpfCleaned == "" || cpfCleaned.length !== 11 ){
        return res.render('index',{msg:"CPF inválido."})
      }

      const user = await prisma.User.findUnique({
        where: {
          cpf: cpf,
        },
      });

      const nome = user.name;
      const creditos = selectLoanOptions(user.income, user.city, user.location, user.age);

      return res.render('consulta', { nome, cpf, creditos });

    } catch (error) {
      return res.render('index',{msg:"Usuário não encontrado"});
    }
  });


// Rota: PUT /creditos
exports.alteraDados =
  ("/creditos",
  async (req, res) => {
      const userFields = {
        cpf: req.body.cpf,
        name: req.body.name,
        age: parseInt(req.body.age),
        income: numberToUs(req.body.income),
        city: req.body.city,
        location: req.body.location,
      };

      fieldsValidate(userFields,res); // Valida os campos do usuário

      await prisma.User.update({
        where: {
          cpf: req.body.cpf, // assume que o CPF é único
        },
        data: userFields,
      });

      this.buscaDadosPorCPF(req, res);
  });

  
// Rota: DELETE /creditos
exports.deletaDados =
  ("/creditos/:cpf",
  async (req, res) => {
    try {
      await prisma.User.delete({
        where: {
          cpf: req.params.cpf, // assume que o CPF é único e usado para identificar o usuário
        },
      });

      res.status(200).json({ message: "Usuário deletado com sucesso!" });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }
      res.status(500).json({ message: error.message });
    }
  });


// //Rota para testes
// exports.buscaDados =
//   ("/usuarios",
//   async (req, res) => {
//     try {
//       const users = await prisma.User.findMany();
//       res.status(200).json(users); // Retorna todos os usuários
//     } catch (error) {
//       res.status(500).json({ message: error.message }); // Erro interno do servidor
//     }
//   });



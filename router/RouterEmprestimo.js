const express = require("express");

const ControllerEmprestimo = require("../controller/ControllerEmprestimo");

const router = express.Router()
router.use(express.json());

//rota: GET: / - Renderiza Index
router.get("/", ControllerEmprestimo.index);

//rota: GET: /cadastro - Renderiza Tela de Cadasto
router.get("/cadastro", ControllerEmprestimo.cadastro)

router.put("/cadastro/:cpf", ControllerEmprestimo.alteraDados)

// Rota: POST /creditos - Salva dados do cadastro
router.post("/creditos", ControllerEmprestimo.enviaDados);

// Rota: GET /creditos - Busca dados pelo CPF
router.get("/creditos", ControllerEmprestimo.buscaDadosPorCPF);

// Rota: DELETE /creditos - Deleta pelo CPF
router.delete("/creditos/:cpf", ControllerEmprestimo.deletaDados);

// Rota: PUT /creditos
//router.get("/creditos", ControllerEmprestimo.alteraDados);

// Rota: GET /usuarios
//router.get("/usuarios", ControllerEmprestimo.buscaDados);
/*


// Rota: GET /creditos - por CPF
router.post("/consulta", ControllerEmprestimo.buscaDadosPorCPF);
*/

module.exports = router;

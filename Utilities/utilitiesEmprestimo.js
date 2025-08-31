const { render } = require("ejs");

// Função de validação dos campos do usuário
function fieldsValidate(user,res) {
  const cpf = user.cpf.replace(/\D/g, ""); // Remove caracteres não numéricos do CPF
  
  const values = {
    cpf: user.cpf || "",
    name: user.name || "",
    age: user.age || "",
    income: user.income || "",
    city: user.city || "",
    location: user.location || "",
  };

  const errors = {
    cpf : !cpf || cpf.length !== 11 ? "CPF inválido. Deve conter 11 dígitos.": "",
    name: !user.name ? "Nome inválido." : "",
    age: !user.age  || user.age <= 0 ? "Idade inválida" : "",
    income: !user.income || user.income < 3000.00 ? "Renda inválida. Deve ser superior a R$ 3.000,00.": "",
    location: !user.location ? "Localização inválida.": "",
  };

  if (Object.values(errors).some(err => err !== "")) {
    res.render("cadastro", { values, errors, message: "" });
    return false;
  }

  return true;
}

//Seleciona as opções de empréstimo com base na renda, localização e idade
function selectLoanOptions(income, city, location, age) {
  let loans = [];

  const loanTypes = {
    PERSONAL: { type: "PERSONAL", interest_rate: 4, description: 'Pessoal' },
    GUARANTEED: { type: "GUARANTEED", interest_rate: 3, description: 'Com garantia' },
    CONSIGNMENT: { type: "CONSIGNMENT", interest_rate: 2, description: 'Consignado' }
  }

  if (
    income <= 3000.0 || (
      income > 3000.0 &&
      income < 5000.0 &&
      city.toLowerCase() == 'porto alegre' &&
      location === "RS" &&
      age < 30
    )
  ) {
    return [loanTypes.PERSONAL, loanTypes.GUARANTEED];
  }

  if (income >= 5000.0) {
    return [loanTypes.CONSIGNMENT];
  }

  return [];
}

function printInfo(req) {
  return {
    customer: req.body.customer || req.body.name,
    loans: selectLoanOptions(req.body.income, req.body.city, req.body.location, req.body.age),
  };
}

function numberToUs(numberStr){
  return parseFloat(numberStr.replace('.', '').replace(',', '.'));
}

exports.fieldsValidate = fieldsValidate;
exports.printInfo = printInfo;
exports.selectLoanOptions = selectLoanOptions;
exports.numberToUs = numberToUs
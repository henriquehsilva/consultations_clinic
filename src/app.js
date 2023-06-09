import _ from './database.js';
import inquirer from "inquirer";
import UserService from "./services/user.service.js";
import UserModel from "./models/user.model.js";
import ConsultationService from "./services/consultation.service.js";
import ConsultationModel from "./models/consultation.model.js";

// Created instance of object for application
let user = {
  id: 0,
  name: '',
  phone: ''
};

let consultation = {
  id: 0,
  date: '',
  time: '',
  specialty: '',
  userId: 0
};

// Created input methods for application
const inputFunc = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'func',
        message: 'Escolha uma funcionalidade dentre as apresentadas?'
      },
    ])
    .then(answers => {
      switch(answers.func) {
        case '1': inputUser(); break;
        case '2': listUsers(); break;
        case '3': listSchedules(); break;
        case '4': process.exit(1); break;
      }; 
    });
}

const inputUser = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Qual o nome do paciente?'
      },
    ])
    .then(answers => {
      user.name = answers.name;
      if (user.name != '') {
        inputUserPhone();
      }
    });
}

const inputUserPhone = () => { 
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'phone',
        message: 'Qual o número de telefone?'
      },
    ])
    .then(answers => {
      user.phone = answers.phone;
      if (user.phone != '') {
        createUser();
      }
    });
}

const inputConsultation = (userId) => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'date',
        message: 'Qual o dia da consulta?',
        default: new Date().toLocaleDateString()
      },
    ])
    .then(answers => {
      consultation.date = answers.date;
      consultation.userId = userId;
      if (consultation.date != '') {
        inputConsultationTime();
      }
    });
}

const inputConsultationTime = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'time',
        message: 'Qual o horário da consulta?',
        default: new Date().toLocaleTimeString()
      },
    ])
    .then(answers => {
      consultation.time = answers.time;
      if (consultation.time != '') {
        inputConsultationSpecialty();
      }
    });
}

const inputConsultationSpecialty = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'specialty',
        message: 'Qual a especialidade?',
        default: 'Clinico Geral'
      },
    ])
    .then(answers => {
      consultation.specialty = answers.specialty;
      if (consultation.specialty != '') {
        createConsultation();
      }
    });
}

// Created CRUD methods for application
const createUser = () => {
  UserModel.find({}).sort({id: -1}).limit(1).then((u) => {
    if (u.length == 0) {
      u[0] = {
        id: 0
      }
    }
    let incrementId = u[0].id + 1;

    UserService
      .create(incrementId, user)
      .save().then((user) => {
        console.info('\n\t\x1b[32m Paciente cadastrado com sucesso!\x1b[0m\n');      
        showMenu();
      }).catch((error) => {
        if (error.code == 11000) {
          console.log('\n\t\x1b[33m Paciente já cadastrado! \x1b[0m\n');
          showMenu();
        }
      });
  });
}

const createConsultation = () => {
  ConsultationModel.find({}).sort({id: -1}).limit(1).then((c) => { 
    if (c.length == 0) {
      c[0] = {
        id: 0
      }
    }
    let incrementId = c[0].id + 1;

    if (consultation.date < new Date().toLocaleDateString() || consultation.time < new Date().toLocaleTimeString()) {
      console.log('\n\t\x1b[33m Horário inválido! \x1b[0m\n');
      showMenu();
    } else {
      ConsultationModel.find({date: consultation.date, time: consultation.time}).then((c) => {
        if (c.length > 0) {
          console.log('\n\t\x1b[33m Horário indisponível! \x1b[0m\n');
          showMenu();
        } else {
          ConsultationService.create(incrementId, consultation);
          console.info('\n\t\x1b[32m Consulta marcada com sucesso!\x1b[0m\n');
          showMenu();
        }
      });
    }

  });
}

const deleteConsultation = (consultationId) => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'validation',
        message: 'Deseja realmente cancelar o agendamento? (digite Sim ou Não)',
        default: 'Sim'
      },
    ])
    .then(answers => {
      if (answers.validation != 'Sim') { showMenu(); }
      ConsultationService.deleteById(consultationId);
      console.info('\n\t\x1b[32m Consulta cancelada com sucesso!\x1b[0m\n');
      showMenu();
    });
}

// Created mask for phone
const maskPhone = (phone) => {
  let maskedPhone = '';
  let count = 0;
  for (let i = 0; i < phone.length; i++) {
    if (count == 0) {
      maskedPhone += '(' + phone[i];
    } else if (count == 1) {
      maskedPhone += phone[i] + ') ';
    } else if (count == 6) {
      maskedPhone += phone[i] + '-';
    } else {
      maskedPhone += phone[i];
    }
    count++;
  }
  return maskedPhone;
}

// Created list methods for application
const listUsers = () => {
  const title = "\n\tLista de Pacientes Cadastrados\n";
  console.info(title);
  
  UserModel.find({}).sort({}).limit(9).then((u) => {
    u.forEach((user) => {
      console.info("\t" + user.id + " | " + user.name + "\t | " + maskPhone(user.phone));
    });
    
    console.info("\t----------------------------------\n");
    selectUser();
  });
}

const listSchedules = () => {
  const title = "\n\tLista de Agendamentos Cadastrados\n";
  console.info(title);
  
  ConsultationModel.find({}).sort({}).limit(9).then((c) => {
    c.forEach((consultation) => {
      console.info("\t" + consultation.id + " | " + consultation.date + "\t | " + consultation.time + "\t | " + consultation.specialty);
    });
    
    console.info("\t----------------------------------\n");
    selectConsultation();
  });
}

// Created select methods for application
const selectUser = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'userId',
        message: 'Escolha o número correspondente a um paciente:'
      },
    ])
    .then(answers => {
      UserModel.find({id: answers.userId}).then((u) => {
        console.info("\n\t" + u[0].id + " | " + u[0].name + "\t | " + maskPhone(u[0].phone));
        console.info("\t----------------------------------\n");
        inputConsultation(u[0].id);
      });
    });
}

const selectConsultation = () => {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'consultationId',
        message: 'Deseja remarcar qual agendamento:'
      },
    ])
    .then(answers => {
      ConsultationModel.find({id: answers.consultationId}).then((c) => {
        console.info("\n\t" + c[0].id + " | " + c[0].date + "\t | " + c[0].time + "\t | " + c[0].specialty);
        console.info("\t----------------------------------\n");
        deleteConsultation(c[0].id);
      });
    });
}

// Created menu display method for application
const showMenu = () => {
  const menu = "\tSistema de Clínica de Consultas\n\n" +
    "\t1. Cadastrar um paciente\n" +
    "\t2. Marcações de consultas\n" +
    "\t3. Cancelamento de consultas\n" +
    "\t4. Sair\n" +
    "\t----------------------------------\n";
  console.info(menu);
  inputFunc(); 
}

showMenu();


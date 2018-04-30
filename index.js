const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/check', (req, res) => {
  const dataNascimento = req.body.data_nascimento;
  const nome = req.body.name;
  const idade = moment().diff(moment(dataNascimento, "DD/MM/YYYY"), 'years');
  if (idade > 18)
    res.redirect(`/major?nome=${nome}`);
  else if (idade <=18)
    res.redirect(`/minor?nome=${nome}`);
  // res.send(`Seu nome é ${req.body.name} e idade ${idade}`);
});

const userMiddleware = (req, res, next) => {
  if (req.query.nome === undefined){
    res.redirect(`/`);
  }else
    next();

};

app.get('/major', userMiddleware,  (req, res) => {
  res.render('major', { nome : req.query.nome} );
});

app.get('/minor', userMiddleware,  (req, res) => {
  res.render('minor',{ nome : req.query.nome});
});



app.listen(3000);

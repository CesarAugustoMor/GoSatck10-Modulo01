const express = require("express");

const server = express();
server.use(express.json());

const users = ["Diego", "Cláudio", "Victor", "César"]; //vetor de usuarios cadastraos

server.use((req, res, next) => {
  console.time("Tempo da Requisição");

  console.log("====================================");
  console.log(
    "Foi realizada uma requisição no método:",
    req.method,
    "Na rota/URL:",
    req.url
  );

  next();

  console.timeEnd("Tempo da Requisição");
  console.log("====================================");
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "Nome de Usuario requirido" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!users) {
    return res.status(400).json({ error: "Usuario não existente" });
  }

  req.user = user;
  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put("/users/:idex", checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  // @ts-ignore
  users.splice(index, 1);

  return res.send();
});
server.listen(3000); //porta na qual o servidor está escutando

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.MONGODB_URI;
const dbName = "CarParkingCampinas";

app.use(bodyParser.json());
app.use(cors()); // Adicione esta linha para habilitar CORS

app.post("/savePayment", async (req, res) => {
  console.log("POST /savePayment");
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("TicketPago");
    await collection.insertOne(req.body);
    res.status(200).send("Pagamento salvo com sucesso");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao salvar pagamento");
  } finally {
    await client.close();
  }
});

app.get("/getPrices", async (req, res) => {
  console.log("GET /getPrices");
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("Prices");
    const prices = await collection.findOne({});
    console.log(prices);
    res.status(200).json(prices);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao obter preços");
  } finally {
    await client.close();
  }
});

app.post("/updatePrices", async (req, res) => {
  console.log("POST /updatePrices");
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("Prices");
    await collection.updateOne({}, { $set: req.body }, { upsert: true });
    res.status(200).send("Preços atualizados com sucesso");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao atualizar preços");
  } finally {
    await client.close();
  }
});

// Rota para autenticação
app.post("/authenticate", async (req, res) => {
  console.log("POST /authenticate");
  const { username, password } = req.body;
  console.log(`Username: ${username}, Password: ${password}`);
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("Usuarios");
    const user = await collection.findOne({
      usuario: username,
      senha: password,
    });
    console.log(`User found: ${user}`);
    if (user && user.role === "ADMIN") {
      res.status(200).json({ authenticated: true, role: "ADMIN" });
    } else if (user) {
      res.status(200).json({ authenticated: true, role: "USER" });
    } else {
      res.status(401).json({ authenticated: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao autenticar usuário");
  } finally {
    await client.close();
  }
});

// Rota para obter os convênios
app.get("/getConvenios", async (req, res) => {
  console.log("GET /getConvenios");
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("Convenios");
    const convenios = await collection.find({}).toArray();
    console.log(convenios);
    res.status(200).json(convenios);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao obter convênios");
  } finally {
    await client.close();
  }
});

// Rota para obter os dados da coleção TicketPago
app.get("/getPayments", async (req, res) => {
  console.log("GET /getPayments");
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("TicketPago");
    const payments = await collection.find({}).toArray();
    console.log(payments);
    res.status(200).json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao obter pagamentos");
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

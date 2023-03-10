const express = require("express");
const fs = require("fs");
const dataPizzas = "backend/pizzas.json";
const dataAll = "backend/allergen.json";
const dataOrder = "backend/order.json";
const actualOrder = "backend/actualorder.json";

const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 9002;

//API's

/*-----PIZZAS----*/
app.get("/api/pizza", (req, res) => {
  fs.readFile(dataPizzas, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error loading data");
    }
    const jsonData = JSON.parse(data);

    res.send(jsonData);
  });
});

/*-----Allergens----*/
app.get("/api/allergen", (req, res) => {
  fs.readFile(dataAll, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error loading data");
    }
    const jsonData = JSON.parse(data);

    res.send(jsonData);
  });
});

/*-----Order----*/

app.get("/api/order", (req, res) => {
  fs.readFile(dataOrder, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error loading data");
    }
    const jsonData = JSON.parse(data);

    res.send(jsonData);
  });
});

app.post("/api/order", (req, res) => {
  const newOrder = req.body;

  // Read the existing order data from file
  fs.readFile(dataOrder, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error loading data");
    }
    const orders = JSON.parse(data).orders;

    // Generate a new order ID
    const maxId = Math.max(...orders.map((order) => order.id));
    newOrder.id = maxId + 1;

    // Add the new order to the array
    orders.push(newOrder);

    // Write the updated order data to file
    fs.writeFile(dataOrder, JSON.stringify({ orders }), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error saving data");
      }
      res.status(201);
    });
  });
});

/*-----ActualOrder----*/

app.get("/api/actualOrder", (req, res) => {
  fs.readFile(actualOrder, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error loading data");
    }
    const jsonData = JSON.parse(data);

    res.send(jsonData);
  });
});

app.post("/api/actualOrder", (req, res) => {
  const requestData = req.body;
  console.log(req.body);
  fs.readFile(actualOrder, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error loading data");
    }
    const orders = JSON.parse(data);

    // Append the new request data to the existing data
    orders.requestData.push(requestData);

    fs.writeFile(actualOrder, JSON.stringify(orders), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error saving data");
      }
      res.send(orders);
    });
  });
});

/*-----DeleteActualOrder----*/
app.delete("/api/actualOrder", (req, res) => {
  fs.writeFile(actualOrder, JSON.stringify({ requestData: [] }), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error deleting data");
    }
    res.send("Data deleted successfully");
  });
});

/*-----ADMIN PAGE----*/
app.get(["/admin"], (req, res, next) => {
  res.sendFile(path.join(`${__dirname}/../frontend/admin.html`));
});

/*-----Thanks PAGE----*/
app.get(["/success"], (req, res, next) => {
  res.sendFile(path.join(`${__dirname}/../frontend/thx.html`));
});

/*-----Thanks PAGE----*/
app.get(["/proba"], (req, res, next) => {
  res.sendFile(path.join(`${__dirname}/../frontend/proba.html`));
});

app.get("/", (req, res) => {
  res.redirect(301, "/pizza/list");
});
app.get(["/pizza/list", "/pizza/list:id"], (req, res, next) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});
app.get(["/chechkout"], (req, res, next) => {
  res.sendFile(path.join(`${__dirname}/../frontend/chechkout.html`));
});
app.use("/public", express.static(`${__dirname}/../frontend/public`));

app.listen(port, (_) => console.log(`http://127.0.0.1:${port}`));

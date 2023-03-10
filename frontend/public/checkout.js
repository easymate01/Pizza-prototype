let pizzaData;
let orderedPizzaData;
const root = document.getElementById("root");
const root2 = document.getElementById("root2");
let itemsToRemove = [];
function orderSummary(priceSum) {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = `<div class="row lower">
  <div class="col text-left">Összesen</div>
  <div id="price1" class="col text-right">${priceSum} Ft</div>
</div>
<div class="row lower">
  <div class="col text-left">Szállítási díj</div>
  <div class="col text-right">Ingyenes</div>
</div>
<div class="row lower">
  <div class="col text-left"><b>Fizetendő</b></div>
  <div id="price2" class="price col text-right"><b>${priceSum} Ft</b></div>
</div>
<div class="row lower">
<div  class="col text-left">
<a id="promo" href="#"><u>20% kedvezmény aktiválása</u></a>
  </div>
</div>
<button class="btn" onclick="saveOrder()">Megrendelés</button>
</div>`;
  root2.appendChild(newDiv);

  let formattedPrice = priceSum * 1000;

  const promoBt = document.getElementById("promo");
  promoBt.addEventListener("click", () => {
    document.getElementById("price1").innerHTML = `${promo(formattedPrice)} Ft`;
    document.getElementById("price2").innerHTML = `<b>${promo(
      formattedPrice
    )} Ft </b>`;
  });
}

function dataToDom(name, img, price, am, id) {
  console.log(am);
  const newDiv = document.createElement("div");
  newDiv.setAttribute("id", `widget-${id}`);
  newDiv.classList.add("row");
  newDiv.classList.add("item");
  newDiv.innerHTML = `<div class="col-4 align-self-center">
  <img
    class="img-fluid"
    src=${img}
  />
</div>
<div class="col-8">
  <div class="row"><b>${price}Ft</b></div>
  <div class="row text-muted">
    ${name}
  </div>
  <div class="row">${am}</div>
</div>
<div id="trash-${id}" class="trash"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
<path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
</svg></div>`;
  root.appendChild(newDiv);

  document.getElementById(`trash-${id}`).addEventListener("click", () => {
    document.getElementById(`widget-${id}`).remove();
  });
}

async function orderedPizza() {
  try {
    const response = await fetch(`/api/actualOrder`);
    const data = await response.json();
    orderedPizzaData = data.requestData;
  } catch (error) {
    console.error(error);
  }
}

async function pizzas() {
  try {
    const response = await fetch(`/api/pizza`);
    const data = await response.json();
    pizzaData = data.pizzas;
  } catch (error) {
    console.error(error);
  }
}

async function getOrderIds() {
  await orderedPizza();
  await pizzas();
  let ids = [];
  let qt = [];
  let sumQt = 0;
  for (let i = 0; i < orderedPizzaData.length; i++) {
    ids.push(orderedPizzaData[i].id);
    qt.push(orderedPizzaData[i].amount);
  }
  for (let i = 0; i < qt.length; i++) {
    sumQt += qt[i];
  }
  const qtSum = document.getElementById("qt");
  qtSum.innerHTML = `<b>${sumQt} tétel</b>`;

  const filteredPizzas = pizzaData.filter((pizza) => ids.includes(pizza.id));
  console.log(filteredPizzas);
  let priceSum = 0;

  for (j = 0; j < filteredPizzas.length; j++) {
    const pizza = filteredPizzas[j];
    const quantity = qt[ids.indexOf(pizza.id)];
    console.log(quantity * pizza.price);
    const newPrice = quantity * pizza.price;
    let formattedPrice = (newPrice / 1000).toFixed(3);
    dataToDom(pizza.name, pizza.img, formattedPrice, quantity, pizza.id);
    priceSum += pizza.price * quantity;
  }
  let formattedPrice = (priceSum / 1000).toFixed(3);
  orderSummary(formattedPrice);
}

function promo(priceSum) {
  let promoPrice = priceSum * 0.8;

  return promoPrice;
}

getOrderIds();

function getDate() {
  const inputDate = new Date();
  const outputDate = {
    year: inputDate.getFullYear(),
    month: inputDate.getMonth() + 1,
    day: inputDate.getDate(),
    hour: inputDate.getHours(),
    minute: inputDate.getMinutes(),
  };
  return outputDate;
}

//Get customer details
let customer = {
  name: "",
  email: "",
  address: {
    city: "",
    street: "",
  },
};
const userName = document.getElementById("username");
const userEmail = document.getElementById("email");
const userCity = document.getElementById("city");
const userStreet = document.getElementById("address");
userName.addEventListener("input", () => {
  customer.name = userName.value;
});
userEmail.addEventListener("input", () => {
  customer.email = userEmail.value;
});
userCity.addEventListener("input", () => {
  customer.address.city = userCity.value;
});
userStreet.addEventListener("input", () => {
  customer.address.street = userStreet.value;
});

async function saveOrder() {
  const newDate = getDate();
  const newCustomer = customer;
  console.log(customer);

  await orderedPizza(); // wait for orderedPizzaData to be initialized
  let orderObject = {
    id: 1,
    pizzas: orderedPizzaData,
    date: {
      year: newDate.year,
      month: newDate.month,
      day: newDate.day,
      hour: newDate.hour,
      minute: newDate.minute,
    },
    customer: {
      name: newCustomer.name,
      email: newCustomer.email,
      address: {
        city: newCustomer.address.city,
        street: newCustomer.address.street,
      },
    },
  };

  fetch(`/api/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderObject),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok");
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error(error));

  deleteActualOrders();
  setTimeout(() => {
    window.location.href = "/success";
  }, 1500);
}

function deleteActualOrders() {
  fetch("/api/actualOrder", {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Actual orders deleted successfully.");
      } else {
        console.error("Failed to delete actual orders.");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

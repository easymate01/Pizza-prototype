const table = document.getElementById("table");
let allOrders;

function dataToDom(id, name, address, pizzaId, city) {
  console.log(address);
  const newElement = document.createElement("tr");
  newElement.innerHTML = `<th>
  <label class="customcheckbox">
    <input type="checkbox" class="listCheckbox" />
    <span class="checkmark"></span>
  </label>
</th>
<td>#${id + 1}</td>
<td>Pizza: ${pizzaId}</td>
<td>${name}</td>
<td>${city} - ${address}</td>`;

  table.appendChild(newElement);
}

async function ordersList() {
  try {
    const response = await fetch(`/api/order`);
    const data = await response.json();
    allOrders = data.orders;
  } catch (error) {
    console.error(error);
  }
}

async function getOrderDatas() {
  await ordersList();
  console.log(allOrders);
  for (let i = 0; i < allOrders.length; i++) {
    const orderId = allOrders[i].id;
    const cName = allOrders[i].customer.name;
    const cityName = allOrders[i].customer.address.city;
    const cAddress = allOrders[i].customer.address.street;
    let orderPizzaId = [];
    for (let j = 0; j < allOrders[i].pizzas.length; j++) {
      orderPizzaId.push(allOrders[i].pizzas[j].id);
    }
    console.log(orderPizzaId);

    dataToDom(orderId, cName, cAddress, orderPizzaId, cityName);
  }
}
getOrderDatas();

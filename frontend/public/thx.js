const root = document.getElementById("root");
//let last = order;

function dataToDom(name, orderNumber, address) {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = `  <div class="card p-4 mt-3">
    <div
      class="first d-flex justify-content-between align-items-center mb-3"
    >
      <div class="info">
        <span class="d-block name">⌛ Köszönjük a rendelést, ${name}!</span><br>
        <span class="order">Rendelésszám: #D00${orderNumber}</span>
      </div>

      
    </div>
    <div class="detail">
      <span class="d-block summery"
        >Köszönjük a rendelése sikeres volt, átadtuk a futárnak, hamarosan nálad lesz. </span
      >
    </div>
    <hr />
    <div class="text">
      <span class="d-block new mb-1">Teljes név: ${name}</span>
    </div>
    <span class="d-block address mb-3"
      >Cím: ${address.city} ${address.street}</span
    >
    <div class="money d-flex flex-row mt-2 align-items-center">
            <span class="ml-2">Fizetésmód: Készpénzzel, a futárnál.</span>
    </div>
    <div class="last d-flex align-items-center mt-3">
     <a href="/">Térj vissza a főoldalra</a>
    </div>
  </div>`;
  root.appendChild(newDiv);
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
  const name = allOrders[allOrders.length - 1].customer.name;
  const address = allOrders[allOrders.length - 1].customer.address;
  let orderDetails = [];
  orderDetails.push(allOrders[allOrders.length - 1].date.year);
  orderDetails.push(allOrders[allOrders.length - 1].date.month);
  orderDetails.push(allOrders[allOrders.length - 1].date.day);
  orderDetails.push(allOrders[allOrders.length - 1].id);
  let orderNumber = orderDetails.join("-");
  console.log(orderNumber);
  dataToDom(name, orderNumber, address);
}
getOrderDatas();

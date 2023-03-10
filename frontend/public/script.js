const root = document.getElementById("root");

let pizzaData;

const dataToDom = function (
  actualName,
  actualPrice,
  actualDes,
  actualImg,
  allerg,
  productId,
  ingr
) {
  const pizzaId = probaObj.id[productId - 1];
  const newDiv = document.createElement("div");
  newDiv.setAttribute("id", `frame-${productId}`);
  newDiv.setAttribute("class", "frame");
  newDiv.classList.add("g-col-6");
  newDiv.innerHTML = `
  <div class="product_image">
    <img
      class="image_p"
      src=${actualImg}
    />
  </div>
  <div class="product_infos">
    <h1>${actualName}</h1>
    <h2>${actualPrice} Ft<span></span></h2>
   
   <div class="btnIng"> <button id="moreIngredients-${productId}" class="btnI" type="button">Több infó + </button></div>
          <div id="par-${productId}" class="hide par">
            <p > ${ingr}</p> 
            <hr style="width: 107%;
            margin-left: -10px; margin-bottom:5px;">
            <p>${allerg}</p>
          </div>

          <p id="des-${productId}">
          ${actualDes}
        </p>
  </div>
  <div class="btn1 d-grid gap-2 col-6 mx-auto">
   <input type="number" id="quantity-${pizzaId}" 
  class="input-group-text inp" name="quantity" value=""  size="4" min="1" max="" step="1" placeholder="1"
   inputmode="numeric" autocomplete="off" wtx-context="ACBC3D0C-99FD-4491-84C2-C58701B7EF8A"> 
   <button id="saveBtn-${pizzaId}" class="btn btn-dark " type="button" )">Kosárba teszem</button>

  </div>`;
  root.appendChild(newDiv);

  let segedNum = 1;
  const ingBtn = document.querySelector(`#moreIngredients-${productId}`);
  ingBtn.addEventListener("click", () => {
    segedNum++;
    if (segedNum % 2 == 0) {
      ingBtn.innerHTML = "More Details -";
    } else {
      ingBtn.innerHTML = "More Details +";
    }
    document.getElementById(`par-${productId}`).classList.toggle("hide");
    document.getElementById(`des-${productId}`).classList.toggle("hide");
  });

  //Quantity change
  const inpQuantity = document.getElementById(`quantity-${pizzaId}`);
  let amount = 0;
  inpQuantity.addEventListener("change", () => {
    if (amount == 0) {
      amount = 1;
    } else {
      amount++;
    }
  });

  //Add to cart
  const saveBtn = document.getElementById(`saveBtn-${pizzaId}`);
  const toastLiveExample = document.getElementById("liveToast");
  saveBtn.addEventListener("click", () => {
    const toast = new bootstrap.Toast(toastLiveExample);
    toast.show();
    if ((saveBtn.innerHTML = "Order")) {
      saveBtn.innerHTML = "Added to cart";
    }

    saveOrder(pizzaId, amount);
  });
};

const probaObj = {
  id: [],
  name: [],
  price: [],
  des: [],
  img: [],
  allergens: [],
  ingredients: [],
  allergensId: [],
  allergensNames: [],
};

async function pizzas() {
  try {
    const response = await fetch(`/api/pizza`);
    const data = await response.json();
    pizzaData = data;

    for (let i = 0; i < data.pizzas.length; i++) {
      probaObj.name.push(data.pizzas[i].name);
      probaObj.price.push(data.pizzas[i].price);
      probaObj.des.push(data.pizzas[i].description);
      probaObj.img.push(data.pizzas[i].img);
      probaObj.ingredients.push(data.pizzas[i].ingredients);
      probaObj.allergens.push(data.pizzas[i].allergens);
      probaObj.id.push(data.pizzas[i].id);
    }
  } catch (error) {
    console.error(error);
  }
}

async function allergen() {
  try {
    const response = await fetch(`/api/allergen`);
    const data = await response.json();

    for (let j = 0; j < data.allergens.length; j++) {
      probaObj.allergensNames.push(data.allergens[j].name);
      probaObj.allergensId.push(data.allergens[j].id);
    }
  } catch (error) {
    console.error(error);
  }
}

const allergenCheckboxes = document.querySelectorAll('input[type="checkbox"]');
const subButton = document.getElementById("subBtn");
const filteredAllergens = [];

allergenCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      filteredAllergens.push(checkbox.value);
    } else {
      const index = filteredAllergens.indexOf(checkbox.value);
      filteredAllergens.splice(index, 1);
    }
    console.log(filteredAllergens);
  });
});

const addedPizzaIds = [];
subButton.addEventListener("click", () => {
  if (filteredAllergens.length === 0) {
    objToDom([]);
  } else {
    objToDom(filteredAllergens);
  }
});

async function objToDom(allergens) {
  await pizzas();
  await allergen();
  console.log(pizzaData);

  for (let j = 0; j < probaObj.name.length; j++) {
    const pizzaAllergens = idtoAll(probaObj.allergens[j]);
    if (allergens.every((allergen) => pizzaAllergens.includes(allergen))) {
      // Check if the pizza's ID has already been added to the DOM

      if (!addedPizzaIds.includes(j + 1)) {
        dataToDom(
          probaObj.name[j],
          probaObj.price[j],
          probaObj.des[j],
          probaObj.img[j],
          pizzaAllergens.join(", "),
          j + 1,
          probaObj.ingredients[j]
        );
        addedPizzaIds.push(j + 1); // Add the pizza's ID to the array of added IDs
      }
    }
  }
}

function idtoAll(allergenIds) {
  return allergenIds.map((id) => probaObj.allergensNames[id]);
}

function saveOrder(id, am) {
  let orderObject = {
    id: id,
    amount: am,
  };

  fetch(`/api/actualOrder`, {
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
}

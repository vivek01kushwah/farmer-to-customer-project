function myUsernameFunction() {
  const username = sessionStorage.getItem("username");
  console.log(sessionStorage);
  console.log("my usernamem is " + username);
  // document.getElementById("user").innerHTML = username;
  // document.getElementById('orderUsername').value=username;  

  const allList = document.querySelectorAll(".usernameForAddToCart");

  allList.forEach((userItem) => {
    userItem.value = username;
  });
  const allCost = document.querySelectorAll(".costOfProduct");

  var fullCost = 0;
  allCost.forEach((userCostItem) => {
    fullCost += Number(userCostItem.value);
  });
  console.log("full cost" + fullCost);
  console.log("all cost " + allCost);
  console.log("all list " + allList);
  const total=fullCost+99;
  document.getElementById("fullCost").innerHTML = "₹" + fullCost;
  document.getElementById("totalCost").innerHTML = "₹" + total;
  
  document.getElementById("price").value = total;

  // document.getElementsByClassName("button").name = fullCost;
  // document.getElementsByClassName("button").style.display = "inline-block";
}
const products = document.querySelectorAll(".product");


function calculateTotal() {
  const productRows = document.querySelectorAll('.product');

  productRows.forEach(function (productRow) {
      const costOfProduct = parseFloat(productRow.querySelector('.costOfProduct').value);
      const quantity = parseFloat(productRow.querySelector('.quantity').value);
      const total = costOfProduct * quantity;

      productRow.querySelector('.total').textContent = total;
  });

  calculateFullCost();
}


function calculateFullCost() {
  const productTotals = document.querySelectorAll('.total');
  let fullCost = 0;

  productTotals.forEach(function (productTotal) {
      fullCost += parseFloat(productTotal.textContent);
  });
  const total=fullCost+99;
  document.getElementById('fullCost').textContent =  "₹" +fullCost;
  document.getElementById('totalCost').textContent = "₹" + total;
  document.getElementById("price").value = total;

}


const quantityInputs = document.querySelectorAll('.quantity');
quantityInputs.forEach(function (input) {
  input.addEventListener('change', calculateTotal);
});


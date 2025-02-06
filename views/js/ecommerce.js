function loadUserName() {
  const ecommerceUserName = sessionStorage.getItem("username");
  if(ecommerceUserName==null)
  {
    document.getElementById("ecommerceUser").innerHTML="Login";
    document.getElementById("logout").style.display = "none";
    
  }else{
    var email = ecommerceUserName;
var username = email.substring(0, email.indexOf('@'));
  document.getElementById("ecommerceUser").innerHTML =username;
  }
  var link = document.getElementById('link');
  console.log('New Href value:', link.href);
  var link2 = document.getElementById('link2');

link.setAttribute('href', '/productAddress/'+ecommerceUserName);
link2.setAttribute('href', '/wishlist/'+ecommerceUserName);
console.log('New Href value:', link.href);
  
}
function logout() {
  if (document.getElementById("ecommerceUser").innerHTML == "") {
    document.getElementById("logout").style.display = "none";
  }
  else {
    sessionStorage.clear();
    document.getElementById("ecommerceUser").innerHTML = "Login";
    document.getElementById("logout").style.display = "none";
    
  }
}
function userLoginOrNot() {
  const ecommerceUserName = sessionStorage.getItem("username");
  const allList = document.querySelectorAll(".userNameForAddToCart");

  allList.forEach((userItem) => {
    userItem.value = ecommerceUserName;
  });

  const username = document.getElementById("ecommerceUser").innerHTML;
  console.log("username is :" + username);
  if (username == "Login") {
    alert("please login");
    return false;
  }
  
}
//for searching the search bar
// function searchBar() {
//   var searchInput = document.getElementById('myInput');
//     searchInput = searchInput.value.toUpperCase();
//     if(searchInput=='')alert('enter something to search');
//     if (searchInput != '') {
//     var productsTag = document.getElementsByClassName('productNameForSearching');
//     var innerTxt;
//     var k=0;
//     for (var i = 0; i < productsTag.length; i++) {
//       innerTxt = productsTag[i].innerText;
//       txtValue = innerTxt.toUpperCase();
//       if (txtValue.indexOf(searchInput) > -1) {
//         var input = document.createElement('input');
//         input.setAttribute("type", "text");     
//         input.setAttribute("name", "myname");
//         input.setAttribute("value", innerTxt);
//         document.getElementById('searchForm').appendChild(input);
//         k++;
//       }
//     }
//     document.getElementById('countOfMatched').value = k;
//    document.getElementById("searchForm").submit(); 
//   }
// }
function checkInput() {
  // Get the input element
  var inputElement = document.getElementById("myInput");

  // Check if the input value is empty
  if (inputElement.value.trim() === "") {
      // Don't submit the form
      alert("Please enter a search term.");
  } else {
      // Submit the form
      document.getElementById("searchForm").submit();
  }
}
const header=document.querySelector("header");
window.addEventListener("scroll",function(){
    header.classList.toggle("sticky",this.window.scrollY>0);
})
let menu= document.querySelector('#menu-icon');
let navmenu= document.querySelector('.nav-menu');
menu.onclick=()=>{
    if(window.innerWidth<750)
    menu.classList.toggle('bx-x');
    navmenu.classList.toggle('open');
}

const userDropdownTrigger = document.querySelector('.user-dropdown-trigger');
const userDropdown = document.querySelector('.user-dropdown');


userDropdownTrigger.addEventListener('mouseenter', () => {
  userDropdown.style.display = 'block';
});


userDropdown.addEventListener('mouseleave', () => {
  userDropdown.style.display = 'none';
});
// ----link to cart Page


 
  document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.querySelector('.add-to-cart-button');
    addButton.addEventListener('click', function (event) {
      // Check if the user is logged in before handling the click
      
        handleAddToCartClick(event);
      
    });
  });
function userLogin(event){
  var isLoggedIn =sessionStorage.getItem("username")==null? false:true;

    if (isLoggedIn) {
        
        return true;
    } else {
        
        event.preventDefault();
        alert("Please log in to access this page.");
     
    }
}
// -------------wishlist js---------------------------------------------------
function addToWishlist(productId) {
  // Get the user ID from sessionStorage
  const userId = sessionStorage.getItem('username');

  // Make sure userId is not null or undefined before making the request
  if (userId) {
    // Make an AJAX request to add the product to the wishlist
    fetch(`/add-to-wishlist/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      
      const heartIcon=document.querySelector(`[data-product-id="${productId}"]`);
      heartIcon.classList.remove("bx-heart");
      heartIcon.classList.remove("heart-icon");
      heartIcon.classList.add("bxs-heart");
      heartIcon.style.color = "#e80e0e";

    })
    .catch(error => console.error('Error:', error));
  } else {
    console.error('User ID not found in sessionStorage');
  }
}
document.addEventListener('DOMContentLoaded', function () {
  const backgroundContainer = document.getElementById('backgroundContainer');
  const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
  let currentIndex = 0;

  function changeBackground() {
    // background-image: url(./home-page-fashion-slider-01.jpg);
    backgroundContainer.style.backgroundImage = `url(../css/${images[currentIndex]})`;

    currentIndex = (currentIndex + 1) % images.length;

    
    setTimeout(changeBackground, 5000);
  }

  
  changeBackground();
});
function addToCart(productId) {
  // Get the user ID from sessionStorage
  const userId = sessionStorage.getItem('username');



  // Make sure userId is not null or undefined before making the request
  if (userId) {
    
    fetch(`/productAddress/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      
      
      const cart=document.querySelector(`[cart-product-id="${productId}"]`);
      cart.textContent="Added";

    })
    .catch(error => console.error('Error:', error));
  } else {
    
    console.error('User ID not found in sessionStorage');
    alert("Login First");

  }
}



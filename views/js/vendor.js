

    
      const vendorUserName = sessionStorage.getItem("email");
      if(sessionStorage.length==0)
      {
        document.getElementById("ecommerceUser").innerHTML="Login";
        
      }else{
        var email = vendorUserName;
    var username = email.substring(0, email.indexOf('@'));
      document.getElementById("ecommerceUser").innerHTML =username;
      }
      
    function fillEmail() {
      
      

    }
    function fillEmailIntoDelete(){
      const email=sessionStorage.getItem('email');
      document.getElementById("vendorDeleteEmail").value = email;
       const text = "Do you want to Delete this product";
       if(confirm(text)==true)return true;
       else{ return false;} 
  
  }
      
    
    function logout() {
      if (document.getElementById("ecommerceUser").innerHTML == "") {
        document.getElementById("logout").style.display = "none";
      }
      else {
        document.getElementById("ecommerceUser").innerHTML = "Login";
        document.getElementById("logout").style.display = "none";
        
      }
    }
  
    //for searching the search bar
   
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
    // Get the user dropdown trigger and the user dropdown menu
    const userDropdownTrigger = document.querySelector('.user-dropdown-trigger');
    const userDropdown = document.querySelector('.user-dropdown');
    
    // Add an event listener to show the user dropdown menu on hover
    userDropdownTrigger.addEventListener('mouseenter', () => {
      userDropdown.style.display = 'block';
    });
    
    // Add an event listener to hide the user dropdown menu when the mouse leaves
    userDropdown.addEventListener('mouseleave', () => {
      userDropdown.style.display = 'none';
    });
   

    function submitForm(event) {
        // Prevent the default form submission
        event.preventDefault();
        document.getElementById('autoEmail').value =vendorUserName;
        // Your additional logic to handle the form data (e.g., AJAX request)

        // Example: Sending the form data using Fetch API
        fetch('/vendorSection', {
            method: 'POST',
            body: new FormData(document.querySelector('form')),
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response as needed

            // For now, you can log the response
            // if (data.refresh) {
            //   // Refresh the page
            //   location.reload();
            // }
            console.log(data);
            location.reload();
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
    }

// ---------------display the photo


function displayImage() {
  var input = document.getElementById('pPhoto');
  var preview = document.getElementById('preview');
  var imagePreview = document.getElementById('imagePreview');
   var file = document.getElementById('file');

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = 'inline';
      imagePreview.style.display = 'flex';
    };

    reader.readAsDataURL(input.files[0]);
    file.style.display='none';
  }
}
function changePhoto() {
  document.getElementById('file').style.display='block';
  document.getElementById('imagePreview').style.display='none'
  var input = document.getElementById('pPhoto');
  input.value = '';
  
}


    
    
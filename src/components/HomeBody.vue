<template >
<meta charset="utf-8">
<section id="hero" class="hero" >
              <br><br><br><br><br><br>
              <h2 class="animated bounce infinite" style="font-size: 57px; color: white;" >Welcome to Crate Digger</h2><br>
              <p style="font-size: 20px; color: #949494;">We recommend you artists, you write reviews and rate them</p>

              <router-link class="btn-get-started" to="/SearchPage">Search</router-link>
              <br><br><br><br><br><br><br><br>
 
  </section>
   
  <div id="myModal" class="modal"> <!-- Sign in popup  -->
  <!-- Modal content -->
  <div class="modal-content">
    <span class="close">&times;</span>
    <p style="font-size: 40px;">Sign in</p>
    <label style="color: #949494;">Username</label>
    <input style="height: 40px; border-radius: 7.5px;" required><br>
    <label style="color: #949494;"> Password</label>
    <input style="height: 40px; border-radius: 7.5px;" required><br>
    <a onclick="closesignin()" class="btn-get-started">Sign in</a>
  </div>
</div>

<div id="myModal1" class="modal1"> <!-- create account popup  -->
    <!-- Modal content -->
    <div class="modal-content1">
      <span class="close1">&times;</span><br><br>
      <p style="font-size: 40px;">Create account</p>
      <label style="color: #949494;" >Email</label><br>
      <input style="height: 40px; border-radius: 7.5px;"  required><br><br>
      <label style="color: #949494;" >Username</label><br>
      <input style="height: 40px; border-radius: 7.5px;"  required><br><br>
      <label style="color: #949494;">Password</label><br>
      <input style="height: 40px; border-radius: 7.5px;"  required><br><br>
      <a onclick="closesignin1()" class="btn-get-started">Create</a>
    </div>
  </div>

  <section  id="services" class="services section-bg">
      <div class="container" data-aos="fade-up">
        <div class="section-header">
          <h2 >Crate Digger lets you...</h2></div></div>

     </section>
     
   

  </template>
  
<style scoped>

  .boxes{
    color: white
  }

  .boxes:hover{
    color: #1DB954; 
  }

  .hero{
    text-align: center;
    background-color: black;
    padding-top: 12.5%;
  }

.btn-get-started {
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 1px;
  display: inline-block;
  padding: 12px 40px;
  border-radius: 50px;
  transition: 0.5s;
  margin: 10px;
  color: white;
  text-decoration: none;
  border: 2px solid #1DB954;
}

.btn-get-started:hover {
  background: #1DB954;
  color: black;
}


.heading:hover{
  color: #1DB954;
  width: 100px;
  background-color: blueviolet;
}

.services{
  text-align: center;
  
  color: white;
  background-color:black;
  background-size: cover;
  font-size: 14px;
  padding: 80px 0 60px 0;
  position: relative;
}

.section-header {
  text-align: center;
  padding-bottom: 7.5%;

  color: white;
}


  
  /* The Modal (background) */
  .modal {
    
      display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 150px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    /* background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.6); /* Black w/ opacity */
  }
  
  /* Modal Content */
  .modal-content {
      align-items: left;
      width: 350px;
      height: 450px;
    background-color: #1a1a1a;
    margin: auto;
    padding: 15px;
  
   
  }
  
  /* The Close Button */
  .close {
      position: relative;
      left: 40%;
    color: #262626;
    float: right;
    font-size: 32px;
    font-weight: bold;
  }
  
  .close:hover,
  .close:focus {
    color: #BFB1A4;
    text-decoration: none;
    cursor: pointer;
  }
  .modal1 {

display: none; /* Hidden by default */
position: fixed; /* Stay in place */
z-index: 1; /* Sit on top */
padding-top: 150px; /* Location of the box */
left: 0;
top: 0;
width: 100%; /* Full width */
height: 100%; /* Full height */
overflow: auto; /* Enable scroll if needed */
background-color: #262626; /* Fallback color */
background-color: rgba(0,0,0,0.6); /* Black w/ opacity */
}

/* Modal Content */
.modal-content1 {
  
  width: 350px;
      height: 535px;
background-color: #1a1a1a;
border-radius: 10px;
margin: auto;
padding: 15px;


}

/* The Close Button */
.close1 {
  position: relative;
      right: 7%;
    color: #262626;
    float: right;
    font-size: 32px;
    font-weight: bold;
}

.close1:hover,
.close1:focus {
color: #BFB1A4;
text-decoration: none;
cursor: pointer;
}
.modal-content {
    align-items: center;
    width: 350px;
    height: 450px;
  background-color: #1a1a1a;
  margin: auto;
  padding: 10px;

 
}

/* The Close Button */
.close {
    position: relative;
    left: 40%;
  color:#262626;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #BFB1A4;
  text-decoration: none;
  cursor: pointer;
}

  </style>
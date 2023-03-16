<template >
<meta charset="utf-8">
<section class="px-4 py-5 text-center" style="width: 100vw; height: 100vh; color:white; background-color:black">
    <h1 class="display-5 fw-bold" style="padding-top:10%">Welcome to Crate Digger</h1>
    <div class="col-lg-6 mx-auto">
      <p class="lead mb-4">Search for your favourite artists, like your favourite artists and your favourite albums by them saving them to your profile page. then we recommend you artists based on your favourited artists</p>
      <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <router-link type="button" class="btn btn-lg px-4 gap-3 btn-get-started" to="/Search">Search</router-link>
        <router-link type="button" class="btn btn-lg px-4 gap-3 btn-get-started" to="/Recommend">Get Recommendations</router-link>
        
      </div>
    </div>
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
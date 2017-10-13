<!DOCTYPE html>
<html>
<head>
  <title>Logga in</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">



</head>
<body>
<div class="row">
 <div class="col-md-10 col-xs-8 right-header">

 <img src="Images/SHL-logo.jpg" alt="SHL" class="logo">

 </div>
 <div class="col-md-2 col-xs-4 left-header">

 	<p id="inloggadsom">Inloggad som: Ej inloggad</p>

 	<a href="index.php">Tillbaka</a>


 </div>
</div>

   <div class="container" style="margin-top:30px">

<br>

    
            
                   <div class="col-md-3 col-xs-3"></div>
                    
                    <div class="col-md-6">        
                  <div class="form-group">
                  <label>Ditt tröjnummer:</label>
                      <input class="form-control" placeholder="tröjnummer" name="trojnummer" id="trojnummer">
                  </div>
                 <div class="form-group">
                  <label>Ditt lösenord:</label>
                      <input class="form-control" placeholder="Lösenord" name="losenord" id="losenord" type="password">
                  </div>
                 
            
                  <button class="btn btn-info">Logga in</button>
                  <button class="btn btn-info">Nytt lösenord</button>
               </div>
                           
                        
                   
                
<div class="col-md-12" style="height: 250px;"></div>    
</div>





<footer class="navbar navbar-default foooter">

 <div class="col-md-4 col-lg-4 col-xs-12 ">
 	   <h4 class='center-text'>SHL</h4>
 	   <p  class='center-text'>Namn shl</p>
 	   <p  class='center-text'>Telefon SHL</p>
 	   <p  class='center-text'>Organisationsnummer SHL</p>
 	   <p  class='center-text'>Adress SHL</p>   
 
</div>


 <div class="col-md-4 col-lg-4 col-xs-12">
 	   <h4 class='center-text'>Domarchef</h4>
 	   <p class='center-text'>Peter Andersson</p>
 	   <p class='center-text'>Mobil</p>
 	   <p class='center-text'>Epost</p>

 	
 </div>

 <div class="col-md-4 col-lg-4 col-xs-12 ">
 	   <h4 class='center-text'>Webmaster</h4>
 	   <p class='center-text'>Webmaster nummer</p>
 	   <p class='center-text'>Epost webmaster</p>
 </div>
 </footer>

</body>

  <?php
require_once("includes/bootstrap.php");
?>
</html>

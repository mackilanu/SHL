<?php


#define ("KORNING", "TEST");
define ("KORNING", "PRODUKTION");


// Avser databasen
define("DB_NAME",        "shl");
define("DB_HOST",        "localhost");

if (KORNING == "TEST"){

    define("DB_PW"  , "");   // Lokala databasen
    define("DB_USER", "root");

} else {

    define("DB_PW", "silop1337"); // produktionsdatabasen
    define("DB_USER", "root");
}


//Avser path till ErrorFile
define("SHL_ERROR_FILE",  "/var/log/shl/shl.log");
define("TILLSATTNINGSFIL", "/var/www/html/files/lista.txt");

/*
//Avser sändning via mackilanu@gmail.com
define("HOST",            "smtp.gmail.com");
define("PORT",            "587");
define("USERNAME",        "mackilanu@gmail.com");
define("PASSWORD",        "Silop1337");
*/
//define("HOST",           "ssl://smtp.gmail.com");
define("HOST",           "smtp.office365.com");
//define("PORT",           "465");
define("PORT",           "587");
//define("USERNAME",       "triantafillos.pavlidis@itgksd.se");
define("USERNAME",       "christer.larking@shl.se");
//define("PASSWORD",       "itgksdLa13");
define("PASSWORD",       "SHLreferee@33@");

//Avser sändning via Google
define("HOST2",           "smtp.gmail.com");
define("PORT2",           "587");
define("USERNAME2",       "mackilanu@gmail.com");
define("PASSWORD2",       "Silop1337");

//define("TO",              "pavlidis.nitsasoft@gmail.com,mackilanu@gmail.com");
define("TO",              "pavlidis.nitsasoft@gmail.com");
//define("TO",              "mackilanu@gmail.com");


define("DOCTYPEN", '<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">

   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>

	<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

<link rel="stylesheet" type="text/css" href="css/index.css">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
 <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
');


define("RESTEN", '<meta name="description" content="NitsaSoft in Sweden AB">
<link rel="SHORTCUT ICON" href="Images/home.ico" type="image/x-icon" />
</head>');

define("BODY", '<body>
<div class="row">

<div id="div_container" class="container"></div>

</div>');



define("FOTEN", '
<footer class="navbar navbar-default foooter">

 <div class="col-md-4 col-lg-4 col-xs-12">
 	   <h4 class="text-left">SHL</h4>
 	   <p  class="text-left" id="P_Namn"></p>
 	   <p  class="text-left" id="P_Telefon"></p>
 	   <p  class="text-left" id="P_Organisationsnr"></p>
 	   <p  class="text-left" id="P_Adress"></p>   
 
</div>


 <div class="col-md-4 col-lg-4 col-xs-12">
 	   <h4 class="text-left">Domarchef</h4>
 	   <p  class="text-left" id="P_Domarchef"></p>
 	   <p  class="text-left" id="P_Mobil"></p>
 	   <p  class="text-left" id="P_Epost"></p>

 	
 </div>

 <div class="col-md-4 col-lg-4 col-xs-12 ">
 	   <h4 class="text-left">Webmaster</h4>
 	   <p  class="text-left" id="P_Webmaster"></hp>
 	   <p  class="text-left" id="P_WebTelefon"></p>
 	   <p  class="text-left" id="P_WebEpost"></p>
 </div>
 </footer>');


define("AVSLUT", '
</body>
</html>');

?>


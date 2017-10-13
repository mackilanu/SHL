<?php


define ("KORNING", "TEST");
#define ("KORNING", "PRODUKTION");


if (KORNING == "TEST"){

    define("DB_PW", "silop1337");   // Lokala databasen

} else {

    define("DB_PW", "YYYYYYYYY"); // produktionsdatabasen
}


//Avser path till ErrorFile
define("SHL_ERROR_FILE",  "/var/log/shl/shl.log");

// Avser databasen
define("DB_NAME",        "shl");
define("DB_HOST",        "localhost");
define("DB_USER",        "user");
define("indexCSS",       "<link rel='stylesheet' type='text/css' href='css/index.css'>");
define("FROM",           "pavlidis.nitsasoft@gmail.com");


define("HEADERBEGIN",  "<div class='row'><div class='col-md-10 col-xs-8 right-header'>");
define("FILEBEGIN",    "<!DOCTYPE html><html lang='sv'><head><script src='https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js'></script>");
define("BODYBEGIN",    "</head><body>");
define("BODYEND",      "</body></html>");
define("BOOTSTRAP",    "require_once('bootstrap.php')");
define("CONTENTBEGIN", "<div id='container' class='container'><div class='row'><div class='col-md-12 col-xs-12 main-content'>");
define("CONTENTEND", "</div></div></div>");
define("MOBILE", "<meta name='viewport' content='width=device-width, initial-scale=1'>");

define("HOST2",     "smtp.gmail.com");
define("PORT2",     "587");
define("USERNAME2", "mackilanu@gmail.com");
define("PASSWORD2", "Silop1337");

?>
<?php

@session_start();

if (!isset($_SESSION['JerseyNo'])){
    header('Location: nosession.php');
    exit;
}



$JerseyNo   =  $_SESSION['JerseyNo'];
$FirstName  =  $_SESSION['FirstName'];
$LastName   =  $_SESSION['LastName'];
$Priviledge =  $_SESSION['Priviledge'];
$Domartyp   =  $_SESSION['Domartyp'];
$TrafficID  =  $_SESSION['TrafficID'];   // TrafficID för inloggningen


$logInfo    = '{"JerseyNo": ' . $JerseyNo . ', "FirstName": "' . $FirstName . '", "LastName": "' . $LastName . '", "Priviledge": ' . $Priviledge . ', "Domartyp": ' . $Domartyp . '}';

echo '<script type="text/javascript">';
echo "var logInfo  = new Array();";
echo "logInfo      = '" . $logInfo . "';";
echo "</script>";


?>

<?php

header("Content-type: text/html; charset=utf-8");

@session_start();

if (!isset($_SESSION['JerseyNo'])){
    header("Location: ../nosession.php");
    exit();
}



date_default_timezone_set("Europe/Stockholm");

require_once("../includes/config.php");
require_once("../includes/io.php");
require_once("../includes/opendb.php");


$ShlNamn       = $_GET['ShlNamn'];
$ShlTelefon    = $_GET['ShlTelefon'];
$ShlOrg        = $_GET['ShlOrg'];
$ShlAdress     = $_GET['ShlAdress'];
$ShlPostnr     = $_GET['ShlPostnr'];
$ShlPostadress = $_GET['ShlPostadress'];

$Chefnamn      = $_GET['Chefnamn'];
$ChefMobil     = $_GET['ChefMobil'];
$ChefEpost     = $_GET['ChefEpost'];

write_error("1");
echo updateparametrar($ShlNamn, $ShlTelefon, $ShlOrg, $ShlAdress, $ShlPostnr, $ShlPostadress, $Chefnamn, $ChefMobil, $ChefEpost);

function updateparametrar($ShlNamn, $ShlTelefon, $ShlOrg, $ShlAdress, $ShlPostnr, $ShlPostadress, $Chefnamn, $ChefMobil, $ChefEpost){
	write_error("2");
    $message_data = "SHL-ERROR vid ajax/parametrar.php function updateparametrar($ShlNamn, $ShlTelefon, $ShlOrg, $ShlAdress, $ShlPostnr, $ShlPostadress, $Chefnamn, $ChefMobil, $ChefEpost)";
    $SQL = "CALL update_Parametrar('$ShlOrg', '$ShlNamn', '$ShlAdress', '$ShlPostnr', '$ShlPostadress', '$ShlTelefon', '$Chefnamn', '$ChefMobil', '$ChefEpost')";
    write_error($SQL);
    list($affected_rows,$result)  = opendb($message_data,$SQL);
    if (!$result) return '{"status": "Error"}';  

    return '{"status": "OK"}';
}

?>

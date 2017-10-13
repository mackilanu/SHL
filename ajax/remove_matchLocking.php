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



$GameId    = $_GET['GameId'];
$Season    = $_SESSION['Season'];
$SQL       = "CALL remove_matchLocking($Season,$GameId)";

//Execute database-query
$affected_rows = 0;
list($affected_rows,$result) = opendb($message_data,$SQL);

$svar     = '';
if (!$result OR $affected_rows == 0){
    $svar = '{"status": "Error"}';

} else {
    $svar = '{"status": "OK"}';
}


echo $svar;

?>

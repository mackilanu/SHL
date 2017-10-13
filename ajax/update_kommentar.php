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


$GameId     = $_GET['GameId'];
$Kommentar  = $_GET['Kommentar'];



$Season     = $_SESSION['Season'];
$SQL        = "CALL update_Kommentar($Season,$GameId,";

if ($Kommentar == 'null'){
    $SQL .= 'NULL';
} else {
    $SQL .= "'$Kommentar'";
}
$SQL .= ')';



echo update_post($SQL);





function update_post($SQL){
    $message_data = "SHL-ERROR vid ajax/update_kommentar.php function update_post($SQL)";


	//Execute database-query
	$affected_rows = 0;
    list($affected_rows,$result) = opendb($message_data,$SQL);
    if (!$result OR $affected_rows == 0) return '{"status": "Error"}';

    return '{"status": "OK"}';
}

?>

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


$JerseyNo        = $_GET['JerseyNo'];
$Active          = $_GET['Active'];
$FirstName       = $_GET['FirstName'];
$LastName        = $_GET['LastName'];
$Priviledge      = $_GET['Priviledge'];
$Email           = $_GET['Email'];
$Mobil           = $_GET['Mobil'];
$Domartyp        = $_GET['Domartyp'];
$Personnr        = $_GET['Personnr'];
$DomdaGrundspel  = $_GET['Grundspel'];
$DomdaSlutspel   = $_GET['Slutspel'];



$SQL = "CALL update_User($JerseyNo,";

if ($Active == ''){
    $SQL .= 'NULL,';
} else {
    $SQL .= "'$Active'" . ',';
}

$SQL .= "'$FirstName','$LastName',$Priviledge,'$Email',";

if ($Mobil == ''){
    $SQL .= 'NULL,';
} else {
    $SQL .= "'$Mobil'" . ',';
}

$SQL .= "$Domartyp,";

if ($Personnr == ''){
    $SQL .= 'NULL,';
} else {
    $SQL .= "'$Personnr'" . ',';
}

if ($DomdaGrundspel == ''){
    $SQL .= 'NULL,';
} else {
    $SQL .= "'$DomdaGrundspel'" . ',';
}

if ($DomdaSlutspel == ''){
    $SQL .= 'NULL,';
} else {
    $SQL .= "'$DomdaSlutspel'" . ',';
}

$Updated_by    = $_SESSION['FirstName'] . ' ' . $_SESSION['LastName'];
$SQL .= "'$Updated_by')";


echo update_post($SQL);





function update_post($SQL){
    $message_data = "SHL-ERROR vid ajax/update_user.php function update_post($SQL)";

	//Execute database-query
	$affected_rows = 0;
    list($affected_rows,$result) = opendb($message_data,$SQL);
    if (!$result OR $affected_rows == 0) return '{"status": "Error"}';

    return '{"status": "OK"}';
}

?>

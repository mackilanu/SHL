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


$UrvalIndex  = $_GET['UrvalIndex'];
$FromDate    = $_GET['FromDate'];
$ToDate      = $_GET['ToDate'];

$Season      = $_SESSION['Season'];

if ($UrvalIndex == 1){
    $SQL = "CALL read_AllaUrvalsMatcher($Season, '$FromDate', '$ToDate')";
} else if ($UrvalIndex == 2){
    $SQL = "CALL read_EjTillsattaMatcher($Season, '$FromDate', '$ToDate')";
} else if ($UrvalIndex == 3){
    $SQL = "CALL read_DelvisTillsattaMatcher($Season, '$FromDate', '$ToDate')";
} else if ($UrvalIndex == 4){
    $SQL = "CALL read_Medkommentar($Season, '$FromDate', '$ToDate')";
}


echo read_poster($SQL);





function read_poster($SQL){
    $message_data = "SHL-ERROR vid ajax/hamta_matcher.php function read_poster($SQL)";
    write_error("SQL=$SQL");

	//Execute database-query
	$affected_rows = 0;
    list($affected_rows,$result) = opendb($message_data,$SQL);
    if (!$result) return '{"status": "Error"}';
    if ($affected_rows == 0) return '{"status": "Inga matcher"}';

    $Matchlista = '{"status": "OK", "Match": [';
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i > 0){
            $Matchlista .=  ',';
        }
        $Matchlista     .=  json_encode($row);
    }
    $Matchlista         .= ']}';


    return $Matchlista;

}

?>

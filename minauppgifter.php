<?php

@session_start();

if (!isset($_SESSION['JerseyNo'])){
    header('Location: nosession.php');
    exit;
}


header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");


require_once("includes/config.php");
require_once("includes/io.php");
require_once("includes/opendb.php");

echo DOCTYPEN . '<title>Mina uppgifter</title>' . RESTEN;

echo BODY;

echo FOTEN;
require_once("includes/parametrar.php");


require_once("includes/loginfo.php"); // Fixar inloggningsuppgifterna


echo '<script type="text/javascript">';
echo "var Userlista  = '';";
echo "Userlista      = JSON.parse( '" . read_user()   . "' );";
echo "</script>";

// Tillhörande JavaScript-filer
echo '<script type="text/javascript" src="javascript/common.js"></script>';
echo '<script type="text/javascript" src="javascript/minauppgifter.js"></script>';


echo AVSLUT;



function read_user(){

    $message_data = "SHL-ERROR vid minauppgifter.php function read_user.";
    $JerseyNo    = $_SESSION['JerseyNo'];
    $SQL  = "CALL read_user($JerseyNo)";

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result or $affected_rows == 0){
        return '{"status": "Error"}';
    }


    $Userlista = '{"status": "OK", "User": [';
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i > 0){
            $Userlista .=  ',';
        }
        $Userlista     .=  json_encode($row);
    }
    $Userlista         .= ']}';

    return $Userlista;

}

?>

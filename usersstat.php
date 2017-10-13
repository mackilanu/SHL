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

echo DOCTYPEN . '<title>Domarstatistik</title>' . RESTEN;

echo BODY;

echo FOTEN;
require_once("includes/parametrar.php");


require_once("includes/loginfo.php"); // Fixar inloggningsuppgifterna

// Fixar menyn
echo '<script type="text/javascript">';
echo "var Userslista  = '';";
echo "Userslista      = JSON.parse( '" . read_users()   . "' );";
echo "</script>";

// Tillhörande JavaScript-filer
echo '<script type="text/javascript" src="javascript/common.js"></script>';
echo '<script type="text/javascript" src="javascript/usersstat.js"></script>';


echo AVSLUT;



function read_users(){

    $message_data = "SHL-ERROR vid usersstat.php function read_users.";

    $SQL  = "CALL read_users()";

    list($affected_rows,$result) = opendb($message_data,$SQL);


    if (!$result or $affected_rows == 0){
        return '{"status": "Error"}';
    }


    $Userslista = '{"status": "OK", "User": [';
    for ($i = 0; $i < $affected_rows; ++$i){
        if ($i > 0){
            $Userslista .=  ',';
        }

        $row = $result->fetch_row();

        $JerseyNo = $row[0];
        $Active   = $row[1];
        $FirstName = $row[2];
        $LastName = $row[3];
        $Domartyp = $row[8];
        $DomdaGrundspel = $row[10];
        if ($DomdaGrundspel == '') $DomdaGrundspel = 0;
        $DomdaSlutspel = $row[11];
        if ($DomdaSlutspel == '') $DomdaSlutspel = 0;

        $Userslista .= '{"JerseyNo":' . $JerseyNo . ', ';
        $Userslista .= '"Active": "'  .$Active    .'", ';
        $Userslista .= '"FirstName": "'  .$FirstName    .'", ';
        $Userslista .= '"LastName": "'  .$LastName    .'", ';
        $Userslista .= '"Domartyp": '  .$Domartyp   .', ';
        $Userslista .= '"DomdaGrundspel": '  .$DomdaGrundspel   .', ';
        $Userslista .= '"DomdaSlutspel": '  .$DomdaSlutspel   .', ';

        $grundspelcount = calc_spelcount($JerseyNo,1);
        if ($grundspelcount == '{"status": "Error"}') return '{"status": "Error"}';

        $Userslista .= '"grundspelcount": '  .$grundspelcount   .', ';

        $slutspelcount = calc_spelcount($JerseyNo,2);
        if ($slutspelcount == '{"status": "Error"}') return '{"status": "Error"}';


        $Userslista .= '"slutspelcount": '  .$slutspelcount   .'}';

    }
    $Userslista         .= ']}';

    //write_error($Userslista);

    return $Userslista;

}

function calc_spelcount($JerseyNo, $action){

    $message_data = "SHL-ERROR vid usersstat.php function calc_spelcount($JerseyNo).";

    if ($action == 1){
        $SQL  = "CALL read_grundspelcount($JerseyNo)";
    } else {
        $SQL  = "CALL read_slutspelcount($JerseyNo)";
    }

    list($affected_rows,$result) = opendb($message_data,$SQL);
    if (!$result or $affected_rows == 0) return '{"status": "Error"}';



    $row   = $result->fetch_row();
    $Antal = $row[0];

    return $Antal;


}

?>

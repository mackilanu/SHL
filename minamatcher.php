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

echo DOCTYPEN . '<title>Mina matcher</title>' . RESTEN;

echo BODY;

echo FOTEN;
require_once("includes/parametrar.php");


require_once("includes/loginfo.php"); // Fixar inloggningsuppgifterna

$FromDate  = new DateTime("now",new DateTimeZone('Europe/Stockholm'));
$FromDate  = $FromDate->format("Y-m-d");
$ToDate    = date('Y-m-d', strtotime($FromDate. ' + 7 days'));

echo '<script type="text/javascript">';
echo "var FromDate = '" . $FromDate . "';";
echo "var ToDate = '"   . $ToDate   . "';";

$publisera = '';
echo "var publish_posts  = '';";
echo "publish_posts      = JSON.parse( '" . read_publish_posts()   . "' );";

echo "var Domarlista  = '';";
echo "Domarlista      = JSON.parse( '" . read_domare()   . "' );";

echo "var Matchlista  = '';";
echo "Matchlista      = JSON.parse( '" . read_matcher($publisera,$FromDate,$ToDate)   . "' );";
echo "</script>";

// Tillhörande JavaScript-filer
echo '<script type="text/javascript" src="javascript/common.js"></script>';
echo '<script type="text/javascript" src="javascript/minamatcher.js"></script>';


echo AVSLUT;

function read_publish_posts(){

    global $publisera;
    
    $message_data = "SHL-ERROR vid minamatcher.php function read_publish_posts().";

    $Season = $_SESSION['Season'];
    $SQL    = "CALL read_publish_posts($Season)";

    
    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result or $affected_rows == 0){
        return '{"status": "Error"}';
    }


    $publish_posts = '{"status": "OK", "publish_posts": "';

    $row = $result->fetch_row();
    $publisera = $row[0];
    $publish_posts .= $publisera . '"}';

    
    return $publish_posts;

}

function read_domare(){

    $message_data = "SHL-ERROR vid minamatcher.php function read_domare().";

    $SQL  = "CALL read_Domare()";

    list($affected_rows,$result) = opendb($message_data,$SQL);


    if (!$result or $affected_rows == 0){
        return '{"status": "Error"}';
    }


    $Domarlista = '{"status": "OK", "Domare": [';
    for ($i = 0; $i < $affected_rows; ++$i){
        $row = $result->fetch_array(MYSQLI_ASSOC);
        if ($i > 0){
            $Domarlista .=  ',';
        }
        $Domarlista     .=  json_encode($row);
    }
    $Domarlista         .= ']}';
    
    return $Domarlista;

}


function read_matcher($publisera,$FromDate,$ToDate){

    
    $message_data = "SHL-ERROR vid minamatcher.php function read_matcher($FromDate,$ToDate).";
    $Season       = $_SESSION['Season'];
    $JerseyNo     = $_SESSION['JerseyNo'];
    $Domartyp     = $_SESSION['Domartyp'];
    if ($Domartyp == 1){
        $SQL  = "CALL read_matcherHD";
    } else if ($Domartyp == 2){
        $SQL  = "CALL read_matcherLD";
    }
    $SQL .= "($Season, $JerseyNo, '$FromDate', '$ToDate')";

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}';


    $Matchlista = '{"status": "OK", "Match": [';

    if ($publisera == "J"){

        for ($i = 0; $i < $affected_rows; ++$i){
            $row = $result->fetch_array(MYSQLI_ASSOC);
            if ($i > 0){
                $Matchlista .=  ',';
            }
            $Matchlista     .=  json_encode($row);
        }

    }
    $Matchlista         .= ']}';
    
    return $Matchlista;

}

?>

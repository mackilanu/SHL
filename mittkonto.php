<?php

@session_start();

if (!isset($_SESSION['JerseyNo'])){
    header('Location: nosession.php');
    exit;
}


header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");


require_once("includes/config.php");
require_once("includes/opendb.php");
require_once("includes/io.php");

echo DOCTYPEN . '<title>Mitt konto</title>' . RESTEN;

echo BODY;

echo FOTEN;
require_once("includes/parametrar.php");


require_once("includes/loginfo.php"); // Fixar inloggningsuppgifterna

// Fixar menyn
echo '<script type="text/javascript">';
echo "var Menyn   = '';";
echo "Menyn         = '" . fixameny() . "';";

$MinDatum = $_SESSION['MinDatum'];
$MaxDatum = $_SESSION['MaxDatum'];
$LastDate = '{"status": "OK", "MinDatum": "' . $MinDatum . '", "MaxDatum": "' . $MaxDatum . '"}';

echo "var LastDate = $LastDate";
echo "</script>";

// Tillhörande JavaScript-filer
echo '<script type="text/javascript" src="javascript/common.js"></script>';
echo '<script type="text/javascript" src="javascript/mittkonto.js"></script>';


echo AVSLUT;


function fixameny(){

    $s = '<button class="btn btn-default button" style="width: 40%;" onclick="bytpw()">Byt lösenord</button>';
    $s .= '<br><br>';
    $s .= '<a href="minauppgifter.php"><button class="btn btn-default button" style="width: 40%;">Mina uppgifter</button></a>';
    $s .= '<br><br>';

    $Priviledge = $_SESSION['Priviledge'];
    $Domartyp   = $_SESSION['Domartyp'];

    if ($Priviledge == 1 || $Priviledge == 2){
        $s .= '<a href="minamatcher.php"><button class="btn btn-default button" style="width: 40%;"">Mina matcher</button>';
        $s .= '<br><br>';
        $s .= '<a href="adminFranvaro.php"><button class="btn btn-default button" style="width: 40%;">Min ledighet</button></a>';
        $s .= '<br><br>';
    }



    if ($Priviledge == 3 OR $Domartyp == 3){
        $s .= '<a href="coachmatcher.php"><button class="btn btn-default button" style="width: 40%;">Mina matcher</button>';
        $s .= '<br><br>';
        $s .= '<a href="adminFranvaro.php"><button class="btn btn-default button" style="width: 40%;" onclick="regFranvaro()">Min ledighet</button></a>';
        $s .= '<br><br>';
        $s .= '<a href="coachtillsattning.php"><button class="btn btn-default button" style="width: 40%;">Domarcoachtillsättning</button></a>';
        $s .= '<br><br>';
    }


    if ($Priviledge == 4 OR $Domartyp == 3){
        $s .= '<a href="readRapporter.php"><button class="btn btn-default button" style="width: 40%;">Läs coachrapporter</button></a>';
        $s .= '<br><br>';
    }

    if ($Priviledge == 4){
        $s .= '<a href="parametrar.php"><button class="btn btn-default button" style="width: 40%;">Parametrar</button></a>';
        $s .= '<br><br>';
        $s .= '<a href="seasons.php"><button class="btn btn-default button" style="width: 40%;">Säsonger</button></a>';
        $s .= '<br><br>';
        $s .= '<a href="users.php"><button class="btn btn-default button" style="width: 40%;">Användarkonton</button></a>';
        $s .= '<br><br>';
        $s .= '<a href="franvaro.php"><button class="btn btn-default button" style="width: 40%;">Ledigheter</button></a>';
        $s .= '<br><br>';
        $s .= '<a href="aterbud.php"><button class="btn btn-default button" style="width: 40%;">Återbud</button></a>';
        $s .= '<br><br>';
        $s .= '<a href="aterbudstat.php"><button class="btn btn-default button" style="width: 40%;">Återbudstatistik</button></a>';
        $s .= '<br><br>';
        $s .= '<a href="tillsattning.php"><button class="btn btn-default button" style="width: 40%;">Domartillsättning</button></a>';
        $s .= '<br><br>';
        $s .= '<a href="usersstat.php"><button class="btn btn-default button" style="width: 40%;">Domarstatistik</button></a>';
        $s .= '<br><br>';
        $s .= '<a href="reportquerys.php"><button class="btn btn-default button" style="width: 40%;">Rapportfrågor</button>';
        $s .= '<br><br>';
        $s .= '<a href="usertraffic.php"><button class="btn btn-default button" style="width: 40%;">Användarinloggningar</button>';
        $s .= '<br><br>';
    }

    
    return $s;

}


?>

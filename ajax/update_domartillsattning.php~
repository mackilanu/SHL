<?php


@session_start();

if (!isset($_SESSION['JerseyNo'])){
    header("Location: ../nosession.php");
    exit();
}

if ($_SESSION['Priviledge'] != 4 ){
    header('Location: unauthorized.php');
    exit;
}

header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");

require_once("../includes/config.php");
require_once("../includes/io.php");
require_once("../includes/opendb.php");
require_once("../includes/epostsender.php");



$GameId  = $_GET['GameId'];
$HD1     = $_GET['HD1'];
$HD2     = $_GET['HD2'];
$LD1     = $_GET['LD1'];
$LD2     = $_GET['LD2'];
$Dcoach  = $_GET['Dcoach'];



// Läser från Seasons om matcherna får publiceras.
$Season  = $_SESSION['Season'];
$SQL = "CALL read_publish_posts($Season)";
$message_data = "SHL-ERROR vid ajax/update_domartillsattning.php SQL=$SQL";
//Execute database-query
$affected_rows = 0;
list($affected_rows,$result) = opendb($message_data,$SQL);
if (!$result || $affected_rows == 0){
    echo '{"status": "Error"}';
    exit();
}

$row = $result->fetch_row();
$publish_posts = $row[0];


if ($publish_posts == 'J'){
    // Läser information om matchen INNAN uppdateringen
    // för att avgöra om någon ändring ha skett.
    $SQL = "CALL read_MatchensInfo($Season,$GameId)";
    $message_data = "SHL-ERROR vid ajax/update_domartillsattning.php SQL=$SQL";
    //Execute database-query
    $affected_rows = 0;
    list($affected_rows,$result) = opendb($message_data,$SQL);
    if (!$result || $affected_rows == 0){
        echo '{"status": "Error"}';
        exit();
    }

    $row             = $result->fetch_row();
    $HomeName        = $row[0];
    $AwayName        = $row[1];
    $Arena           = $row[2];
    $Datum           = $row[3];
    $Old_HD1         = $row[4];
    $Old_HD2         = $row[5];
    $Old_LD1         = $row[6];
    $Old_LD2         = $row[7];
    $Old_Dcoach      = $row[8];
    $PubliceraMatch  = $row[9];
}


$SQL = "CALL update_domartillsattning($Season,$GameId,";

if ($HD1 == 'null' or $HD1 == ''){
    $SQL .= 'NULL';
} else {
    $SQL .= $HD1;
}


if ($HD2 == 'null' or $HD2 == ''){
    $SQL .= ',NULL';
} else {
    $SQL .= ',' . $HD2;
}

if ($LD1 == 'null' or $LD1 == ''){
    $SQL .= ',NULL';
} else {
    $SQL .= ',' .$LD1;
}


if ($LD2 == 'null' or $LD2 == ''){
    $SQL .= ',NULL';
} else {
    $SQL .= ',' . $LD2;
}

if ($Dcoach == 'null' or $Dcoach == ''){
    $SQL .= ',NULL';
} else {
    $SQL .= ',' . $Dcoach;
}

$SQL .= ')';



$message_data = "SHL-ERROR vid ajax/update_domartillsattning.php SQL=$SQL";



//Execute database-query
$affected_rows = 0;
list($affected_rows,$result) = opendb($message_data,$SQL);

$svar = '';
if (!$result){
    echo '{"status": "Error"}';
    exit();
}





//
// Kontrollerar flagorna
//
//write_error("publish_posts=$publish_posts");
// Kontrollerar först den överordnade flaggan från tabellen Seasons
if ($publish_posts != 'J'){
    echo '{"status": "OK"}';
    exit();
}

// och sedan den underordnade flaggan från tabellen Matcher
//write_error("PubliceraMatch=$PubliceraMatch");
if ($PubliceraMatch != 'J'){
    echo '{"status": "OK"}';
    exit();
}



//
// publish_posts är satt till J
// och
// PubliceraMatch är satt till J
// varför e-post ska skickas till berörda domare.
//




$SkickaEpost = false;


if ($HD1 != 'null' and $Old_HD1 != $HD1){
    $SkickaEpost = true;
}

if ($HD2 != 'null' and $Old_HD2 != $HD2){
    $SkickaEpost = true;
}

if ($LD1 != 'null' and $Old_LD1 != $LD1){
    $SkickaEpost = true;
}

if ($LD2 != 'null' and $Old_LD2 != $LD2){
    $SkickaEpost = true;
}


//write_error("SkickaEpost=$SkickaEpost");

if ($SkickaEpost == false){
    echo '{"status": "OK"}';
    exit();
}


//write_error("HD1=$HD1");
//write_error("HD2=$HD2");
//write_error("LD1=$LD1");
//write_error("LD2=$LD2");
//write_error("Dcoach=$Dcoach");


$HD1name = 'Saknas';
if ($HD1 != null){
    $SQL = "CALL read_userEpost($HD1)";
    $message_data = "SHL-ERROR vid ajax/update_domartillsattning.php SQL=$SQL";
    //Execute database-query
    $affected_rows = 0;
    list($affected_rows,$result) = opendb($message_data,$SQL);
    if (!$result || $affected_rows == 0){
        $HD1name = 'Saknas';
    } else {
        $row             = $result->fetch_row();
        $FirstName       = $row[1];
        $LastName        = $row[2];
        $HD1name         = $LastName . ', ' . $FirstName;
        $HD1Email        = $row[4];
    }
}


$HD2name = 'Saknas';
if ($HD2 != null){
    $SQL = "CALL read_userEpost($HD2)";
    $message_data = "SHL-ERROR vid ajax/update_domartillsattning.php SQL=$SQL";
    //Execute database-query
    $affected_rows = 0;
    list($affected_rows,$result) = opendb($message_data,$SQL);
    if (!$result || $affected_rows == 0){
        $HD2name = 'Saknas';
    } else {
        $row             = $result->fetch_row();
        $FirstName       = $row[1];
        $LastName        = $row[2];
        $HD2name         = $LastName . ', ' . $FirstName;
        $HD2Email        = $row[4];
    }
}


$LD1name = 'Saknas';
if ($LD1 != null){
    $SQL = "CALL read_userEpost($LD1)";
    $message_data = "SHL-ERROR vid ajax/update_domartillsattning.php SQL=$SQL";
    //Execute database-query
    $affected_rows = 0;
    list($affected_rows,$result) = opendb($message_data,$SQL);
    if (!$result || $affected_rows == 0){
        $LD1name = 'Saknas';
    } else {
        $row             = $result->fetch_row();
        $FirstName       = $row[1];
        $LastName        = $row[2];
        $LD1name         = $LastName . ', ' . $FirstName;
        $LD1Email        = $row[4];
    }
}


$LD2name = 'Saknas';
if ($LD2 != null){
    $SQL = "CALL read_userEpost($LD2)";
    $message_data = "SHL-ERROR vid ajax/update_domartillsattning.php SQL=$SQL";
    //Execute database-query
    $affected_rows = 0;
    list($affected_rows,$result) = opendb($message_data,$SQL);
    if (!$result || $affected_rows == 0){
        $LD2name = 'Saknas';
    } else {
        $row             = $result->fetch_row();
        $FirstName       = $row[1];
        $LastName        = $row[2];
        $LD2name         = $LastName . ', ' . $FirstName;
        $LD2Email        = $row[4];
    }
}


$Dcoachname = 'Saknas';

if ($Dcoach != null){

    $SQL = "CALL read_userEpost($Dcoach)";
    $message_data = "SHL-ERROR vid ajax/update_domartillsattning.php SQL=$SQL";
    //Execute database-query
    $affected_rows = 0;
    list($affected_rows,$result) = opendb($message_data,$SQL);
    if (!$result || $affected_rows == 0){
        $Dcoachname = 'Saknas';
    } else {
        $row             = $result->fetch_row();
        $FirstName       = $row[1];
        $LastName        = $row[2];
        $Dcoachname      = $LastName . ', ' . $FirstName;
        $DcoachEmail     = $row[4];
    }
}



// Skicka e-post till alla domare, och ev. domarcoach, i denna match


$body  = '<!DOCTYPE html>
  <html lang="sv" class="">
  <head>
  <meta charset="utf-8" />
  </head>
  <body>';

$body .= '<h1 style="background: #ffa500; font-size:25pt;"><strong>refmanagment</strong></h1>';
$body .= '<h2>Meddelande om ändring av domare</h2>';
$body .= '<br>';
$body .= '<p>Härmed meddelas att domartillsättningen för:';
$body .= '<br><br>';
$body .= 'matchen: <strong>' . $HomeName . ' - ' . $AwayName . '</strong>';
$body .= '<br>som spelas på arena: <strong>' . $Arena . '</strong>';
$body .= '<br>den: <strong>'    . $Datum    . '</strong>';
$body .= '<br>är ändrad enligt:';
$body .= '<br>';
$body .= '<br>Huvuddomare 1: ' . '<strong>' . $HD1name . '</strong>';
$body .= '<br>Huvuddomare 2: ' . '<strong>' . $HD2name . '</strong>';
$body .= '<br>Linjedomare 1: ' . '<strong>' . $LD1name . '</strong>';
$body .= '<br>Linjedomare 2: ' . '<strong>' . $LD2name . '</strong>';
if ($Dcoach != null){
    $body .= '<br>Domarcoach: ' . '<strong>' . $Dcoachname . '</strong>';
}

$body .= '<br><br><br>Med vänliga hälsningar';
$body .= '<br>refmanagment';
$body .= '<br>';
$body .= '</body></html>';



$mottagare = $HD1Email . ',' . $HD2Email . ',' . $LD1Email . ',' . $LD2Email;

if ($Dcoach != null){
    $mottagare .= ',' . $DcoachEmail;
}
//write_error("mottagare=$mottagare");


//if (KORNING == 'TEST'){
//    $mottagare = TO;
//}


if (send_epost($mottagare,"refmanagment-matchändring",$body)){
    $svar = '{"status": "OK", "sendEpost": "yes"}';
} else {
    $svar = '{"status": "OK", "sendEpost": "no"}';
}


$svar = '{"status": "OK", "sendEpost": "yes"}';

echo $svar;

?>

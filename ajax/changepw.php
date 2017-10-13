<?php

@session_start();


if (!isset($_SESSION['JerseyNo'])){
    header("Location: ../nosession.php");
    exit();
}


header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");



require_once("../includes/config.php");
require_once("../includes/io.php");
require_once("../includes/opendb.php");
require_once("../includes/salta_pw.php");
require_once("../includes/epostsender.php");


$oldpw  = $_GET['oldpw'];
$newpw  = $_GET['newpw'];

echo  set_new_pw($oldpw,$newpw);



function set_new_pw($oldpw,$newpw){

    $message_data = "SHL-ERROR vid ajax/bytpw.php function set_new_pw";

    $saltad_Pw    = saltaPw($newpw);
    $databas_Pw   = $_SESSION['databasens_Pw'];

    if ($oldpw   != $databas_Pw) return '{"status": "Fel_Pw"}';

    // Lösenordsöverensstämmelse. Lösenordet kan bytas.

    $JerseyNo = $_SESSION['JerseyNo'];
    $SQL      = "CALL update_Pw($JerseyNo,'$saltad_Pw')";

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result OR $affected_rows == 0) return '{"status": "Error"}';

    $_SESSION['databasens_Pw'] = $newpw;

    $row   = $result->fetch_row();
    $epost = $row[0];


    return eposta_pw($epost);
}


function eposta_pw($epost){
    //Skickar det nya lösenordet med e-post.

    $body  = '<!DOCTYPE html>
  <html lang="sv" class="">
  <head>
  <meta charset="utf-8" />
  </head>
  <body>';

    $body .= '<h1 style="background: #ffa500; font-size:25pt;"><strong>refmanagment</strong></h1>';
    $body .= '<h2>Byte av lösenord</h2>';
    $body .= '<p>På din begäran har vi ändrat ditt lösenord.</p>';
    $body .= '<br><br>';
    $body .= 'Om du inte har begärt detta lösenordsbytet informera genast administratören.';
    $body .= '<br><br>';
    $body .= 'Med vänliga hälsningar';
    $body .= '<br>';
    $body .= 'refmanagment';
    $body .= '<br>';
    $body .= '</body></html>';


    if (send_epost($epost,"Byte av lösenord till refmanagment",$body)){
        $svar = '{"status": "OK", "sendEpost": "yes"}';
    } else {
        $svar = '{"status": "OK", "sendEpost": "no"}';
    }

    return $svar;
}

?>

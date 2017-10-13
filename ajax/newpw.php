<?php

@session_start();

header("Content-type: text/html; charset=utf-8");

date_default_timezone_set("Europe/Stockholm");



require_once("../includes/config.php");
require_once("../includes/io.php");
require_once("../includes/opendb.php");
require_once("../includes/salta_pw.php");
require_once("../includes/epostsender.php");


$JerseyNo = $_GET['JerseyNo'];


echo  get_new_pw($JerseyNo);



// ================= Funktioner =================

function get_new_pw($JerseyNo){

    //Generera ny krypterat pw
    $chars  = 'qazxswed_cvfrtgbnhy!ujmkiolp0192837465PLOIKMJUYHNBGTRFVCDEWSXZAQ';
    $str    = "";
    $size   = strlen( $chars );
    for( $i = 0; $i < 8; $i++ ) {
        $str .= $chars[ rand( 0, $size - 1 ) ];
    }
    $newpw         = $str;

    $krypterat_Pw  = md5($newpw);
    $db_user_Pw    = saltaPw($krypterat_Pw);

    $message_data  = "ERROR vid ajax/newpw.php function get_new_pw($JerseyNo)";

    $SQL           = "CALL update_Pw($JerseyNo,'$db_user_Pw')";

    list($affected_rows,$result) = opendb($message_data,$SQL);

    if (!$result) return '{"status": "Error"}'; // Gäller för problem med databasen

    if ($affected_rows == 0) return '{"status": "Error2"}'; // Gäller såväl för saknad JerseyNo som Active = NULL.

    $row           = $result -> fetch_row();
    $epost         = $row[0];


    return eposta_pw($epost,$newpw);

}

function eposta_pw($epost,$newpw){
    //Skickar det nya lösenordet med e-post.

    $body  = '<!DOCTYPE html>
  <html lang="sv" class="">
  <head>
  <meta charset="utf-8" />
  </head>
  <body>';

    $body .= '<h1 style="background: #ffa500; font-size:25pt;"><strong>refmanagment</strong></h1>';
    $body .= '<h2>Nytt lösenord</h2>';
    $body .= '<p>Ditt nya lösenord är: <strong>' . $newpw . '</strong>';
    $body .= '<br><br>Du kan när som helst ändra ditt lösenord när du är inloggad genom att gå till ”Mitt konto”.';
    $body .= '<br><br>Med vänliga hälsningar';
    $body .= '<br>refmanagment';
    $body .= '<br>';
    $body .= '</body></html>';

    $mottagare = $epost;
    $subject   = "Efterfrågat lösenord till refmanagment";
    if (send_epost($mottagare,$subject,$body)){
        $svar = '{"status": "OK", "useradded": "yes", "sendPw": "yes"}';
    } else {
        $svar = '{"status": "OK", "useradded": "yes", "sendPw": "no"}';
    }



    return $svar;
}
?>


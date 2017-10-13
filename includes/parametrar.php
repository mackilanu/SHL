<?php


echo '<script type="text/javascript">';
echo "var Parametrar  = '';";
echo "Parametrar      = JSON.parse( '" . read_parametrar()   . "' );";
echo "</script>";



function read_parametrar(){

    $message_data = "SHL-ERROR vid includes/parametar.php function read_parametrar().";

    $SQL  = "CALL read_Parametrar()";
    
    list($affected_rows,$result) = opendb($message_data,$SQL);


    if (!$result or $affected_rows == 0){
        return '{"status": "Error"}';
    }


    $row         = $result->fetch_row();
    $Orgnr       = $row[0];
    $Namn        = $row[1];
    $Adress      = $row[2];
    $Postnr      = $row[3];
    $Postadress  = $row[4];
    $Telefon     = $row[5];
    $Domarchef   = $row[6];
    $Mobil       = $row[7];
    $Epost       = $row[8];
    $Webmaster   = $row[9];
    $WebTelefon  = $row[10];
    $WebEpost    = $row[11];

    $Parametrar  = '{"status": "OK", "Orgnr": "'   . $Orgnr . '", ';
    $Parametrar .= '"Namn": "'       . $Namn       . '", ';
    $Parametrar .= '"Adress": "'     . $Adress     . '", ';
    $Parametrar .= '"Postnr": "'     . $Postnr     . '", ';
    $Parametrar .= '"Postadress": "' . $Postadress . '", ';
    $Parametrar .= '"Telefon": "'    . $Telefon    . '", ';
    $Parametrar .= '"Domarchef": "'  . $Domarchef  . '", ';
    $Parametrar .= '"Mobil": "'      . $Mobil      . '", ';
    $Parametrar .= '"Epost": "'      . $Epost      . '", ';
    $Parametrar .= '"Webmaster": "'  . $Webmaster  . '", ';
    $Parametrar .= '"WebTelefon": "' . $WebTelefon . '", ';
    $Parametrar .= '"WebEpost": "'   . $WebEpost   . '"}';

    
    return $Parametrar;

}

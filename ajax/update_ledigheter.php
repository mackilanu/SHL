<?php

@session_start();
header('Content-Type: application/json');

require_once("../includes/config.php");
require_once("../includes/io.php");
require_once("../includes/opendb.php");

date_default_timezone_set("Europe/Stockholm");

echo updateLedigheter();

function updateLedigheter(){

     $JerseyNo = $_SESSION['JerseyNo'];
     $namn     = $_SESSION['FirstName']. " ". $_SESSION['LastName'];
     $date     = $_GET['date'];
     $season   = $_SESSION['Season']; 
   
     $SQLledig                        = "CALL read_ledighet('$JerseyNo', '$date')";       
     $SQLtillsatt                     = "CALL read_tillsatt_match('$date', '$JerseyNo')";  

     list($num_rowsuser,$resultledig)        = opendb($message_datauser,$SQLledig);
     list($num_rowstillsatt,$resulttillsatt) = opendb($message_datauser,$SQLtillsatt);

     $rowsledighet = $resultledig->fetch_assoc();
     
     $nuvarandeTid = date('Y-m-d G:i:s  ', time());
     
     $message_data = "SHL-ERROR vid ajax/update_ledigheter.php function updateLedigheter().";

     //Om man redan är ledig och ändrar status så sätts raden till NULL istället.
     if($num_rowstillsatt == 0){

     if($rowsledighet['Noterad_Ledig'] == NULL){
            $SQL          = "CALL set_ledighet('$JerseyNo', '$date', '$nuvarandeTid', '$namn')";
     }else{
            $SQL          = "CALL delete_ledig('$JerseyNo', '$date')";  
     }
    
     list($num_rows,$result) = opendb($message_data,$SQL);

     if ($num_rows == 1){
         return '{"status": "OK", "value": "'. $date .'"}';
     } else {
        return  '{"status": "Error"}';
     }
     }else{
        return  '{"status": "Tillsatt" , "value": "'. $date .'"}';

     }


}


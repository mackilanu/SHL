<?php
require_once("opendb.php");

$message = mysqli_error();

$res = opendb($message,"CALL read_footer()");

//Ifall det inte går att ansluta till databasen
 if(!$res){

 	echo "Det har uppstått ett allvarligt problem: " .$message;
 }

//Om resultatet blir minst 1 rad påverkad så körs koden
if($res[0] != 0){

	while($rows = $res[1]->fetch_assoc()){
        
        //Info till shl-kontoret
		$adressSHL = $rows["Adress"];
		$telefonSHL = $rows["Telefon"];
		$namnSHL = $rows["Namn"];
		$orgNrSHL = $rows["Orgnr"];
		$postNrSHL = $rows["Postnr"];
		$telefonSHL = $rows["Telefon"];
        
        //info till domarchef
		$MobilCHEF = $rows["Mobil"];
		$epostCHEF = $rows["Epost"];
        
        //Info till webmaster
		$webmaster = $rows["Webmaster"];
		$epostWEBMASTER = $rows["Webepost"];

	}
}
//Annars körs detta
else{
 echo "Det har uppstått ett problem när informationen skulle visas";
}
?>

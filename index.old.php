<?php


require_once("includes/config.php");
echo FILEBEGIN;
//echo '<link rel="stylesheet" type="text/css" href="css/index.css">';
 
echo '<title>Startsida</title>';
echo indexCSS;
require_once("includes/bootstrap.php");
echo MOBILE;

echo BODYBEGIN;

require_once("includes/headerindex.php");



echo CONTENTBEGIN;

echo <<<CONTENT
 	<h1 class="center-text">Tillsättningsprogram</h1>
    <br>
 	<p class="center-text">Välkommen till tillsättningsprogrammet, skapat av Triantafillos Pavlidis och Marcus Andersson. Hoppas att du får en bra upplevelse. </p>
</div>
</div>
 </div> 

CONTENT;

echo CONTENTEND;

 
require_once("includes/footer.php");


echo BODYEND;

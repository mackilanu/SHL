// Javascript File


initiera();



function initiera(){

    var s = '<div class="col-md-2 col-xs-0"></div>';
    s += '<div id="c_side" class="col-md-8 col-xs-12"></div>';
    s += '<div class="col-md-2 col-xs-0"></div>';

    document.getElementById('div_container').innerHTML = s;

    visa_sidan();
    visa_foten();
}


function visa_sidan(){
    
    var s = '<div class="col-md-6 col-xs-6 right-header">';
    s += '<img src="Images/SHL-logo.jpg" alt="SHL" class="logo"></div>';


    s += '<div class="col-md-6 col-xs-6 left-header">';
    s += '<p id="inloggadsom" class="text-right"><br>Ej inloggad</p>';
    s +='<p id="knapp" class="text-right"></p></div>';

    

    s += '<h1 class="center-text">refmanagement</h1>';
    s += '<br>';
    s += '<p class="left-text">Välkommen till refmanagement, domartillsättningsprogrammet skapat av <b>NitsaSoft in Sweden AB</b><br>i samarbete med <b>Marcus Andersson</b>, teknikelev på <b>IT-gymnasiet i Karlstad</b>.<br>Den är avsedd för huvuddomare, linjedomare, domarcoach samt administratörer och har följande funktioner:</p>';

    s += '<div>';
    s += '<ul>';
    
    s += '<p><b>Detta kan du göra</b></p>';
    s += '<li><b>som domare och linjedomare</b></li>';
    s += '<ul>';
    s += '<li>Byta lösenord</li>';
    s += '<li>Se dina registrerade uppgifter</li>';
    s += '<li>Se dina matcher och coachrapporterna</li>';
    s += '<li>Anmäla ledighet</li>';
    s += '</ul>';

    s += '<li><b>Som domarcoach</b></li>';
    s += '<ul>';
    s += '<li>Byta lösenord</li>';
    s += '<li>Se dina registrerade uppgifter</li>';
    s += '<li>Se dina matcher och skriva/redigera coachrapporter</li>';
    s += '<li>Tillsätta dig själv som coach i en match</li>';
    s += '<li>Läsa andras coachrapporter</li>';
    s += '</ul>';

    s += '<li><b>Som administratör</b></li>';
    s += '<ul>';
    s += '<li>Byta lösenord</li>';
    s += '<li>Se dina registrerade uppgifter</li>';
    s += '<li>Läsa andras coachrapporter</li>';
    s += '<li>Definiera parametrar för tjänsten</li>';
    s += '<li>Skapa nya säsonger</li>';
    s += '<li>Hantera användarkonto</li>';
    s += '<li>Registrera ledighet för HD/LD/coach</li>';
    s += '<li>Registrera återbud för HD/LD/coach</li>';
    s += '<li>Se återbudstatistik för HD/LD/coach</li>';
    s += '<li>Tillsätta HD/LD/coach på matcher</li>';
    s += '<li>Se statistik för HD/LD/coach</li>';
    s += '<li>Definiera coachrapportfrågorna för säsongen</li>';
    s += '<li>Se användarinloggningar</li>';
    s += '<li>Hantera misslyckade e-postmeddelanden</li>';
    s += '</ul>';

    s += '</ul>';

    s += '<p>Vi hoppas att ni får en bra upplevelse.</p>';
    s += '<p>Triantafillos Pavlidis, NitsaSoft in Sweden AB';
    s += '<br>Marcus Andersson, elev på IT-gymnasiet i Karlstad</p>';

    
    s += '</div>';
    document.getElementById('c_side').innerHTML = s;

    
    s  = '<button class="btn btn-info btn-xs" onclick="login()">Logga in</button>';
    document.getElementById('knapp').innerHTML = s;

}

function login(){
    window.open('login.php','_self');
}

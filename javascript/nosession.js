// Javascript File


initiera();


function initiera(){

    var s = '<div class="col-md-2 col-xs-2"></div>';
    s += '<div id="c_side" class="col-md-8 col-xs-8"></div>';
    s += '<div class="col-md-2 col-xs-2"></div>';

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

    

    s += '<h1 class="center-text">Inloggning saknas</h1>';
    s += '<br>';

    s += '<p class="text-left">Du har inte behörighet till den begärda sidan på grund av att inloggning saknas.</p>';
    s += '<p>Detta kan bero på något av följande orsaker:</p>';
    s += '<ul>';
    s += '<li>Du är inte inloggad överhuvudtaget. <br>(<b>Åtgärd</b> Logga in)</li>';
    s += '<br>';
    s += '<li>Du har varit inloggad men din inlogging har gått ut på grund av långvarig inaktivitet. <br>(<b>Åtgärd</b> Logga in på nytt)</li>';
    s += '</ul>';

    s += '<br><br>';
    document.getElementById('c_side').innerHTML = s;

    
    s  = '<button class="btn btn-info btn-xs" onclick="login()">Logga in</button>';
    document.getElementById('knapp').innerHTML = s;
    

}

function login(){
    window.open('login.php','_self');
}


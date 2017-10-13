// Javascript File


initiera();


function initiera(){

    var s = '<div class="col-md-2 col-xs-2"></div>';
    s += '<div id="c_side" class="col-md-8 col-xs-8"></div>';
    s += '<div class="col-md-2 col-xs-2"></div>';

    document.getElementById('div_container').innerHTML = s;

    visa_sidan();
}


function visa_sidan(){
    
    var s = '<div class="col-md-6 col-xs-6 right-header">';
    s += '<img src="Images/SHL-logo.jpg" alt="SHL" class="logo"></div>';


    s += '<div class="col-md-6 col-xs-6 left-header">';

    logInfo = JSON.parse(logInfo);
    s += '<p id="inloggadsom" class="text-right">';
    s += logInfo.JerseyNo + '-' + logInfo.FirstName + ', ' + logInfo.LastName;
    s += '<br>' + Domartyper[logInfo.Domartyp] + '</p>';
    s +='<p id="knapp" class="text-right"></p></div>';

    

    s += '<h1 class="center-text">Otillräcklig behörighet</h1>';
    s += '<br>';

    s += '<p class="text-left">Du har inte behörighet till den begärda sidan.</p>';
    s += '<p>För att erhålla rätt behörighet kontakta en administratör.</p>';
        
    s += '</div>';
    document.getElementById('c_side').innerHTML = s;

    
    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;


}

function logout(){
    window.open('logout.php','_self');
}


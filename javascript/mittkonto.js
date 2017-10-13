//Javascript File


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
    s += '<img src="Images/SHL-logo.jpg" alt="SHL" class="logo" style="width:80%;"></div>';


    s += '<div class="col-md-6 col-xs-6 left-header">';
    logInfo = JSON.parse(logInfo);
    s += '<p id="inloggadsom" class="text-right">';
    s += logInfo.JerseyNo + '-' + logInfo.FirstName + ', ' + logInfo.LastName;
    s += '<br>' + Domartyper[logInfo.Domartyp];
    if (logInfo.Priviledge != logInfo.Domartyp){
	s += ' (' + Domartyper[logInfo.Priviledge] + ')';
    }
    s += '</p>';
	
    s +='<p id="knapp" class="text-right"></p>';
    s += '</div>';


    s += '<h1 class="center-text">Mitt konto</h1>';
    s += '<br>';

    s += '<div class="form-group text-center">' + Menyn + '</div>';

    document.getElementById('c_side').innerHTML = s;

    
    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

}

function check(){

        var d      = new Date();
    var YYYY   = d.getFullYear();
    var MM     = d.getMonth();
    MM += 1;
    if (MM < 10) MM = '0' + MM;
    var DD = d.getDate();
    if (DD < 10) DD = '0' + DD;
    
    var Dagens = YYYY + '-' + MM + '-' + DD;

    if(LastDate.DateOut >  Dagens){
        alert("Man kan inte registrera återbud än. Detta kan man göra från och med "+ LastDate.DateOut);
    }else{
       window.location.href = "aterbud.php";
    }
}
function bytpw(){
    window.open('changepw.php', '_self');
}


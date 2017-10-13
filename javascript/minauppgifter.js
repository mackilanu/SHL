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
    s += '<a href="mittkonto.php"><img src="Images/SHL-logo.jpg" alt="SHL" class="logo" style="width:80%;"></a></div>';


    s += '<div class="col-md-6 col-xs-6 left-header">';
    logInfo = JSON.parse(logInfo);
    s += '<p id="inloggadsom" class="text-right">';
    s += logInfo.JerseyNo + '-' + logInfo.FirstName + ', ' + logInfo.LastName;
    s += '<br>' + Domartyper[logInfo.Domartyp] + '</p>';
    s +='<p id="knapp" class="text-right"></p>';
    s += '</div>';


    s += '<h1 class="center-text">Mina uppgifter</h1>';
    s += '<br>';

    var Active         = '';
    var FirstName      = '';
    var LastName       = '';
    var Priviledge     = '';
    var Epost          = '';
    var Mobil          = '';
    var Domartyp       = '';
    var Personnr       = '';
    var DomdaGrundspel = '';
    var DomdaSlutspel  = '';
    var Registred_by   = '';
    var Registred_date = '';
    var Updated_by     = '';
    var Updated_date   = '';
    
    if (Userlista.status == "OK"){
	
	Active         = Userlista.User[0].Active;
	FirstName      = Userlista.User[0].FirstName;
	LastName       = Userlista.User[0].LastName;
	Priviledge     = Userlista.User[0].Priviledge;
	Email          = Userlista.User[0].Email;
	Mobil          = Userlista.User[0].Mobil;
	Domartyp       = Userlista.User[0].Domartyp;
	Personnr       = Userlista.User[0].Personnr;
	DomdaGrundspel = Userlista.User[0].DomdaGrundspel;
	DomdaSlutspel  = Userlista.User[0].DomdaSlutspel;
	Registred_by   = Userlista.User[0].Registred_by;
	Registred_date = Userlista.User[0].Registred_date;
	Updated_by     = Userlista.User[0].Updated_by;
	Updated_date   = Userlista.User[0].Updated_date;

    }

    s += '<div class="class="main-content" style="margin: auto 20%;">';

    // Tröjnummer
    s += '<label>Tröjnummer:</label>';
    s +='<input type="text" class="form-control" onkeydown="return isNumber(event)" value="' + logInfo.JerseyNo + '"/>';

    // Aktiv
    s += '<div class="checkbox">';
    s += '<label><input type="checkbox" value=""';
    if (Active == 'J'){
	s += 'checked';
    }
    s += ' disabled>Aktiv</label>';
    s += '</div>';

    // Namn
    s += '<label>Namn:</label>';
    s +='<input type="text" class="form-control" onkeydown="return isNumber(event)" value="' + FirstName + ', ' + LastName + '"/>';

    // Behörighet
    s += '<label>Behörighet:</label>';
    s +='<input type="text" class="form-control" onkeydown="return isNumber(event)" value="' + Domartyper[Priviledge] + '"/>';

    // Epost
    s += '<label>E-post:</label>';
    s +='<input type="text" class="form-control" onkeydown="return isNumber(event)" value="' + Email + '"/>';

    // Mobil
    s += '<label>Mobil:</label>';
    s +='<input type="text" class="form-control" onkeydown="return isNumber(event)" value="';
    if (Mobil){
	s += Mobil;
    }
    s += '"/>';

    // Domartyp
    s += '<label>Domartyp:</label>';
    s +='<input type="text" class="form-control" onkeydown="return isNumber(event)" value="' + Domartyper[Domartyp] + '"/>';

    // Personnr
    s += '<label>Personnr:</label>';
    s +='<input type="text" class="form-control" onkeydown="return isNumber(event)" value="';
    if (Personnr){
	s += Personnr;
    }
    s += '"/>';

    // Dömda grundspel
    s += '<label>Dömda i grundspel:</label>';
    s +='<input type="text" class="form-control" onkeydown="return isNumber(event)" value="';
    if (DomdaGrundspel){
	s +=  DomdaGrundspel;
    }
    s += '"/>';

    // Dömda slutspel
    s += '<label>Dömda i slutspel:</label>';
    s +='<input type="text" class="form-control" onkeydown="return isNumber(event)" value="';
    if (DomdaSlutspel){
	s += + DomdaSlutspel;
    }
    s += '"/>';

    // Registrerad av
    s += '<label>Registrerad av:</label>';
    s +='<input type="text" class="form-control" onkeydown="return isNumber(event)" value="' + Registred_by + '"/>';

    // Registrerad
    s += '<label>Registrerad:</label>';
    s +='<input type="text" class="form-control" onkeydown="return isNumber(event)" value="' + Registred_date + '"/>';

    // Uppdaterad av
    s += '<label>Uppdaterad av:</label>';
    s +='<input type="text" class="form-control" onkeydown="return isNumber(event)" value="' + Updated_by + '"/>';

    // Uppdaterad
    s += '<label>Uppdaterad:</label>';
    s +='<input type="text" class="form-control" onkeydown="return isNumber(event)" value="' + Updated_date + '"/>';

    s += '<br>'
 
    s += '<div class="text-center"><button type="button" class="btn btn-primary" onclick="tillbaka()">Till Mitt konto</button></div>';
	    
    s += '</div>';
    s += '<br>'
    s += '<br>'
    s += '<br>'

    document.getElementById('c_side').innerHTML = s;

    
    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

}

function tillbaka(){
    window.open('mittkonto.php', '_self');
}

function isNumber(event) {

    return false;

}

//Javascript File


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
    s += '<a href="mittkonto.php"><img src="Images/SHL-logo.jpg" alt="SHL" class="logo" style="width:80%;"></a></div>';


    s += '<div class="col-md-6 col-xs-6 left-header">';
    logInfo = JSON.parse(logInfo);
    s += '<p id="inloggadsom" class="text-right">';
    s += logInfo.JerseyNo + '-' + logInfo.FirstName + ', ' + logInfo.LastName;
    s += '<br>' + Domartyper[logInfo.Domartyp] + '</p>';
    s +='<p id="knapp" class="text-right"></p>';
    s += '</div>';


    s += '<h1 class="center-text">Användarkonto</h1>';
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
    
    if (Userslista.status == "OK"){
	
	JerseyNo       = Userslista.User[0].JerseyNo;
	Active         = Userslista.User[0].Active;
	FirstName      = Userslista.User[0].FirstName;
	LastName       = Userslista.User[0].LastName;
	Priviledge     = Userslista.User[0].Priviledge;
	Email          = Userslista.User[0].Email;
	Mobil          = Userslista.User[0].Mobil;
	Domartyp       = Userslista.User[0].Domartyp;
	Personnr       = Userslista.User[0].Personnr;
	DomdaGrundspel = Userslista.User[0].DomdaGrundspel;
	DomdaSlutspel  = Userslista.User[0].DomdaSlutspel;
	Registred_by   = Userslista.User[0].Registred_by;
	Registred_date = Userslista.User[0].Registred_date;
	Updated_by     = Userslista.User[0].Updated_by;
	Updated_date   = Userslista.User[0].Updated_date;

    }

    s += '<div class="class="main-content" style="margin: auto 20%;">';

    // Tröjnummer
    s += '<label>Tröjnummer:</label>';
    s +='<input type="text" class="form-control" onkeydown="return isNumber(event)" value="' + JerseyNo + '"/>';

    // Aktiv
    s += '<div class="checkbox">';
    s += '<label><input type="checkbox" id="chAktiv" value=""';
    if (Active == 'J'){
	s += 'checked';
    }
    s += '>Aktiv</label>';
    s += '</div>';

    // FirstName
    s += '<label>Förnamn:</label>';
    s +='<input type="text" id="txtFirstName" class="form-control" maxlength="32" value="' + FirstName + '"/>';

    // LastName
    s += '<label>Efternamn:</label>';
    s +='<input type="text" id="txtLastName" class="form-control" maxlength="32" value="' +  LastName + '"/>';

    // Behörighet
    s += '<label>Behörighet:</label>';
    s += '<select class="form-control" id="cbPriviledge">';
    s += '<option>Välj behörighet</option>';
    for (var i = 1; i < Domartyper.length; i++){
	s += '<option';
	if (i == Priviledge){
	    s += ' selected';
	}
	s += '>' + Domartyper[i] + '</option>';
    }
    s += '</select>';

    // Epost
    s += '<label>E-post:</label>';
    s +='<input type="text" id="txtEmail" class="form-control" maxlength="128" value="' + Email + '"/>';

    // Mobil
    s += '<label>Mobil:</label>';
    s +='<input type="text" id="txtMobil" class="form-control" maxlength="16" value="';
    if (Mobil){
	s += Mobil;
    }
    s += '"/>';

    // Domartyp
    s += '<label>Domartyp:</label>';
    s += '<select class="form-control" id="cbDomartyp">';
    s += '<option>Välj domartyp</option>';
    for (var i = 1; i < Domartyper.length; i++){
	s += '<option';
	if (i == Domartyp){
	    s += ' selected';
	}
	s += '>' + Domartyper[i] + '</option>';
    }
    s += '</select>';

    // Personnr
    s += '<label>Personnr:</label>';
    s +='<input type="text" id="txtPersonnr" class="form-control" maxlength="16" value="';
    if (Personnr){
	s += Personnr;
    }
    s += '"/>';

    // Dömda grundspel
    s += '<label>Dömda i grundspel:</label>';
    s +='<input type="text" id="txtGrundspel" class="form-control" maxlength="4" onkeydown="return isNumber(event)" value="';
    if (DomdaGrundspel){
	s +=  DomdaGrundspel;
    }
    s += '"/>';

    // Dömda slutspel
    s += '<label>Dömda i slutspel:</label>';
    s +='<input type="text" id="txtSlutspel" class="form-control" maxlength="4" onkeydown="return isNumber(event)" value="';
    if (DomdaSlutspel){
	s += + DomdaSlutspel;
    }
    s += '"/>';

    // Registrerad av
    s += '<label>Registrerad av:</label>';
    s +='<input type="text" class="form-control" value="' + Registred_by + '" disabled>';

    // Registrerad
    s += '<label>Registrerad:</label>';
    s +='<input type="text" class="form-control" value="' + Registred_date + '" disabled>';

    // Uppdaterad av
    s += '<label>Uppdaterad av:</label>';
    s +='<input type="text" class="form-control" value="' + Updated_by + '" disabled>';

    // Uppdaterad
    s += '<label>Uppdaterad:</label>';
    s +='<input type="text" class="form-control" value="' + Updated_date + '" disabled>';

    s += '<br>'
 
 
    s += '<div class="text-center"><button type="button" class="btn btn-primary" onclick="spara()">Spara ändringar</button>';
    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    s += '<button type="button" class="btn btn-primary" onclick="tillbaka()">Till Användarkonton</button></div>';
	    
    s += '</div>';
    s += '<br>'
    s += '<br>'
    s += '<br>'

    document.getElementById('c_side').innerHTML = s;

    
    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

}

function tillbaka(){
    window.open('users.php', '_self');
}

function spara(){
    // Börjar med kontroller


    var Active = null;
    if (document.getElementById('chAktiv').checked){
	Active = 'J';
    }
    
    // FirstName
    var FirstName = rensatoDB(document.getElementById('txtFirstName').value.trim());
    document.getElementById('txtFirstName').value = FirstName;
    if (!FirstName){
	alert("Förnamn saknas.");
	document.getElementById('txtFirstName').focus();
	return false;
    }
    
    // LastName
    var LastName = rensatoDB(document.getElementById('txtLastName').value.trim());
    document.getElementById('txtLastName').value = LastName;
    if (!LastName){
	alert("Efternamn saknas.");
	document.getElementById('txtLastName').focus();
	return false;
    }
    
    // Domartyp
    var Domartyp = document.getElementById('cbDomartyp').selectedIndex;
    if (Domartyp == 0){
	alert("Domartypen saknas.");
	document.getElementById('cbDomartyp').focus();
	return false;
    }


    // Priviledge
    var Priviledge = document.getElementById('cbPriviledge').selectedIndex;
    if (Priviledge == 0){
	alert("Behörighet saknas.");
	document.getElementById('cbPriviledge').focus();
	return false;
    }
    if (Priviledge != Domartyp && Priviledge != 4){
	alert("Behörigheten ska vara administratör eller samma som domartypen");
	document.getElementById('cbPriviledge').focus();
	return false;
    }


    if (!kolla_Epost()) return false;

    
    // Mobil
    var Mobil = rensatoDB(document.getElementById('txtMobil').value.trim());

    // Personnr
    var Personnr = rensatoDB(document.getElementById('txtPersonnr').value.trim());

    // Dömda grundsspel
    var DomdaGrundspel = rensatoDB(document.getElementById('txtGrundspel').value.trim());

    // Dömda slutspel
    var DomdaSlutspel = rensatoDB(document.getElementById('txtSlutspel').value.trim());
    

    var save_record = false;
    if (Userslista.User[0].Active != Active){
	save_record = true;
    }
    if (Userslista.User[0].FirstName != FirstName){
	save_record = true;
    }
    if (Userslista.User[0].LastName != LastName){
	save_record = true;
    }
    if (Priviledge     != Userslista.User[0].Priviledge){
	save_record = true;
    }
    if (Email          != Userslista.User[0].Email){
	save_record = true;
    }
    if (Mobil          != Userslista.User[0].Mobil){
	save_record = true;
    }
    if (Domartyp       != Userslista.User[0].Domartyp){
	save_record = true;
    }
    if (Personnr       != Userslista.User[0].Personnr){
	save_record = true;
    }
    if (DomdaGrundspel != Userslista.User[0].DomdaGrundspel){
	save_record = true;
    }
    if (DomdaSlutspel  != Userslista.User[0].DomdaSlutspel){
	save_record = true;
    }
    
    if (!save_record) return; // Inga ändringar är gjorda



    var instring  = '{"JerseyNo":'   + String(Userslista.User[0].JerseyNo)   + ', ';
    instring     += '"Active": "';
    if (Active){
        instring += Active;
    }
    instring += '", ';
	
    instring     += '"FirstName": "' + FirstName          + '", ';
    instring     += '"LastName": "'  + LastName           + '", ';
    instring     += '"Priviledge": ' + String(Priviledge) + ', ';
    instring     += '"Email": "'     + Email              + '", ';

    instring     += '"Mobil": "';
    if (Mobil){
        instring += Mobil;
    }
    instring += '", ';

    instring     += '"Domartyp": '   + String(Domartyp)   + ', ';
    
    instring     += '"Personnr": "';
    if (Personnr){
        instring += Personnr;
    }
    instring += '", ';
	
    instring     += '"Grundspel": "';
    if (DomdaGrundspel){
	instring += DomdaGrundspel;
    }
    instring += '", ';
    
    instring     += '"Slutspel": "';
    if (DomdaSlutspel){
	instring += DomdaSlutspel;
    }
    instring += '"}';

    
    var js_objekt = JSON.parse(instring);

    $.getJSON("ajax/update_user.php", js_objekt)
        .done(function(data) {
	    spara_success(data);
	})
        .fail(function() {
	    spara_fail();
	})
        .always(function() {

	});

}

function spara_success(response){
    var msg = '';

    if (response.status == 'Error'){
	msg = "Uppdateringen har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbadministratören.";

    } else if (response.status == 'OK'){
	msg = "Uppdateringen är nu genomförd.";

    } else {
	msg ="Oförutsett fel har inträffat!";
    }

    alert(msg);
}

function spara_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}


function kolla_Epost(){
    var felEpost = 'E-postadressen har felaktig format';

    Email = rensatoDB(document.getElementById('txtEmail').value.trim());
    document.getElementById('txtEmail').value = Email;
    if (!Email){
	alert('E-postadress saknas.');
	document.getElementById('txtEmail').focus();
	return false;
    }

    //kontrollerar existensen av @
    if (Email.indexOf('@') == -1){
	alert(felEpost);
	document.getElementById('txtEmail').focus();
	return false;
    }

    //kontrollerar existensen av .
    if (Email.indexOf('.') == -1){
	alert(felEpost);
	document.getElementById('txtEmail').focus();
	return false;
    }

    // kontrollerar att E-postadressen har precis en @
    if (Email.indexOf('@') != Email.lastIndexOf('@')){
	alert(felEpost);
	document.getElementById('txtEmail').focus();
	return false;
    }

    //kontrollerar att . inte är det sista tecknet
    if (Email.lastIndexOf('.') == Email.length - 1){
	alert(felEpost);
	document.getElementById('txtEmail').focus();
	return false;
    }

    //kontrollerar att det finns en . åtminstone två position efter @-tecknet
    if (Email.lastIndexOf('.') < (Email.indexOf('@') + 2)){
	alert(felEpost);
	document.getElementById('txtEmail').focus();
	return false;
    }

    return true;
}


function isNumber(event) {

    if (event) {
	var charCode = (event.which) ? event.which : event.keyCode;
	if (charCode != 190 && charCode > 31 &&
	    (charCode < 48 || charCode > 57) &&
	    (charCode < 96 || charCode > 105) &&
	    (charCode < 37 || charCode > 40) &&
	    charCode != 110 && charCode != 8 && charCode != 46 )
	    return false;
    }
    return true;

}


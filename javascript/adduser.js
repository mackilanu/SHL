//Javascript File

var JerseyNo   = 0;
var Domartyp   = 0;
var Active     = '';;
var FirstName  = '';
var LastName   = '';
var Priviledge = 0;
var Email      = '';
var Mobil      = '';
var Personnr   = '';
var Grundspel  = null;
var Slutspel   = null;


initiera();


function initiera(){

    var s = '<div class="col-md-2 col-xs-0"></div>';
    s += '<div id="c_side" class="col-md-8 col-xs-12"></div>';
    s += '<div class="col-md-2 col-xs-0"></div>';

    document.getElementById('div_container').innerHTML = s;

    visa_sidan();
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


    s += '<h1 class="center-text">Lägg till ett konto</h1>';
    s += '<br>';

    s += '<div class="class="main-content" style="margin: auto 20%;">';

    // Tröjnummer
    s += '<label>Tröjnummer:</label>';
    s +='<input type="text" id="txtJerseyNo" class="form-control" onkeydown="return isNumber(event)" value=""/>';

    // Domartyp
    s += '<label>Domartyp:</label>';
    s += '<select class="form-control" id="cbDomartyp">';
    s += '<option>Välj domartyp</option>';
    for (var i = 1; i < Domartyper.length; i++){
	s += '<option>' + Domartyper[i] + '</option>';
    }
    s += '</select>';

    // Aktiv
    s += '<div class="checkbox">';
    s += '<label><input id="chAktiv" type="checkbox" value="">Aktiv</label>';
    s += '</div>';


    // Förnamn
    s += '<label>Förnamn:</label>';
    s +='<input type="text" id="txtFirstName" class="form-control" value=""/>';

    // Efternamn
    s += '<label>Efternamn:</label>';
    s +='<input type="text" id="txtLastName" class="form-control" value=""/>';

    // Behörighet
    s += '<label>Behörighet:</label>';
    s += '<select class="form-control" id="cbPriviledge">';
    s += '<option>Välj behörighet</option>';
    for (var i = 1; i < Domartyper.length; i++){
	s += '<option>' + Domartyper[i] + '</option>';
    }
    s += '</select>';

    // Epost
    s += '<label>E-post:</label>';
    s +='<input type="text" id="txtEmail" class="form-control" value=""/>';

    // Mobil
    s += '<label>Mobil:</label>';
    s +='<input type="text" id="txtMobil" class="form-control" value=""/>';

    // Personnr
    s += '<label>Personnr:</label>';
    s +='<input type="text" id="txtPersonnr" class="form-control" value=""/>';

    // Dömda grundspel
    s += '<label>Dömda i grundspel:</label>';
    s +='<input type="text" id="txtGrundspel" class="form-control" onkeydown="return isNumber(event)" value=""/>';

    // Dömda slutspel
    s += '<label>Dömda i slutspel:</label>';
    s +='<input type="text" id="txtSlutspel" class="form-control" onkeydown="return isNumber(event)" value=""/>';

    s += '<br>';

    s += '<div class="text-center"><button type="button" class="btn btn-primary" onclick="add_user()">Skapa konto</button>';
    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    s += '<button type="button" class="btn btn-primary" onclick="tillbaka()">Till användarkonton</button></div>';

    s += '</div>';
    s += '<br>';
    s += '<br>';
    s += '<br>';

    document.getElementById('c_side').innerHTML = s;


    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

}

function tillbaka(){
    window.open('users.php', '_self');
}

function add_user(){

    if (!kontrollera()) return;

    Active = null;
    if (document.getElementById('chAktiv').checked){
	Active = 'J';
    }

    var instring  = '{"JerseyNo":'   + String(JerseyNo)   + ', ';
    instring     += '"Domartyp": '   + String(Domartyp)   + ', ';
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

    instring     += '"Personnr": "';
    if (Personnr){
        instring += Personnr;
    }
    instring += '", ';

    instring     += '"Grundspel": '  + String(Grundspel)  + ', ';
    instring     += '"Slutspel": '   + String(Slutspel)   + '} ';


    var js_objekt = JSON.parse(instring);

    $.getJSON("ajax/adduser.php", js_objekt)
        .done(function(data) {
	          add_user_success(data);
	})
        .fail(function() {
	          add_user_fail();
	})
        .always(function() {

	});

}

function add_user_success(response){
    var msg = '';

    if (response.status == 'Error'){
	      msg = "Registreringen har, av okänd anledning, misslyckats. Vid upprepade fel kontakta administratören.";


    } else if (response.status == 'EpostFinns'){
	      msg = "Denna e-postadress innehas redan av " + Domartyper[response.Domartyp] + " " + response.Fnamn + ", " + response.Enamn + " med tröjanummer " + response.TrojaNr + ". Registreringen avbryts.";


    } else if (response.status == 'PnrFinns'){
	      msg = "Detta personnummer innehas redan av " + Domartyper[response.Domartyp] + " " + response.Fnamn + ", " + response.Enamn + " med tröjanummer " + response.TrojaNr + ". Registreringen avbryts.";


    } else if (response.status == 'OK' && response.sendPw == "yes"){
	      msg = "Registreringen är genomförd och ett välkomstmeddelande med lösenord har skickats till vederbörande via e-post.";


    } else if (response.status == 'OK' && response.sendPw == "no"){
	      msg = "Registreringen är genomförd men ett välkomstmeddelande med lösenord har inte kunnat skickas till vederbörande via e-post.";

    } else {
	      msg ="Oförutsett fel har inträffat!";
    }

    alert(msg);

    if (response.status == 'OK'){
	      document.getElementById('txtJerseyNo').value = '';
	      document.getElementById('cbDomartyp').selectedIndex = 0;
	      document.getElementById('chAktiv').checked = false;
	      document.getElementById('txtFirstName').value = '';
	      document.getElementById('txtLastName').value = '';
	      document.getElementById('cbPriviledge').selectedIndex = 0;
	      document.getElementById('txtEmail').value = '';
	      document.getElementById('txtMobil').value = '';
	      document.getElementById('txtPersonnr').value = '';
	      document.getElementById('txtGrundspel').value = '';
	      document.getElementById('txtSlutspel').value = '';
	      document.getElementById('txtJerseyNo').focus();
    }
}

function add_user_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
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

function kontrollera(){

    // JerseyNo
    JerseyNo = rensatoDB(document.getElementById('txtJerseyNo').value.trim());
    document.getElementById('txtJerseyNo').value = JerseyNo;
    if (!JerseyNo){
	      alert("Tröjnummer saknas.");
	      document.getElementById('txtJerseyNo').focus();
	      return false;
    }

    // Domartyp
    Domartyp = document.getElementById('cbDomartyp').selectedIndex;
    if (Domartyp == 0){
	      alert("Domartypen saknas.");
	      document.getElementById('cbDomartyp').focus();
	      return false;
    }
    
    // FirstName
    FirstName = rensatoDB(document.getElementById('txtFirstName').value.trim());
    document.getElementById('txtFirstName').value = FirstName;
    if (!FirstName){
	      alert("Förnamn saknas.");
	      document.getElementById('txtFirstName').focus();
	      return false;
    }
    
    // LastName
    LastName = rensatoDB(document.getElementById('txtLastName').value.trim());
    document.getElementById('txtLastName').value = LastName;
    if (!LastName){
	      alert("Efternamn saknas.");
	      document.getElementById('txtLastName').focus();
	      return false;
    }

    // Priviledge
    Priviledge = document.getElementById('cbPriviledge').selectedIndex;
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
    Mobil = rensatoDB(document.getElementById('txtMobil').value.trim());

    // Personnr
    Personnr = rensatoDB(document.getElementById('txtPersonnr').value.trim());

    // Dömda grundsspel
    Grundspel = rensatoDB(document.getElementById('txtGrundspel').value.trim());

    // Dömda slutspel
    Slutspel = rensatoDB(document.getElementById('txtSlutspel').value.trim());
    

    return true;
    
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


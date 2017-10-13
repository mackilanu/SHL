// JavaScript

var JerseyNo = '';


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




    getInfo();



    s += '<h1 class="center-text">Logga in</h1>';
    s += '<br>';

    if (Season.status == "Error"){
        s += "Ett oförutsett fel hindrar inloggningen. Vid upprepade fel kontakta administratören.";
        s += '<br><br><br>';
    } else {

        s += '<div class="main-content" style="margin: auto 20%;">';

        s += '<label>Tröjnummer:</label>';
        s +='<input type="text" class="form-control" id="txtJerseyNo" placeholder="Ditt tröjnummer" onkeydown="return isNumber(event)" value="' + JerseyNo + '"/>';
        s += '<br>';


        s += '<label for="password">Lösenord:</label>';
        s += '<input type="password" class="form-control" id="txtPw" placeholder="Password" onkeypress="enterevent(event)">';

        s += '<br>';

        s += '<div class="text-center"><button type="button" class="btn btn-primary" onclick="loggain()">Logga in</button>';
        s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        s += '<button type="button" class="btn btn-primary" onclick="newPw()">Nytt lösenord</button></div>';


        s += '</div>';
    }

    document.getElementById('c_side').innerHTML = s;


    s  = '<button class="btn btn-info btn-xs" onclick="tillbaka()">Tillbaka</button>';
    document.getElementById('knapp').innerHTML = s;

    if (Season.status == "OK"){

        if (!JerseyNo){
	          document.getElementById('txtJerseyNo').focus();
        } else {
	          document.getElementById('txtPw').focus();
        }
    }
}

function loggain(){

    if (!kontrollera()) return;

    var current_Pw = document.getElementById('txtPw').value.trim();
    if (!current_Pw){
	      document.getElementById('txtPw').value = '';
	      document.getElementById('txtPw').focus();
	      alert('Lösenord saknas.');
	      return;
    }

    var instring  = '{"JerseyNo": "'  + JerseyNo + '", ';
    instring     += '"Pw": "'         + MD5(current_Pw) + '"}';

    var js_objekt = JSON.parse(instring);


    $.getJSON( "ajax/login.php", js_objekt)
	      .done(function(data) {
	          loggain_success(data);
	      })
	      .fail(function() {
	          loggain_fail();
	      })
	      .always(function() {
    });


}

function loggain_success(response){

    if (response.status == 'Error'){
	      alert("Inloggningen har tyvärr inte kunnat genomföras. Vid uppreppade fel kontakta webbmaster.");
	      return;
    }

    if (response.status == 'OK' && response.JerseyNo == '-1'){
	      alert("Tröjnummer eller lösenordet är felaktig");
	      return;
    }

    if (response.status == 'OK' && response.JerseyNo != '-1'){
	      window.open('mittkonto.php','_self');
    }

}

function loggain_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}

function kontrollera(){

    JerseyNo = document.getElementById('txtJerseyNo').value.trim();
    if (!JerseyNo){
	      document.getElementById('txtJerseyNo').value = '';
	      document.getElementById('txtJerseyNo').focus();
	      alert('Tröjnummer saknas.');
	      return false;
    }


    if (JerseyNo != localStorage.getItem('JerseyNo')){
	      var svar = confirm("Ska det nya tröjnummer sparas?");
	      if (svar == true) {
	          localStorage.setItem('JerseyNo',JerseyNo);
	      }
    }

    return true;
}


function newPw(){

if (!kontrollera()) return;

var instring  = '{"JerseyNo": "'  + JerseyNo + '"}';

var js_objekt = JSON.parse(instring);

$.getJSON( "ajax/newpw.php", js_objekt)
    .done(function(data) {

	      newPw_success(data);
    })
    .fail(function() {
	      newPw_fail();
    })
    .always(function() {

    });
}

function newPw_success(response){

    if (response.Session == 'out'){
	      window.open('../sessiontimedout.php', '_self');
	      return;
    }

    if (response.status == 'Error'){
	alert('Din begäran om nytt lösenord kunde inte genomföras på grund av ett oförutsägbart fel.');
	return;
    }

    if (response.status == 'Error2'){
	      alert('Du har angivit fel tröjnummer eller saknar du behörighet att logga in i webbtjänsten.');
	      return;
    }

    if (response.status == 'OK'){
	      if (response.sendPw    == 'yes'){
	          alert();ert('Ett nygenererat lösenord har skickas till ditt epostadress.');
	      } else if (response.sendPw    == 'no'){
	          alert('Ett nytt lösenord är genererad men har INTE kunnat skickas till ditt epostadress.');
	      }
    }
}

function newPw_fail(response){
    alert('Din begäran om nytt lösenord kunde inte genomföras på grund av ett fel!');
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


function getInfo(){

    JerseyNo = localStorage.getItem('JerseyNo');
    if (!JerseyNo){
	      JerseyNo = "";
	      localStorage.setItem('JerseyNo',"");
    }
}

function save_userinfo(){
    // Sparar user-info
    localStorage.setItem('JerseyNo',JerseyNo);
}

function enterevent(event){

    if (event.keyCode == 13) loggain();
}

function tillbaka(){
    window.open('index.php','_self');
}

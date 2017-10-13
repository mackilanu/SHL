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


    s += '<h1 class="center-text">Byt lösenord</h1>';
    s += '<br>';

    s += '<div class="main-content" style="margin: auto 20%;">';

    s += '<label>Nuvarande lösenord:</label>';
    s += '<input type="password" class="form-control" id="txtcurrentPw" placeholder="Nuvarande lösenord" maxlength="32" required>';
    s += '<br>'
 

    s += '<label>Nytt lösenord:</label>';
    s += '<input type="password" class="form-control" id="txtnewPw1" placeholder="Nytt lösenord" maxlength="32" required>';
    s += '<br>'

    s += '<label>Verifiera nytt lösenord:</label>';
    s += '<input type="password" class="form-control" id="txtnewPw2" placeholder="Verifiera nytt lösenord" maxlength="32" required>';

    s += '<br>'
 
    s += '<div class="text-center"><button type="button" class="btn btn-primary" onclick="changepw()">Genomför ändringen</button>';
    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    s += '<button type="button" class="btn btn-primary" onclick="mittkonto()">Till mitt konto</button></div>';

    s += '<br>'
    s += '<br>'
    s += '<br>'
    s += '<br>'
 
    s += '</div>';

    document.getElementById('c_side').innerHTML = s;
    document.getElementById('txtcurrentPw').focus();

    
    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

}

function mittkonto(){
    window.open('mittkonto.php', '_self');
}


function changepw(){
    var old_pw = document.getElementById('txtcurrentPw').value.trim();
    if (!old_pw){
	document.getElementById('txtcurrentPw').focus();
	alert('Nuvarande lösenord saknas.');
	return;
    }

    var new_pw1 = document.getElementById('txtnewPw1').value.trim();
    if (!new_pw1){
	document.getElementById('txtnewPw1').focus();
	alert('Nytt lösenord saknas.');
	return;
    }

    var new_pw2 = document.getElementById('txtnewPw2').value.trim();
    if (!new_pw2){
	document.getElementById('txtnewPw2').focus();
	alert('Verifiering av nytt lösenord saknas.');
	return;
    }

    if (new_pw1 != new_pw2){
	alert('Nytt lösenord och verifieringen överrensstämmer inte med varandra.');
	document.getElementById('txtnewPw1').value = '';
	document.getElementById('txtnewPw2').value = '';
	document.getElementById('txtnewPw1').focus();
	return;
    }

    var instring  = '{"oldpw": "' + MD5(old_pw)    + '", ';
    instring     += '"newpw": "'  + MD5(new_pw1)   + '"}';


    var js_objekt = JSON.parse(instring);

    $.getJSON( "ajax/changepw.php", js_objekt)
        .done(function(data) {
	    changepw_success(data);
	})
        .fail(function() {
	    changepw_fail();
	})
        .always(function() {

	});

}

function changepw_success(response){

    if (response.Session == 'out'){
	window.open('../nosession.php', '_self');

    } else if (response.status == 'Error'){
	alert('Din begäran om lösenordsbyte kunde inte genomföras på grund av ett oförutsägbar fel!');

    } else if (response.status == 'Fel_Pw'){
	alert("Nuvarande lösenord stämmer inte med den registrerade");

    } else if (response.status == 'OK'){
	if (response.sendEpost == 'yes'){
	    alert('Lösenordet är nu ändrat i databasen och ett epostmeddelande har skickats till den registrerade epostadressen.');
	} else if (response.sendEpost == 'no'){
	    alert('Lösenordet är nu ändrad i databasen men ett epostmeddelande har inte kuunnat skickats till den registrerade epostadressen.');
	}
	window.open('mittkonto.php','_self');

    } else {
	alert("Ett oförutsett fel har uppstått!");
    }
}

function changepw_fail(response){
    alert('Lösenordsbyte kunde inte genomföras på grund av ett oförutsägbart fel!');
}

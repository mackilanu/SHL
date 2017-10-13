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


    s += '<h1 class="center-text">Ändra parametrar</h1>';
    s += '<br>';

    s += '<div class="main-content" style="margin: auto 20%;">';
    s += '<h3>Uppgifter till SHL</h3>'
    s += '<label>Namn:</label>';
    s += '<input type="text" class="form-control" id="txtShlName" maxlength="32" value="' + Parametrar.Namn + '" required>';
    s += '<br>'
 

    s += '<label>Telefon:</label>';
    s += '<input type="text" class="form-control" id="txtShlPhone" maxlength="16" value="' + Parametrar.Telefon + '"required>';
    s += '<br>'

    s += '<label>Org-nr:</label>';
    s += '<input type="text" class="form-control" id="txtShlOrg" maxlength="32" value="' + Parametrar.Orgnr + '" required>';

    s += '<br>'

    s += '<label>Adress:</label>';
    s += '<input type="text" class="form-control" id="txtShlAdress" maxlength="32" value="' + Parametrar.Adress + '" required>';
    s += '<br>'

    s += '<label>Postadress:</label>';
    s += '<input type="text" class="form-control" id="txtShlPostadress" maxlength="32" value="' + Parametrar.Postadress + '" required>';
    s += '<br>'

    s += '<label>Postnummer:</label>';
    s += '<input type="text" class="form-control" id="txtShlPostnr" maxlength="32" value="' + Parametrar.Postnr + '" required>';
    s += '<br>'

    s += '<h3>Uppgifter till domarchef</h3>';

    s += '<br>';
    s += '<label>Namn:</label>';
    s += '<input type="text" class="form-control" id="txtChefNamn" maxlength="32" value="' + Parametrar.Domarchef + '" required>';

    s += '<br>'

    s += '<label>Telefon:</label>';
    s += '<input type="text" class="form-control" id="txtChefMobil" maxlength="16" value="' + Parametrar.Mobil + '" required>';

    s += '<br>'

    s += '<label>E-post:</label>';
    s += '<input type="text" class="form-control" id="txtChefEpost" maxlength="128" value="' + Parametrar.Epost + '" required>';

    s += '<br>'
 
    s += '<div class="text-center"><button type="button" class="btn btn-primary" onclick="changeparametrar()">Genomför ändringen</button>';
    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    s += '<button type="button" class="btn btn-primary" onclick="mittkonto()">Till mitt konto</button></div>';

    s += '<br>'
    s += '<br>'
    s += '<br>'
    s += '<br>'
 
    s += '</div>';

    document.getElementById('c_side').innerHTML = s;
    document.getElementById('txtShlName').focus();

    
    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

}

function mittkonto(){
    window.open('mittkonto.php', '_self');
}


function changeparametrar(){

    var Andrad = false;
    var validEmail = false;


    var ShlNamn = rensatoDB(document.getElementById('txtShlName').value.trim());
    if(ShlNamn != Parametrar.Namn)
        Andrad = true;
    if (!ShlNamn){
    document.getElementById('txtShlName').focus();
	alert('Namn till SHL saknas.');
	return;
    }

      var ShlAdress = rensatoDB(document.getElementById('txtShlAdress').value.trim());
    if(ShlAdress != Parametrar.Adress)
        Andrad = true;
    if (!ShlAdress){
    document.getElementById('txtShlAdress').focus();
    alert('Adress saknas till SHL.');
    return;
    }

    var ShlPhone = rensatoDB(document.getElementById('txtShlPhone').value.trim());
    if(ShlPhone != Parametrar.Telefon)
        Andrad = true;
    if (!ShlPhone){
	document.getElementById('txtShlPhone').focus();
	alert('Telefon-nummer saknas till SHL.');
	return;
    }

    var ShlOrg = rensatoDB(document.getElementById('txtShlOrg').value.trim());
     if(ShlOrg != Parametrar.Orgnr)
        Andrad = true;
    if (!ShlOrg){
	document.getElementById('txtShlOrg').focus();
	alert('Organisationsnummer till shl saknas.');
	return;
    }

    var ShlPostadress  = rensatoDB(document.getElementById('txtShlPostadress').value.trim());
      if(ShlPostadress != Parametrar.Postadress)
        Andrad = true;
    if (!ShlPostadress){
    document.getElementById('txtShlPostadress').focus();
    alert('Postadress till shl saknas.');
    return;
    }

    var ShlPostnr = rensatoDB(document.getElementById('txtShlPostnr').value.trim());
      if(ShlPostnr != Parametrar.Postnr)
        Andrad = true;
    if (!ShlPostnr){
    document.getElementById('txtShlPostnr').focus();
    alert('Postnummer till shl saknas.');
    return;
    }

    var ChefNamn = rensatoDB(document.getElementById('txtChefNamn').value.trim());
      if(ChefNamn != Parametrar.Domarchef)
        Andrad = true;
    if (!ChefNamn){
    document.getElementById('txtChefNamn').focus();
    alert('Namn till domarchef saknas');
    return;
    }

    var ChefMobil = rensatoDB(document.getElementById('txtChefMobil').value.trim());
      if(ChefMobil != Parametrar.Mobil)
        Andrad = true;
    if (!ChefMobil){
    document.getElementById('txtChefMobil').focus();
    alert('Mobilnummer till domarchef saknas.');
    return;
    }

    var ChefEpost = rensatoDB(document.getElementById('txtChefEpost').value.trim());
      if(ChefEpost != Parametrar.Epost)
        Andrad = true;
    if (!ChefEpost){
    document.getElementById('txtChefEpost').focus();
    alert('Epost till domarchef saknas.');
    return;
    }

var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 var res = re.test(ChefEpost);

 if(res == false)
    alert("Email-adressen för domarchef är ogiltigt formaterad.");
else
    validEmail = true;


   if(Andrad){

    var instring  = '{"ShlNamn": "' + ShlNamn    + '", ';
    instring     += '"ShlTelefon": "'  + ShlPhone + '",';
    instring     += '"ShlOrg": "'  + ShlOrg + '",';
    instring     += '"ShlAdress": "'   + ShlAdress + '",';
    instring     += '"ShlPostnr": "'  + ShlPostnr + '",';
    instring     += '"ShlPostadress": "'  + ShlPostadress + '",';
    instring     += '"Chefnamn": "'  + ChefNamn + '",';
    instring     += '"ChefMobil": "'  + ChefMobil + '",';
    instring     += '"ChefEpost": "'  + ChefEpost + '"}';

  console.log(instring);

    var js_objekt = JSON.parse(instring);

    $.getJSON( "ajax/parametrar.php", js_objekt)
        .done(function(data) {
	    changeparametrar_success(data);
	})
        .fail(function() {
	    changeparametrar_fail();
	})
        .always(function() {

	});

}else{
    alert("Formuläret är oförändrat");
}
}

function changeparametrar_success(response){

   if (response.status == 'Error'){
	alert('Ändringen kunde inte genomföras på grund av ett oförutsägbar fel!');

    } else if (response.status == 'OK'){

	 alert("Ändringarna är nu sparat.");

    } else {
	alert("Ett oförutsett fel har uppstått!");
    }
}

function changeparametrar_fail(response){
    alert('Ändringen kunde inte genomföras på grund av ett oförutsägbart fel!');
}

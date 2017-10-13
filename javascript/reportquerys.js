//Javascript File


initiera();


function initiera(){

    var s = '<div class="col-md-1 col-xs-1"></div>';
    s += '<div id="c_side" class="col-md-10 col-xs-10"></div>';
    s += '<div class="col-md-1 col-xs-1"></div>';

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


    s += '<br>';
    s += '<br>';
    s += '<h1 class="center-text">Rapportfrågor</h1>';


    s += '<div class="class="main-content" style="margin: auto 0%;">';
    // Tabellen
    s += '<br>';
    s += '<div id="div_tabell"></div>';
    s += '<br>';
    s += '<div id="div_knappar"></div>';
  
    s += '</div>';
    s += '<br>'
    s += '<br>'
    s += '<br>'

    document.getElementById('c_side').innerHTML = s;

    
    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

        
    visa_querys();
    visa_knappar();

}

function visa_knappar(){
    var s = '<div class="text-center"><button type="button" class="btn btn-primary" onclick="lagg_till()">Lägg till ny fråga</button>&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-info" onclick="tillbaka()">Till Mitt konto</button></div>';
    document.getElementById('div_knappar').innerHTML = s;
}

function dolj_knappar(){

    document.getElementById('div_knappar').innerHTML = '';
}

function tillbaka(){
    window.open('mittkonto.php', '_self');
}

function visa_querys(){
    
    var s = '<table class="table">';
    s += '<caption>Totalt ' + Querylista.Query.length + ' frågor funna</caption>' ;
    s += '<thead>';
    s += '<tr>';
    s += '<th>ID</th>';
    s += '<th>Fråga</th>';
    s += '<th>Ändra</th>';
    s += '<th>Radera</th>';
    s += '</tr>';
    s += '</thead>';
    s += '<tbody>';

    
    for (var i = 0; i < Querylista.Query.length; i++){

	s += '<tr style="cursor:default;">';
	// QueryID
	s += '<td>' + Querylista.Query[i].QueryID + '</td>';

	// Query
	s += '<td>' + Querylista.Query[i].Query + '</td>';

	// Ändra
	s += '<td><button type="button" class="btn-xs btn-primary" onclick="change_query(' + String(i) + ')">';
	s += 'Ändra</button></td>';

	// Radera
	s += '<td><button type="button" class="btn-xs btn-primary" onclick="delete_query(' + String(i) + ')">';
	s += 'Radera</button></td>';

	s += '</tr>';
    }
    s += '</tbody>';
    s += '</table>';


    document.getElementById('div_tabell').innerHTML = s;
	
}

function tillbaka(){
    window.open('mittkonto.php', '_self');
}

function lagg_till(){
    dolj_knappar();

    var s = '<label>ID</label><input type="text" class="form-control" maxlength="2" id="txtQueryID" value="">';
    s += '<label>Fråga</label><input type="text" class="form-control" maxlength="255" id="txtQuery" value="">';

    s += '<br><br>';
    s += '<div class="text-center"><button type="button" class="btn btn-primary" onclick="add_query()">Lägg till frågan</button>&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-primary" onclick="visa_knappar()">Tillbaka</button></div>';
    document.getElementById('div_knappar').innerHTML = s;
    document.getElementById('txtQueryID').focus();

}

function add_query(){
    var queryID = rensatoDB(document.getElementById('txtQueryID').value.trim());
    if (!queryID){
	alert("Frågans ID saknas!");
	document.getElementById('txtQueryID').focus();
	return;
    }

    var query = rensatoDB(document.getElementById('txtQuery').value.trim());
    if (!query){
	alert("Frågan saknas!");
	document.getElementById('txtQuery').focus();
	return;
    }

    if (IDexist(queryID)){
	alert("Denna ID finns redan! Använd ett annat ID");
	document.getElementById('txtQueryID').focus();
	return;
    }
	
    var instring ='{"QueryID": ' + queryID + ', ';
    instring    +='"Query": "'   + query + '"}';
    
    var js_objekt = JSON.parse(instring);

    $.getJSON("ajax/add_query.php", js_objekt)
        .done(function(data) {
	    add_query_success(data);
	})
        .fail(function() {
	    add_query_fail();
	})
        .always(function() {

	});

}

function add_query_success(response){

    if (response.status == 'Error'){
	alert("Registrering av frågan har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbadministratören.");

    } else if (response.status == 'OK'){
	window.open("reportquerys.php", "_self");
    } else {
	alert("Oförutsett fel har inträffat!");
    }
}

function add_query_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}
    
function change_query(i){
    dolj_knappar();
    var s = '<input type="text" class="form-control" maxlength="255" id="txtQuery" value="' + Querylista.Query[i].Query + '">';

    s += '<br><br>';
    s += '<div class="text-center"><button type="button" class="btn btn-primary" onclick="save_query(' + String(i) + ')">Spara fråga</button>&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-primary" onclick="visa_knappar()">Tillbaka</button></div>';
    document.getElementById('div_knappar').innerHTML = s;
    document.getElementById('txtQuery').focus();
}

function save_query(i){

    var query = rensatoDB(document.getElementById('txtQuery').value.trim());
    if (!query){
	alert("Det finns ingen fråga att spara!");
	document.getElementById('txtQuery').focus();
	return;
    }
    
    var instring ='{"QueryID": ' + Querylista.Query[i].QueryID + ', ';
    instring    +='"Query": "'   + query + '"}';
    
    var js_objekt = JSON.parse(instring);


    $.getJSON("ajax/update_query.php", js_objekt)
        .done(function(data) {
	    save_query_success(data);
	})
        .fail(function() {
	    save_query_fail();
	})
        .always(function() {

	});
}

function save_query_success(response){

    if (response.status == 'Error'){
	alert("Ändring av frågan har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbadministratören.");

    } else if (response.status == 'OK'){
	window.open("reportquerys.php", "_self");
    } else {
	alert("Oförutsett fel har inträffat!");
    }
}

function save_query_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}


function delete_query(i){
    var tmp = "Frågan med ID " + Querylista.Query[i].QueryID + " kommer att raderas.";
    var r = confirm(tmp);
    if (r == false) return;

        
    var instring ='{"QueryID": ' + Querylista.Query[i].QueryID + '}';

    var js_objekt = JSON.parse(instring);


    $.getJSON("ajax/delete_query.php", js_objekt)
        .done(function(data) {
	    delete_query_success(data);
	})
        .fail(function() {
	    delete_query_fail();
	})
        .always(function() {

	});

}

function delete_query_success(response){

    if (response.status == 'Error'){
	alert("Borttagning av frågan har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbadministratören.");

    } else if (response.status == 'OK'){
	window.open("reportquerys.php", "_self");
    } else {
	alert("Oförutsett fel har inträffat!");
    }
}

function delete_query_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}

function IDexist(queryID){

    for (var i = 0; i < Querylista.Query.length; i++){

	if (queryID == Querylista.Query[i].QueryID){
	    return true;
	}
    }

    return false;

}

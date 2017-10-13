//Javascript File

var Rapportlista = new Array();
var old_color    = '';
var old_i        = -1;
var old_kolumn   = -1;

var MatchlistaIndex = -1;
var RapportVisas    = -1;
var curr_kolumn     = -1;
var curr_DomarID    = -1;
var curr_GameId     = -1;


initiera();


function initiera(){

    var s = '<div class="col-md-1 col-xs-0"></div>';
    s += '<div id="c_side" class="col-md-10 col-xs-12"></div>';
    s += '<div class="col-md-1 col-xs-0"></div>';

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


    s += '<h1 class="center-text">Mina matcher</h1>';
    s += '<br>';


    s += '<div class="class="main-content" style="margin: auto 0%;">';

    s += '<div class="text-center">';
    // Fr.o.m. datum
    s += '<label>Fr.o.m.:</label>';
    s +='<input type="text" id="txtFromDate" maxlength="10" value="' + FromDate + '"/>';

    // T.o.m. datum
    s += '&nbsp;&nbsp;<label>T.o.m.:</label>';
    s +='<input type="text" id="txtToDate" value="' + ToDate + '"/>';

    //Bearbeta
    s += '&nbsp;&nbsp;&nbsp;';
    s += '<button type="button" class="btn-md btn-primary" onclick="bearbeta()">Bearbeta</button>';
    s += '</div>';

    // Rapporten
    s += '<br>';
    s += '<label id="rapportrubrik">Matchrapport</label>';
    s += '<div class="well" id="div_rapport"></div>';

    // Tabellen
    s += '<br><br>';
    s += '<div id="div_tabell"></div>';
    s += '<br>';
    s += '<div class="text-center"><button type="button" class="btn btn-primary" onclick="tillbaka()">Till Mitt konto</button></div>';

    s += '</div>';
    s += '<br>';
    s += '<br>';
    s += '<br>';

    document.getElementById('c_side').innerHTML = s;


    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;


    visa_matcher();

}

function tillbaka(){
    window.open('mittkonto.php', '_self');
}

function visa_matcher(){

    var s = '<table id="mintabell" class="table">';
    s += '<caption>Totalt ' + Matchlista.Match.length + ' matcher funna</caption>' ;
    s += '<thead>';
    s += '<tr>';
    s += '<th>Datum</th>';
    s += '<th>Match</th>';
    s += '<th>HD1</th>';
    s += '<th>HD2</th>';
    s += '<th>LD1</th>';
    s += '<th>LD2</th>';
    s += '<th>Arena</th>';
    s += '</tr>';
    s += '</thead>';
    s += '<tbody>';



    for (var i = 0; i < Matchlista.Match.length; i++){

        MatchlistaIndex = i;

	      s += '<tr style="cursor:default;">';
	      // Datum
	      s += '<td title="' + Matchlista.Match[i].GameId + '">' + Matchlista.Match[i].Date.substr(0,16) + '</td>';

	      // Match
	      var tmp1 = Matchlista.Match[i].HomeCode + '-' + Matchlista.Match[i].AwayCode;
	      var tmp2 = Matchlista.Match[i].HomeName + '-' + Matchlista.Match[i].AwayName;
	      s += '<td title="' + tmp2 + '">' + tmp1 + '</td>';

	      // HD1
	      if (Matchlista.Match[i].HD1 > 0){
	          s += '<td id="cell' + String(i) + '1" onclick="visa_rapport(' + MatchlistaIndex + ',1)" style="cursor:pointer;">' +  getDomare(Matchlista.Match[i].HD1) + '</td>';
	      } else {
	          s += '<td id="cell' + String(i) + '1" style="cursor:default;">' +  getDomare(Matchlista.Match[i].HD1) + '</td>';
	      }

	      // HD2
	      if (Matchlista.Match[i].HD2 > 0){
	          s += '<td id="cell' + String(i) + '2" onclick="visa_rapport(' + MatchlistaIndex + ',2)" style="cursor:pointer;">' +  getDomare(Matchlista.Match[i].HD2) + '</td>';
	      } else {
	          s += '<td id="cell' + String(i) + '2" style="cursor:default;">' +  getDomare(Matchlista.Match[i].HD2) + '</td>';
	      }

	      // LD1
	      if (Matchlista.Match[i].LD1 > 0 ){
	          s += '<td id="cell' + String(i) + '3" onclick="visa_rapport(' + MatchlistaIndex + ',3)" style="cursor:pointer;">' +  getDomare(Matchlista.Match[i].LD1) + '</td>';
	      } else {
	          s += '<td id="cell' + String(i) + '3" style="cursor:default;">' +  getDomare(Matchlista.Match[i].LD1) + '</td>';
	      }

	      // LD2
	      if (Matchlista.Match[i].LD2 > 0 ){
	          s += '<td id="cell' + String(i) + '4" onclick="visa_rapport(' + MatchlistaIndex + ',4)" style="cursor:pointer;">' +  getDomare(Matchlista.Match[i].LD2) + '</td>';
	      } else {
	          s += '<td id="cell' + String(i) + '4" style="cursor:default;">' +  getDomare(Matchlista.Match[i].LD2) + '</td>';
	      }


	      // Arena
	      s += '<td>' +  Matchlista.Match[i].Arena + '</td>';

	      s += '</tr>';
    }

    s += '</tbody>';
    s += '</table>';

    document.getElementById('div_tabell').innerHTML = s;

    for (i = 0; i < Matchlista.Match.length; i++){
	      // HD1
        var id = 'cell' + String(i) + '1';
	      var X = document.getElementById(id);
	      X.bgColor = Matchlista.Match[i].HD1color;

	      //HD2
	      id = 'cell' + String(i) + '2';
	      X = document.getElementById(id);
	      X.bgColor = Matchlista.Match[i].HD2color;

	      //LD1
	      id = 'cell' + String(i) + '3';
	      X = document.getElementById(id);
	      X.bgColor = Matchlista.Match[i].LD1color;

	      //LD2
	      id = 'cell' + String(i) + '4';
	      X = document.getElementById(id);
	      X.bgColor = Matchlista.Match[i].LD2color;
    }
}

function visa_rapport(MatchlistaIndex,kolumn){

    if (RapportVisas == 1){
        alert("Du måste först stänga nuvarande rapport genom att spara eller lämna den.");
        return;
    }


    curr_GameId  = Matchlista.Match[MatchlistaIndex].GameId;
    curr_kolumn  = kolumn;
    curr_DomarID = -1;
    if (curr_kolumn == 1){
        curr_DomarID = Matchlista.Match[MatchlistaIndex].HD1;
    } else if (curr_kolumn == 2){
        curr_DomarID = Matchlista.Match[MatchlistaIndex].HD2;
    } else if (curr_kolumn == 3){
        curr_DomarID = Matchlista.Match[MatchlistaIndex].LD1;
    } else if (curr_kolumn == 4){
        curr_DomarID = Matchlista.Match[MatchlistaIndex].LD2;
    }


    //console.log("visa_rapport-curr_GameId  ="+ curr_GameId);
    //console.log("visa_rapport-curr_kolumn  ="+ curr_kolumn);
    //console.log("visa_rapport-curr_DomarID ="+ curr_DomarID);


    var id = 'cell' + String(old_i) + String(old_kolumn);
    var X = document.getElementById(id);

    if (old_i != -1){
	      X.bgColor = old_color;
    }

    old_i = MatchlistaIndex;
    old_kolumn = curr_kolumn;
    id = 'cell' + String(MatchlistaIndex) + String(curr_kolumn);
    X = document.getElementById(id);
    old_color = X.bgColor;


    X.bgColor = "CornflowerBlue";


    var instring ='{"GameId": "' + curr_GameId       + '", ';
    instring += '"DomarID": "'   + curr_DomarID + '"}';
    //console.log("visa_rapport-hämtar information för GameId="+ curr_GameId + " och domarID="+curr_DomarID);

    var js_objekt = JSON.parse(instring);


    $.getJSON("ajax/hamta_coachrapport.php", js_objekt)
        .done(function(data) {
	          visa_rapport_success(data);
	})
        .fail(function() {
	          visa_rapport_fail();
	})
        .always(function() {

	});

}

function visa_rapport_success(response){

    Rapportlista = response;

    if (Rapportlista.status == 'Error'){
	      alert("Hämtning av rapporten har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbadministratören.");
    } else if (Rapportlista.status == 'OK'){
	      visa_rapporten();
    } else {
	      alert("Oförutsett fel har inträffat!");
    }
}

function visa_rapport_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}


function visa_rapporten(){

    var s = '';
    for (i = 0; i < Rapportlista.Query.length; ++i){
	      s += '<b>' + Rapportlista.Query[i].Query + '</b>';
	      s += '<br>';
	      var tmp = 'txtAnswer' + String(i);
	      s += '<textarea id="' + tmp + '" rows="4" class="form-control" style="min-width: 100%">';
	      if (Rapportlista.Answer.length > 0){
	          s += Rapportlista.Answer[i].Answer;
	      }
	      s += '</textarea>';

	      s += '<br>';
    }

    s += '<br>';
    s += '<b>Betyg: </b>';

    s += '<label><input type="radio" class="radio-inline" name="betyg" value="1"';
    if (Rapportlista.Betyg == 1){
	      s += ' checked';
    }
    s += '> <b>1</b></label>';

    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="radio" class="radio-inline" name="betyg" value="2"';
    if (Rapportlista.Betyg == 2){
	      s += ' checked';
    }
    s += '> <b>2</b></label>';

    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="radio" class="radio-inline" name="betyg" value="3"';
    if (Rapportlista.Betyg == 3){
	      s += ' checked';
    }
    s += '> <b>3</b></label>';

    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="radio" class="radio-inline" name="betyg" value="4"';
    if (Rapportlista.Betyg == 4){
	      s += ' checked';
    }
    s += '> <b>4</b></label>';

    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="radio" class="radio-inline" name="betyg" value="5"';
    if (Rapportlista.Betyg == 5){
	      s += ' checked';
    }
    s += '> <b>5</b></label>';

    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="radio" class="radio-inline" name="betyg" value="6"';
    if (Rapportlista.Betyg == 6){
	      s += ' checked';
    }
    s += '> <b>6</b></label>';

    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="radio" class="radio-inline" name="betyg" value="7"';
    if (Rapportlista.Betyg == 7){
	      s += ' checked';
    }
    s += '> <b>7</b></label>';

    // Publicera
    s += '<br><br><b>Publicera: </b>';
    s += '<input type="checkbox" id="cbPublicera"';
    if (Rapportlista.Publicera == 'J'){
	      s += ' checked="checked"';
    }
    s += '>';

    s += '<br>';
    s += '<div class="text-center"><button type="button" class="btn btn-primary" onclick="spara()">Spara</button>';
    s += '&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-primary" onclick="lamna()">Lämna rapporten</button></div>';



    document.getElementById('div_rapport').innerHTML = s;
    document.getElementById('txtAnswer0').focus();

    tmp = 'Matchrapport för domaren ' + getDomare(curr_DomarID) + ' och matchen ' + Matchlista.Match[MatchlistaIndex].HomeName + '-' + Matchlista.Match[MatchlistaIndex].AwayName;

    document.getElementById('rapportrubrik').innerHTML = tmp;

    RapportVisas = 1;
}

function lamna(){
    document.getElementById('div_rapport').innerHTML = '';
    document.getElementById('rapportrubrik').innerHTML = 'Matchrapport';
    RapportVisas = -1;
}

function spara(){

    for (i = 0; i < Rapportlista.Query.length; ++i){
	      var tmp = 'txtAnswer' + String(i);
	      var tmp2 = rensatoDB(document.getElementById(tmp).value.trim());

	      if (!tmp2){
	          alert("Svar saknas!");
	          document.getElementById(tmp).focus();
	          return;
	      }
    }


    var X = document.getElementsByName('betyg');
    var Betyg = '';
    for (i = 0; i < X.length; i++){
	      if (X[i].checked){
	          Betyg = X[i].value;
	      }
    }
    if (Betyg == ''){
	      alert("Betyg saknas!");
	      return;
    }

    var Publicera = '';
    if (document.getElementById('cbPublicera').checked){
	      Publicera = 'J';
    }

    var instring ='{"GameId": "' + curr_GameId  + '", ';
    instring += '"DomarID": "'   + curr_DomarID + '", ';
    instring += '"Betyg": "'     + Betyg        + '", ';
    instring += '"Publicera": "' + Publicera    + '", ';
    instring += '"Answer": [';
    for (i = 0; i < Rapportlista.Query.length; ++i){
	      if (i > 0){
	          instring += ', ';
	      }
	      tmp = 'txtAnswer' + String(i);
	      instring += '{"QueryID": ' + String(i+1) + ', "Answer": "' + rensatoDB(document.getElementById(tmp).value.trim()) + '"}';
	      //instring += '{"QueryID": ' + String(i+1) + ', "Answer": "' + document.getElementById(tmp).value + '"}';
    }
    instring += ']}';

    var js_objekt = JSON.parse(instring);


    $.getJSON("ajax/spara_coachrapport.php", js_objekt)
        .done(function(data) {
	    spara_success(data,Publicera);
	})
        .fail(function() {
	    spara_fail();
	})
        .always(function() {

	});

}

function spara_success(response,Publicera){

    Rapportlista = response;

    if (Rapportlista.status == 'Error'){
	      alert("Registrering av rapporten har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbadministratören.");

    } else if (Rapportlista.status == 'OK'){
	      // Sätt rätt färg på aktuell tabellcell
	      var id = 'cell' + String(MatchlistaIndex) + String(curr_kolumn);
	      var X = document.getElementById(id);
	      if (Publicera == 'J'){
	          X.bgColor = "DarkSeaGreen";
	      } else {
	          X.bgColor = "Yellow";
	      }
	      old_color = X.bgColor;
    } else {
	      alert("Oförutsett fel har inträffat!");
    }

	  lamna();
}

function spara_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}


function getDomare(domarID){
    var svar = '';
    for (var i = 0; i < Domarlista.Domare.length; ++i){
	      if (Domarlista.Domare[i].JerseyNo == domarID){
	          svar = Domarlista.Domare[i].LastName + ', ' + Domarlista.Domare[i].FirstName;
	          return svar;
	      }
    }
    return svar;
}

function bearbeta(){

    lamna();

    var FromDate = rensatoDB(document.getElementById('txtFromDate').value.trim());
    document.getElementById('txtFromDate').value = FromDate;
    if (!FromDate){
	      alert("Från och med datum saknas.");
	      document.getElementById('txtFromDate').focus();
	      return;
    }
    FromDate = FromDate + ' 00:00:00';


    var ToDate = rensatoDB(document.getElementById('txtToDate').value.trim());
    document.getElementById('txtToDate').value = ToDate;
    if (!ToDate){
	      alert("Till och med datum saknas.");
	      document.getElementById('txtToDate').focus();
	      return;
    }
    ToDate = ToDate + ' 23:59:59';


    if (FromDate > ToDate){
	      alert("Från och med datumet är större än till och med datumet");
	      document.getElementById('txtFromDate').focus();
	      return;
    }

    var instring ='{"FromDate": "' + FromDate + '", ';
    instring += '"ToDate": "' + ToDate + '"}';


    var js_objekt = JSON.parse(instring);

    $.getJSON("ajax/hamta_minamatcher.php", js_objekt)
        .done(function(data) {
	          bearbeta_success(data);
	})
        .fail(function() {
	          bearbeta_fail();
	})
        .always(function() {

	});

}

function bearbeta_success(response){

    Matchlista = response;

    if (Matchlista.status == 'Error'){
	      alert("Hämtning av matcher har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbadministratören.");

    } else if (Matchlista.status == 'OK'){
	      visa_matcher();
    } else {
	      alert("Oförutsett fel har inträffat!");
    }
}

function bearbeta_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}



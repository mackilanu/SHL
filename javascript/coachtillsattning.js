//Javascript File

var Matchlista   = new Array();
var LedigaDomare = new Array();
var Old_JerseyNo = -1;

var Dagens       = '';
var Inaktiv      = false;



initiera();


function initiera(){

    Dagens = getDagens();

    var s = '<div class="col-md-0 col-xs-0"></div>';
    s += '<div id="c_side" class="col-md-12 col-xs-12"></div>';
    s += '<div class="col-md-0 col-xs-0"></div>';

    document.getElementById('div_container').innerHTML = s;

    visa_sidan();
    visa_foten();
}

 $( function() {
    $( "#txtFromDate" ).datepicker( {dateFormat: 'yy-mm-dd' });
  } );


 $( function() {
    $( "#txtToDate" ).datepicker( {dateFormat: 'yy-mm-dd' });
  } );

function CheckDate(){

     var from = document.getElementById("txtFromDate").value;
     var tom  = document.getElementById("txtToDate").value;

     if(tom == "")
     	return;

     if(tom < from)
        alert("From kan inte vara större än Tom ");

}


function visa_sidan(){

    var s = '<div class="col-md-6 col-xs-6 right-header">';
    s += '<a href="mittkonto.php"><img src="Images/SHL-logo.jpg" alt="SHL" class="logo" style="width:80%;"></a></div>';


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


    s += '<h1 class="center-text">Domarcoachtillsättning</h1>';
    s += '<br>';

    s += '<div class="class="main-content" style="margin: auto 0%;">';


    if (Domarlista.status == 'Error'){
	s += '<br>';
	s += 'Ett fel har förhindrat sidans normala uppbyggnad. Vid upprepade fel kontakta webbadministratören.';

    } else {

	// Fr.o.m. datum
	s += '<label>From:</label>';
	s +='<input type="text" id="txtFromDate" onchange="CheckDate()" value=""/>';

	// T.o.m. datum
	s += '&nbsp;<label>Tom:</label>';
	s +='<input type="text" id="txtToDate" onchange="CheckDate()" value=""/>';

	// Urval
	s += '&nbsp;<label>Vilka matcher ska hämtas:</label>';
	s += '<select id="cbUrval" onchange="hamta_matcher()">';
	s += '<option>Välj matcher</option>';
	s += '<option>Alla matcher i datumintervallet</option>';
	s += '<option>Ej tillsatta matcher</option>';
	s += '<option>Ej eller delvis tillsatta matcher</option>';
	s += '<option>Matcher med tillsättningskommentar</option>';
	s += '</select>';

	// Tom div
	s += '<div id="div_result"></div>';
    }

    s += '<br>';
    s += '<br>';
    s += '<br>';

    s += '<div id="div_buttons" class="text-center"><button type="button" class="btn btn-primary" onclick="tillbaka()">Till Mitt konto</button></div>';

    s += '</div>';
    s += '<br>';
    s += '<br>';
    s += '<br>';

    document.getElementById('c_side').innerHTML = s;
    document.getElementById("txtFromDate").value = Dagens;



    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

    // document.getElementById('txtFromDate').focus();
}

function tillbaka(){
    window.open('mittkonto.php', '_self');
}

function hamta_matcher(){

    var UrvalIndex = document.getElementById('cbUrval').selectedIndex;
    if (UrvalIndex == 0){
	document.getElementById('div_result').innerHTML = '';
	return;
    }


    var FromDate = rensatoDB(document.getElementById('txtFromDate').value.trim());
    document.getElementById('txtFromDate').value = FromDate;
    if (!FromDate){
	alert("Från och med datum saknas.");
	document.getElementById('cbUrval').selectedIndex = 0;
	document.getElementById('txtFromDate').focus();
	return;
    }
    FromDate = FromDate + ' 00:00:00';


    var ToDate = rensatoDB(document.getElementById('txtToDate').value.trim());
    document.getElementById('txtToDate').value = ToDate;
    if (!ToDate){
	alert("Till och med datum saknas.");
	document.getElementById('cbUrval').selectedIndex = 0;
	document.getElementById('txtToDate').focus();
	return;
    }
    ToDate = ToDate + ' 23:59:59';


    // Här måste det kontrolleras att det finns riktiga datum för säsongen
    // som sträcker sig från och med Season-08-01 till och med (Season+1)-07-31
    // samt att ToDate >= FromDate

    var instring ='{"UrvalIndex": ' + String(UrvalIndex) + ', ';
    instring += '"FromDate": "' + FromDate + '", ';
    instring += '"ToDate": "' + ToDate + '"}';


    var js_objekt = JSON.parse(instring);

    $.getJSON("ajax/hamta_matcher.php", js_objekt)
        .done(function(data) {
	    hamta_matcher_success(data);
	})
        .fail(function() {
	    hamta_matcher_fail();
	})
        .always(function() {

	});

}

function hamta_matcher_success(response){

    Matchlista = response;

    if (Matchlista.status == 'Error'){
	      alert("Hämtning av matcher har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbadministratören.");

    } else if (Matchlista.status == 'Inga matcher'){
	      alert("Det finns inga matcher inom denna tidsperiod.");
	      document.getElementById('cbUrval').selectedIndex = 0;	
    } else if (Matchlista.status == 'OK'){
	      visa_matcher();

    } else {
	      alert("Oförutsett fel har inträffat!");
    }
}

function hamta_matcher_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}

function visa_matcher(){
    var s = '<div id="myModal" class="modal">';
    // Modal content
    s += '<div class="modal-content">';

    s += '<div class="modal-header">';
    //s += '<span class="close">&times;</span>';
    s += '<h4>refmanagment</h4>';
    s += '<h5>T. Pavlidis - NitsaSoft in Sweden AB</h5>';
    s += '</div>';

    s += '<div id="div_modal_body" class="modal-body">';
    s += '</div>';

    s += '<div class="modal-footer">';
    s += '<h5>Marcus Andresson - IT gymnasiet i Karlstad</h5>';
    s += '</div>';

    s += '</div>';
    s += '</div>';


    s += '<table class="table">';
    s += '<caption>Totalt ' + Matchlista.Match.length + ' matcher funna</caption>' ;
    s += '<thead>';
    s += '<tr>';
    s += '<th>Datum</th>';
    s += '<th>Match</th>';
    s += '<th>HD1</th>';
    s += '<th>HD2</th>';
    s += '<th>LD1</th>';
    s += '<th>LD2</th>';
    s += '<th>Coach</th>';
    s += '<th>Publicera</th>';
    s += '<th>Kommentar</th>';
    s += '</tr>';
    s += '</thead>';
    s += '<tbody>';


    for (var i = 0; i < Matchlista.Match.length; i++){
	      Inaktiv = false;
	      if (Matchlista.Match[i].Date < Dagens) Inaktiv = true;


	      s += '<tr style="cursor:default;">';
	      // Datum
	      var tmp = Matchlista.Match[i].Arena + '-' + Matchlista.Match[i].GameType;
	      s += '<td title="' + tmp + '">' + Matchlista.Match[i].Date + '</td>';

	      // Match
	      var tmp1 = Matchlista.Match[i].HomeCode + '-' + Matchlista.Match[i].AwayCode;
	      var tmp2 = Matchlista.Match[i].HomeName + '-' + Matchlista.Match[i].AwayName;
	      s += '<td title="' + tmp2 + '">' + tmp1 + '</td>';

	      // HD1
	      var Rad    = i;
	      var Domartyp = 1;
	      var Kolumn   = 1;
	      s += '<td>';
	      if (Matchlista.Match[Rad].HD1){
	          s += getDomare(Matchlista.Match[Rad].HD1);
	      }
	      s += '</td>';

	      // HD2
	      Domartyp = 1;
	      Kolumn   = 2;
	      s += '<td>';
	      if (Matchlista.Match[i].HD2){
	          s += getDomare(Matchlista.Match[Rad].HD2);
	      }
	      s += '</td>';

	      // LD1
	      Domartyp = 2;
	      Kolumn   = 3;
	      s += '<td>';
	      if (Matchlista.Match[i].LD1){
	          s += getDomare(Matchlista.Match[Rad].LD1);
	      }
	      s += '</td>';

	      // LD2
	      Domartyp = 2;
	      Kolumn   = 4;
	      s += '<td>';
	      if (Matchlista.Match[i].LD2){
	          s += getDomare(Matchlista.Match[Rad].LD2);
	      }
	      s += '</td>';

	      // Dcoach
	      Domartyp = 3;
	      Kolumn   = 5;
	      if (!Matchlista.Match[i].Dcoach){
	          s += '<td id="cell' + String(Rad) + '_' + Kolumn + '"><button type="button" class="';
	          if (Matchlista.Match[Rad].Dcoach){
		            s += 'btn btn-primary';
	          } else {
		            s += 'btn btn-warning';
	          }
	          s += '" onclick="tillsatt_coach(' + String(Rad) + ', ' + Domartyp + ',' + Kolumn + ')"';
	          if (Inaktiv) s += ' disabled';
	          if (Matchlista.Match[i].Dcoach){
		            s += ' title="' + getDomare(Matchlista.Match[Rad].Dcoach) + '">';
		            s += Matchlista.Match[Rad].Dcoach;
	          } else {
		            s += '>';
	          }
	          s += 'Tillsätt mig</button></td>';
	      } else {
	          s += '<td>';
	          if (Matchlista.Match[i].Dcoach){
		            s += getDomare(Matchlista.Match[Rad].Dcoach);
	          }
	          s += '</td>';
	      }

	      // PubliceraMatch
	      s += '<td><input type="checkbox" id="chPubl' + String(i) + '"';
	      if (Matchlista.Match[i].PubliceraMatch){
	          s += ' checked';
	      }
	      s += ' disabled';
	      s += '></td>';

	      // Kommentar
	      Kolumn   = 6;
	      s += '<td id="cell' + String(Rad) + '_' + Kolumn + '"><button type="button" class="';
	      if (Matchlista.Match[Rad].Kommentar){
	          s += 'btn btn-primary';
	      } else {
	          s += 'btn btn-warning';
	      }
	      s += '" onclick="visa_kommentar(' + String(Rad) + ')"';
	      if (Matchlista.Match[i].Kommentar){
	          s += ' title="' + Matchlista.Match[Rad].Kommentar + '">';
	      } else {
	          s += '>';
	      }
	      s += 'Kommentar</button></td>';

	      s += '</tr>';
    }
    s += '</tbody>';
    s += '</table>';


    document.getElementById('div_result').innerHTML = s;

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

function tillsatt_coach(index,domartyp,kolumn){

    domarID = logInfo.JerseyNo;

    var instring = '{"GameId": ' + Matchlista.Match[index].GameId + ', ';
    instring += '"kolumn": '     + kolumn                         + ', ';
    instring += '"JerseyNo": '   + domarID                        + '}';

    var js_objekt = JSON.parse(instring);

    $.getJSON("ajax/update_tillsattning.php", js_objekt)
        .done(function(data) {
	          if (domarID == -1) domarID = null;
	          Matchlista.Match[index].Dcoach = domarID;
	          var tmp = logInfo.LastName + ', ' + logInfo.FirstName;
	          var id  = 'cell' + String(index) + '_' + kolumn;
	          document.getElementById(id).innerHTML = tmp;
	      })
        .fail(function() {
	          alert("Tillsättning av domarcoach för denna match har misslyckats. Vid upprepade fel kontakta webbadministratören.");
	      })
        .always(function() {

	});

}

function visa_kommentar(Rad){
    // When the user clicks the button, open the modal
    // Get the modal

    var s = '<br>Kommentar för matchen <b>' + Matchlista.Match[Rad].HomeName + ' - ' + Matchlista.Match[Rad].AwayName + '</b>';
    s += '<br><textarea id="txtKommentar" rows="8" cols="60" style="background-color: Silver">';
    if (Matchlista.Match[Rad].Kommentar){
	      s += Matchlista.Match[Rad].Kommentar;
    }
    s += '</textarea>';
    s += '<br>';

    Inaktiv = false;
    if (Matchlista.Match[Rad].Date < Dagens) Inaktiv = true;
    if (Inaktiv == false){
	      s += '<button type="button" class="btn btn-primary" onclick="sparaKommentar(' + Rad + ')">Spara kommentar</button>&nbsp;&nbsp;&nbsp;&nbsp;';
    }
    s += '<button type="button" class="btn btn-primary" onclick="doljKommentar()">Dölj kommentar</button>';


    document.getElementById('div_modal_body').innerHTML = s;
    document.getElementById('txtKommentar').focus();


    modal = document.getElementById('myModal');


    // Get the button that opens the modal
    var tmp = 'knapp' + Rad;
    btn = document.getElementById(tmp);

    modal.style.display = "block";
/*
    var s = '<br>Kommentar för matchen <b>' + Matchlista.Match[index].HomeName + ' - ' + Matchlista.Match[index].AwayName + '</b>';
    s += '<br><textarea id="txtKommentar" rows="8" cols="60" style="background-color: Silver" disabled>';
    if (Matchlista.Match[index].Kommentar){
	      s += Matchlista.Match[index].Kommentar;
    }
    s += '</textarea>';
    s += '<br>';

    Inaktiv = false;
    if (Matchlista.Match[index].Date < Dagens) Inaktiv = true;
    s += '<button type="button" class="btn btn-primary" onclick="doljKommentar()">Dölj kommentar</button>';

    document.getElementById('div_kommentar').innerHTML = s;
    document.getElementById('txtKommentar').focus();
*/
}

function doljKommentar(){
    modal.style.display = "none";

    //document.getElementById('div_kommentar').innerHTML = '';
}

function aterstall_kommentar(Rad){

    Inaktiv = false;
    if (Matchlista.Match[Rad].Date < Dagens) Inaktiv = true;

    var Kommentar = document.getElementById('txtKommentar').value;
    Matchlista.Match[Rad].Kommentar = Kommentar;

    // Button Kommentar
    Kolumn   = 6;
    var id='cell' + String(Rad) + '_' + Kolumn;
    var s = '<button type="button" class="';
    if (Matchlista.Match[Rad].Kommentar){
	      s += 'btn btn-primary';
    } else {
	      s += 'btn btn-warning';
    }
    s += '" onclick="visa_kommentar(' + String(Rad) + ')"';
    if (Inaktiv) s += ' disabled';
    if (Matchlista.Match[Rad].Kommentar){
	      s += ' title="' + Matchlista.Match[Rad].Kommentar + '">';
    } else {
	      s += '>';
    }
    s += 'Kommentar</button></td>';

    document.getElementById(id).innerHTML = s;

    doljKommentar();
}


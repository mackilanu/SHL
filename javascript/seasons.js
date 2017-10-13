//Javascript File

var Old_LastDate = '';

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


    s += '<h1 class="center-text">Säsonger</h1>';
    s += '<br>';


    s += '<div class="class="main-content" style="margin: auto 20%;">';


    if (Seasonlista.status == "OK"){

	      Old_LastDate = Seasonlista.Season[0].LastDate;

	      s += '<table class="table">';
	      s += '<thead>';
	      s += '<tr>';
	      s += '<th>Säsong</th>';
	      s += '<th>Ledighetsspärr</th>';
	      s += '<th>Publicera</th>';
	      s += '</tr>';
	      s += '</thead>';
	      s += '<tbody>';

	      for (var i = 0; i < Seasonlista.Season.length; i++){
	          if (i > 0){
		            s += '<tr style="cursor:default;">';
		            s += '<td>' +  Seasonlista.Season[i].Season + '</td>';
		            s += '<td>' +  Seasonlista.Season[i].LastDate + '</td>';
		            s += '<td><input id="chAktiv" type="checkbox"';
		            if (Seasonlista.Season[i].publish_posts == 'J'){
		                s += ' checked';
		            }
		            s += ' disabled></td>';
		            s += '</tr>';
	          } else {
		            s += '<tr style="cursor:default;">';
		            s += '<td>' +  Seasonlista.Season[0].Season + '</td>';
		            s += '<td><input type=text id="txtLastDate" value="' +  Seasonlista.Season[0].LastDate + '"></td>';
		            s += '<td><input id="chAktiv" type="checkbox"';
		            if (Seasonlista.Season[0].publish_posts == 'J'){
		                s += ' checked';
		            }
		            s += '></td>';
		            s += '</tr>';
	          }
	      }

	      s += '</tbody>';
	      s += '</table>';
	      s += '<div id="div_resten"></div>';

	      s += '<br>';
	      s += '<br>';

	      s += '<div class="text-center"><button type="button" class="btn btn-primary" onclick="spara()">Spara ändringar</button></div>';
	      s += '<br>';

    } else {
	      s += '<p>Ett fel har förhindrat tillgång till sidan. Vid upprepade fel kontakta webbadminstratören.</p>';

	      s += '<br>';
	      s += '<br>';
    }

    s += '<div class="text-center"><button type="button" class="btn btn-info" onclick="tillbaka()">Till Mitt konto</button></div>';

    s += '</div>';
    s += '<br>';
    s += '<br>';
    s += '<br>';

    document.getElementById('c_side').innerHTML = s;


    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

}


function tillbaka(){
    window.open('mittkonto.php', '_self');
}


function spara(){

    Publish = null;
    if (document.getElementById('chAktiv').checked){
	      Publish = 'J';
    }

    var Datum     = document.getElementById('txtLastDate').value;
    var MinDatum = SeasonDates.MinDatum.substring(0,10);
    var MaxDatum = SeasonDates.MaxDatum.substring(0,10);
    console.log("MinDatum="+MinDatum);
    console.log("MaxDatum="+MaxDatum);
    if (Datum < MinDatum || Datum > MaxDatum){
        var tmp = "Datumet ligger utanför säsongen. Giltiga datum är from " + MinDatum + ", tom " + MaxDatum;
        alert(tmp);
        return;
    }

    var instring  = '{"LastDate": "' + Datum + '", ';
    instring     += '"Publish": "';
    if (Publish){
        instring += Publish;
    }
    instring += '"}';


    var js_objekt = JSON.parse(instring);

    $.getJSON("ajax/update_season.php", js_objekt)
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

    if (response.status == 'Error'){
	      alert("Uppdateringen har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbadministratören.");
    } else {
	      alert("Uppgifterna är nu  sparade i databasen.");
    }

}


function spara_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}


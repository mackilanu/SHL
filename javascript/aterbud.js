//Javascript File

var Aterbudslista  = new Array();
var LastDate       = '';
var curr_season    = 0;
var curr_JerseyNo  = 0;


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
    s += '<br>' + Domartyper[logInfo.Domartyp];
    if (logInfo.Priviledge != logInfo.Domartyp){
	s += ' (' + Domartyper[logInfo.Priviledge] + ')';
    }
    s += '</p>';

    s +='<p id="knapp" class="text-right"></p>';
    s += '</div>';


    s += '<h1 class="center-text">Återbud</h1>';

    s += '<div class="form-group text-center">';


    if (Seasons.status == 'Error' || Userslista.status == 'Error'){
	s += 'Vi kan tyvärr inte lämna denna information just nu på grund av oförutsedda problem.<br><br>Vid upprepade fel kontakta webbadministratören';
    } else {
	      s += bygg_sidan();
    }

    s += '</div>';

    document.getElementById('c_side').innerHTML = s;


    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

}

function bygg_sidan(){

    LastDate = Seasons.Season[0].LastDate;

    var s = '<h4 id="lbl_rubrik" class="center-text">Senaste datum för registrering av ledighet är <b>' + LastDate + '</b>.</h4>';
    s += '<div class="text-center">';

    s += "<br>";
    s += "<div id='upperdiv'>";
    s += '<label>Välj person: &nbsp;&nbsp;</label>';
    s += '<select class="" id="cbDomare" onchange="get_info()">';
    s += '<option value="-1" selected>Välj person</option>';
    s += '<option value="0">ALLA</option>';
    for (var i = 0; i < Userslista.User.length; i++){
	      var Namn = Userslista.User[i].Domartyp + '-' + Userslista.User[i].JerseyNo + '-' + Userslista.User[i].LastName + ', ' + Userslista.User[i].FirstName;
	      s += '<option value="' + Userslista.User[i].JerseyNo + '">' + Namn + '</option>';
    }
    s += '</select>';

    s += '&nbsp;&nbsp;&nbsp;&nbsp;<label>Säsong:&nbsp;&nbsp;</label>';
    s += '<select class="" id="cbSeason" onchange="get_info()">';
    s += "<option value='-1'>Välj säsong</option>";
    for (i = 0; i < Seasons.Season.length; i++){
	      s += '<option';
	      if (i == 0){
	          s += ' selected';
	      }
        s += ' value= ' + Seasons.Season[i].Season + '>' + Seasons.Season[i].Season + '</option>';
    }
    s += '</select>';

    s += "&nbsp;&nbsp;&nbsp;<input type='button' class='btn btn-info' onclick='tillbaka()' value='Till Mitt konto'></input>";

    s += '<div id="div_tabell"></div>';
    s += '<br><br>';
    return s;
}


function get_info(){

    // Domare
    curr_JerseyNo = $("#cbDomare").val();
    if (curr_JerseyNo == -1){
	      rensa_tabell();
	      return;
    }

    // Säsong
    curr_season = $("#cbSeason").val();
    if (curr_season == -1){
	      rensa_tabell();
	      return;
    }


    var instring  = '{"season":' + curr_season + ', "JerseyNo":' + curr_JerseyNo   + '}';

    var js_objekt = JSON.parse(instring);


    $.getJSON("ajax/get_aterbud.php", js_objekt)
        .done(function(data) {
	          get_info_success(data);
	})
        .fail(function() {
	          get_info_fail();
	})
        .always(function() {

	});

}

function tillbaka(){
    window.location.href = "mittkonto.php";
}

function get_info_success(response){

    Aterbudslista = response;

    if (response.status == 'Error'){
	      alert("Läsning av information har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbmaster.");
    } else {
        if (curr_JerseyNo > 0 ){
	          visa_resten();
        } else {
            visa_alla();
        }
    }

}

function get_info_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}

function visa_resten(){

    var Dagens = getDagens();

    var seasonIndex = document.getElementById("cbSeason").selectedIndex;
    seasonIndex -= 1;;

    LastDate = Seasons.Season[seasonIndex].LastDate;
    document.getElementById('lbl_rubrik').innerHTML = 'Senaste datum för registrering av ledighet är <b>' + LastDate + '</b>.';



    var s = '<table class="table">';
    s += '<caption>Totalt ' + Aterbudslista.Dag.length + ' återbud funna</caption>' ;
s += '<thead>';
    s += '<tr>';
    s += '<th>Datum</th>';
    s += '<th>Game</th>';
    s += '<th>Arena</th>';
    s += '<th>Registrerad</th>';
    s += '<th>GameType</th>';
    s += '</tr>';
    s += '</thead>';
    s += '<tbody>';

    for (var i = 0; i < Aterbudslista.Dag.length; i++){

	      s += '<tr style="cursor:default;">';

	      // Datum
	      s += '<td>' + Aterbudslista.Dag[i].Date + '</td>';

	      // Game
	      var tmp = Aterbudslista.Dag[i].HomeCode + ' - ' + Aterbudslista.Dag[i].AwayCode;
	      var thistitel = Aterbudslista.Dag[i].HomeName + ' - ' + Aterbudslista.Dag[i].AwayName;
	      s += '<td title="' + thistitel + '">' + tmp + '</td>';

	      // Arena
	      s += '<td>' + Aterbudslista.Dag[i].Arena + '</td>';

	      // Registrerad
	      thistitel = Aterbudslista.Dag[i].Registrerat_Av;
	      s += '<td title="' + thistitel + '">' + Aterbudslista.Dag[i].Registrerat + '</td>';

	      // GameType
	      if (!Aterbudslista.Dag[i].Level){
	          thistitel = 'Uppgift saknas';
	      } else {
	          thistitel = Aterbudslista.Dag[i].Level;
	      }
	      s += '<td title="' + thistitel + '">' + Aterbudslista.Dag[i].GameType + '</td>';

	      s += '</tr>';

    }

    if (seasonIndex == 0){
        for (i = 0; i < Aterbudslista.Match.length; i++){

	          s += '<tr style="cursor:default;">';

	          // Datum
	          s += '<td>' + Aterbudslista.Match[i].Date + '</td>';

	          // Game
	          tmp = Aterbudslista.Match[i].HomeCode + ' - ' + Aterbudslista.Match[i].AwayCode;
	          thistitel = Aterbudslista.Match[i].HomeName + ' - ' + Aterbudslista.Match[i].AwayName;
	          s += '<td title="' + thistitel + '">' + tmp + '</td>';

	          // Arena
	          s += '<td>' + Aterbudslista.Match[i].Arena + '</td>';

	          // Registrerad
	          s += '<td><button type="button" class="btn-xs btn-primary" onclick="set_aterbud(' + String(i) + ')">Återbud</button></td>';

	          // GameType
	          if (!Aterbudslista.Match[i].Level){
	              thistitel = 'Uppgift saknas';
	          } else {
	              thistitel = Aterbudslista.Match[i].Level;
	          }
	          s += '<td title="' + thistitel + '">' + Aterbudslista.Match[i].GameType + '</td>';

	          s += '<tr>';

        }
    }
    s += '</tbody>';

    s += '</table>';

    s += '<br>';
    s += "<button class='btn btn-info' onclick='tillbaka()'>Till Mitt konto</button>";

    document.getElementById('div_tabell').innerHTML = s;

}

function visa_alla(){

    var Dagens = getDagens();

    var seasonIndex = document.getElementById("cbSeason").selectedIndex;
    seasonIndex -= 1;;

    LastDate = Seasons.Season[seasonIndex].LastDate;
    document.getElementById('lbl_rubrik').innerHTML = 'Senaste datum för registrering av ledighet är <b>' + LastDate + '</b>.';



    var s = '<table class="table">';
    s += '<caption>Totalt ' + Aterbudslista.Dag.length + ' återbud funna</caption>' ;
s += '<thead>';
    s += '<tr>';
    s += '<th>Namn</th>';
    s += '<th>Datum</th>';
    s += '<th>Game</th>';
    s += '<th>Arena</th>';
    s += '<th>Registrerad</th>';
    s += '<th>GameType</th>';
    s += '</tr>';
    s += '</thead>';
    s += '<tbody>';

    for (var i = 0; i < Aterbudslista.Dag.length; i++){

	      s += '<tr style="cursor:default;">';

	      // Namn
	      s += '<td>' + getDomare(Aterbudslista.Dag[i].JerseyNo) + '</td>';

	      // Datum
	      s += '<td>' + Aterbudslista.Dag[i].Date + '</td>';

	      // Game
	      var tmp = Aterbudslista.Dag[i].HomeCode + ' - ' + Aterbudslista.Dag[i].AwayCode;
	      var thistitel = Aterbudslista.Dag[i].HomeName + ' - ' + Aterbudslista.Dag[i].AwayName;
	      s += '<td title="' + thistitel + '">' + tmp + '</td>';

	      // Arena
	      s += '<td>' + Aterbudslista.Dag[i].Arena + '</td>';

	      // Registrerad
	      thistitel = Aterbudslista.Dag[i].Registrerat_Av;
	      s += '<td title="' + thistitel + '">' + Aterbudslista.Dag[i].Registrerat + '</td>';

	      // GameType
	      if (!Aterbudslista.Dag[i].Level){
	          thistitel = 'Uppgift saknas';
	      } else {
	          thistitel = Aterbudslista.Dag[i].Level;
	      }
	      s += '<td title="' + thistitel + '">' + Aterbudslista.Dag[i].GameType + '</td>';

	      s += '</tr>';

    }
    s += '</tbody>';

    s += '</table>';

    s += '<br>';
    s += "<button class='btn btn-info' onclick='tillbaka()'>Till Mitt konto</button>";

    document.getElementById('div_tabell').innerHTML = s;

}

function set_aterbud(i){

    curr_JerseyNo = $("#cbDomare").val();
    curr_season = $("#cbSeason").val();


    var instring  = '{"season":' + curr_season + ', "JerseyNo":' + curr_JerseyNo  + ', ';
    instring     += '"GameId": '   + Aterbudslista.Match[i].GameId           + ', ';
    instring     += '"Datum": "'   + Aterbudslista.Match[i].Date             + '"}';

    var js_objekt = JSON.parse(instring);


    $.getJSON("ajax/set_aterbud.php", js_objekt)
        .done(function(data) {
	          set_aterbud_success(data);
	})
        .fail(function() {
	          set_aterbud_fail();
	})
        .always(function() {

	});
}


function set_aterbud_success(response){

    if (response.status == 'Error'){
	      alert("Återbud har, av okänd anledning, misslyckats. Vid upprepade fel kontakta webbmaster.");
    } else if (response.status == 'OK'){
	      if (response.sendEpost == 'no'){
	          alert("E-postmeddelande till övriga domare i matchen har inte kunnat skickas!");
	      }
	      get_info();
    } else {
	      visa_resten();
    }

}

function set_aterbud_fail(){

    alert("Ett oförutsett fel har inträffat! Åtgärden har inte kunnat genomföras");
}


function getDomare(JerseyNo){

    for (var i = 0; i < Userslista.User.length; i++){
        if (Userslista.User[i].JerseyNo == JerseyNo){
	          var Namn = Userslista.User[i].LastName + ', ' + Userslista.User[i].FirstName;
            return  Namn;
        }
    }

    return '';
}

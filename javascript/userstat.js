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


    s += '<h1 class="center-text">Domarstatistik</h1>';
    s += '<h3 class="center-text">för ' + FirstName + ', ' + LastName + '</h3>';
    s += '<br>';

    s += '<div class="class="main-content" style="margin: auto 2%;">';

    s += '<table class="table">';
    s += '<caption>Totalt ' + Resultatlista.Resultat.length + ' säsonger funna';
    s += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-info" onclick="tillbaka()">Tillbaka</button>';

    s += '</caption>' ;
    s += '<thead>';
    s += '<tr>';
    s += '<th>Säsong</th>';
    s += '<th>Grundspel</th>';
    s += '<th>Slutspel</th>';
    s += '<th>Totalt</th>';
    s += '</tr>';
    s += '</thead>';
    s += '<tbody>';

    var SummaGrund  = DomdaGrundspel;
    var SummaSlut   = DomdaSlutspel;
    var SummaTotalt = 0;
    s += '<tr style="cursor:default;">';
    s += '<td>Från kontot</td>';
    s += '<td>' + DomdaGrundspel + '</td>';
    s += '<td>' + DomdaSlutspel  + '</td>';
    var Totalt = DomdaGrundspel + DomdaSlutspel;
    s += '<td>' + Totalt + '</td>';
    s += '</tr>';

    SummaTotalt = Totalt;
    if (Resultatlista.status == "OK"){
	for (var i = 0; i < Resultatlista.Resultat.length; i++){
	    s += '<tr style="cursor:default;">';
	    s += '<td>' + Resultatlista.Resultat[i].Season + '</td>';
	    s += '<td>' + Resultatlista.Resultat[i].Grundspelcount + '</td>';
	    SummaGrund += Resultatlista.Resultat[i].Grundspelcount;
	    s += '<td>' + Resultatlista.Resultat[i].Slutspelcount + '</td>';
	    SummaSlut += Resultatlista.Resultat[i].Slutspelcount;
	    Totalt = Resultatlista.Resultat[i].Grundspelcount + Resultatlista.Resultat[i].Slutspelcount;
	    SummaTotalt += Totalt;
	    s += '<td>' + Totalt + '</td>';
	    s += '</tr>';
	}
    }

    s += '<tr style="cursor:default;">';
    s += '<td>Summor</td>';
    s += '<td>' + SummaGrund + '</td>';
    s += '<td>' + SummaSlut  + '</td>';
    s += '<td>' + SummaTotalt + '</td>';
    s += '</tr>';


    s += '</tbody>';
    s += '</table>';

    s += '<br>';

    s += '<div class="text-center">';
    s += '<button type="button" class="btn btn-info" onclick="tillbaka()">Tillbaka</button></div>';

    s += '</div>';
    s += '<br>';
    s += '<br>';
    s += '<br>';

    document.getElementById('c_side').innerHTML = s;


    s  = '<button class="btn btn-info btn-xs" onclick="logout()">Logga ut</button>';
    document.getElementById('knapp').innerHTML = s;

}

function tillbaka(){
    window.open('usersstat.php', '_self');
}


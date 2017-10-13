//Javascript File

var Domartyper = new Array();
Domartyper[0] = '';
Domartyper[1] = 'Domare';
Domartyper[2] = 'Linjedomare';
Domartyper[3] = 'Domarcoach';
Domartyper[4] = 'Administratör';

var veckodagar = new Array();
veckodagar[0] = "Sön";
veckodagar[1] = "Mån";
veckodagar[2] = "Tis";
veckodagar[3] = "Ons";
veckodagar[4] = "Tor";
veckodagar[5] = "Fre";
veckodagar[6] = "Lör";

var manader   = new Array();
manader[0]    = "ALLA";
manader[1]    = "Januari";
manader[2]    = "Februari";
manader[3]    = "Mars";
manader[4]    = "April";
manader[5]    = "Maj";
manader[6]    = "Juni";
manader[7]    = "Juli";
manader[8]    = "Augusti";
manader[9]    = "September";
manader[10]   = "Oktober";
manader[11]   = "November";
manader[12]   = "December";

var dagar     = new Array();
dagar[0]      = 31;
dagar[1]      = 31;
dagar[2]      = 28;
dagar[3]      = 31;
dagar[4]      = 30;
dagar[5]      = 31;
dagar[6]      = 30;
dagar[7]      = 31;
dagar[8]      = 31;
dagar[9]      = 30;
dagar[10]     = 31;
dagar[11]     = 30;
dagar[12]     = 31;

var MinYear   = 0;
var MaxYear   = 0;
var MinMonth  = 0;
var MaxMonth  = 0;



function visa_foten(){

    var Orgnr      = 'Organisationsnr: ';
    var Namn       = '';
    var Adress     = '';
    var Postnr     = '';
    var Postadress = '';
    var Telefon    = 'Telefon: ';
    var Mobil      = 'Mobil: ';
    var Domarchef  = '';
    var Epost      = 'Epost: ';
    var Webmaster  = '';
    var WebTelefon = 'Telefon: ';
    var WebEpost   = 'Epost: ';


    if (Parametrar.status == 'OK'){
	      Orgnr      += Parametrar.Orgnr;
	      Namn        = Parametrar.Namn;
	      Adress      = Parametrar.Adress;
	      Postnr      = Parametrar.Postnr;
	      Postadress  = Parametrar.Postadress;
	      Telefon    += Parametrar.Telefon;
	      Domarchef   = Parametrar.Domarchef;
	      Mobil      += Parametrar.Mobil;
	      Epost      += Parametrar.Epost;
	      Webmaster   = Parametrar.Webmaster;
	      WebTelefon += Parametrar.WebTelefon;
	      WebEpost   += Parametrar.WebEpost;
    }

    // SHL
    document.getElementById('P_Namn').innerHTML = Namn;
    document.getElementById('P_Telefon').innerHTML = Telefon;
    document.getElementById('P_Organisationsnr').innerHTML = Orgnr;
    var tmp = Adress + ', ' + Postnr + ' ' + Postadress;
    document.getElementById('P_Adress').innerHTML = tmp;

    // Domarchef
    document.getElementById('P_Domarchef').innerHTML = Domarchef;
    document.getElementById('P_Mobil').innerHTML = Mobil;
    document.getElementById('P_Epost').innerHTML = Epost;

    // Webmaster
    document.getElementById('P_Webmaster').innerHTML = Webmaster;
    document.getElementById('P_WebTelefon').innerHTML = WebTelefon;
    document.getElementById('P_WebEpost').innerHTML = WebEpost;
}


function logout(){

    var instring  = '{"indata": "inga"}';

    var js_objekt = JSON.parse(instring);


    $.getJSON("ajax/loggaut.php", js_objekt)
        .done(function(data) {
	    logout_success(data);
	})
        .fail(function() {
	    logout_fail();
	})
        .always(function() {

	});
}

function logout_success(response){

    if (response.logged_out == 'yes'){
	window.open('index.php',"_self");
    } else if (response.logged_out == 'logedout'){
	window.open('nosession.php',"_self");
    } else {
	alert('Ett oförutsägbart fel har hindrat utloggningen!');
	return;
    }
}

function logout_fail(){
    alert('Utloggningen kunde inte genomföras på grund av ett oförutsägbar fel!');
    return;
}


function rensatoDB(instring) {

    // Ska anropas INNAN man ska spara information till databasen
    // T.ex. precis innan ett ajax-anrop till servern.

    if (!instring) return null;


    var find   = '"';
    instring   = instring.replace(new RegExp(find,'g'),' ');

    find       = "'";
    instring   = instring.replace(new RegExp(find,'g'),' ');

    find   = '&';
    instring   = instring.replace(new RegExp(find,'g'),' ');

    find       = "\\n";
    instring   = instring.replace(/\\n/g," ");

    find       = "\n";
    instring   = instring.replace(/\n/g," ");

    instring = instring.replace(/\\/g, " "); // Tar bort alla \

    return instring;

}

function getVeckodag(datum){

    var d = new  Date(datum);
    return veckodagar[d.getDay()];
}

function getDagens(){

    var d      = new Date();
    var YYYY   = d.getFullYear();
    var MM     = d.getMonth();
    MM += 1;
    if (MM < 10) MM = '0' + MM;
    var DD = d.getDate();
    if (DD < 10) DD = '0' + DD;

    Dagens = YYYY + '-' + MM + '-' + DD;

    return Dagens;
}


function leapYear(year)
{
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);

}


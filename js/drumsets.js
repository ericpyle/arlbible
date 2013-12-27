/**
 * @author (C) 2010 Eric Pyle
 */

/*
(function($){
tile = function() {
$("body").append('See? It works.');
};
})(jQuery);
*/
$(document).ready(function () {
	$("#btnPrevDay").click(function () {
		prevDay();
	});

	$(".btnNextDay").click(function () {
		nextDay();
	});

	$("#btnSetDay").click(function () {
		displayAllBCHeading();
	});

	var arlBookmarkDay = $.cookie('arl-bookmark');
	if (arlBookmarkDay == undefined) {
		arlBookmarkDay = "1";
	}
	$('#tbDay').val(arlBookmarkDay);
	displayAllBCHeading();
});

function nextDay() {
	var day = parseInt($("#tbDay").val());
	if (day == undefined)
		return;
	var nextday = day + 1;
	if (nextday > 0) {
		$("#tbDay").val(nextday);
		displayAllBCHeading();
	}
}

function prevDay() {
	var day = parseInt($("#tbDay").val());
	if (day == undefined)
		return;
	var prevday = day - 1;
	if (prevday > 0) {
		$("#tbDay").val(prevday);
		displayAllBCHeading();
	}
}

function SetDay(e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	if (code == 13) { //Enter keycode
		//Do something
		displayAllBCHeading();
	}

}

function displayAllBCHeading() {
	var day = $('#tbDay').val();
	$('.drumDayNumber').text(day);
	$('#accordion1').accordion("activate", false);
	loadPlannedPages(day);
};

function loadPlannedPages(day, genreToActivate) {
	$.cookie('arl-bookmark', day, { expires: 999 });
	loadBCHeadingLink(day, mapDtHistoryToBC, "DtHistory");
	loadBCHeadingLink(day, mapWisdomToBC, "Wisdom");
	loadBCHeadingLink(day, mapProphetsToBC, "Prophets");
	loadBCHeadingLink(day, mapGospelsToBC, "Gospels");
	loadBCHeadingLink(day, mapChurchHistoryToBC, "ChurchHistory");
	if (genreToActivate) {
		//var index = genreIndex(genreToActivate);
		activateAccordionPanel('#accordion1', genreToActivate);
		//$.scrollTo($('#accordion1').children('table').eq(index), 200);
	}
}
/*
function displaymessage()
{
alert("Hello World!");
};
*/
var timeEstimates = new Array(5);

				function showTab(event, ui)
				{
					if (ui.index == 0)
					{
						//var active = $("#accordion1").accordion( "option", "active" );
						//alert(active)
						//if (active)
						//	$.scrollTo($('#accordion1').children('table').eq(active), 200);
						//alert(active);
						//$("#accordion1").accordion( "activate" , index);
					}
				}
				
				function accordionOnChange(event, ui)
				{
					var active = ui.newHeader.parent().accordion( "option", "active" );
					//alert(active);					
					if (active >= 0){						
						//alert(active);
						$.scrollTo(ui.newHeader.parent().children('table').eq(active), 200);
					}
					 // ui.newHeader // jQuery object, activated header
					 // ui.oldHeader // jQuery object, previous header
					 // ui.newContent // jQuery object, activated content
					 // ui.oldContent // jQuery object, previous content
					 
				}

 				function displayBCHeadingLink(day, mapArray, genre)
				{
					var bm = (day - 1) % mapArray.length;
					var bcAbbr = mapArray[bm];
					var heading = convertBCAbbrToHeading(bcAbbr);
					var ch = parseInt(bcAbbr.substring(3), 10);					
					$("#BCHeading_" + genre).text(heading + " " + ch);
					$("#BCHeading_" + genre).attr("href", 
						"javascript:loadPlannedPages(" + day + ", '" + genre + "');");
						//"javascript:loadGenrePage('#content_" + genre + "', '"+ bcAbbr + ".htm');");					
				};
				
				function loadBCHeadingLink(day, mapArray, genre)
				{
					var bm = (day - 1) % mapArray.length;
					var bcAbbr = mapArray[bm];
					var heading = convertBCAbbrToHeading(bcAbbr);
					var ch = parseInt(bcAbbr.substring(3), 10);					
					
					loadGenrePage("#content_"+ genre, bcAbbr + ".htm", true);				
				};
				
				function displayTotalEstimatedReadingTime()
				{
					var totalTime = 0;
					for (var i = 0; i < 5; ++i)
					{
						totalTime += timeEstimates[i];
					}
					$("#totalTimeEstimation").text(totalTime.toFixed(2));
				}
				function loadGenrePage(idGenreDiv, bcPage, fLoadOnly){
					var version = "kjv";									
					var bookCode = bcPage.substring(0, 3);
					var verses = BookStats[bookCode].verses;
					var words = BookStats[bookCode].words;
					var bcAbbr = bcPage.split(".")[0];
					var chVerses = BookStats[bcAbbr].verses;
					var genre = idGenreDiv.split("_")[1];
					var index = genreIndex(genre);
					var timeEstimation = (words/verses*chVerses/160);
					timeEstimates[index] = timeEstimation;										
					$("#timeEstimation_" + genre).text(timeEstimation.toFixed(2));
					displayTotalEstimatedReadingTime();
					var heading = convertBCAbbrToHeading(bcAbbr);
					var ch = parseInt(bcAbbr.substring(3), 10);
					$("#HeadingBCRef_" + genre).text(heading + " " + ch);
					//document.location.href="#mainDocTop";
					$(idGenreDiv).load(version + "/" + bcPage, function(){
						
						// disassemble the page into book
						//var bcAbbr = bcPage.split('.')[0];
						//var bookAbbr = bcAbbr.substring(0, 3);
						jQuery(this).find("div.navButtons a")
							.each(function(){
								importLink(idGenreDiv, $(this));
								//"javascript:loadGenrePage('#content_DtHistory', '" + bookAbbr + pad2(ch) + ".htm');");
						
						});
						jQuery(this).find("div.navChapters a")
							.each(function(){
								importLink(idGenreDiv, $(this));
								//"javascript:loadGenrePage('#content_DtHistory', '" + bookAbbr + pad2(ch) + ".htm');");																	
						});
						if (fLoadOnly)
							return;
						activateAccordionPanel('#accordion1', genre);
						//.animate({scrollTop:0}, 2000, 'ease')
						// $(window).animate({scrollTop:0}, 'slow', 'easein');
						//$(window).scrollTo(0);
						//if (fLoadOnly)
						//	return;
						$.scrollTo($('#accordion1').children('table').eq(index), 200);
						//$.scrollTo(0, 200);
						//$(window).scrollTop(0);
						
					});					
					
					
				}
				
				function genreIndex(genre)
				{
					var index = 0;
						switch(genre)
						{
							case "DtHistory":
							index = 0;
							break;
							case "Wisdom":
							index = 1;
							break;
							case "Prophets":
							index = 2;
							break;
							case "Gospels":
							index = 3;
							break;
							case "ChurchHistory":
							index = 4;
							break;
							default:
							index = 0;
							break;
						}
					return index;
				}
				
				function activateAccordionPanel(accordionSelector, genre)
					{
						$('#tabs').tabs('select','#tabs-1');
						var index = genreIndex(genre);
						// this is kludgy, but not sure how to prevent closing the panel if it's already open
						// (could possibly detect "style: display:block"
						$(accordionSelector).accordion( "option", "collapsible", false );						
						$(accordionSelector).accordion( "activate" , index);
						$(accordionSelector).accordion( "option", "collapsible", true );
						
						//$.scrollTo($(accordionSelector).children('table').eq(index), 200);							
						//document.getElementById('mainDocTop').scrollIntoView(true);			

					}
				
				function importLink(idGenreDiv, anchorElement)
				{
					var bchtm = anchorElement.attr("href");
					anchorElement.attr("href",
						"javascript:loadGenrePage('" + idGenreDiv +"', '" + bchtm + "');");
					return anchorElement; 
				}
				
				function pad2(number) {
   
     				return (number < 10 ? '0' : '') + number
   
				}
				
				function pad3(number) {
   
     				return (number < 10 ? '00' : '') + number
   
				}
				
				$("#btnPrevDay").click(function() {
  					var day=parseInt($("#tbDay").val());
					if (day == undefined)
						return;
					var prevday = day - 1;
					if (prevday > 0) {
						$("#tbDay").val(prevday);
						displayAllBCHeading();
					}
				});
				
				function convertBCAbbrToHeading(bcAbbr)
				{
					var bookAbbr = bcAbbr.substring(0, 3);
					var heading = SILTitleAbbrToHeader_eng[bookAbbr];
					return heading;
				}
				

			
var mapDtHistoryToBC = new Array();
mapDtHistoryToBC[0] = "GEN01";
mapDtHistoryToBC[1] = "GEN02";
mapDtHistoryToBC[2] = "GEN03";
mapDtHistoryToBC[3] = "GEN04";
mapDtHistoryToBC[4] = "GEN05";
mapDtHistoryToBC[5] = "GEN06";
mapDtHistoryToBC[6] = "GEN07";
mapDtHistoryToBC[7] = "GEN08";
mapDtHistoryToBC[8] = "GEN09";
mapDtHistoryToBC[9] = "GEN10";
mapDtHistoryToBC[10] = "GEN11";
mapDtHistoryToBC[11] = "GEN12";
mapDtHistoryToBC[12] = "GEN13";
mapDtHistoryToBC[13] = "GEN14";
mapDtHistoryToBC[14] = "GEN15";
mapDtHistoryToBC[15] = "GEN16";
mapDtHistoryToBC[16] = "GEN17";
mapDtHistoryToBC[17] = "GEN18";
mapDtHistoryToBC[18] = "GEN19";
mapDtHistoryToBC[19] = "GEN20";
mapDtHistoryToBC[20] = "GEN21";
mapDtHistoryToBC[21] = "GEN22";
mapDtHistoryToBC[22] = "GEN23";
mapDtHistoryToBC[23] = "GEN24";
mapDtHistoryToBC[24] = "GEN25";
mapDtHistoryToBC[25] = "GEN26";
mapDtHistoryToBC[26] = "GEN27";
mapDtHistoryToBC[27] = "GEN28";
mapDtHistoryToBC[28] = "GEN29";
mapDtHistoryToBC[29] = "GEN30";
mapDtHistoryToBC[30] = "GEN31";
mapDtHistoryToBC[31] = "GEN32";
mapDtHistoryToBC[32] = "GEN33";
mapDtHistoryToBC[33] = "GEN34";
mapDtHistoryToBC[34] = "GEN35";
mapDtHistoryToBC[35] = "GEN36";
mapDtHistoryToBC[36] = "GEN37";
mapDtHistoryToBC[37] = "GEN38";
mapDtHistoryToBC[38] = "GEN39";
mapDtHistoryToBC[39] = "GEN40";
mapDtHistoryToBC[40] = "GEN41";
mapDtHistoryToBC[41] = "GEN42";
mapDtHistoryToBC[42] = "GEN43";
mapDtHistoryToBC[43] = "GEN44";
mapDtHistoryToBC[44] = "GEN45";
mapDtHistoryToBC[45] = "GEN46";
mapDtHistoryToBC[46] = "GEN47";
mapDtHistoryToBC[47] = "GEN48";
mapDtHistoryToBC[48] = "GEN49";
mapDtHistoryToBC[49] = "GEN50";
mapDtHistoryToBC[50] = "EXO01";
mapDtHistoryToBC[51] = "EXO02";
mapDtHistoryToBC[52] = "EXO03";
mapDtHistoryToBC[53] = "EXO04";
mapDtHistoryToBC[54] = "EXO05";
mapDtHistoryToBC[55] = "EXO06";
mapDtHistoryToBC[56] = "EXO07";
mapDtHistoryToBC[57] = "EXO08";
mapDtHistoryToBC[58] = "EXO09";
mapDtHistoryToBC[59] = "EXO10";
mapDtHistoryToBC[60] = "EXO11";
mapDtHistoryToBC[61] = "EXO12";
mapDtHistoryToBC[62] = "EXO13";
mapDtHistoryToBC[63] = "EXO14";
mapDtHistoryToBC[64] = "EXO15";
mapDtHistoryToBC[65] = "EXO16";
mapDtHistoryToBC[66] = "EXO17";
mapDtHistoryToBC[67] = "EXO18";
mapDtHistoryToBC[68] = "EXO19";
mapDtHistoryToBC[69] = "EXO20";
mapDtHistoryToBC[70] = "EXO21";
mapDtHistoryToBC[71] = "EXO22";
mapDtHistoryToBC[72] = "EXO23";
mapDtHistoryToBC[73] = "EXO24";
mapDtHistoryToBC[74] = "EXO25";
mapDtHistoryToBC[75] = "EXO26";
mapDtHistoryToBC[76] = "EXO27";
mapDtHistoryToBC[77] = "EXO28";
mapDtHistoryToBC[78] = "EXO29";
mapDtHistoryToBC[79] = "EXO30";
mapDtHistoryToBC[80] = "EXO31";
mapDtHistoryToBC[81] = "EXO32";
mapDtHistoryToBC[82] = "EXO33";
mapDtHistoryToBC[83] = "EXO34";
mapDtHistoryToBC[84] = "EXO35";
mapDtHistoryToBC[85] = "EXO36";
mapDtHistoryToBC[86] = "EXO37";
mapDtHistoryToBC[87] = "EXO38";
mapDtHistoryToBC[88] = "EXO39";
mapDtHistoryToBC[89] = "EXO40";
mapDtHistoryToBC[90] = "LEV01";
mapDtHistoryToBC[91] = "LEV02";
mapDtHistoryToBC[92] = "LEV03";
mapDtHistoryToBC[93] = "LEV04";
mapDtHistoryToBC[94] = "LEV05";
mapDtHistoryToBC[95] = "LEV06";
mapDtHistoryToBC[96] = "LEV07";
mapDtHistoryToBC[97] = "LEV08";
mapDtHistoryToBC[98] = "LEV09";
mapDtHistoryToBC[99] = "LEV10";
mapDtHistoryToBC[100] = "LEV11";
mapDtHistoryToBC[101] = "LEV12";
mapDtHistoryToBC[102] = "LEV13";
mapDtHistoryToBC[103] = "LEV14";
mapDtHistoryToBC[104] = "LEV15";
mapDtHistoryToBC[105] = "LEV16";
mapDtHistoryToBC[106] = "LEV17";
mapDtHistoryToBC[107] = "LEV18";
mapDtHistoryToBC[108] = "LEV19";
mapDtHistoryToBC[109] = "LEV20";
mapDtHistoryToBC[110] = "LEV21";
mapDtHistoryToBC[111] = "LEV22";
mapDtHistoryToBC[112] = "LEV23";
mapDtHistoryToBC[113] = "LEV24";
mapDtHistoryToBC[114] = "LEV25";
mapDtHistoryToBC[115] = "LEV26";
mapDtHistoryToBC[116] = "LEV27";
mapDtHistoryToBC[117] = "NUM01";
mapDtHistoryToBC[118] = "NUM02";
mapDtHistoryToBC[119] = "NUM03";
mapDtHistoryToBC[120] = "NUM04";
mapDtHistoryToBC[121] = "NUM05";
mapDtHistoryToBC[122] = "NUM06";
mapDtHistoryToBC[123] = "NUM07";
mapDtHistoryToBC[124] = "NUM08";
mapDtHistoryToBC[125] = "NUM09";
mapDtHistoryToBC[126] = "NUM10";
mapDtHistoryToBC[127] = "NUM11";
mapDtHistoryToBC[128] = "NUM12";
mapDtHistoryToBC[129] = "NUM13";
mapDtHistoryToBC[130] = "NUM14";
mapDtHistoryToBC[131] = "NUM15";
mapDtHistoryToBC[132] = "NUM16";
mapDtHistoryToBC[133] = "NUM17";
mapDtHistoryToBC[134] = "NUM18";
mapDtHistoryToBC[135] = "NUM19";
mapDtHistoryToBC[136] = "NUM20";
mapDtHistoryToBC[137] = "NUM21";
mapDtHistoryToBC[138] = "NUM22";
mapDtHistoryToBC[139] = "NUM23";
mapDtHistoryToBC[140] = "NUM24";
mapDtHistoryToBC[141] = "NUM25";
mapDtHistoryToBC[142] = "NUM26";
mapDtHistoryToBC[143] = "NUM27";
mapDtHistoryToBC[144] = "NUM28";
mapDtHistoryToBC[145] = "NUM29";
mapDtHistoryToBC[146] = "NUM30";
mapDtHistoryToBC[147] = "NUM31";
mapDtHistoryToBC[148] = "NUM32";
mapDtHistoryToBC[149] = "NUM33";
mapDtHistoryToBC[150] = "NUM34";
mapDtHistoryToBC[151] = "NUM35";
mapDtHistoryToBC[152] = "NUM36";
mapDtHistoryToBC[153] = "DEU01";
mapDtHistoryToBC[154] = "DEU02";
mapDtHistoryToBC[155] = "DEU03";
mapDtHistoryToBC[156] = "DEU04";
mapDtHistoryToBC[157] = "DEU05";
mapDtHistoryToBC[158] = "DEU06";
mapDtHistoryToBC[159] = "DEU07";
mapDtHistoryToBC[160] = "DEU08";
mapDtHistoryToBC[161] = "DEU09";
mapDtHistoryToBC[162] = "DEU10";
mapDtHistoryToBC[163] = "DEU11";
mapDtHistoryToBC[164] = "DEU12";
mapDtHistoryToBC[165] = "DEU13";
mapDtHistoryToBC[166] = "DEU14";
mapDtHistoryToBC[167] = "DEU15";
mapDtHistoryToBC[168] = "DEU16";
mapDtHistoryToBC[169] = "DEU17";
mapDtHistoryToBC[170] = "DEU18";
mapDtHistoryToBC[171] = "DEU19";
mapDtHistoryToBC[172] = "DEU20";
mapDtHistoryToBC[173] = "DEU21";
mapDtHistoryToBC[174] = "DEU22";
mapDtHistoryToBC[175] = "DEU23";
mapDtHistoryToBC[176] = "DEU24";
mapDtHistoryToBC[177] = "DEU25";
mapDtHistoryToBC[178] = "DEU26";
mapDtHistoryToBC[179] = "DEU27";
mapDtHistoryToBC[180] = "DEU28";
mapDtHistoryToBC[181] = "DEU29";
mapDtHistoryToBC[182] = "DEU30";
mapDtHistoryToBC[183] = "DEU31";
mapDtHistoryToBC[184] = "DEU32";
mapDtHistoryToBC[185] = "DEU33";
mapDtHistoryToBC[186] = "DEU34";
mapDtHistoryToBC[187] = "JOS01";
mapDtHistoryToBC[188] = "JOS02";
mapDtHistoryToBC[189] = "JOS03";
mapDtHistoryToBC[190] = "JOS04";
mapDtHistoryToBC[191] = "JOS05";
mapDtHistoryToBC[192] = "JOS06";
mapDtHistoryToBC[193] = "JOS07";
mapDtHistoryToBC[194] = "JOS08";
mapDtHistoryToBC[195] = "JOS09";
mapDtHistoryToBC[196] = "JOS10";
mapDtHistoryToBC[197] = "JOS11";
mapDtHistoryToBC[198] = "JOS12";
mapDtHistoryToBC[199] = "JOS13";
mapDtHistoryToBC[200] = "JOS14";
mapDtHistoryToBC[201] = "JOS15";
mapDtHistoryToBC[202] = "JOS16";
mapDtHistoryToBC[203] = "JOS17";
mapDtHistoryToBC[204] = "JOS18";
mapDtHistoryToBC[205] = "JOS19";
mapDtHistoryToBC[206] = "JOS20";
mapDtHistoryToBC[207] = "JOS21";
mapDtHistoryToBC[208] = "JOS22";
mapDtHistoryToBC[209] = "JOS23";
mapDtHistoryToBC[210] = "JOS24";
mapDtHistoryToBC[211] = "JDG01";
mapDtHistoryToBC[212] = "JDG02";
mapDtHistoryToBC[213] = "JDG03";
mapDtHistoryToBC[214] = "JDG04";
mapDtHistoryToBC[215] = "JDG05";
mapDtHistoryToBC[216] = "JDG06";
mapDtHistoryToBC[217] = "JDG07";
mapDtHistoryToBC[218] = "JDG08";
mapDtHistoryToBC[219] = "JDG09";
mapDtHistoryToBC[220] = "JDG10";
mapDtHistoryToBC[221] = "JDG11";
mapDtHistoryToBC[222] = "JDG12";
mapDtHistoryToBC[223] = "JDG13";
mapDtHistoryToBC[224] = "JDG14";
mapDtHistoryToBC[225] = "JDG15";
mapDtHistoryToBC[226] = "JDG16";
mapDtHistoryToBC[227] = "JDG17";
mapDtHistoryToBC[228] = "JDG18";
mapDtHistoryToBC[229] = "JDG19";
mapDtHistoryToBC[230] = "JDG20";
mapDtHistoryToBC[231] = "JDG21";
mapDtHistoryToBC[232] = "RUT01";
mapDtHistoryToBC[233] = "RUT02";
mapDtHistoryToBC[234] = "RUT03";
mapDtHistoryToBC[235] = "RUT04";
mapDtHistoryToBC[236] = "1SA01";
mapDtHistoryToBC[237] = "1SA02";
mapDtHistoryToBC[238] = "1SA03";
mapDtHistoryToBC[239] = "1SA04";
mapDtHistoryToBC[240] = "1SA05";
mapDtHistoryToBC[241] = "1SA06";
mapDtHistoryToBC[242] = "1SA07";
mapDtHistoryToBC[243] = "1SA08";
mapDtHistoryToBC[244] = "1SA09";
mapDtHistoryToBC[245] = "1SA10";
mapDtHistoryToBC[246] = "1SA11";
mapDtHistoryToBC[247] = "1SA12";
mapDtHistoryToBC[248] = "1SA13";
mapDtHistoryToBC[249] = "1SA14";
mapDtHistoryToBC[250] = "1SA15";
mapDtHistoryToBC[251] = "1SA16";
mapDtHistoryToBC[252] = "1SA17";
mapDtHistoryToBC[253] = "1SA18";
mapDtHistoryToBC[254] = "1SA19";
mapDtHistoryToBC[255] = "1SA20";
mapDtHistoryToBC[256] = "1SA21";
mapDtHistoryToBC[257] = "1SA22";
mapDtHistoryToBC[258] = "1SA23";
mapDtHistoryToBC[259] = "1SA24";
mapDtHistoryToBC[260] = "1SA25";
mapDtHistoryToBC[261] = "1SA26";
mapDtHistoryToBC[262] = "1SA27";
mapDtHistoryToBC[263] = "1SA28";
mapDtHistoryToBC[264] = "1SA29";
mapDtHistoryToBC[265] = "1SA30";
mapDtHistoryToBC[266] = "1SA31";
mapDtHistoryToBC[267] = "2SA01";
mapDtHistoryToBC[268] = "2SA02";
mapDtHistoryToBC[269] = "2SA03";
mapDtHistoryToBC[270] = "2SA04";
mapDtHistoryToBC[271] = "2SA05";
mapDtHistoryToBC[272] = "2SA06";
mapDtHistoryToBC[273] = "2SA07";
mapDtHistoryToBC[274] = "2SA08";
mapDtHistoryToBC[275] = "2SA09";
mapDtHistoryToBC[276] = "2SA10";
mapDtHistoryToBC[277] = "2SA11";
mapDtHistoryToBC[278] = "2SA12";
mapDtHistoryToBC[279] = "2SA13";
mapDtHistoryToBC[280] = "2SA14";
mapDtHistoryToBC[281] = "2SA15";
mapDtHistoryToBC[282] = "2SA16";
mapDtHistoryToBC[283] = "2SA17";
mapDtHistoryToBC[284] = "2SA18";
mapDtHistoryToBC[285] = "2SA19";
mapDtHistoryToBC[286] = "2SA20";
mapDtHistoryToBC[287] = "2SA21";
mapDtHistoryToBC[288] = "2SA22";
mapDtHistoryToBC[289] = "2SA23";
mapDtHistoryToBC[290] = "2SA24";
mapDtHistoryToBC[291] = "1KI01";
mapDtHistoryToBC[292] = "1KI02";
mapDtHistoryToBC[293] = "1KI03";
mapDtHistoryToBC[294] = "1KI04";
mapDtHistoryToBC[295] = "1KI05";
mapDtHistoryToBC[296] = "1KI06";
mapDtHistoryToBC[297] = "1KI07";
mapDtHistoryToBC[298] = "1KI08";
mapDtHistoryToBC[299] = "1KI09";
mapDtHistoryToBC[300] = "1KI10";
mapDtHistoryToBC[301] = "1KI11";
mapDtHistoryToBC[302] = "1KI12";
mapDtHistoryToBC[303] = "1KI13";
mapDtHistoryToBC[304] = "1KI14";
mapDtHistoryToBC[305] = "1KI15";
mapDtHistoryToBC[306] = "1KI16";
mapDtHistoryToBC[307] = "1KI17";
mapDtHistoryToBC[308] = "1KI18";
mapDtHistoryToBC[309] = "1KI19";
mapDtHistoryToBC[310] = "1KI20";
mapDtHistoryToBC[311] = "1KI21";
mapDtHistoryToBC[312] = "1KI22";
mapDtHistoryToBC[313] = "2KI01";
mapDtHistoryToBC[314] = "2KI02";
mapDtHistoryToBC[315] = "2KI03";
mapDtHistoryToBC[316] = "2KI04";
mapDtHistoryToBC[317] = "2KI05";
mapDtHistoryToBC[318] = "2KI06";
mapDtHistoryToBC[319] = "2KI07";
mapDtHistoryToBC[320] = "2KI08";
mapDtHistoryToBC[321] = "2KI09";
mapDtHistoryToBC[322] = "2KI10";
mapDtHistoryToBC[323] = "2KI11";
mapDtHistoryToBC[324] = "2KI12";
mapDtHistoryToBC[325] = "2KI13";
mapDtHistoryToBC[326] = "2KI14";
mapDtHistoryToBC[327] = "2KI15";
mapDtHistoryToBC[328] = "2KI16";
mapDtHistoryToBC[329] = "2KI17";
mapDtHistoryToBC[330] = "2KI18";
mapDtHistoryToBC[331] = "2KI19";
mapDtHistoryToBC[332] = "2KI20";
mapDtHistoryToBC[333] = "2KI21";
mapDtHistoryToBC[334] = "2KI22";
mapDtHistoryToBC[335] = "2KI23";
mapDtHistoryToBC[336] = "2KI24";
mapDtHistoryToBC[337] = "2KI25";
mapDtHistoryToBC[338] = "1CH01";
mapDtHistoryToBC[339] = "1CH02";
mapDtHistoryToBC[340] = "1CH03";
mapDtHistoryToBC[341] = "1CH04";
mapDtHistoryToBC[342] = "1CH05";
mapDtHistoryToBC[343] = "1CH06";
mapDtHistoryToBC[344] = "1CH07";
mapDtHistoryToBC[345] = "1CH08";
mapDtHistoryToBC[346] = "1CH09";
mapDtHistoryToBC[347] = "1CH10";
mapDtHistoryToBC[348] = "1CH11";
mapDtHistoryToBC[349] = "1CH12";
mapDtHistoryToBC[350] = "1CH13";
mapDtHistoryToBC[351] = "1CH14";
mapDtHistoryToBC[352] = "1CH15";
mapDtHistoryToBC[353] = "1CH16";
mapDtHistoryToBC[354] = "1CH17";
mapDtHistoryToBC[355] = "1CH18";
mapDtHistoryToBC[356] = "1CH19";
mapDtHistoryToBC[357] = "1CH20";
mapDtHistoryToBC[358] = "1CH21";
mapDtHistoryToBC[359] = "1CH22";
mapDtHistoryToBC[360] = "1CH23";
mapDtHistoryToBC[361] = "1CH24";
mapDtHistoryToBC[362] = "1CH25";
mapDtHistoryToBC[363] = "1CH26";
mapDtHistoryToBC[364] = "1CH27";
mapDtHistoryToBC[365] = "1CH28";
mapDtHistoryToBC[366] = "1CH29";
mapDtHistoryToBC[367] = "2CH01";
mapDtHistoryToBC[368] = "2CH02";
mapDtHistoryToBC[369] = "2CH03";
mapDtHistoryToBC[370] = "2CH04";
mapDtHistoryToBC[371] = "2CH05";
mapDtHistoryToBC[372] = "2CH06";
mapDtHistoryToBC[373] = "2CH07";
mapDtHistoryToBC[374] = "2CH08";
mapDtHistoryToBC[375] = "2CH09";
mapDtHistoryToBC[376] = "2CH10";
mapDtHistoryToBC[377] = "2CH11";
mapDtHistoryToBC[378] = "2CH12";
mapDtHistoryToBC[379] = "2CH13";
mapDtHistoryToBC[380] = "2CH14";
mapDtHistoryToBC[381] = "2CH15";
mapDtHistoryToBC[382] = "2CH16";
mapDtHistoryToBC[383] = "2CH17";
mapDtHistoryToBC[384] = "2CH18";
mapDtHistoryToBC[385] = "2CH19";
mapDtHistoryToBC[386] = "2CH20";
mapDtHistoryToBC[387] = "2CH21";
mapDtHistoryToBC[388] = "2CH22";
mapDtHistoryToBC[389] = "2CH23";
mapDtHistoryToBC[390] = "2CH24";
mapDtHistoryToBC[391] = "2CH25";
mapDtHistoryToBC[392] = "2CH26";
mapDtHistoryToBC[393] = "2CH27";
mapDtHistoryToBC[394] = "2CH28";
mapDtHistoryToBC[395] = "2CH29";
mapDtHistoryToBC[396] = "2CH30";
mapDtHistoryToBC[397] = "2CH31";
mapDtHistoryToBC[398] = "2CH32";
mapDtHistoryToBC[399] = "2CH33";
mapDtHistoryToBC[400] = "2CH34";
mapDtHistoryToBC[401] = "2CH35";
mapDtHistoryToBC[402] = "2CH36";
mapDtHistoryToBC[403] = "EZR01";
mapDtHistoryToBC[404] = "EZR02";
mapDtHistoryToBC[405] = "EZR03";
mapDtHistoryToBC[406] = "EZR04";
mapDtHistoryToBC[407] = "EZR05";
mapDtHistoryToBC[408] = "EZR06";
mapDtHistoryToBC[409] = "EZR07";
mapDtHistoryToBC[410] = "EZR08";
mapDtHistoryToBC[411] = "EZR09";
mapDtHistoryToBC[412] = "EZR10";
mapDtHistoryToBC[413] = "NEH01";
mapDtHistoryToBC[414] = "NEH02";
mapDtHistoryToBC[415] = "NEH03";
mapDtHistoryToBC[416] = "NEH04";
mapDtHistoryToBC[417] = "NEH05";
mapDtHistoryToBC[418] = "NEH06";
mapDtHistoryToBC[419] = "NEH07";
mapDtHistoryToBC[420] = "NEH08";
mapDtHistoryToBC[421] = "NEH09";
mapDtHistoryToBC[422] = "NEH10";
mapDtHistoryToBC[423] = "NEH11";
mapDtHistoryToBC[424] = "NEH12";
mapDtHistoryToBC[425] = "NEH13";
mapDtHistoryToBC[426] = "EST01";
mapDtHistoryToBC[427] = "EST02";
mapDtHistoryToBC[428] = "EST03";
mapDtHistoryToBC[429] = "EST04";
mapDtHistoryToBC[430] = "EST05";
mapDtHistoryToBC[431] = "EST06";
mapDtHistoryToBC[432] = "EST07";
mapDtHistoryToBC[433] = "EST08";
mapDtHistoryToBC[434] = "EST09";
mapDtHistoryToBC[435] = "EST10";


var mapWisdomToBC = new Array();
mapWisdomToBC[0] = "JOB01";
mapWisdomToBC[1] = "JOB02";
mapWisdomToBC[2] = "JOB03";
mapWisdomToBC[3] = "JOB04";
mapWisdomToBC[4] = "JOB05";
mapWisdomToBC[5] = "JOB06";
mapWisdomToBC[6] = "JOB07";
mapWisdomToBC[7] = "JOB08";
mapWisdomToBC[8] = "JOB09";
mapWisdomToBC[9] = "JOB10";
mapWisdomToBC[10] = "JOB11";
mapWisdomToBC[11] = "JOB12";
mapWisdomToBC[12] = "JOB13";
mapWisdomToBC[13] = "JOB14";
mapWisdomToBC[14] = "JOB15";
mapWisdomToBC[15] = "JOB16";
mapWisdomToBC[16] = "JOB17";
mapWisdomToBC[17] = "JOB18";
mapWisdomToBC[18] = "JOB19";
mapWisdomToBC[19] = "JOB20";
mapWisdomToBC[20] = "JOB21";
mapWisdomToBC[21] = "JOB22";
mapWisdomToBC[22] = "JOB23";
mapWisdomToBC[23] = "JOB24";
mapWisdomToBC[24] = "JOB25";
mapWisdomToBC[25] = "JOB26";
mapWisdomToBC[26] = "JOB27";
mapWisdomToBC[27] = "JOB28";
mapWisdomToBC[28] = "JOB29";
mapWisdomToBC[29] = "JOB30";
mapWisdomToBC[30] = "JOB31";
mapWisdomToBC[31] = "JOB32";
mapWisdomToBC[32] = "JOB33";
mapWisdomToBC[33] = "JOB34";
mapWisdomToBC[34] = "JOB35";
mapWisdomToBC[35] = "JOB36";
mapWisdomToBC[36] = "JOB37";
mapWisdomToBC[37] = "JOB38";
mapWisdomToBC[38] = "JOB39";
mapWisdomToBC[39] = "JOB40";
mapWisdomToBC[40] = "JOB41";
mapWisdomToBC[41] = "JOB42";
mapWisdomToBC[42] = "PSA001";
mapWisdomToBC[43] = "PSA002";
mapWisdomToBC[44] = "PSA003";
mapWisdomToBC[45] = "PSA004";
mapWisdomToBC[46] = "PSA005";
mapWisdomToBC[47] = "PSA006";
mapWisdomToBC[48] = "PSA007";
mapWisdomToBC[49] = "PSA008";
mapWisdomToBC[50] = "PSA009";
mapWisdomToBC[51] = "PSA010";
mapWisdomToBC[52] = "PSA011";
mapWisdomToBC[53] = "PSA012";
mapWisdomToBC[54] = "PSA013";
mapWisdomToBC[55] = "PSA014";
mapWisdomToBC[56] = "PSA015";
mapWisdomToBC[57] = "PSA016";
mapWisdomToBC[58] = "PSA017";
mapWisdomToBC[59] = "PSA018";
mapWisdomToBC[60] = "PSA019";
mapWisdomToBC[61] = "PSA020";
mapWisdomToBC[62] = "PSA021";
mapWisdomToBC[63] = "PSA022";
mapWisdomToBC[64] = "PSA023";
mapWisdomToBC[65] = "PSA024";
mapWisdomToBC[66] = "PSA025";
mapWisdomToBC[67] = "PSA026";
mapWisdomToBC[68] = "PSA027";
mapWisdomToBC[69] = "PSA028";
mapWisdomToBC[70] = "PSA029";
mapWisdomToBC[71] = "PSA030";
mapWisdomToBC[72] = "PSA031";
mapWisdomToBC[73] = "PSA032";
mapWisdomToBC[74] = "PSA033";
mapWisdomToBC[75] = "PSA034";
mapWisdomToBC[76] = "PSA035";
mapWisdomToBC[77] = "PSA036";
mapWisdomToBC[78] = "PSA037";
mapWisdomToBC[79] = "PSA038";
mapWisdomToBC[80] = "PSA039";
mapWisdomToBC[81] = "PSA040";
mapWisdomToBC[82] = "PSA041";
mapWisdomToBC[83] = "PSA042";
mapWisdomToBC[84] = "PSA043";
mapWisdomToBC[85] = "PSA044";
mapWisdomToBC[86] = "PSA045";
mapWisdomToBC[87] = "PSA046";
mapWisdomToBC[88] = "PSA047";
mapWisdomToBC[89] = "PSA048";
mapWisdomToBC[90] = "PSA049";
mapWisdomToBC[91] = "PSA050";
mapWisdomToBC[92] = "PSA051";
mapWisdomToBC[93] = "PSA052";
mapWisdomToBC[94] = "PSA053";
mapWisdomToBC[95] = "PSA054";
mapWisdomToBC[96] = "PSA055";
mapWisdomToBC[97] = "PSA056";
mapWisdomToBC[98] = "PSA057";
mapWisdomToBC[99] = "PSA058";
mapWisdomToBC[100] = "PSA059";
mapWisdomToBC[101] = "PSA060";
mapWisdomToBC[102] = "PSA061";
mapWisdomToBC[103] = "PSA062";
mapWisdomToBC[104] = "PSA063";
mapWisdomToBC[105] = "PSA064";
mapWisdomToBC[106] = "PSA065";
mapWisdomToBC[107] = "PSA066";
mapWisdomToBC[108] = "PSA067";
mapWisdomToBC[109] = "PSA068";
mapWisdomToBC[110] = "PSA069";
mapWisdomToBC[111] = "PSA070";
mapWisdomToBC[112] = "PSA071";
mapWisdomToBC[113] = "PSA072";
mapWisdomToBC[114] = "PSA073";
mapWisdomToBC[115] = "PSA074";
mapWisdomToBC[116] = "PSA075";
mapWisdomToBC[117] = "PSA076";
mapWisdomToBC[118] = "PSA077";
mapWisdomToBC[119] = "PSA078";
mapWisdomToBC[120] = "PSA079";
mapWisdomToBC[121] = "PSA080";
mapWisdomToBC[122] = "PSA081";
mapWisdomToBC[123] = "PSA082";
mapWisdomToBC[124] = "PSA083";
mapWisdomToBC[125] = "PSA084";
mapWisdomToBC[126] = "PSA085";
mapWisdomToBC[127] = "PSA086";
mapWisdomToBC[128] = "PSA087";
mapWisdomToBC[129] = "PSA088";
mapWisdomToBC[130] = "PSA089";
mapWisdomToBC[131] = "PSA090";
mapWisdomToBC[132] = "PSA091";
mapWisdomToBC[133] = "PSA092";
mapWisdomToBC[134] = "PSA093";
mapWisdomToBC[135] = "PSA094";
mapWisdomToBC[136] = "PSA095";
mapWisdomToBC[137] = "PSA096";
mapWisdomToBC[138] = "PSA097";
mapWisdomToBC[139] = "PSA098";
mapWisdomToBC[140] = "PSA099";
mapWisdomToBC[141] = "PSA100";
mapWisdomToBC[142] = "PSA101";
mapWisdomToBC[143] = "PSA102";
mapWisdomToBC[144] = "PSA103";
mapWisdomToBC[145] = "PSA104";
mapWisdomToBC[146] = "PSA105";
mapWisdomToBC[147] = "PSA106";
mapWisdomToBC[148] = "PSA107";
mapWisdomToBC[149] = "PSA108";
mapWisdomToBC[150] = "PSA109";
mapWisdomToBC[151] = "PSA110";
mapWisdomToBC[152] = "PSA111";
mapWisdomToBC[153] = "PSA112";
mapWisdomToBC[154] = "PSA113";
mapWisdomToBC[155] = "PSA114";
mapWisdomToBC[156] = "PSA115";
mapWisdomToBC[157] = "PSA116";
mapWisdomToBC[158] = "PSA117";
mapWisdomToBC[159] = "PSA118";
mapWisdomToBC[160] = "PSA119";
mapWisdomToBC[161] = "PSA120";
mapWisdomToBC[162] = "PSA121";
mapWisdomToBC[163] = "PSA122";
mapWisdomToBC[164] = "PSA123";
mapWisdomToBC[165] = "PSA124";
mapWisdomToBC[166] = "PSA125";
mapWisdomToBC[167] = "PSA126";
mapWisdomToBC[168] = "PSA127";
mapWisdomToBC[169] = "PSA128";
mapWisdomToBC[170] = "PSA129";
mapWisdomToBC[171] = "PSA130";
mapWisdomToBC[172] = "PSA131";
mapWisdomToBC[173] = "PSA132";
mapWisdomToBC[174] = "PSA133";
mapWisdomToBC[175] = "PSA134";
mapWisdomToBC[176] = "PSA135";
mapWisdomToBC[177] = "PSA136";
mapWisdomToBC[178] = "PSA137";
mapWisdomToBC[179] = "PSA138";
mapWisdomToBC[180] = "PSA139";
mapWisdomToBC[181] = "PSA140";
mapWisdomToBC[182] = "PSA141";
mapWisdomToBC[183] = "PSA142";
mapWisdomToBC[184] = "PSA143";
mapWisdomToBC[185] = "PSA144";
mapWisdomToBC[186] = "PSA145";
mapWisdomToBC[187] = "PSA146";
mapWisdomToBC[188] = "PSA147";
mapWisdomToBC[189] = "PSA148";
mapWisdomToBC[190] = "PSA149";
mapWisdomToBC[191] = "PSA150";
mapWisdomToBC[192] = "PRO01";
mapWisdomToBC[193] = "PRO02";
mapWisdomToBC[194] = "PRO03";
mapWisdomToBC[195] = "PRO04";
mapWisdomToBC[196] = "PRO05";
mapWisdomToBC[197] = "PRO06";
mapWisdomToBC[198] = "PRO07";
mapWisdomToBC[199] = "PRO08";
mapWisdomToBC[200] = "PRO09";
mapWisdomToBC[201] = "PRO10";
mapWisdomToBC[202] = "PRO11";
mapWisdomToBC[203] = "PRO12";
mapWisdomToBC[204] = "PRO13";
mapWisdomToBC[205] = "PRO14";
mapWisdomToBC[206] = "PRO15";
mapWisdomToBC[207] = "PRO16";
mapWisdomToBC[208] = "PRO17";
mapWisdomToBC[209] = "PRO18";
mapWisdomToBC[210] = "PRO19";
mapWisdomToBC[211] = "PRO20";
mapWisdomToBC[212] = "PRO21";
mapWisdomToBC[213] = "PRO22";
mapWisdomToBC[214] = "PRO23";
mapWisdomToBC[215] = "PRO24";
mapWisdomToBC[216] = "PRO25";
mapWisdomToBC[217] = "PRO26";
mapWisdomToBC[218] = "PRO27";
mapWisdomToBC[219] = "PRO28";
mapWisdomToBC[220] = "PRO29";
mapWisdomToBC[221] = "PRO30";
mapWisdomToBC[222] = "PRO31";
mapWisdomToBC[223] = "ECC01";
mapWisdomToBC[224] = "ECC02";
mapWisdomToBC[225] = "ECC03";
mapWisdomToBC[226] = "ECC04";
mapWisdomToBC[227] = "ECC05";
mapWisdomToBC[228] = "ECC06";
mapWisdomToBC[229] = "ECC07";
mapWisdomToBC[230] = "ECC08";
mapWisdomToBC[231] = "ECC09";
mapWisdomToBC[232] = "ECC10";
mapWisdomToBC[233] = "ECC11";
mapWisdomToBC[234] = "ECC12";
mapWisdomToBC[235] = "SNG01";
mapWisdomToBC[236] = "SNG02";
mapWisdomToBC[237] = "SNG03";
mapWisdomToBC[238] = "SNG04";
mapWisdomToBC[239] = "SNG05";
mapWisdomToBC[240] = "SNG06";
mapWisdomToBC[241] = "SNG07";
mapWisdomToBC[242] = "SNG08";


var mapProphetsToBC = new Array();
mapProphetsToBC[0] = "ISA01";
mapProphetsToBC[1] = "ISA02";
mapProphetsToBC[2] = "ISA03";
mapProphetsToBC[3] = "ISA04";
mapProphetsToBC[4] = "ISA05";
mapProphetsToBC[5] = "ISA06";
mapProphetsToBC[6] = "ISA07";
mapProphetsToBC[7] = "ISA08";
mapProphetsToBC[8] = "ISA09";
mapProphetsToBC[9] = "ISA10";
mapProphetsToBC[10] = "ISA11";
mapProphetsToBC[11] = "ISA12";
mapProphetsToBC[12] = "ISA13";
mapProphetsToBC[13] = "ISA14";
mapProphetsToBC[14] = "ISA15";
mapProphetsToBC[15] = "ISA16";
mapProphetsToBC[16] = "ISA17";
mapProphetsToBC[17] = "ISA18";
mapProphetsToBC[18] = "ISA19";
mapProphetsToBC[19] = "ISA20";
mapProphetsToBC[20] = "ISA21";
mapProphetsToBC[21] = "ISA22";
mapProphetsToBC[22] = "ISA23";
mapProphetsToBC[23] = "ISA24";
mapProphetsToBC[24] = "ISA25";
mapProphetsToBC[25] = "ISA26";
mapProphetsToBC[26] = "ISA27";
mapProphetsToBC[27] = "ISA28";
mapProphetsToBC[28] = "ISA29";
mapProphetsToBC[29] = "ISA30";
mapProphetsToBC[30] = "ISA31";
mapProphetsToBC[31] = "ISA32";
mapProphetsToBC[32] = "ISA33";
mapProphetsToBC[33] = "ISA34";
mapProphetsToBC[34] = "ISA35";
mapProphetsToBC[35] = "ISA36";
mapProphetsToBC[36] = "ISA37";
mapProphetsToBC[37] = "ISA38";
mapProphetsToBC[38] = "ISA39";
mapProphetsToBC[39] = "ISA40";
mapProphetsToBC[40] = "ISA41";
mapProphetsToBC[41] = "ISA42";
mapProphetsToBC[42] = "ISA43";
mapProphetsToBC[43] = "ISA44";
mapProphetsToBC[44] = "ISA45";
mapProphetsToBC[45] = "ISA46";
mapProphetsToBC[46] = "ISA47";
mapProphetsToBC[47] = "ISA48";
mapProphetsToBC[48] = "ISA49";
mapProphetsToBC[49] = "ISA50";
mapProphetsToBC[50] = "ISA51";
mapProphetsToBC[51] = "ISA52";
mapProphetsToBC[52] = "ISA53";
mapProphetsToBC[53] = "ISA54";
mapProphetsToBC[54] = "ISA55";
mapProphetsToBC[55] = "ISA56";
mapProphetsToBC[56] = "ISA57";
mapProphetsToBC[57] = "ISA58";
mapProphetsToBC[58] = "ISA59";
mapProphetsToBC[59] = "ISA60";
mapProphetsToBC[60] = "ISA61";
mapProphetsToBC[61] = "ISA62";
mapProphetsToBC[62] = "ISA63";
mapProphetsToBC[63] = "ISA64";
mapProphetsToBC[64] = "ISA65";
mapProphetsToBC[65] = "ISA66";
mapProphetsToBC[66] = "JER01";
mapProphetsToBC[67] = "JER02";
mapProphetsToBC[68] = "JER03";
mapProphetsToBC[69] = "JER04";
mapProphetsToBC[70] = "JER05";
mapProphetsToBC[71] = "JER06";
mapProphetsToBC[72] = "JER07";
mapProphetsToBC[73] = "JER08";
mapProphetsToBC[74] = "JER09";
mapProphetsToBC[75] = "JER10";
mapProphetsToBC[76] = "JER11";
mapProphetsToBC[77] = "JER12";
mapProphetsToBC[78] = "JER13";
mapProphetsToBC[79] = "JER14";
mapProphetsToBC[80] = "JER15";
mapProphetsToBC[81] = "JER16";
mapProphetsToBC[82] = "JER17";
mapProphetsToBC[83] = "JER18";
mapProphetsToBC[84] = "JER19";
mapProphetsToBC[85] = "JER20";
mapProphetsToBC[86] = "JER21";
mapProphetsToBC[87] = "JER22";
mapProphetsToBC[88] = "JER23";
mapProphetsToBC[89] = "JER24";
mapProphetsToBC[90] = "JER25";
mapProphetsToBC[91] = "JER26";
mapProphetsToBC[92] = "JER27";
mapProphetsToBC[93] = "JER28";
mapProphetsToBC[94] = "JER29";
mapProphetsToBC[95] = "JER30";
mapProphetsToBC[96] = "JER31";
mapProphetsToBC[97] = "JER32";
mapProphetsToBC[98] = "JER33";
mapProphetsToBC[99] = "JER34";
mapProphetsToBC[100] = "JER35";
mapProphetsToBC[101] = "JER36";
mapProphetsToBC[102] = "JER37";
mapProphetsToBC[103] = "JER38";
mapProphetsToBC[104] = "JER39";
mapProphetsToBC[105] = "JER40";
mapProphetsToBC[106] = "JER41";
mapProphetsToBC[107] = "JER42";
mapProphetsToBC[108] = "JER43";
mapProphetsToBC[109] = "JER44";
mapProphetsToBC[110] = "JER45";
mapProphetsToBC[111] = "JER46";
mapProphetsToBC[112] = "JER47";
mapProphetsToBC[113] = "JER48";
mapProphetsToBC[114] = "JER49";
mapProphetsToBC[115] = "JER50";
mapProphetsToBC[116] = "JER51";
mapProphetsToBC[117] = "JER52";
mapProphetsToBC[118] = "LAM01";
mapProphetsToBC[119] = "LAM02";
mapProphetsToBC[120] = "LAM03";
mapProphetsToBC[121] = "LAM04";
mapProphetsToBC[122] = "LAM05";
mapProphetsToBC[123] = "EZK01";
mapProphetsToBC[124] = "EZK02";
mapProphetsToBC[125] = "EZK03";
mapProphetsToBC[126] = "EZK04";
mapProphetsToBC[127] = "EZK05";
mapProphetsToBC[128] = "EZK06";
mapProphetsToBC[129] = "EZK07";
mapProphetsToBC[130] = "EZK08";
mapProphetsToBC[131] = "EZK09";
mapProphetsToBC[132] = "EZK10";
mapProphetsToBC[133] = "EZK11";
mapProphetsToBC[134] = "EZK12";
mapProphetsToBC[135] = "EZK13";
mapProphetsToBC[136] = "EZK14";
mapProphetsToBC[137] = "EZK15";
mapProphetsToBC[138] = "EZK16";
mapProphetsToBC[139] = "EZK17";
mapProphetsToBC[140] = "EZK18";
mapProphetsToBC[141] = "EZK19";
mapProphetsToBC[142] = "EZK20";
mapProphetsToBC[143] = "EZK21";
mapProphetsToBC[144] = "EZK22";
mapProphetsToBC[145] = "EZK23";
mapProphetsToBC[146] = "EZK24";
mapProphetsToBC[147] = "EZK25";
mapProphetsToBC[148] = "EZK26";
mapProphetsToBC[149] = "EZK27";
mapProphetsToBC[150] = "EZK28";
mapProphetsToBC[151] = "EZK29";
mapProphetsToBC[152] = "EZK30";
mapProphetsToBC[153] = "EZK31";
mapProphetsToBC[154] = "EZK32";
mapProphetsToBC[155] = "EZK33";
mapProphetsToBC[156] = "EZK34";
mapProphetsToBC[157] = "EZK35";
mapProphetsToBC[158] = "EZK36";
mapProphetsToBC[159] = "EZK37";
mapProphetsToBC[160] = "EZK38";
mapProphetsToBC[161] = "EZK39";
mapProphetsToBC[162] = "EZK40";
mapProphetsToBC[163] = "EZK41";
mapProphetsToBC[164] = "EZK42";
mapProphetsToBC[165] = "EZK43";
mapProphetsToBC[166] = "EZK44";
mapProphetsToBC[167] = "EZK45";
mapProphetsToBC[168] = "EZK46";
mapProphetsToBC[169] = "EZK47";
mapProphetsToBC[170] = "EZK48";
mapProphetsToBC[171] = "DAN01";
mapProphetsToBC[172] = "DAN02";
mapProphetsToBC[173] = "DAN03";
mapProphetsToBC[174] = "DAN04";
mapProphetsToBC[175] = "DAN05";
mapProphetsToBC[176] = "DAN06";
mapProphetsToBC[177] = "DAN07";
mapProphetsToBC[178] = "DAN08";
mapProphetsToBC[179] = "DAN09";
mapProphetsToBC[180] = "DAN10";
mapProphetsToBC[181] = "DAN11";
mapProphetsToBC[182] = "DAN12";
mapProphetsToBC[183] = "HOS01";
mapProphetsToBC[184] = "HOS02";
mapProphetsToBC[185] = "HOS03";
mapProphetsToBC[186] = "HOS04";
mapProphetsToBC[187] = "HOS05";
mapProphetsToBC[188] = "HOS06";
mapProphetsToBC[189] = "HOS07";
mapProphetsToBC[190] = "HOS08";
mapProphetsToBC[191] = "HOS09";
mapProphetsToBC[192] = "HOS10";
mapProphetsToBC[193] = "HOS11";
mapProphetsToBC[194] = "HOS12";
mapProphetsToBC[195] = "HOS13";
mapProphetsToBC[196] = "HOS14";
mapProphetsToBC[197] = "JOL01";
mapProphetsToBC[198] = "JOL02";
mapProphetsToBC[199] = "JOL03";
mapProphetsToBC[200] = "AMO01";
mapProphetsToBC[201] = "AMO02";
mapProphetsToBC[202] = "AMO03";
mapProphetsToBC[203] = "AMO04";
mapProphetsToBC[204] = "AMO05";
mapProphetsToBC[205] = "AMO06";
mapProphetsToBC[206] = "AMO07";
mapProphetsToBC[207] = "AMO08";
mapProphetsToBC[208] = "AMO09";
mapProphetsToBC[209] = "OBA01";
mapProphetsToBC[210] = "JON01";
mapProphetsToBC[211] = "JON02";
mapProphetsToBC[212] = "JON03";
mapProphetsToBC[213] = "JON04";
mapProphetsToBC[214] = "MIC01";
mapProphetsToBC[215] = "MIC02";
mapProphetsToBC[216] = "MIC03";
mapProphetsToBC[217] = "MIC04";
mapProphetsToBC[218] = "MIC05";
mapProphetsToBC[219] = "MIC06";
mapProphetsToBC[220] = "MIC07";
mapProphetsToBC[221] = "NAM01";
mapProphetsToBC[222] = "NAM02";
mapProphetsToBC[223] = "NAM03";
mapProphetsToBC[224] = "HAB01";
mapProphetsToBC[225] = "HAB02";
mapProphetsToBC[226] = "HAB03";
mapProphetsToBC[227] = "ZEP01";
mapProphetsToBC[228] = "ZEP02";
mapProphetsToBC[229] = "ZEP03";
mapProphetsToBC[230] = "HAG01";
mapProphetsToBC[231] = "HAG02";
mapProphetsToBC[232] = "ZEC01";
mapProphetsToBC[233] = "ZEC02";
mapProphetsToBC[234] = "ZEC03";
mapProphetsToBC[235] = "ZEC04";
mapProphetsToBC[236] = "ZEC05";
mapProphetsToBC[237] = "ZEC06";
mapProphetsToBC[238] = "ZEC07";
mapProphetsToBC[239] = "ZEC08";
mapProphetsToBC[240] = "ZEC09";
mapProphetsToBC[241] = "ZEC10";
mapProphetsToBC[242] = "ZEC11";
mapProphetsToBC[243] = "ZEC12";
mapProphetsToBC[244] = "ZEC13";
mapProphetsToBC[245] = "ZEC14";
mapProphetsToBC[246] = "MAL01";
mapProphetsToBC[247] = "MAL02";
mapProphetsToBC[248] = "MAL03";
mapProphetsToBC[249] = "MAL04";


var mapGospelsToBC = new Array();
mapGospelsToBC[0] = "MAT01";
mapGospelsToBC[1] = "MAT02";
mapGospelsToBC[2] = "MAT03";
mapGospelsToBC[3] = "MAT04";
mapGospelsToBC[4] = "MAT05";
mapGospelsToBC[5] = "MAT06";
mapGospelsToBC[6] = "MAT07";
mapGospelsToBC[7] = "MAT08";
mapGospelsToBC[8] = "MAT09";
mapGospelsToBC[9] = "MAT10";
mapGospelsToBC[10] = "MAT11";
mapGospelsToBC[11] = "MAT12";
mapGospelsToBC[12] = "MAT13";
mapGospelsToBC[13] = "MAT14";
mapGospelsToBC[14] = "MAT15";
mapGospelsToBC[15] = "MAT16";
mapGospelsToBC[16] = "MAT17";
mapGospelsToBC[17] = "MAT18";
mapGospelsToBC[18] = "MAT19";
mapGospelsToBC[19] = "MAT20";
mapGospelsToBC[20] = "MAT21";
mapGospelsToBC[21] = "MAT22";
mapGospelsToBC[22] = "MAT23";
mapGospelsToBC[23] = "MAT24";
mapGospelsToBC[24] = "MAT25";
mapGospelsToBC[25] = "MAT26";
mapGospelsToBC[26] = "MAT27";
mapGospelsToBC[27] = "MAT28";
mapGospelsToBC[28] = "MRK01";
mapGospelsToBC[29] = "MRK02";
mapGospelsToBC[30] = "MRK03";
mapGospelsToBC[31] = "MRK04";
mapGospelsToBC[32] = "MRK05";
mapGospelsToBC[33] = "MRK06";
mapGospelsToBC[34] = "MRK07";
mapGospelsToBC[35] = "MRK08";
mapGospelsToBC[36] = "MRK09";
mapGospelsToBC[37] = "MRK10";
mapGospelsToBC[38] = "MRK11";
mapGospelsToBC[39] = "MRK12";
mapGospelsToBC[40] = "MRK13";
mapGospelsToBC[41] = "MRK14";
mapGospelsToBC[42] = "MRK15";
mapGospelsToBC[43] = "MRK16";
mapGospelsToBC[44] = "LUK01";
mapGospelsToBC[45] = "LUK02";
mapGospelsToBC[46] = "LUK03";
mapGospelsToBC[47] = "LUK04";
mapGospelsToBC[48] = "LUK05";
mapGospelsToBC[49] = "LUK06";
mapGospelsToBC[50] = "LUK07";
mapGospelsToBC[51] = "LUK08";
mapGospelsToBC[52] = "LUK09";
mapGospelsToBC[53] = "LUK10";
mapGospelsToBC[54] = "LUK11";
mapGospelsToBC[55] = "LUK12";
mapGospelsToBC[56] = "LUK13";
mapGospelsToBC[57] = "LUK14";
mapGospelsToBC[58] = "LUK15";
mapGospelsToBC[59] = "LUK16";
mapGospelsToBC[60] = "LUK17";
mapGospelsToBC[61] = "LUK18";
mapGospelsToBC[62] = "LUK19";
mapGospelsToBC[63] = "LUK20";
mapGospelsToBC[64] = "LUK21";
mapGospelsToBC[65] = "LUK22";
mapGospelsToBC[66] = "LUK23";
mapGospelsToBC[67] = "LUK24";
mapGospelsToBC[68] = "JHN01";
mapGospelsToBC[69] = "JHN02";
mapGospelsToBC[70] = "JHN03";
mapGospelsToBC[71] = "JHN04";
mapGospelsToBC[72] = "JHN05";
mapGospelsToBC[73] = "JHN06";
mapGospelsToBC[74] = "JHN07";
mapGospelsToBC[75] = "JHN08";
mapGospelsToBC[76] = "JHN09";
mapGospelsToBC[77] = "JHN10";
mapGospelsToBC[78] = "JHN11";
mapGospelsToBC[79] = "JHN12";
mapGospelsToBC[80] = "JHN13";
mapGospelsToBC[81] = "JHN14";
mapGospelsToBC[82] = "JHN15";
mapGospelsToBC[83] = "JHN16";
mapGospelsToBC[84] = "JHN17";
mapGospelsToBC[85] = "JHN18";
mapGospelsToBC[86] = "JHN19";
mapGospelsToBC[87] = "JHN20";
mapGospelsToBC[88] = "JHN21";


var mapChurchHistoryToBC = new Array();
mapChurchHistoryToBC[0] = "ACT01";
mapChurchHistoryToBC[1] = "ACT02";
mapChurchHistoryToBC[2] = "ACT03";
mapChurchHistoryToBC[3] = "ACT04";
mapChurchHistoryToBC[4] = "ACT05";
mapChurchHistoryToBC[5] = "ACT06";
mapChurchHistoryToBC[6] = "ACT07";
mapChurchHistoryToBC[7] = "ACT08";
mapChurchHistoryToBC[8] = "ACT09";
mapChurchHistoryToBC[9] = "ACT10";
mapChurchHistoryToBC[10] = "ACT11";
mapChurchHistoryToBC[11] = "ACT12";
mapChurchHistoryToBC[12] = "ACT13";
mapChurchHistoryToBC[13] = "ACT14";
mapChurchHistoryToBC[14] = "ACT15";
mapChurchHistoryToBC[15] = "ACT16";
mapChurchHistoryToBC[16] = "ACT17";
mapChurchHistoryToBC[17] = "ACT18";
mapChurchHistoryToBC[18] = "ACT19";
mapChurchHistoryToBC[19] = "ACT20";
mapChurchHistoryToBC[20] = "ACT21";
mapChurchHistoryToBC[21] = "ACT22";
mapChurchHistoryToBC[22] = "ACT23";
mapChurchHistoryToBC[23] = "ACT24";
mapChurchHistoryToBC[24] = "ACT25";
mapChurchHistoryToBC[25] = "ACT26";
mapChurchHistoryToBC[26] = "ACT27";
mapChurchHistoryToBC[27] = "ACT28";
mapChurchHistoryToBC[28] = "ROM01";
mapChurchHistoryToBC[29] = "ROM02";
mapChurchHistoryToBC[30] = "ROM03";
mapChurchHistoryToBC[31] = "ROM04";
mapChurchHistoryToBC[32] = "ROM05";
mapChurchHistoryToBC[33] = "ROM06";
mapChurchHistoryToBC[34] = "ROM07";
mapChurchHistoryToBC[35] = "ROM08";
mapChurchHistoryToBC[36] = "ROM09";
mapChurchHistoryToBC[37] = "ROM10";
mapChurchHistoryToBC[38] = "ROM11";
mapChurchHistoryToBC[39] = "ROM12";
mapChurchHistoryToBC[40] = "ROM13";
mapChurchHistoryToBC[41] = "ROM14";
mapChurchHistoryToBC[42] = "ROM15";
mapChurchHistoryToBC[43] = "ROM16";
mapChurchHistoryToBC[44] = "1CO01";
mapChurchHistoryToBC[45] = "1CO02";
mapChurchHistoryToBC[46] = "1CO03";
mapChurchHistoryToBC[47] = "1CO04";
mapChurchHistoryToBC[48] = "1CO05";
mapChurchHistoryToBC[49] = "1CO06";
mapChurchHistoryToBC[50] = "1CO07";
mapChurchHistoryToBC[51] = "1CO08";
mapChurchHistoryToBC[52] = "1CO09";
mapChurchHistoryToBC[53] = "1CO10";
mapChurchHistoryToBC[54] = "1CO11";
mapChurchHistoryToBC[55] = "1CO12";
mapChurchHistoryToBC[56] = "1CO13";
mapChurchHistoryToBC[57] = "1CO14";
mapChurchHistoryToBC[58] = "1CO15";
mapChurchHistoryToBC[59] = "1CO16";
mapChurchHistoryToBC[60] = "2CO01";
mapChurchHistoryToBC[61] = "2CO02";
mapChurchHistoryToBC[62] = "2CO03";
mapChurchHistoryToBC[63] = "2CO04";
mapChurchHistoryToBC[64] = "2CO05";
mapChurchHistoryToBC[65] = "2CO06";
mapChurchHistoryToBC[66] = "2CO07";
mapChurchHistoryToBC[67] = "2CO08";
mapChurchHistoryToBC[68] = "2CO09";
mapChurchHistoryToBC[69] = "2CO10";
mapChurchHistoryToBC[70] = "2CO11";
mapChurchHistoryToBC[71] = "2CO12";
mapChurchHistoryToBC[72] = "2CO13";
mapChurchHistoryToBC[73] = "GAL01";
mapChurchHistoryToBC[74] = "GAL02";
mapChurchHistoryToBC[75] = "GAL03";
mapChurchHistoryToBC[76] = "GAL04";
mapChurchHistoryToBC[77] = "GAL05";
mapChurchHistoryToBC[78] = "GAL06";
mapChurchHistoryToBC[79] = "EPH01";
mapChurchHistoryToBC[80] = "EPH02";
mapChurchHistoryToBC[81] = "EPH03";
mapChurchHistoryToBC[82] = "EPH04";
mapChurchHistoryToBC[83] = "EPH05";
mapChurchHistoryToBC[84] = "EPH06";
mapChurchHistoryToBC[85] = "PHP01";
mapChurchHistoryToBC[86] = "PHP02";
mapChurchHistoryToBC[87] = "PHP03";
mapChurchHistoryToBC[88] = "PHP04";
mapChurchHistoryToBC[89] = "COL01";
mapChurchHistoryToBC[90] = "COL02";
mapChurchHistoryToBC[91] = "COL03";
mapChurchHistoryToBC[92] = "COL04";
mapChurchHistoryToBC[93] = "1TH01";
mapChurchHistoryToBC[94] = "1TH02";
mapChurchHistoryToBC[95] = "1TH03";
mapChurchHistoryToBC[96] = "1TH04";
mapChurchHistoryToBC[97] = "1TH05";
mapChurchHistoryToBC[98] = "2TH01";
mapChurchHistoryToBC[99] = "2TH02";
mapChurchHistoryToBC[100] = "2TH03";
mapChurchHistoryToBC[101] = "1TI01";
mapChurchHistoryToBC[102] = "1TI02";
mapChurchHistoryToBC[103] = "1TI03";
mapChurchHistoryToBC[104] = "1TI04";
mapChurchHistoryToBC[105] = "1TI05";
mapChurchHistoryToBC[106] = "1TI06";
mapChurchHistoryToBC[107] = "2TI01";
mapChurchHistoryToBC[108] = "2TI02";
mapChurchHistoryToBC[109] = "2TI03";
mapChurchHistoryToBC[110] = "2TI04";
mapChurchHistoryToBC[111] = "TIT01";
mapChurchHistoryToBC[112] = "TIT02";
mapChurchHistoryToBC[113] = "TIT03";
mapChurchHistoryToBC[114] = "PHM01";
mapChurchHistoryToBC[115] = "HEB01";
mapChurchHistoryToBC[116] = "HEB02";
mapChurchHistoryToBC[117] = "HEB03";
mapChurchHistoryToBC[118] = "HEB04";
mapChurchHistoryToBC[119] = "HEB05";
mapChurchHistoryToBC[120] = "HEB06";
mapChurchHistoryToBC[121] = "HEB07";
mapChurchHistoryToBC[122] = "HEB08";
mapChurchHistoryToBC[123] = "HEB09";
mapChurchHistoryToBC[124] = "HEB10";
mapChurchHistoryToBC[125] = "HEB11";
mapChurchHistoryToBC[126] = "HEB12";
mapChurchHistoryToBC[127] = "HEB13";
mapChurchHistoryToBC[128] = "JAS01";
mapChurchHistoryToBC[129] = "JAS02";
mapChurchHistoryToBC[130] = "JAS03";
mapChurchHistoryToBC[131] = "JAS04";
mapChurchHistoryToBC[132] = "JAS05";
mapChurchHistoryToBC[133] = "1PE01";
mapChurchHistoryToBC[134] = "1PE02";
mapChurchHistoryToBC[135] = "1PE03";
mapChurchHistoryToBC[136] = "1PE04";
mapChurchHistoryToBC[137] = "1PE05";
mapChurchHistoryToBC[138] = "2PE01";
mapChurchHistoryToBC[139] = "2PE02";
mapChurchHistoryToBC[140] = "2PE03";
mapChurchHistoryToBC[141] = "1JN01";
mapChurchHistoryToBC[142] = "1JN02";
mapChurchHistoryToBC[143] = "1JN03";
mapChurchHistoryToBC[144] = "1JN04";
mapChurchHistoryToBC[145] = "1JN05";
mapChurchHistoryToBC[146] = "2JN01";
mapChurchHistoryToBC[147] = "3JN01";
mapChurchHistoryToBC[148] = "JUD01";
mapChurchHistoryToBC[149] = "REV01";
mapChurchHistoryToBC[150] = "REV02";
mapChurchHistoryToBC[151] = "REV03";
mapChurchHistoryToBC[152] = "REV04";
mapChurchHistoryToBC[153] = "REV05";
mapChurchHistoryToBC[154] = "REV06";
mapChurchHistoryToBC[155] = "REV07";
mapChurchHistoryToBC[156] = "REV08";
mapChurchHistoryToBC[157] = "REV09";
mapChurchHistoryToBC[158] = "REV10";
mapChurchHistoryToBC[159] = "REV11";
mapChurchHistoryToBC[160] = "REV12";
mapChurchHistoryToBC[161] = "REV13";
mapChurchHistoryToBC[162] = "REV14";
mapChurchHistoryToBC[163] = "REV15";
mapChurchHistoryToBC[164] = "REV16";
mapChurchHistoryToBC[165] = "REV17";
mapChurchHistoryToBC[166] = "REV18";
mapChurchHistoryToBC[167] = "REV19";
mapChurchHistoryToBC[168] = "REV20";
mapChurchHistoryToBC[169] = "REV21";
mapChurchHistoryToBC[170] = "REV22";


var SILTitleAbbrToHeader_eng = new Object();
SILTitleAbbrToHeader_eng["GEN"] = "Genesis";
SILTitleAbbrToHeader_eng["EXO"] = "Exodus";
SILTitleAbbrToHeader_eng["LEV"] = "Leviticus";
SILTitleAbbrToHeader_eng["NUM"] = "Numbers";
SILTitleAbbrToHeader_eng["DEU"] = "Deuteronomy";
SILTitleAbbrToHeader_eng["JOS"] = "Joshua";
SILTitleAbbrToHeader_eng["JDG"] = "Judges";
SILTitleAbbrToHeader_eng["RUT"] = "Ruth";
SILTitleAbbrToHeader_eng["1SA"] = "1 Samuel";
SILTitleAbbrToHeader_eng["2SA"] = "2 Samuel";
SILTitleAbbrToHeader_eng["1KI"] = "1 Kings";
SILTitleAbbrToHeader_eng["2KI"] = "2 Kings";
SILTitleAbbrToHeader_eng["1CH"] = "1 Chronicles";
SILTitleAbbrToHeader_eng["2CH"] = "2 Chronicles";
SILTitleAbbrToHeader_eng["EZR"] = "Ezra";
SILTitleAbbrToHeader_eng["NEH"] = "Nehemiah";
SILTitleAbbrToHeader_eng["EST"] = "Esther";
SILTitleAbbrToHeader_eng["JOB"] = "Job";
SILTitleAbbrToHeader_eng["PSA"] = "Psalms";
SILTitleAbbrToHeader_eng["PRO"] = "Proverbs";
SILTitleAbbrToHeader_eng["ECC"] = "Ecclesiastes";
SILTitleAbbrToHeader_eng["SNG"] = "Song of Solomon";
SILTitleAbbrToHeader_eng["ISA"] = "Isaiah";
SILTitleAbbrToHeader_eng["JER"] = "Jeremiah";
SILTitleAbbrToHeader_eng["LAM"] = "Lamentations";
SILTitleAbbrToHeader_eng["EZK"] = "Ezekiel";
SILTitleAbbrToHeader_eng["DAN"] = "Daniel";
SILTitleAbbrToHeader_eng["HOS"] = "Hosea";
SILTitleAbbrToHeader_eng["JOL"] = "Joel";
SILTitleAbbrToHeader_eng["AMO"] = "Amos";
SILTitleAbbrToHeader_eng["OBA"] = "Obadiah";
SILTitleAbbrToHeader_eng["JON"] = "Jonah";
SILTitleAbbrToHeader_eng["MIC"] = "Micah";
SILTitleAbbrToHeader_eng["NAM"] = "Nahum";
SILTitleAbbrToHeader_eng["HAB"] = "Habakkuk";
SILTitleAbbrToHeader_eng["ZEP"] = "Zephaniah";
SILTitleAbbrToHeader_eng["HAG"] = "Haggai";
SILTitleAbbrToHeader_eng["ZEC"] = "Zechariah";
SILTitleAbbrToHeader_eng["MAL"] = "Malachi";
SILTitleAbbrToHeader_eng["TOB"] = "Tobit";
SILTitleAbbrToHeader_eng["JDT"] = "Judith";
SILTitleAbbrToHeader_eng["ESG"] = "Esther (Greek)";
SILTitleAbbrToHeader_eng["WIS"] = "Wisdom";
SILTitleAbbrToHeader_eng["SIR"] = "Sirach";
SILTitleAbbrToHeader_eng["BAR"] = "Baruch";
SILTitleAbbrToHeader_eng["LJE"] = "Letter of Jeremiah";
SILTitleAbbrToHeader_eng["S3Y"] = "Azariah";
SILTitleAbbrToHeader_eng["SUS"] = "Susanna";
SILTitleAbbrToHeader_eng["BEL"] = "Bel";
SILTitleAbbrToHeader_eng["1MA"] = "1 Maccabees";
SILTitleAbbrToHeader_eng["2MA"] = "2 Maccabees";
SILTitleAbbrToHeader_eng["1ES"] = "1 Esdras";
SILTitleAbbrToHeader_eng["MAN"] = "Manasseh";
SILTitleAbbrToHeader_eng["2ES"] = "2 Esdras";
SILTitleAbbrToHeader_eng["MAT"] = "Matthew";
SILTitleAbbrToHeader_eng["MRK"] = "Mark";
SILTitleAbbrToHeader_eng["LUK"] = "Luke";
SILTitleAbbrToHeader_eng["JHN"] = "John";
SILTitleAbbrToHeader_eng["ACT"] = "Acts";
SILTitleAbbrToHeader_eng["ROM"] = "Romans";
SILTitleAbbrToHeader_eng["1CO"] = "1 Corinthians";
SILTitleAbbrToHeader_eng["2CO"] = "2 Corinthians";
SILTitleAbbrToHeader_eng["GAL"] = "Galatians";
SILTitleAbbrToHeader_eng["EPH"] = "Ephesians";
SILTitleAbbrToHeader_eng["PHP"] = "Philippians";
SILTitleAbbrToHeader_eng["COL"] = "Colossians";
SILTitleAbbrToHeader_eng["1TH"] = "1 Thessalonians";
SILTitleAbbrToHeader_eng["2TH"] = "2 Thessalonians";
SILTitleAbbrToHeader_eng["1TI"] = "1 Timothy";
SILTitleAbbrToHeader_eng["2TI"] = "2 Timothy";
SILTitleAbbrToHeader_eng["TIT"] = "Titus";
SILTitleAbbrToHeader_eng["PHM"] = "Philemon";
SILTitleAbbrToHeader_eng["HEB"] = "Hebrews";
SILTitleAbbrToHeader_eng["JAS"] = "James";
SILTitleAbbrToHeader_eng["1PE"] = "1 Peter";
SILTitleAbbrToHeader_eng["2PE"] = "2 Peter";
SILTitleAbbrToHeader_eng["1JN"] = "1 John";
SILTitleAbbrToHeader_eng["2JN"] = "2 John";
SILTitleAbbrToHeader_eng["3JN"] = "3 John";
SILTitleAbbrToHeader_eng["JUD"] = "Jude";
SILTitleAbbrToHeader_eng["REV"] = "Revelation";

var BookStats = {
	"GEN": { verses: 1533, words: 38262 },
	"EXO": { verses: 1213, words: 32685 },
	"LEV": { verses: 859, words: 24541 },
	"NUM": { verses: 1288, words: 32896 },
	"DEU": { verses: 959, words: 28352 },
	"JOS": { verses: 658, words: 18854 },
	"JDG": { verses: 618, words: 18966 },
	"RUT": { verses: 85, words: 2574 },
	"1SA": { verses: 810, words: 25048 },
	"2SA": { verses: 695, words: 20600 },
	"1KI": { verses: 816, words: 24513 },
	"2KI": { verses: 719, words: 23517 },
	"1CH": { verses: 942, words: 20365 },
	"2CH": { verses: 822, words: 26069 },
	"EZR": { verses: 280, words: 7440 },
	"NEH": { verses: 406, words: 10480 },
	"EST": { verses: 167, words: 5633 },
	"JOB": { verses: 1070, words: 18098 },
	"PSA": { verses: 2461, words: 42704 },
	"PRO": { verses: 915, words: 15038 },
	"ECC": { verses: 222, words: 5579 },
	"SNG": { verses: 117, words: 2658 },
	"ISA": { verses: 1292, words: 37036 },
	"JER": { verses: 1364, words: 42654 },
	"LAM": { verses: 154, words: 3411 },
	"EZK": { verses: 1273, words: 39401 },
	"DAN": { verses: 357, words: 11602 },
	"HOS": { verses: 197, words: 5174 },
	"JOL": { verses: 73, words: 2033 },
	"AMO": { verses: 146, words: 4216 },
	"OBA": { verses: 21, words: 669 },
	"JON": { verses: 48, words: 1320 },
	"MIC": { verses: 105, words: 3152 },
	"NAM": { verses: 47, words: 1284 },
	"HAB": { verses: 56, words: 1475 },
	"ZEP": { verses: 53, words: 1616 },
	"HAG": { verses: 38, words: 1130 },
	"ZEC": { verses: 211, words: 6443 },
	"MAL": { verses: 55, words: 1781 },
	"MAT": { verses: 1071, words: 23343 },
	"MRK": { verses: 678, words: 14949 },
	"LUK": { verses: 1151, words: 25640 },
	"JHN": { verses: 879, words: 18658 },
	"ACT": { verses: 1007, words: 24229 },
	"ROM": { verses: 433, words: 9422 },
	"1CO": { verses: 437, words: 9462 },
	"2CO": { verses: 257, words: 6046 },
	"GAL": { verses: 149, words: 3084 },
	"EPH": { verses: 155, words: 3022 },
	"PHP": { verses: 104, words: 2183 },
	"COL": { verses: 95, words: 1979 },
	"1TH": { verses: 89, words: 1837 },
	"2TH": { verses: 47, words: 1022 },
	"1TI": { verses: 113, words: 2244 },
	"2TI": { verses: 83, words: 1666 },
	"TIT": { verses: 46, words: 896 },
	"PHM": { verses: 25, words: 430 },
	"HEB": { verses: 303, words: 6897 },
	"JAS": { verses: 108, words: 2304 },
	"1PE": { verses: 105, words: 2476 },
	"2PE": { verses: 61, words: 1553 },
	"1JN": { verses: 105, words: 2517 },
	"2JN": { verses: 13, words: 298 },
	"3JN": { verses: 14, words: 294 },
	"JUD": { verses: 25, words: 608 },
	"REV": { verses: 404, words: 11952 },
    "GEN01" : { verses : 31 },
    "GEN02" : { verses : 25 },
    "GEN03" : { verses : 24 },
    "GEN04" : { verses : 26 },
    "GEN05" : { verses : 32 },
    "GEN06" : { verses : 22 },
    "GEN07" : { verses : 24 },
    "GEN08" : { verses : 22 },
    "GEN09" : { verses : 29 },
    "GEN10" : { verses : 32 },
    "GEN11" : { verses : 32 },
    "GEN12" : { verses : 20 },
    "GEN13" : { verses : 18 },
    "GEN14" : { verses : 24 },
    "GEN15" : { verses : 21 },
    "GEN16" : { verses : 16 },
    "GEN17" : { verses : 27 },
    "GEN18" : { verses : 33 },
    "GEN19" : { verses : 38 },
    "GEN20" : { verses : 18 },
    "GEN21" : { verses : 34 },
    "GEN22" : { verses : 24 },
    "GEN23" : { verses : 20 },
    "GEN24" : { verses : 67 },
    "GEN25" : { verses : 34 },
    "GEN26" : { verses : 35 },
    "GEN27" : { verses : 46 },
    "GEN28" : { verses : 22 },
    "GEN29" : { verses : 35 },
    "GEN30" : { verses : 43 },
    "GEN31" : { verses : 55 },
    "GEN32" : { verses : 32 },
    "GEN33" : { verses : 20 },
    "GEN34" : { verses : 31 },
    "GEN35" : { verses : 29 },
    "GEN36" : { verses : 43 },
    "GEN37" : { verses : 36 },
    "GEN38" : { verses : 30 },
    "GEN39" : { verses : 23 },
    "GEN40" : { verses : 23 },
    "GEN41" : { verses : 57 },
    "GEN42" : { verses : 38 },
    "GEN43" : { verses : 34 },
    "GEN44" : { verses : 34 },
    "GEN45" : { verses : 28 },
    "GEN46" : { verses : 34 },
    "GEN47" : { verses : 31 },
    "GEN48" : { verses : 22 },
    "GEN49" : { verses : 33 },
    "GEN50" : { verses : 26 },
    "EXO01" : { verses : 22 },
    "EXO02" : { verses : 25 },
    "EXO03" : { verses : 22 },
    "EXO04" : { verses : 31 },
    "EXO05" : { verses : 23 },
    "EXO06" : { verses : 30 },
    "EXO07" : { verses : 25 },
    "EXO08" : { verses : 32 },
    "EXO09" : { verses : 35 },
    "EXO10" : { verses : 29 },
    "EXO11" : { verses : 10 },
    "EXO12" : { verses : 51 },
    "EXO13" : { verses : 22 },
    "EXO14" : { verses : 31 },
    "EXO15" : { verses : 27 },
    "EXO16" : { verses : 36 },
    "EXO17" : { verses : 16 },
    "EXO18" : { verses : 27 },
    "EXO19" : { verses : 25 },
    "EXO20" : { verses : 26 },
    "EXO21" : { verses : 36 },
    "EXO22" : { verses : 31 },
    "EXO23" : { verses : 33 },
    "EXO24" : { verses : 18 },
    "EXO25" : { verses : 40 },
    "EXO26" : { verses : 37 },
    "EXO27" : { verses : 21 },
    "EXO28" : { verses : 43 },
    "EXO29" : { verses : 46 },
    "EXO30" : { verses : 38 },
    "EXO31" : { verses : 18 },
    "EXO32" : { verses : 35 },
    "EXO33" : { verses : 23 },
    "EXO34" : { verses : 35 },
    "EXO35" : { verses : 35 },
    "EXO36" : { verses : 38 },
    "EXO37" : { verses : 29 },
    "EXO38" : { verses : 31 },
    "EXO39" : { verses : 43 },
    "EXO40" : { verses : 38 },
    "LEV01" : { verses : 17 },
    "LEV02" : { verses : 16 },
    "LEV03" : { verses : 17 },
    "LEV04" : { verses : 35 },
    "LEV05" : { verses : 19 },
    "LEV06" : { verses : 30 },
    "LEV07" : { verses : 38 },
    "LEV08" : { verses : 36 },
    "LEV09" : { verses : 24 },
    "LEV10" : { verses : 20 },
    "LEV11" : { verses : 47 },
    "LEV12" : { verses : 8 },
    "LEV13" : { verses : 59 },
    "LEV14" : { verses : 57 },
    "LEV15" : { verses : 33 },
    "LEV16" : { verses : 34 },
    "LEV17" : { verses : 16 },
    "LEV18" : { verses : 30 },
    "LEV19" : { verses : 37 },
    "LEV20" : { verses : 27 },
    "LEV21" : { verses : 24 },
    "LEV22" : { verses : 33 },
    "LEV23" : { verses : 44 },
    "LEV24" : { verses : 23 },
    "LEV25" : { verses : 55 },
    "LEV26" : { verses : 46 },
    "LEV27" : { verses : 34 },
    "NUM01" : { verses : 54 },
    "NUM02" : { verses : 34 },
    "NUM03" : { verses : 51 },
    "NUM04" : { verses : 49 },
    "NUM05" : { verses : 31 },
    "NUM06" : { verses : 27 },
    "NUM07" : { verses : 89 },
    "NUM08" : { verses : 26 },
    "NUM09" : { verses : 23 },
    "NUM10" : { verses : 36 },
    "NUM11" : { verses : 35 },
    "NUM12" : { verses : 16 },
    "NUM13" : { verses : 33 },
    "NUM14" : { verses : 45 },
    "NUM15" : { verses : 41 },
    "NUM16" : { verses : 50 },
    "NUM17" : { verses : 13 },
    "NUM18" : { verses : 32 },
    "NUM19" : { verses : 22 },
    "NUM20" : { verses : 29 },
    "NUM21" : { verses : 35 },
    "NUM22" : { verses : 41 },
    "NUM23" : { verses : 30 },
    "NUM24" : { verses : 25 },
    "NUM25" : { verses : 18 },
    "NUM26" : { verses : 65 },
    "NUM27" : { verses : 23 },
    "NUM28" : { verses : 31 },
    "NUM29" : { verses : 40 },
    "NUM30" : { verses : 16 },
    "NUM31" : { verses : 54 },
    "NUM32" : { verses : 42 },
    "NUM33" : { verses : 56 },
    "NUM34" : { verses : 29 },
    "NUM35" : { verses : 34 },
    "NUM36" : { verses : 13 },
    "DEU01" : { verses : 46 },
    "DEU02" : { verses : 37 },
    "DEU03" : { verses : 29 },
    "DEU04" : { verses : 49 },
    "DEU05" : { verses : 33 },
    "DEU06" : { verses : 25 },
    "DEU07" : { verses : 26 },
    "DEU08" : { verses : 20 },
    "DEU09" : { verses : 29 },
    "DEU10" : { verses : 22 },
    "DEU11" : { verses : 32 },
    "DEU12" : { verses : 32 },
    "DEU13" : { verses : 18 },
    "DEU14" : { verses : 29 },
    "DEU15" : { verses : 23 },
    "DEU16" : { verses : 22 },
    "DEU17" : { verses : 20 },
    "DEU18" : { verses : 22 },
    "DEU19" : { verses : 21 },
    "DEU20" : { verses : 20 },
    "DEU21" : { verses : 23 },
    "DEU22" : { verses : 30 },
    "DEU23" : { verses : 25 },
    "DEU24" : { verses : 22 },
    "DEU25" : { verses : 19 },
    "DEU26" : { verses : 19 },
    "DEU27" : { verses : 26 },
    "DEU28" : { verses : 68 },
    "DEU29" : { verses : 29 },
    "DEU30" : { verses : 20 },
    "DEU31" : { verses : 30 },
    "DEU32" : { verses : 52 },
    "DEU33" : { verses : 29 },
    "DEU34" : { verses : 12 },
    "JOS01" : { verses : 18 },
    "JOS02" : { verses : 24 },
    "JOS03" : { verses : 17 },
    "JOS04" : { verses : 24 },
    "JOS05" : { verses : 15 },
    "JOS06" : { verses : 27 },
    "JOS07" : { verses : 26 },
    "JOS08" : { verses : 35 },
    "JOS09" : { verses : 27 },
    "JOS10" : { verses : 43 },
    "JOS11" : { verses : 23 },
    "JOS12" : { verses : 24 },
    "JOS13" : { verses : 33 },
    "JOS14" : { verses : 15 },
    "JOS15" : { verses : 63 },
    "JOS16" : { verses : 10 },
    "JOS17" : { verses : 18 },
    "JOS18" : { verses : 28 },
    "JOS19" : { verses : 51 },
    "JOS20" : { verses : 9 },
    "JOS21" : { verses : 45 },
    "JOS22" : { verses : 34 },
    "JOS23" : { verses : 16 },
    "JOS24" : { verses : 33 },
    "JDG01" : { verses : 36 },
    "JDG02" : { verses : 23 },
    "JDG03" : { verses : 31 },
    "JDG04" : { verses : 24 },
    "JDG05" : { verses : 31 },
    "JDG06" : { verses : 40 },
    "JDG07" : { verses : 25 },
    "JDG08" : { verses : 35 },
    "JDG09" : { verses : 57 },
    "JDG10" : { verses : 18 },
    "JDG11" : { verses : 40 },
    "JDG12" : { verses : 15 },
    "JDG13" : { verses : 25 },
    "JDG14" : { verses : 20 },
    "JDG15" : { verses : 20 },
    "JDG16" : { verses : 31 },
    "JDG17" : { verses : 13 },
    "JDG18" : { verses : 31 },
    "JDG19" : { verses : 30 },
    "JDG20" : { verses : 48 },
    "JDG21" : { verses : 25 },
    "RUT01" : { verses : 22 },
    "RUT02" : { verses : 23 },
    "RUT03" : { verses : 18 },
    "RUT04" : { verses : 22 },
    "1SA01" : { verses : 28 },
    "1SA02" : { verses : 36 },
    "1SA03" : { verses : 21 },
    "1SA04" : { verses : 22 },
    "1SA05" : { verses : 12 },
    "1SA06" : { verses : 21 },
    "1SA07" : { verses : 17 },
    "1SA08" : { verses : 22 },
    "1SA09" : { verses : 27 },
    "1SA10" : { verses : 27 },
    "1SA11" : { verses : 15 },
    "1SA12" : { verses : 25 },
    "1SA13" : { verses : 23 },
    "1SA14" : { verses : 52 },
    "1SA15" : { verses : 35 },
    "1SA16" : { verses : 23 },
    "1SA17" : { verses : 58 },
    "1SA18" : { verses : 30 },
    "1SA19" : { verses : 24 },
    "1SA20" : { verses : 42 },
    "1SA21" : { verses : 15 },
    "1SA22" : { verses : 23 },
    "1SA23" : { verses : 29 },
    "1SA24" : { verses : 22 },
    "1SA25" : { verses : 44 },
    "1SA26" : { verses : 25 },
    "1SA27" : { verses : 12 },
    "1SA28" : { verses : 25 },
    "1SA29" : { verses : 11 },
    "1SA30" : { verses : 31 },
    "1SA31" : { verses : 13 },
    "2SA01" : { verses : 27 },
    "2SA02" : { verses : 32 },
    "2SA03" : { verses : 39 },
    "2SA04" : { verses : 12 },
    "2SA05" : { verses : 25 },
    "2SA06" : { verses : 23 },
    "2SA07" : { verses : 29 },
    "2SA08" : { verses : 18 },
    "2SA09" : { verses : 13 },
    "2SA10" : { verses : 19 },
    "2SA11" : { verses : 27 },
    "2SA12" : { verses : 31 },
    "2SA13" : { verses : 39 },
    "2SA14" : { verses : 33 },
    "2SA15" : { verses : 37 },
    "2SA16" : { verses : 23 },
    "2SA17" : { verses : 29 },
    "2SA18" : { verses : 33 },
    "2SA19" : { verses : 43 },
    "2SA20" : { verses : 26 },
    "2SA21" : { verses : 22 },
    "2SA22" : { verses : 51 },
    "2SA23" : { verses : 39 },
    "2SA24" : { verses : 25 },
    "1KI01" : { verses : 53 },
    "1KI02" : { verses : 46 },
    "1KI03" : { verses : 28 },
    "1KI04" : { verses : 34 },
    "1KI05" : { verses : 18 },
    "1KI06" : { verses : 38 },
    "1KI07" : { verses : 51 },
    "1KI08" : { verses : 66 },
    "1KI09" : { verses : 28 },
    "1KI10" : { verses : 29 },
    "1KI11" : { verses : 43 },
    "1KI12" : { verses : 33 },
    "1KI13" : { verses : 34 },
    "1KI14" : { verses : 31 },
    "1KI15" : { verses : 34 },
    "1KI16" : { verses : 34 },
    "1KI17" : { verses : 24 },
    "1KI18" : { verses : 46 },
    "1KI19" : { verses : 21 },
    "1KI20" : { verses : 43 },
    "1KI21" : { verses : 29 },
    "1KI22" : { verses : 53 },
    "2KI01" : { verses : 18 },
    "2KI02" : { verses : 25 },
    "2KI03" : { verses : 27 },
    "2KI04" : { verses : 44 },
    "2KI05" : { verses : 27 },
    "2KI06" : { verses : 33 },
    "2KI07" : { verses : 20 },
    "2KI08" : { verses : 29 },
    "2KI09" : { verses : 37 },
    "2KI10" : { verses : 36 },
    "2KI11" : { verses : 21 },
    "2KI12" : { verses : 21 },
    "2KI13" : { verses : 25 },
    "2KI14" : { verses : 29 },
    "2KI15" : { verses : 38 },
    "2KI16" : { verses : 20 },
    "2KI17" : { verses : 41 },
    "2KI18" : { verses : 37 },
    "2KI19" : { verses : 37 },
    "2KI20" : { verses : 21 },
    "2KI21" : { verses : 26 },
    "2KI22" : { verses : 20 },
    "2KI23" : { verses : 37 },
    "2KI24" : { verses : 20 },
    "2KI25" : { verses : 30 },
    "1CH01" : { verses : 54 },
    "1CH02" : { verses : 55 },
    "1CH03" : { verses : 24 },
    "1CH04" : { verses : 43 },
    "1CH05" : { verses : 26 },
    "1CH06" : { verses : 81 },
    "1CH07" : { verses : 40 },
    "1CH08" : { verses : 40 },
    "1CH09" : { verses : 44 },
    "1CH10" : { verses : 14 },
    "1CH11" : { verses : 47 },
    "1CH12" : { verses : 40 },
    "1CH13" : { verses : 14 },
    "1CH14" : { verses : 17 },
    "1CH15" : { verses : 29 },
    "1CH16" : { verses : 43 },
    "1CH17" : { verses : 27 },
    "1CH18" : { verses : 17 },
    "1CH19" : { verses : 19 },
    "1CH20" : { verses : 8 },
    "1CH21" : { verses : 30 },
    "1CH22" : { verses : 19 },
    "1CH23" : { verses : 32 },
    "1CH24" : { verses : 31 },
    "1CH25" : { verses : 31 },
    "1CH26" : { verses : 32 },
    "1CH27" : { verses : 34 },
    "1CH28" : { verses : 21 },
    "1CH29" : { verses : 30 },
    "2CH01" : { verses : 17 },
    "2CH02" : { verses : 18 },
    "2CH03" : { verses : 17 },
    "2CH04" : { verses : 22 },
    "2CH05" : { verses : 14 },
    "2CH06" : { verses : 42 },
    "2CH07" : { verses : 22 },
    "2CH08" : { verses : 18 },
    "2CH09" : { verses : 31 },
    "2CH10" : { verses : 19 },
    "2CH11" : { verses : 23 },
    "2CH12" : { verses : 16 },
    "2CH13" : { verses : 22 },
    "2CH14" : { verses : 15 },
    "2CH15" : { verses : 19 },
    "2CH16" : { verses : 14 },
    "2CH17" : { verses : 19 },
    "2CH18" : { verses : 34 },
    "2CH19" : { verses : 11 },
    "2CH20" : { verses : 37 },
    "2CH21" : { verses : 20 },
    "2CH22" : { verses : 12 },
    "2CH23" : { verses : 21 },
    "2CH24" : { verses : 27 },
    "2CH25" : { verses : 28 },
    "2CH26" : { verses : 23 },
    "2CH27" : { verses : 9 },
    "2CH28" : { verses : 27 },
    "2CH29" : { verses : 36 },
    "2CH30" : { verses : 27 },
    "2CH31" : { verses : 21 },
    "2CH32" : { verses : 33 },
    "2CH33" : { verses : 25 },
    "2CH34" : { verses : 33 },
    "2CH35" : { verses : 27 },
    "2CH36" : { verses : 23 },
    "EZR01" : { verses : 11 },
    "EZR02" : { verses : 70 },
    "EZR03" : { verses : 13 },
    "EZR04" : { verses : 24 },
    "EZR05" : { verses : 17 },
    "EZR06" : { verses : 22 },
    "EZR07" : { verses : 28 },
    "EZR08" : { verses : 36 },
    "EZR09" : { verses : 15 },
    "EZR10" : { verses : 44 },
    "NEH01" : { verses : 11 },
    "NEH02" : { verses : 20 },
    "NEH03" : { verses : 32 },
    "NEH04" : { verses : 23 },
    "NEH05" : { verses : 19 },
    "NEH06" : { verses : 19 },
    "NEH07" : { verses : 73 },
    "NEH08" : { verses : 18 },
    "NEH09" : { verses : 38 },
    "NEH10" : { verses : 39 },
    "NEH11" : { verses : 36 },
    "NEH12" : { verses : 47 },
    "NEH13" : { verses : 31 },
    "EST01" : { verses : 22 },
    "EST02" : { verses : 23 },
    "EST03" : { verses : 15 },
    "EST04" : { verses : 17 },
    "EST05" : { verses : 14 },
    "EST06" : { verses : 14 },
    "EST07" : { verses : 10 },
    "EST08" : { verses : 17 },
    "EST09" : { verses : 32 },
    "EST10" : { verses : 3 },
    "JOB01" : { verses : 22 },
    "JOB02" : { verses : 13 },
    "JOB03" : { verses : 26 },
    "JOB04" : { verses : 21 },
    "JOB05" : { verses : 27 },
    "JOB06" : { verses : 30 },
    "JOB07" : { verses : 21 },
    "JOB08" : { verses : 22 },
    "JOB09" : { verses : 35 },
    "JOB10" : { verses : 22 },
    "JOB11" : { verses : 20 },
    "JOB12" : { verses : 25 },
    "JOB13" : { verses : 28 },
    "JOB14" : { verses : 22 },
    "JOB15" : { verses : 35 },
    "JOB16" : { verses : 22 },
    "JOB17" : { verses : 16 },
    "JOB18" : { verses : 21 },
    "JOB19" : { verses : 29 },
    "JOB20" : { verses : 29 },
    "JOB21" : { verses : 34 },
    "JOB22" : { verses : 30 },
    "JOB23" : { verses : 17 },
    "JOB24" : { verses : 25 },
    "JOB25" : { verses : 6 },
    "JOB26" : { verses : 14 },
    "JOB27" : { verses : 23 },
    "JOB28" : { verses : 28 },
    "JOB29" : { verses : 25 },
    "JOB30" : { verses : 31 },
    "JOB31" : { verses : 40 },
    "JOB32" : { verses : 22 },
    "JOB33" : { verses : 33 },
    "JOB34" : { verses : 37 },
    "JOB35" : { verses : 16 },
    "JOB36" : { verses : 33 },
    "JOB37" : { verses : 24 },
    "JOB38" : { verses : 41 },
    "JOB39" : { verses : 30 },
    "JOB40" : { verses : 24 },
    "JOB41" : { verses : 34 },
    "JOB42" : { verses : 17 },
    "PSA001" : { verses : 6 },
    "PSA002" : { verses : 12 },
    "PSA003" : { verses : 8 },
    "PSA004" : { verses : 8 },
    "PSA005" : { verses : 12 },
    "PSA006" : { verses : 10 },
    "PSA007" : { verses : 17 },
    "PSA008" : { verses : 9 },
    "PSA009" : { verses : 20 },
    "PSA010" : { verses : 18 },
    "PSA011" : { verses : 7 },
    "PSA012" : { verses : 8 },
    "PSA013" : { verses : 6 },
    "PSA014" : { verses : 7 },
    "PSA015" : { verses : 5 },
    "PSA016" : { verses : 11 },
    "PSA017" : { verses : 15 },
    "PSA018" : { verses : 50 },
    "PSA019" : { verses : 14 },
    "PSA020" : { verses : 9 },
    "PSA021" : { verses : 13 },
    "PSA022" : { verses : 31 },
    "PSA023" : { verses : 6 },
    "PSA024" : { verses : 10 },
    "PSA025" : { verses : 22 },
    "PSA026" : { verses : 12 },
    "PSA027" : { verses : 14 },
    "PSA028" : { verses : 9 },
    "PSA029" : { verses : 11 },
    "PSA030" : { verses : 12 },
    "PSA031" : { verses : 24 },
    "PSA032" : { verses : 11 },
    "PSA033" : { verses : 22 },
    "PSA034" : { verses : 22 },
    "PSA035" : { verses : 28 },
    "PSA036" : { verses : 12 },
    "PSA037" : { verses : 40 },
    "PSA038" : { verses : 22 },
    "PSA039" : { verses : 13 },
    "PSA040" : { verses : 17 },
    "PSA041" : { verses : 13 },
    "PSA042" : { verses : 11 },
    "PSA043" : { verses : 5 },
    "PSA044" : { verses : 26 },
    "PSA045" : { verses : 17 },
    "PSA046" : { verses : 11 },
    "PSA047" : { verses : 9 },
    "PSA048" : { verses : 14 },
    "PSA049" : { verses : 20 },
    "PSA050" : { verses : 23 },
    "PSA051" : { verses : 19 },
    "PSA052" : { verses : 9 },
    "PSA053" : { verses : 6 },
    "PSA054" : { verses : 7 },
    "PSA055" : { verses : 23 },
    "PSA056" : { verses : 13 },
    "PSA057" : { verses : 11 },
    "PSA058" : { verses : 11 },
    "PSA059" : { verses : 17 },
    "PSA060" : { verses : 12 },
    "PSA061" : { verses : 8 },
    "PSA062" : { verses : 12 },
    "PSA063" : { verses : 11 },
    "PSA064" : { verses : 10 },
    "PSA065" : { verses : 13 },
    "PSA066" : { verses : 20 },
    "PSA067" : { verses : 7 },
    "PSA068" : { verses : 35 },
    "PSA069" : { verses : 36 },
    "PSA070" : { verses : 5 },
    "PSA071" : { verses : 24 },
    "PSA072" : { verses : 20 },
    "PSA073" : { verses : 28 },
    "PSA074" : { verses : 23 },
    "PSA075" : { verses : 10 },
    "PSA076" : { verses : 12 },
    "PSA077" : { verses : 20 },
    "PSA078" : { verses : 72 },
    "PSA079" : { verses : 13 },
    "PSA080" : { verses : 19 },
    "PSA081" : { verses : 16 },
    "PSA082" : { verses : 8 },
    "PSA083" : { verses : 18 },
    "PSA084" : { verses : 12 },
    "PSA085" : { verses : 13 },
    "PSA086" : { verses : 17 },
    "PSA087" : { verses : 7 },
    "PSA088" : { verses : 18 },
    "PSA089" : { verses : 52 },
    "PSA090" : { verses : 17 },
    "PSA091" : { verses : 16 },
    "PSA092" : { verses : 15 },
    "PSA093" : { verses : 5 },
    "PSA094" : { verses : 23 },
    "PSA095" : { verses : 11 },
    "PSA096" : { verses : 13 },
    "PSA097" : { verses : 12 },
    "PSA098" : { verses : 9 },
    "PSA099" : { verses : 9 },
    "PSA100" : { verses : 5 },
    "PSA101" : { verses : 8 },
    "PSA102" : { verses : 28 },
    "PSA103" : { verses : 22 },
    "PSA104" : { verses : 35 },
    "PSA105" : { verses : 45 },
    "PSA106" : { verses : 48 },
    "PSA107" : { verses : 43 },
    "PSA108" : { verses : 13 },
    "PSA109" : { verses : 31 },
    "PSA110" : { verses : 7 },
    "PSA111" : { verses : 10 },
    "PSA112" : { verses : 10 },
    "PSA113" : { verses : 9 },
    "PSA114" : { verses : 8 },
    "PSA115" : { verses : 18 },
    "PSA116" : { verses : 19 },
    "PSA117" : { verses : 2 },
    "PSA118" : { verses : 29 },
    "PSA119" : { verses : 176 },
    "PSA120" : { verses : 7 },
    "PSA121" : { verses : 8 },
    "PSA122" : { verses : 9 },
    "PSA123" : { verses : 4 },
    "PSA124" : { verses : 8 },
    "PSA125" : { verses : 5 },
    "PSA126" : { verses : 6 },
    "PSA127" : { verses : 5 },
    "PSA128" : { verses : 6 },
    "PSA129" : { verses : 8 },
    "PSA130" : { verses : 8 },
    "PSA131" : { verses : 3 },
    "PSA132" : { verses : 18 },
    "PSA133" : { verses : 3 },
    "PSA134" : { verses : 3 },
    "PSA135" : { verses : 21 },
    "PSA136" : { verses : 26 },
    "PSA137" : { verses : 9 },
    "PSA138" : { verses : 8 },
    "PSA139" : { verses : 24 },
    "PSA140" : { verses : 13 },
    "PSA141" : { verses : 10 },
    "PSA142" : { verses : 7 },
    "PSA143" : { verses : 12 },
    "PSA144" : { verses : 15 },
    "PSA145" : { verses : 21 },
    "PSA146" : { verses : 10 },
    "PSA147" : { verses : 20 },
    "PSA148" : { verses : 14 },
    "PSA149" : { verses : 9 },
    "PSA150" : { verses : 6 },
    "PRO01" : { verses : 33 },
    "PRO02" : { verses : 22 },
    "PRO03" : { verses : 35 },
    "PRO04" : { verses : 27 },
    "PRO05" : { verses : 23 },
    "PRO06" : { verses : 35 },
    "PRO07" : { verses : 27 },
    "PRO08" : { verses : 36 },
    "PRO09" : { verses : 18 },
    "PRO10" : { verses : 32 },
    "PRO11" : { verses : 31 },
    "PRO12" : { verses : 28 },
    "PRO13" : { verses : 25 },
    "PRO14" : { verses : 35 },
    "PRO15" : { verses : 33 },
    "PRO16" : { verses : 33 },
    "PRO17" : { verses : 28 },
    "PRO18" : { verses : 24 },
    "PRO19" : { verses : 29 },
    "PRO20" : { verses : 30 },
    "PRO21" : { verses : 31 },
    "PRO22" : { verses : 29 },
    "PRO23" : { verses : 35 },
    "PRO24" : { verses : 34 },
    "PRO25" : { verses : 28 },
    "PRO26" : { verses : 28 },
    "PRO27" : { verses : 27 },
    "PRO28" : { verses : 28 },
    "PRO29" : { verses : 27 },
    "PRO30" : { verses : 33 },
    "PRO31" : { verses : 31 },
    "ECC01" : { verses : 18 },
    "ECC02" : { verses : 26 },
    "ECC03" : { verses : 22 },
    "ECC04" : { verses : 16 },
    "ECC05" : { verses : 20 },
    "ECC06" : { verses : 12 },
    "ECC07" : { verses : 29 },
    "ECC08" : { verses : 17 },
    "ECC09" : { verses : 18 },
    "ECC10" : { verses : 20 },
    "ECC11" : { verses : 10 },
    "ECC12" : { verses : 14 },
    "SNG01" : { verses : 17 },
    "SNG02" : { verses : 17 },
    "SNG03" : { verses : 11 },
    "SNG04" : { verses : 16 },
    "SNG05" : { verses : 16 },
    "SNG06" : { verses : 13 },
    "SNG07" : { verses : 13 },
    "SNG08" : { verses : 14 },
    "ISA01" : { verses : 31 },
    "ISA02" : { verses : 22 },
    "ISA03" : { verses : 26 },
    "ISA04" : { verses : 6 },
    "ISA05" : { verses : 30 },
    "ISA06" : { verses : 13 },
    "ISA07" : { verses : 25 },
    "ISA08" : { verses : 22 },
    "ISA09" : { verses : 21 },
    "ISA10" : { verses : 34 },
    "ISA11" : { verses : 16 },
    "ISA12" : { verses : 6 },
    "ISA13" : { verses : 22 },
    "ISA14" : { verses : 32 },
    "ISA15" : { verses : 9 },
    "ISA16" : { verses : 14 },
    "ISA17" : { verses : 14 },
    "ISA18" : { verses : 7 },
    "ISA19" : { verses : 25 },
    "ISA20" : { verses : 6 },
    "ISA21" : { verses : 17 },
    "ISA22" : { verses : 25 },
    "ISA23" : { verses : 18 },
    "ISA24" : { verses : 23 },
    "ISA25" : { verses : 12 },
    "ISA26" : { verses : 21 },
    "ISA27" : { verses : 13 },
    "ISA28" : { verses : 29 },
    "ISA29" : { verses : 24 },
    "ISA30" : { verses : 33 },
    "ISA31" : { verses : 9 },
    "ISA32" : { verses : 20 },
    "ISA33" : { verses : 24 },
    "ISA34" : { verses : 17 },
    "ISA35" : { verses : 10 },
    "ISA36" : { verses : 22 },
    "ISA37" : { verses : 38 },
    "ISA38" : { verses : 22 },
    "ISA39" : { verses : 8 },
    "ISA40" : { verses : 31 },
    "ISA41" : { verses : 29 },
    "ISA42" : { verses : 25 },
    "ISA43" : { verses : 28 },
    "ISA44" : { verses : 28 },
    "ISA45" : { verses : 25 },
    "ISA46" : { verses : 13 },
    "ISA47" : { verses : 15 },
    "ISA48" : { verses : 22 },
    "ISA49" : { verses : 26 },
    "ISA50" : { verses : 11 },
    "ISA51" : { verses : 23 },
    "ISA52" : { verses : 15 },
    "ISA53" : { verses : 12 },
    "ISA54" : { verses : 17 },
    "ISA55" : { verses : 13 },
    "ISA56" : { verses : 12 },
    "ISA57" : { verses : 21 },
    "ISA58" : { verses : 14 },
    "ISA59" : { verses : 21 },
    "ISA60" : { verses : 22 },
    "ISA61" : { verses : 11 },
    "ISA62" : { verses : 12 },
    "ISA63" : { verses : 19 },
    "ISA64" : { verses : 12 },
    "ISA65" : { verses : 25 },
    "ISA66" : { verses : 24 },
    "JER01" : { verses : 19 },
    "JER02" : { verses : 37 },
    "JER03" : { verses : 25 },
    "JER04" : { verses : 31 },
    "JER05" : { verses : 31 },
    "JER06" : { verses : 30 },
    "JER07" : { verses : 34 },
    "JER08" : { verses : 22 },
    "JER09" : { verses : 26 },
    "JER10" : { verses : 25 },
    "JER11" : { verses : 23 },
    "JER12" : { verses : 17 },
    "JER13" : { verses : 27 },
    "JER14" : { verses : 22 },
    "JER15" : { verses : 21 },
    "JER16" : { verses : 21 },
    "JER17" : { verses : 27 },
    "JER18" : { verses : 23 },
    "JER19" : { verses : 15 },
    "JER20" : { verses : 18 },
    "JER21" : { verses : 14 },
    "JER22" : { verses : 30 },
    "JER23" : { verses : 40 },
    "JER24" : { verses : 10 },
    "JER25" : { verses : 38 },
    "JER26" : { verses : 24 },
    "JER27" : { verses : 22 },
    "JER28" : { verses : 17 },
    "JER29" : { verses : 32 },
    "JER30" : { verses : 24 },
    "JER31" : { verses : 40 },
    "JER32" : { verses : 44 },
    "JER33" : { verses : 26 },
    "JER34" : { verses : 22 },
    "JER35" : { verses : 19 },
    "JER36" : { verses : 32 },
    "JER37" : { verses : 21 },
    "JER38" : { verses : 28 },
    "JER39" : { verses : 18 },
    "JER40" : { verses : 16 },
    "JER41" : { verses : 18 },
    "JER42" : { verses : 22 },
    "JER43" : { verses : 13 },
    "JER44" : { verses : 30 },
    "JER45" : { verses : 5 },
    "JER46" : { verses : 28 },
    "JER47" : { verses : 7 },
    "JER48" : { verses : 47 },
    "JER49" : { verses : 39 },
    "JER50" : { verses : 46 },
    "JER51" : { verses : 64 },
    "JER52" : { verses : 34 },
    "LAM01" : { verses : 22 },
    "LAM02" : { verses : 22 },
    "LAM03" : { verses : 66 },
    "LAM04" : { verses : 22 },
    "LAM05" : { verses : 22 },
    "EZK01" : { verses : 28 },
    "EZK02" : { verses : 10 },
    "EZK03" : { verses : 27 },
    "EZK04" : { verses : 17 },
    "EZK05" : { verses : 17 },
    "EZK06" : { verses : 14 },
    "EZK07" : { verses : 27 },
    "EZK08" : { verses : 18 },
    "EZK09" : { verses : 11 },
    "EZK10" : { verses : 22 },
    "EZK11" : { verses : 25 },
    "EZK12" : { verses : 28 },
    "EZK13" : { verses : 23 },
    "EZK14" : { verses : 23 },
    "EZK15" : { verses : 8 },
    "EZK16" : { verses : 63 },
    "EZK17" : { verses : 24 },
    "EZK18" : { verses : 32 },
    "EZK19" : { verses : 14 },
    "EZK20" : { verses : 49 },
    "EZK21" : { verses : 32 },
    "EZK22" : { verses : 31 },
    "EZK23" : { verses : 49 },
    "EZK24" : { verses : 27 },
    "EZK25" : { verses : 17 },
    "EZK26" : { verses : 21 },
    "EZK27" : { verses : 36 },
    "EZK28" : { verses : 26 },
    "EZK29" : { verses : 21 },
    "EZK30" : { verses : 26 },
    "EZK31" : { verses : 18 },
    "EZK32" : { verses : 32 },
    "EZK33" : { verses : 33 },
    "EZK34" : { verses : 31 },
    "EZK35" : { verses : 15 },
    "EZK36" : { verses : 38 },
    "EZK37" : { verses : 28 },
    "EZK38" : { verses : 23 },
    "EZK39" : { verses : 29 },
    "EZK40" : { verses : 49 },
    "EZK41" : { verses : 26 },
    "EZK42" : { verses : 20 },
    "EZK43" : { verses : 27 },
    "EZK44" : { verses : 31 },
    "EZK45" : { verses : 25 },
    "EZK46" : { verses : 24 },
    "EZK47" : { verses : 23 },
    "EZK48" : { verses : 35 },
    "DAN01" : { verses : 21 },
    "DAN02" : { verses : 49 },
    "DAN03" : { verses : 30 },
    "DAN04" : { verses : 37 },
    "DAN05" : { verses : 31 },
    "DAN06" : { verses : 28 },
    "DAN07" : { verses : 28 },
    "DAN08" : { verses : 27 },
    "DAN09" : { verses : 27 },
    "DAN10" : { verses : 21 },
    "DAN11" : { verses : 45 },
    "DAN12" : { verses : 13 },
    "HOS01" : { verses : 11 },
    "HOS02" : { verses : 23 },
    "HOS03" : { verses : 5 },
    "HOS04" : { verses : 19 },
    "HOS05" : { verses : 15 },
    "HOS06" : { verses : 11 },
    "HOS07" : { verses : 16 },
    "HOS08" : { verses : 14 },
    "HOS09" : { verses : 17 },
    "HOS10" : { verses : 15 },
    "HOS11" : { verses : 12 },
    "HOS12" : { verses : 14 },
    "HOS13" : { verses : 16 },
    "HOS14" : { verses : 9 },
    "JOL01" : { verses : 20 },
    "JOL02" : { verses : 32 },
    "JOL03" : { verses : 21 },
    "AMO01" : { verses : 15 },
    "AMO02" : { verses : 16 },
    "AMO03" : { verses : 15 },
    "AMO04" : { verses : 13 },
    "AMO05" : { verses : 27 },
    "AMO06" : { verses : 14 },
    "AMO07" : { verses : 17 },
    "AMO08" : { verses : 14 },
    "AMO09" : { verses : 15 },
    "OBA01" : { verses : 21 },
    "JON01" : { verses : 17 },
    "JON02" : { verses : 10 },
    "JON03" : { verses : 10 },
    "JON04" : { verses : 11 },
    "MIC01" : { verses : 16 },
    "MIC02" : { verses : 13 },
    "MIC03" : { verses : 12 },
    "MIC04" : { verses : 13 },
    "MIC05" : { verses : 15 },
    "MIC06" : { verses : 16 },
    "MIC07" : { verses : 20 },
    "NAM01" : { verses : 15 },
    "NAM02" : { verses : 13 },
    "NAM03" : { verses : 19 },
    "HAB01" : { verses : 17 },
    "HAB02" : { verses : 20 },
    "HAB03" : { verses : 19 },
    "ZEP01" : { verses : 18 },
    "ZEP02" : { verses : 15 },
    "ZEP03" : { verses : 20 },
    "HAG01" : { verses : 15 },
    "HAG02" : { verses : 23 },
    "ZEC01" : { verses : 21 },
    "ZEC02" : { verses : 13 },
    "ZEC03" : { verses : 10 },
    "ZEC04" : { verses : 14 },
    "ZEC05" : { verses : 11 },
    "ZEC06" : { verses : 15 },
    "ZEC07" : { verses : 14 },
    "ZEC08" : { verses : 23 },
    "ZEC09" : { verses : 17 },
    "ZEC10" : { verses : 12 },
    "ZEC11" : { verses : 17 },
    "ZEC12" : { verses : 14 },
    "ZEC13" : { verses : 9 },
    "ZEC14" : { verses : 21 },
    "MAL01" : { verses : 14 },
    "MAL02" : { verses : 17 },
    "MAL03" : { verses : 18 },
    "MAL04" : { verses : 6 },
    "MAT01" : { verses : 25 },
    "MAT02" : { verses : 23 },
    "MAT03" : { verses : 17 },
    "MAT04" : { verses : 25 },
    "MAT05" : { verses : 48 },
    "MAT06" : { verses : 34 },
    "MAT07" : { verses : 29 },
    "MAT08" : { verses : 34 },
    "MAT09" : { verses : 38 },
    "MAT10" : { verses : 42 },
    "MAT11" : { verses : 30 },
    "MAT12" : { verses : 50 },
    "MAT13" : { verses : 58 },
    "MAT14" : { verses : 36 },
    "MAT15" : { verses : 39 },
    "MAT16" : { verses : 28 },
    "MAT17" : { verses : 27 },
    "MAT18" : { verses : 35 },
    "MAT19" : { verses : 30 },
    "MAT20" : { verses : 34 },
    "MAT21" : { verses : 46 },
    "MAT22" : { verses : 46 },
    "MAT23" : { verses : 39 },
    "MAT24" : { verses : 51 },
    "MAT25" : { verses : 46 },
    "MAT26" : { verses : 75 },
    "MAT27" : { verses : 66 },
    "MAT28" : { verses : 20 },
    "MRK01" : { verses : 45 },
    "MRK02" : { verses : 28 },
    "MRK03" : { verses : 35 },
    "MRK04" : { verses : 41 },
    "MRK05" : { verses : 43 },
    "MRK06" : { verses : 56 },
    "MRK07" : { verses : 37 },
    "MRK08" : { verses : 38 },
    "MRK09" : { verses : 50 },
    "MRK10" : { verses : 52 },
    "MRK11" : { verses : 33 },
    "MRK12" : { verses : 44 },
    "MRK13" : { verses : 37 },
    "MRK14" : { verses : 72 },
    "MRK15" : { verses : 47 },
    "MRK16" : { verses : 20 },
    "LUK01" : { verses : 80 },
    "LUK02" : { verses : 52 },
    "LUK03" : { verses : 38 },
    "LUK04" : { verses : 44 },
    "LUK05" : { verses : 39 },
    "LUK06" : { verses : 49 },
    "LUK07" : { verses : 50 },
    "LUK08" : { verses : 56 },
    "LUK09" : { verses : 62 },
    "LUK10" : { verses : 42 },
    "LUK11" : { verses : 54 },
    "LUK12" : { verses : 59 },
    "LUK13" : { verses : 35 },
    "LUK14" : { verses : 35 },
    "LUK15" : { verses : 32 },
    "LUK16" : { verses : 31 },
    "LUK17" : { verses : 37 },
    "LUK18" : { verses : 43 },
    "LUK19" : { verses : 48 },
    "LUK20" : { verses : 47 },
    "LUK21" : { verses : 38 },
    "LUK22" : { verses : 71 },
    "LUK23" : { verses : 56 },
    "LUK24" : { verses : 53 },
    "JHN01" : { verses : 51 },
    "JHN02" : { verses : 25 },
    "JHN03" : { verses : 36 },
    "JHN04" : { verses : 54 },
    "JHN05" : { verses : 47 },
    "JHN06" : { verses : 71 },
    "JHN07" : { verses : 53 },
    "JHN08" : { verses : 59 },
    "JHN09" : { verses : 41 },
    "JHN10" : { verses : 42 },
    "JHN11" : { verses : 57 },
    "JHN12" : { verses : 50 },
    "JHN13" : { verses : 38 },
    "JHN14" : { verses : 31 },
    "JHN15" : { verses : 27 },
    "JHN16" : { verses : 33 },
    "JHN17" : { verses : 26 },
    "JHN18" : { verses : 40 },
    "JHN19" : { verses : 42 },
    "JHN20" : { verses : 31 },
    "JHN21" : { verses : 25 },
    "ACT01" : { verses : 26 },
    "ACT02" : { verses : 47 },
    "ACT03" : { verses : 26 },
    "ACT04" : { verses : 37 },
    "ACT05" : { verses : 42 },
    "ACT06" : { verses : 15 },
    "ACT07" : { verses : 60 },
    "ACT08" : { verses : 40 },
    "ACT09" : { verses : 43 },
    "ACT10" : { verses : 48 },
    "ACT11" : { verses : 30 },
    "ACT12" : { verses : 25 },
    "ACT13" : { verses : 52 },
    "ACT14" : { verses : 28 },
    "ACT15" : { verses : 41 },
    "ACT16" : { verses : 40 },
    "ACT17" : { verses : 34 },
    "ACT18" : { verses : 28 },
    "ACT19" : { verses : 41 },
    "ACT20" : { verses : 38 },
    "ACT21" : { verses : 40 },
    "ACT22" : { verses : 30 },
    "ACT23" : { verses : 35 },
    "ACT24" : { verses : 27 },
    "ACT25" : { verses : 27 },
    "ACT26" : { verses : 32 },
    "ACT27" : { verses : 44 },
    "ACT28" : { verses : 31 },
    "ROM01" : { verses : 32 },
    "ROM02" : { verses : 29 },
    "ROM03" : { verses : 31 },
    "ROM04" : { verses : 25 },
    "ROM05" : { verses : 21 },
    "ROM06" : { verses : 23 },
    "ROM07" : { verses : 25 },
    "ROM08" : { verses : 39 },
    "ROM09" : { verses : 33 },
    "ROM10" : { verses : 21 },
    "ROM11" : { verses : 36 },
    "ROM12" : { verses : 21 },
    "ROM13" : { verses : 14 },
    "ROM14" : { verses : 23 },
    "ROM15" : { verses : 33 },
    "ROM16" : { verses : 27 },
    "1CO01" : { verses : 31 },
    "1CO02" : { verses : 16 },
    "1CO03" : { verses : 23 },
    "1CO04" : { verses : 21 },
    "1CO05" : { verses : 13 },
    "1CO06" : { verses : 20 },
    "1CO07" : { verses : 40 },
    "1CO08" : { verses : 13 },
    "1CO09" : { verses : 27 },
    "1CO10" : { verses : 33 },
    "1CO11" : { verses : 34 },
    "1CO12" : { verses : 31 },
    "1CO13" : { verses : 13 },
    "1CO14" : { verses : 40 },
    "1CO15" : { verses : 58 },
    "1CO16" : { verses : 24 },
    "2CO01" : { verses : 24 },
    "2CO02" : { verses : 17 },
    "2CO03" : { verses : 18 },
    "2CO04" : { verses : 18 },
    "2CO05" : { verses : 21 },
    "2CO06" : { verses : 18 },
    "2CO07" : { verses : 16 },
    "2CO08" : { verses : 24 },
    "2CO09" : { verses : 15 },
    "2CO10" : { verses : 18 },
    "2CO11" : { verses : 33 },
    "2CO12" : { verses : 21 },
    "2CO13" : { verses : 14 },
    "GAL01" : { verses : 24 },
    "GAL02" : { verses : 21 },
    "GAL03" : { verses : 29 },
    "GAL04" : { verses : 31 },
    "GAL05" : { verses : 26 },
    "GAL06" : { verses : 18 },
    "EPH01" : { verses : 23 },
    "EPH02" : { verses : 22 },
    "EPH03" : { verses : 21 },
    "EPH04" : { verses : 32 },
    "EPH05" : { verses : 33 },
    "EPH06" : { verses : 24 },
    "PHP01" : { verses : 30 },
    "PHP02" : { verses : 30 },
    "PHP03" : { verses : 21 },
    "PHP04" : { verses : 23 },
    "COL01" : { verses : 29 },
    "COL02" : { verses : 23 },
    "COL03" : { verses : 25 },
    "COL04" : { verses : 18 },
    "1TH01" : { verses : 10 },
    "1TH02" : { verses : 20 },
    "1TH03" : { verses : 13 },
    "1TH04" : { verses : 18 },
    "1TH05" : { verses : 28 },
    "2TH01" : { verses : 12 },
    "2TH02" : { verses : 17 },
    "2TH03" : { verses : 18 },
    "1TI01" : { verses : 20 },
    "1TI02" : { verses : 15 },
    "1TI03" : { verses : 16 },
    "1TI04" : { verses : 16 },
    "1TI05" : { verses : 25 },
    "1TI06" : { verses : 21 },
    "2TI01" : { verses : 18 },
    "2TI02" : { verses : 26 },
    "2TI03" : { verses : 17 },
    "2TI04" : { verses : 22 },
    "TIT01" : { verses : 16 },
    "TIT02" : { verses : 15 },
    "TIT03" : { verses : 15 },
    "PHM01" : { verses : 25 },
    "HEB01" : { verses : 14 },
    "HEB02" : { verses : 18 },
    "HEB03" : { verses : 19 },
    "HEB04" : { verses : 16 },
    "HEB05" : { verses : 14 },
    "HEB06" : { verses : 20 },
    "HEB07" : { verses : 28 },
    "HEB08" : { verses : 13 },
    "HEB09" : { verses : 28 },
    "HEB10" : { verses : 39 },
    "HEB11" : { verses : 40 },
    "HEB12" : { verses : 29 },
    "HEB13" : { verses : 25 },
    "JAS01" : { verses : 27 },
    "JAS02" : { verses : 26 },
    "JAS03" : { verses : 18 },
    "JAS04" : { verses : 17 },
    "JAS05" : { verses : 20 },
    "1PE01" : { verses : 25 },
    "1PE02" : { verses : 25 },
    "1PE03" : { verses : 22 },
    "1PE04" : { verses : 19 },
    "1PE05" : { verses : 14 },
    "2PE01" : { verses : 21 },
    "2PE02" : { verses : 22 },
    "2PE03" : { verses : 18 },
    "1JN01" : { verses : 10 },
    "1JN02" : { verses : 29 },
    "1JN03" : { verses : 24 },
    "1JN04" : { verses : 21 },
    "1JN05" : { verses : 21 },
    "2JN01" : { verses : 13 },
    "3JN01" : { verses : 14 },
    "JUD01" : { verses : 25 },
    "REV01" : { verses : 20 },
    "REV02" : { verses : 29 },
    "REV03" : { verses : 22 },
    "REV04" : { verses : 11 },
    "REV05" : { verses : 14 },
    "REV06" : { verses : 17 },
    "REV07" : { verses : 17 },
    "REV08" : { verses : 13 },
    "REV09" : { verses : 21 },
    "REV10" : { verses : 11 },
    "REV11" : { verses : 19 },
    "REV12" : { verses : 17 },
    "REV13" : { verses : 18 },
    "REV14" : { verses : 20 },
    "REV15" : { verses : 8 },
    "REV16" : { verses : 21 },
    "REV17" : { verses : 18 },
    "REV18" : { verses : 24 },
    "REV19" : { verses : 21 },
    "REV20" : { verses : 15 },
    "REV21" : { verses : 27 },
    "REV22" : { verses : 21 },
};



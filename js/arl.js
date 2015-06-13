/**
 * @author (C) 2010 Eric Pyle
 * @requires: jquery, BigInteger.min.js
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

	$('.loopDaysLeft').attr('title', 'loop days left');
	$('.chapterDaysLeft').attr('title', 'book days left');
    $('.timeEstimation').attr('title', 'estimated time for chapter');

    var urlParams = $.url().fparam();
    var arlBookmarkDay = 1;
    $.cookie.json = true;
    var arlCookie = $.cookie('arl-bookmark');
    if (urlParams['day']) {
        arlBookmarkDay = bigInt(urlParams['day']);
    } else {
        if (arlCookie == undefined)
            arlCookie = { "day": arlBookmarkDay, versionChapterPath: $("#versionChapterPath").val(), language: "eng" };
        arlBookmarkDay = arlCookie.day;
    }
	if (arlBookmarkDay == undefined) {
		if (arlCookie > 0)
			arlBookmarkDay = arlCookie;
		else
			arlBookmarkDay = "1";
	}
	languageToVersion =
    {
        "eng": [{ path: 'bibles/eng/kjv', displayName: 'KJV - King James Version' },
                { path: 'bibles/eng/web', displayName: 'WEB - World English Bible' }],
        "cmn": [{ path: 'bibles/cmn/cmnCUVs', displayName: 'Chinese Union (Simplified)' },
                { path: 'bibles/cmn/cmnCUt', displayName: 'Chinese Union (Traditional)' }],
        "spa": [{ path: 'bibles/spa/spa1909', displayName: 'Reina Valera (1909)' }],
    };
	if (urlParams['language']) {
	    arlCookie.language = urlParams['language'];
	} else {
	    if (arlCookie.language == undefined)
	        arlCookie.language = 'eng';
    }
	$("#languageChooser").change(function () {
	    var langCode = $(this).val();
	    populateVersionControl(langCode);
	    displayAllBCHeading();
	});

	function populateVersionControl(langCode) {
	    var versionInfo = languageToVersion[langCode];
	    $("#versionChapterPath").empty();
	    for (var i = 0; i < versionInfo.length; i++) {
	        var versionData = versionInfo[i];
	        var versionOption = $('<option value="' + versionData.path + '">' + versionData.displayName + '</option>');
	        $("#versionChapterPath").append(versionOption);
	        $('#versionChapterPath').trigger("chosen:updated");
	        $('#tabs').tabs('select', '#tabs-1');
	    }
	}

	$("#languageChooser").val(arlCookie.language);
	populateVersionControl(arlCookie.language);
	if (urlParams['version']) {
	    arlCookie.versionChapterPath = 'bibles/' + arlCookie.language + '/' + urlParams['version'];
	} else {
	    if (arlCookie.versionChapterPath == undefined)
	        arlCookie.versionChapterPath = languageToVersion['eng'][0].path;
    }
    $("#versionChapterPath").val(arlCookie.versionChapterPath);

	$('#tbDay').val(arlBookmarkDay);
	$("#versionChapterPath").change(function () {
		displayAllBCHeading();
	});

//	fillBibleStatsWithChapters();
	displayAllBCHeading();
});

//function fillBibleStatsWithChapters() {
//    for (var key in BookStats) {  
//        if (key.length > 3) {
//            var bookCode = key.substring(0, 3);
//            book = BookStats[bookCode];
//            var chapterCode = parseInt(key.substring(3, key.length));
//            if (!book.chapters || chapterCode > book.chapters) {
//                book.chapters = chapterCode;
//            }
//        };
//    }
//}

function showTab(event, ui) {
	if (ui.index == 0) {
	}
}

function accordionOnChange(event, ui) {

    $('.footnote_toggle').siblings('p').hide();
	var active = ui.newHeader.parent().accordion("option", "active");
	//alert(active);
	if (active >= 0) {
		//alert(active);
	    $.scrollTo(ui.newHeader.parent().children('.accordion_header').eq(active), 200);
	}
	// ui.newHeader // jQuery object, activated header
	// ui.oldHeader // jQuery object, previous header
	// ui.newContent // jQuery object, activated content
	// ui.oldContent // jQuery object, previous content

}

function nextDay() {
	var day = bigInt($("#tbDay").val());
	var nextday = day.next();
	if (nextday.greater(0)) {
		$("#tbDay").val(nextday);
		displayAllBCHeading();
	}
}

function prevDay() {
	var day = bigInt($("#tbDay").val());
	var prevday = day.prev();
	if (prevday.greater(0)) {
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
	var chapterPath = $('#versionChapterPath').val();
	var language = $('#languageChooser').val();
	ARL.initialize(chapterPath, language);
	ARL.loadPlannedPages(day);
};

var ARL = (function (jQuery, BookStats, SILTitleAbbrToHeader_eng) {

	var api = {};
	api.initialize = initialize;
	api.loadPlannedPages = loadPlannedPages;
	api.loadGenrePage = loadGenrePage;

	var oconfiguration = { chapterPath : "kjv"};

	var timeEstimates = new Array(5);

	function initialize(chapterPath, language) {
	    oconfiguration.chapterPath = chapterPath;
	    oconfiguration.language = language;
	}

	function displayBCHeadingLink(day, mapArray, genre) {
		var bm = (bigInt(day).prev()).mod(mapArray.length);
		var bcAbbr = mapArray[bm.valueOf()];
		var heading = convertBCAbbrToHeading(bcAbbr);
		var ch = parseInt(bcAbbr.substring(3), 10);
		$("#BCHeading_" + genre).text(heading + " " + ch);
		$("#BCHeading_" + genre).attr("href",
			"javascript:loadPlannedPages(" + day + ", '" + genre + "');");
		//"javascript:loadGenrePage('#content_" + genre + "', '"+ bcAbbr + ".htm');");
	};

	function loadPlannedPages(day, genreToActivate) {
	    $.cookie('arl-bookmark', { "day": day, versionChapterPath: oconfiguration.chapterPath, language: oconfiguration.language }, { expires: 999 });
	    var version = oconfiguration.chapterPath.split(/\//).pop();
	    var newHashObj = { 'day': day, 'language': oconfiguration.language, 'version': version };
	    var newHash = '#' + $.param(newHashObj);
	    if (document.location.hash != newHash)
	        document.location.hash = newHash;
		loadBCHeadingLink(day, mapDtHistoryToBC, "DtHistory");
		loadBCHeadingLink(day, mapWisdomToBC, "Wisdom");
		loadBCHeadingLink(day, mapProphetsToBC, "Prophets");
		loadBCHeadingLink(day, mapGospelsToBC, "Gospels");
		loadBCHeadingLink(day, mapChurchHistoryToBC, "ChurchHistory");
		if (genreToActivate) {
			//var index = genreIndex(genreToActivate);
			activateAccordionPanel('#accordion1', genreToActivate);
		}
	}

	function loadBCHeadingLink(day, mapArray, genre) {
		var bm = bigInt(day).prev().mod(mapArray.length);
		var bcAbbr = mapArray[bm.valueOf()];
		var heading = convertBCAbbrToHeading(bcAbbr);
		var ch = parseInt(bcAbbr.substring(3), 10);

		loadGenrePage("#content_" + genre, bcAbbr + ".htm", true);
	};

	function displayTotalEstimatedReadingTime() {
		var totalTime = 0;
		for (var i = 0; i < 5; ++i) {
			totalTime += timeEstimates[i];
		}
		$("#totalTimeEstimation").text(totalTime.toFixed(2));
	}

	function getMapFromGenre(genre) {
	    switch (genre) {
	        case "DtHistory": return mapDtHistoryToBC;
	        case "Wisdom": return mapWisdomToBC;
	        case "Prophets": return mapProphetsToBC;
	        case "Gospels": return mapGospelsToBC;
	        case "ChurchHistory": return mapChurchHistoryToBC;
	        default: return [];
	    }
	}

	function loadGenrePage(idGenreDiv, bcPage, fLoadOnly) {
		var bookCode = bcPage.substring(0, 3);
		var verses = BookStats[bookCode].verses;
		var words = BookStats[bookCode].words;
		var bcAbbr = bcPage.split(".")[0];
		var chVerses = BookStats[bcAbbr].verses;
		var genre = idGenreDiv.split("_")[1];
		var index = genreIndex(genre);
		var timeEstimation = (words / verses * chVerses / 160);
		timeEstimates[index] = timeEstimation;
		$("#timeEstimation_" + genre).text(timeEstimation.toFixed(2));
		displayTotalEstimatedReadingTime();
		var heading = convertBCAbbrToHeading(bcAbbr);
		var ch = parseInt(bcAbbr.substring(3), 10);
		$("#HeadingBCRef_" + genre).text(heading + " " + (ch ? ch : ""));
		var mapArray = getMapFromGenre(genre);
		var daysIntoLoop = mapArray.indexOf(bcAbbr);
		$("#Heading_loopDaysLeft_" + genre).text((ch ? (mapArray.length - daysIntoLoop) : ""));
	    var totalChapters = BookStats[bookCode].chapters;
	    var chaptersLeft = totalChapters - ch + 1;
		$("#HeadingChaptersCount_" + genre).text(ch ? chaptersLeft : "");
	    //document.location.href="#mainDocTop";
		if (ch) {
		    // there's probably a restful way to post current chapter to href !#/blah
            // but just store the state internally for now.
		    $(idGenreDiv).data("current_chapter", ch.toString());
		    $(idGenreDiv).data("chapter_selection", false);
		}
		else
		{
		    $(idGenreDiv).data("chapter_selection", true);
		}


		$(idGenreDiv).load(oconfiguration.chapterPath + "/" + bcPage, function () {
		    var current_chapter = $(idGenreDiv).data("current_chapter");
			// disassemble the page into book
			//var bcAbbr = bcPage.split('.')[0];
		    //var bookAbbr = bcAbbr.substring(0, 3);
			jQuery(this).find("ul.tnav li a")
				.each(function (index) {
				    importLink(idGenreDiv, $(this));
				    if ($(this).text() == current_chapter) {
				        if ($(idGenreDiv).data("chapter_selection"))
				            $(this).addClass("current_chapter");
				        else {
				            $(this).html(current_chapter + "<span class='ch-selection-total'> / " + totalChapters + '</span> <span class="ch-selection-ellipsis">' +'\u2026</span>');
				            $(this).attr('title', 'click to select chapter');
				        }
				    }
				        
					//"javascript:loadGenrePage('#content_DtHistory', '" + bookAbbr + pad2(ch) + ".htm');");

				});
			jQuery(this).find("div.navChapters a")
				.each(function () {
					importLink(idGenreDiv, $(this));
					//"javascript:loadGenrePage('#content_DtHistory', '" + bookAbbr + pad2(ch) + ".htm');");
				});
			jQuery(this).find("div.footnote")
				.each(function () {
				    $(this).find('p').hide();
				    var fnCount = $(this).find('p').size();
				    if (fnCount > 0) {
				        $('<div class="footnote_toggle">footnotes</div>').insertAfter($(this).find('hr').first())
                            .click(function () {
                                $(this).siblings('p').toggle("slow", function () {
                                    // Animation complete.
                                });
                            });
				        $('.notemark').click(function () {
				            $('.footnote_toggle').siblings('p').show();
				        });
				    }
				});
			if (fLoadOnly)
				return;
			activateAccordionPanel('#accordion1', genre);
			//.animate({scrollTop:0}, 2000, 'ease')
			// $(window).animate({scrollTop:0}, 'slow', 'easein');
			//$(window).scrollTo(0);
			//if (fLoadOnly)
			//	return;
			$.scrollTo($('#accordion1').children('.accordion_header').eq(index), 200);
			//$.scrollTo(0, 200);
			//$(window).scrollTop(0);

		});


	}

	function genreIndex(genre) {
		var index = 0;
		switch (genre) {
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

	function activateAccordionPanel(accordionSelector, genre) {
		$('#tabs').tabs('select', '#tabs-1');
		var index = genreIndex(genre);
		// this is kludgy, but not sure how to prevent closing the panel if it's already open
		// (could possibly detect "style: display:block"
		$(accordionSelector).accordion("option", "collapsible", false);
		$(accordionSelector).accordion("activate", index);
		$(accordionSelector).accordion("option", "collapsible", true);
		//$.scrollTo($(accordionSelector).children('table').eq(index), 200);
	    //document.getElementById('mainDocTop').scrollIntoView(true);

	}

	function importLink(idGenreDiv, anchorElement) {
	    var bchtm = anchorElement.attr("href");
	    if (bchtm.indexOf("index") == -1)
		    anchorElement.attr("href","javascript:ARL.loadGenrePage('" + idGenreDiv + "', '" + bchtm + "');");
		return anchorElement;
	}

	function pad2(number) {

		return (number < 10 ? '0' : '') + number

	}

	function pad3(number) {

		return (number < 10 ? '00' : '') + number

	}

	function convertBCAbbrToHeading(bcAbbr) {
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

	return api;

})(jQuery, BookStats, SILTitleAbbrToHeader_eng);

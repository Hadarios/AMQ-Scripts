// ==UserScript==
// @name         Copy metadata button for AnisongDB
// @namespace    https://github.com/Hadarios
// @version      1.0.2
// @description  Adds a button to copy song metadata on AnisongDB
// @author       Hadarios
// @match        https://anisongdb.com
// @icon         https://www.google.com/s2/favicons?sz=64&domaster=anisongdb.com
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL  https://github.com/Hadarios/AMQ-Scripts/raw/master/anisongdbCopySongMetadata.user.js
// @updateURL    https://github.com/Hadarios/AMQ-Scripts/raw/master/anisongdbCopySongMetadata.user.js
// ==/UserScript==

function addCopyMetadata() {
    if ($("#qpCopyMetadata").length != 0) {
        return;
    }

    var songInfo = $("span[title=\"Copy song infos to clipboard\"]").text();
    var song = songInfo.match(/\"(.*)\" by/i)[1]
    var artist = songInfo.match(/\" by (.*)/i)[1]
    var animeInfo = $("#modal-header").text();
    var anime = animeInfo.match(/(.*) \(.*\)/i)[1]
    var mp3url = $("#modal-mp3-link").length !== 0 ? $("#modal-mp3-link").attr("href") : null;
    var webmurl = $("#modal-720-link").length !== 0 ? $("#modal-720-link").attr("href") : ($("#modal-480-link").length !== 0 ? $("#modal-480-link").attr("href") : null);

    let type;

    $("td").each(function() {
        if ($(this).text() === song) {
            $(this).parent().children().each(function () {
                if ($(this).text() === anime) {
                    $(this).parent().children().each(function () {
                        var text = $(this).text();
                        if (text.includes("Insert Song") || /Opening [0-9]+/.test(text) || /Ending [0-9]+/.test(text)) {
                            type = text;
                        }
                    })
                }
            })
        }
    })

    var metadata = `${anime} - ${type} (${song} - ${artist})\n\n${webmurl}\n${mp3url !== null ? mp3url : ''}`

    $("img[alt=\"Anime News Network Link\"]")
        .parent()
        .parent()
        .prepend(
        $("<p>Copy metadata</p>")
        .attr('id', 'qpCopyMetadata')
        .addClass("clickable")
        .attr('_ngcontent-ng-c2837928189', '')
        .css('margin-right', '20px')
        .css('margin-top', '5px')
        .click(() => {
            navigator.clipboard.writeText(metadata);
        })
    );
}

function setup() {
    document.addEventListener("click", (event) => {
        if (event.target.className !== 'fa fa-plus') return;
        setTimeout(() => {
            addCopyMetadata();
        }, 10);
    });
}

const loadInterval = setInterval(() => {
    if (document.querySelector("#table")) {
        clearInterval(loadInterval);
        setup();
    }
}, 200);
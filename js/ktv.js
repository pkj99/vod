
let pagename = window.location.pathname.split('/').slice(-1);
var urlParams;
var api_url = "https://pan.mailberry.com.cn/api/fs/get";
var db_url = 'https://pkj99.github.io/vod/db/songs.db';

function tvchannels2(groupName) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', m3u_url);
    xhr.onload = e => {

        var contents = xhr.response;
        var channel = "0";
        var url_tvg, tvg_logo, tvg_name, group_title, title, url, info;
        let htmlString = '';

        var lines = contents.split(/[\r\n]/);
        for (var i in lines) {
            var line = lines[i];
            if (/#EXTM3U/.test(line)) {
                channel = "0";
                if (/url-tvg/.test(line)) {
                    var keyVal = line.split(/ /)[1], url_tvg = keyVal.split(/[=]/)[1].replaceAll('\"', '').trim();
                }
            } else {
                if (/#EXTINF/.test(line)) {
                    channel = "0";
                    title = line.split(/,/)[1].replaceAll('\"', '').trim();
                    info = line.split(/,/)[0];

                    if (/tvg-logo/.test(info)) {
                        var keyVal = info.split(/tvg-logo/)[1], val2 = keyVal.split(/ /)[0], tvg_logo = val2.split(/[=]/)[1].replaceAll('\"', '').trim();
                    }
                    if (/tvg-name/.test(info)) {
                        var keyVal = info.split(/tvg-name/)[1], val2 = keyVal.split(/ /)[0], tvg_name = val2.split(/[=]/)[1].replaceAll('\"', '').trim();
                    }
                    if (/group-title/.test(info)) {
                        var keyVal = info.split(/group-title/)[1], val2 = keyVal.split(/ /)[0], group_title = val2.split(/[=]/)[1].replaceAll('\"', '').trim();
                    }
                } else {
                    if (line.trim() != '') {
                        channel = "1";
                        url = line.trim();
                    }
                }
            }
            if (channel == "1") {
                var img = tvg_logo;
                if (tvg_logo.includes('haiwaikan') || tvg_logo.includes('movieffm')) {
                    img = cors_api_url + encodeURIComponent(tvg_logo);
                }
                if (group_title == groupName || groupName == 'ALL') {
                    htmlString += `<li class="col-lg-8 col-md-8 col-sm-5 col-xs-3">`;
                    htmlString += `<div class="myui-vodlist__box">`;
                    htmlString += `<a class="myui-vodlist__thumb lazyload" href="playvideo.html?url=${url}&img=${tvg_logo}" `;
                    htmlString += `title="${title}" `;
                    htmlString += `data-original="${url}" `;
                    htmlString += `style="background-image: url('${img}')"`;
                    htmlString += `</a>`;
                    htmlString += `<span class="pic-text text-right">${group_title}</span>`;
                    htmlString += `</div>`;
                    htmlString += `<div class="myui-vodlist__detail">`;
                    htmlString += `<h4 class="title text-overflow"><a href="${url}">${title}</a></h4>`;
                    htmlString += `</div>`;
                    htmlString += `</li>`;
                }
                channel = "0";
            }
        }
        document.getElementById('tvlist').innerHTML = htmlString;
    };
    xhr.send();
}


// create song list 
function songlists(sqlstring) {
    // console.log(sqlstring);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', db_url, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = e => {
        const uInt8Array = new Uint8Array(xhr.response);
        const db = new SQL.Database(uInt8Array);

        const contents = db.exec(sqlstring);
        var data = JSON.parse(JSON.stringify(contents));

        let htmlString = '<ul>';

        if (typeof data[0] == "undefined") { data = []; } else { data = data[0].values; }

        for (var i = 0; i < data.length; i++) {
            var pid = data[i][0];
            var artist = data[i][1];
            var song = data[i][2];
            var path = data[i][5];

            htmlString += '<li class="col-lg-10 col-md-8 col-sm-5 col-xs-3">';
            htmlString += '<div class="myui-vodlist__box">';
            htmlString += '<a class="myui-vodlist__thumb lazyload" href="?song=' + path + '" ';
            htmlString += '</a>';
            htmlString += '</div>';

            htmlString += '<div class="myui-vodlist__detail">';
            htmlString += '<h4 class="title text-overflow"><a href="?song=' + path + '">' + song + '</a></h4>';
            htmlString += '</div>';
            htmlString += '</li>';
        }

        htmlString += '</ul>';

        document.getElementById('tvlist').innerHTML = htmlString;

    };
    xhr.send();
}



// Example POST method implementation:
async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

// get params
(window.onpopstate = function () {
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
})();


if (urlParams["t"] == null) { var t = "0"; } else { var t = urlParams["t"]; }
if (urlParams["artist"] != null) {
    var artist = urlParams["artist"];
    var sqlstring = "select * from ktv where artist=" + artist;
    songlists(sqlstring);
}






// if (urlParams["song"] == null) {
//     urlParams["song"] = '/onedrive/KTV/KTV歌库01(1000首)/4 IN LOVE-FALL IN LOVE[国语].mkv';
// }

var song_name = '';
let htmlString = '';

if (urlParams["song"] != null) {
    song_name = urlParams["song"];
    console.log(song_name);
    postData(api_url, { password: '', path: `${song_name}` }).then((data) => {
        console.log(data); // JSON data parsed by `data.json()` call
        if (data['code'] == 200) {
            var raw_url = data['data']['raw_url'];
            var thumb = data['data']['thumb'];
            ktv_url = `playvideo.html?url=${raw_url}&img=${thumb}`;
            // window.location.assign(ktv_url);
            // htmlString += `<video controls autoplay width="50%" poster="${thumb}" src="${raw_url}"></video>`;
            htmlString += `<video controls autoplay width="50%" src="${raw_url}"></video>`;
            document.getElementById('tvlist').innerHTML = htmlString;
        }
    });

}

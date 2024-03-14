
let pagename = window.location.pathname.split('/').slice(-1);
var urlParams;
var api_url = "https://pan.mailberry.com.cn/api/fs/get";
var db_url = 'https://pkj99.github.io/vod/db/karaoke.db';

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

        let htmlString = '';

        if (typeof data[0] == "undefined") { data = []; } else { data = data[0].values; }

        // htmlString += `<ul><li class="col-lg-8 col-md-8 col-sm-5 col-xs-3">`;
        htmlString += `<div class="myui-vodlist__box" style="width:200px">`;
        htmlString += `<a class="myui-vodlist__thumb lazyload" href="?artist=${data[0][1]}" `;
        htmlString += `title="${data[0][1]}" `;
        htmlString += `data-original="${data[0][1]}" `;
        htmlString += `style="background-image: url('${data[0][6]}');padding-top: 200px;"`;
        htmlString += `</a>`;
        htmlString += `<span class="pic-text text-right">${data[0][1]}</span>`;
        htmlString += `</div>`;
        // htmlString += `<div class="myui-vodlist__detail">`;
        // htmlString += `<h4 class="title text-overflow"><a href="?artist=${data[0][1]}">${data[0][1]}</a></h4>`;
        // htmlString += `</div>`;
        // htmlString += `</li></ul><br>`;

        htmlString += '<ul>';

        for (var i = 0; i < data.length; i++) {
            var pid = data[i][0];
            var artist = data[i][1];
            var song = data[i][2];
            var path = data[i][5];

            htmlString += '<li class="col-lg-10 col-md-8 col-sm-5 col-xs-3">';
            // htmlString += '<div class="myui-vodlist__box">';
            // htmlString += '<a class="myui-vodlist__thumb lazyload" href="?song=' + path + '" ';
            // htmlString += '</a>';
            // htmlString += '</div>';

            htmlString += '<div class="myui-vodlist__detail">';
            htmlString += '<h4 class="title text-overflow"><a href="?song=' + path + '">' + song + '</a></h4>';
            htmlString += '</div>';
            htmlString += '</li>';
        }

        htmlString += '</ul>';
        // console.log(htmlString);

        document.getElementById('tvlist').innerHTML = htmlString;

    };
    xhr.send();
}

// create song list 
function artistlists(sqlstring) {
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
            var artist_id = data[i][0];
            var artist_name = data[i][1];
            var artist_img = data[i][2];
            var group_id = data[i][3];

            htmlString += `<li class="col-lg-8 col-md-8 col-sm-5 col-xs-3">`;
            htmlString += `<div class="myui-vodlist__box">`;
            htmlString += `<a class="myui-vodlist__thumb lazyload" href="?artist=${artist_name}" `;
            htmlString += `title="${artist_name}" `;
            htmlString += `data-original="${artist_name}" `;
            htmlString += `style="background-image: url('${artist_img}');padding-top: 200px;"`;
            htmlString += `</a>`;
            htmlString += `<span class="pic-text text-right">${artist_name}</span>`;
            htmlString += `</div>`;
            // htmlString += `<div class="myui-vodlist__detail">`;
            // htmlString += `<h4 class="title text-overflow"><a href="?artist=${artist_name}">${artist_name}</a></h4>`;
            // htmlString += `</div>`;
            htmlString += `</li>`;
        }

        htmlString += '</ul>';
        // console.log(htmlString);

        document.getElementById('tvlist').innerHTML = htmlString;

    };
    xhr.send();
}


// create search list 
function searchlists(sqlstring) {
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
            var img = data[i][6];
            if (img == null) {
                img = 'images/karaoke.jpg';
            }

            htmlString += `<li class="col-lg-8 col-md-8 col-sm-5 col-xs-3">`;
            htmlString += `<div class="myui-vodlist__box">`;
            htmlString += `<a class="myui-vodlist__thumb lazyload" href="?song=${path}" `;
            htmlString += `title="${song}" `;
            htmlString += `data-original="${path}" `;
            htmlString += `style="background-image: url('${img}');padding-top: 200px;"`;
            htmlString += `</a>`;
            htmlString += `<span class="pic-text text-left">${artist}</span>`;
            htmlString += `<span class="pic-text text-right">${song}</span>`;
            htmlString += `</div>`;
            // htmlString += `<div class="myui-vodlist__detail">`;
            // htmlString += `<h4 class="title text-overflow"><a href="?artist=${artist_name}">${artist_name}</a></h4>`;
            // htmlString += `</div>`;
            htmlString += `</li>`;
        }

        htmlString += '</ul>';
        // console.log(htmlString);

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


if (urlParams["wd"] != null) {
    var wd = urlParams["wd"];
    var sqlstring = "select a.*,b.artist_img from ktv a left outer join artists b on a.artist = b.artist_name where a.artist like '%" + wd + "%' or a.song like '%" + wd + "%'";
    searchlists(sqlstring);
}


if (urlParams["artist"] != null) {
    var artist = urlParams["artist"];
    var sqlstring = "select a.*,b.artist_img from ktv a left outer join artists b on a.artist = b.artist_name where a.artist='" + artist + "'";
    songlists(sqlstring);
}

if (urlParams["type"] != null) {
    var type = urlParams["type"];
    var sqlstring = "select * from v_artists where group_id=" + type + "";
    artistlists(sqlstring);
    let menuId = 'menu' + urlParams["type"];
    document.getElementById(menuId).classList.add("active");
}


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
            htmlString += `<video controls autoplay width="100%"><source src="${raw_url}" type="video/mkv"></video>`;
            document.getElementById('tvlist').innerHTML = htmlString;
        }
    });

}

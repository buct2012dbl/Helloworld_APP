function initialize() {
    var options = {
        sky: true,
        atmosphere: true,
        dragging: true,
        tilting: true,
        zooming: true,
        center: [46.8011, 8.2266],
        scrollWheelZoom:true,
        zoom: 2
    };
    earth = new WE.map('earth_div', options);
    var natural = WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
        tileSize: 256,
        tms: true
    });
    natural.addTo(earth);

    var toner = WE.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.',
        opacity: 0.6
    });

    toner.addTo(earth);
    var before = null;
    /*requestAnimationFrame(function animate(now) {
        var c = earth.getPosition();
        var elapsed = before? now - before: 0;
        before = now;
        earth.setCenter([c[0], c[1] + 0.1*(elapsed/30)]);
        requestAnimationFrame(animate);
    });*/
    var showInfo = function(e) {
        alert(e.latitude + ', ' + e.longitude);
        alert('at ' + e.screenX + ', ' + e.screenY);
    };
    earth.on('dblclick', showInfo);
    $.ajax({
        url: 'http://api.map.baidu.com/highacciploc/v1?ak=CTNCAIq6rCsC561XesHUZ54qIp6lr4Bv&extensions=1,3&coord=gcj02&callback_type=jsonp',
        type: 'get',
        data: {},
        dataType: "jsonp",
        jsonp: "callback",
        success: function(data) {
            earth.setView([data.content.location.lat, data.content.location.lng], 2);
            var marker = WE.marker([data.content.location.lat, data.content.location.lng]).addTo(earth);
            marker.bindPopup('<b>你现在的位置:' + data.content.formatted_address + '</b>');
            marker.openPopup();
            sessionStorage.setItem("lat", data.content.location.lat);
            sessionStorage.setItem("lng", data.content.location.lng);
            sessionStorage.setItem("address", data.content.formatted_address)
            $("#upload_location_lat").val(data.content.location.lat);
            $("#upload_location_lng").val(data.content.location.lng);
            $("#upload_location_address").val(data.content.formatted_address);
        }
    });
}

function pvbinit() {
    var options = {
        sky: true,
        atmosphere: true,
        dragging: true,
        tilting: true,
        zooming: true,
        center: [46.8011, 8.2266],
        scrollWheelZoom:true,
        zoom: 2
    };
    earth = new WE.map('earth_div', options);
    var natural = WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
        tileSize: 256,
        tms: true
    });
    natural.addTo(earth);
    var toner = WE.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.',
        opacity: 0.6
    });
    toner.addTo(earth);
    $.ajax({
        url: '/placeshavebeen',
        type: 'POST',
        dataType: 'json',
        data: {
            id: sessionStorage.getItem("id")
        },
        success: function(data) {
            earth.setView([sessionStorage.getItem("lat"), sessionStorage.getItem("lng")], 2);
            for (var i = 0; i < data.content.length; i++) {
                var marker = WE.marker([data.content[i].lat, data.content[i].lng]).addTo(earth);
                marker.bindPopup('<b>' + data.content[i].address + '</b>');
            }
        }
    });
    $("#upload_location_lat").val(sessionStorage.getItem("lat"));
    $("#upload_location_lng").val(sessionStorage.getItem("lng"));
    $("#upload_location_address").val(sessionStorage.getItem("address"));
}

function mainpage() {
    window.location.href = "/index";

}

function loginexitclick() {
    $(".login").fadeOut();
}

function signupexitclick() {
    $(".signup").fadeOut();
}

function loginclick() {
    $(".login").fadeIn();
}

function signupclick() {
    $(".signup").fadeIn();
}

function userloginsubmit() {
    var username = $(".username").val();
    var password = $(".password").val();
    if (username == "" || password == "") {
        $(".errormsg").text('The insertion can\'t be empty');
        return;
    }
    $.ajax({
        url: '/userconfirm',
        type: 'POST',
        dataType: 'json',
        data: {
            username: username,
            password: password
        },
        success: function(data) {
            if (data.success) {
                $(".errormsg").empty();
                $(".login").css("display", "none");
                sessionStorage.setItem("id", data.id);
            } else if (!data.success) {
                $(".errormsg").text('login failed, username or password is wrong.');
            }
        }
    });

}

function usersignupsubmit() {
    var username = $(".signupusername").val();
    var password = $(".signuppassword").val();
    var passwordagain = $(".signuppasswordagain").val();
    if (username == "" || password == "" || passwordagain == "") {
        $(".signupperrmsg").text('The insertion can\'t be empty');
    }
    if (password != passwordagain) {
        $(".signuperrmsg").text('The first password insertion is different from the second');
        return;
    } else {
        $.ajax({
            url: '/saveuser',
            type: 'POST',
            dataType: 'json',
            data: {
                username: username,
                password: password
            },
            success: function(data) {
                if (data.success) {
                    $(".signup").css("display", "none");
                    $(".signuppasswordagain").empty();
                } else if (!data.success) {
                    $(".signuperrmsg").text('Sign up failed');
                }
            }
        });
    }
}

function markwhereyoure() {
    if (sessionStorage.getItem("id")) {
        $(".uploadsection").fadeIn();

    } else
        alert("You haven't logined.");
}

function markwhereyoure_out() {
    $(".uploadsection").fadeOut();
}

function placeshavebeen() {
    if (sessionStorage.getItem("id")) {
        window.location.href = "/placesyouhavebeen"


    } else {
        alert("You haven't logined.");
        return;
    }
}

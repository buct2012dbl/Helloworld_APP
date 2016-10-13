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
        $(".errorsg").text('The insertion can\'t be empty');
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
            	$(".login").css("display","none");
            	sessionStorage.currentuser = data.id;
            } else if (!data.success) {
                $(".errormsg").text('login failed, username or password is wrong');
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

	$(".uploadsection").fadeIn();
}

function markwhereyoure_out() {
	$(".uploadsection").fadeOut();
}

function placeshavebeen() {
        if (sessionStorage.currentuser) {
            var options = {
                sky: true,
                atmosphere: true,
                dragging: true,
                tilting: true,
                zooming: true,
                center: [46.8011, 8.2266],
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
                    id: sessionStorage.currentuser
                },
                success: function(data) {
                    for (var i = 0; i < data.content.length; i++) {
                        var marker = WE.marker([data.content[i].lat, data.content[i].lng]).addTo(earth);
                        marker.bindPopup('<b>' + data.content[i].address + '</b>');
                    }
                }
            });

        } else {
            alert("You haven't logined.");
            return;
        }
    }
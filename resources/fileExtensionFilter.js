myApp.filter('fileExtensionFilter', function () {
    return function (input) {
        if (input.substring(input.indexOf('.')) == ".txt") {
            return "/index/static/icons/ico_txt.png";
        }
        else if (input.substring(input.indexOf('.')) == ".jpg") {
            return "/index/static/icons/ico_jpg.png"
        }
        else if (input.substring(input.indexOf('.')) == ".jpeg") {
            return "/index/static/icons/ico_jpeg.png"
        }
        else if (input.substring(input.indexOf('.')) == ".html") {
            return "/index/static/icons/ico_html.png"
        }
        else if (input.substring(input.indexOf('.')) == ".js") {
            return "/index/static/icons/ico_js.png"
        }
        else if (input.substring(input.indexOf('.')) == ".mp3") {
            return "/index/static/icons/ico_mp3.png"
        }
        else {
            return;
        }

    };
});
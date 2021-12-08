window.addEventListener("load", function (event) {

    document.location.search.slice(1).split("&").forEach((pair) => {

        if (pair.split("=")[0] === "parameter") {
            let parameter = decodeURIComponent(pair.slice(pair.indexOf("=") + 1));
            if (parameter === "[全局]") {
                parameter = "";
            }
            let sections = Array.prototype.slice.call(document.querySelectorAll(".tag-section"), 0);
            for (let section of sections) {
                if (section.getAttribute("tag-parameter") !== parameter) {
                    section.style.display = "none";
                }
            }
        }

    });

});

window.addEventListener("load", function (event) {
    if (window.parent) {
        document.addEventListener("keyup", function (event) {
            if (event.key === "s") {
                window.parent.postMessage({
                    "command": "focusSearch"
                }, "*");
            }
        });
        window.parent.postMessage({
            "command": "highlightTOCEntry",
            "url": document.location.href
        }, "*");
    }
});

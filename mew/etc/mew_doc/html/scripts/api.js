window.addEventListener("load", function (event) {

    let apiTags = Array.prototype.slice.call(document.querySelectorAll(".api-tag"), 0);
    for (let tag of apiTags) {
        tag.addEventListener("click", function () {
            let tagName = tag.querySelector(".api-tag-name").textContent;
            let tagParameter = tag.querySelector(".api-tag-parameter");
            if (mewDocIndex.tags[tagName]) {
                if (tagParameter) {
                    document.location = `../${mewDocIndex.tags[tagName].path}?parameter=${encodeURIComponent(tagParameter.textContent)}`;
                } else {
                    document.location = `../${mewDocIndex.tags[tagName].path}`;
                }
            }
        });
    }

    let apiRelateds = Array.prototype.slice.call(document.querySelectorAll(".api-related"), 0);
    for (let related of apiRelateds) {
        related.addEventListener("click", function () {
            let relatedName = related.querySelector(".api-related-name").textContent;
            if (mewDocIndex.apis[relatedName]) {
                document.location = `../${mewDocIndex.apis[relatedName].path}`;
            }
        });
    }

    let lastTypeValue = undefined;

    const highlightTypes = function (typeValue) {

        if (lastTypeValue === typeValue) {
            return;
        }
        lastTypeValue = typeValue;

        for (let highlighted of Array.prototype.slice.call(document.querySelectorAll(".highlighting"), 0)) {
            highlighted.classList.remove("highlighting");
        }

        let names = Array.prototype.slice.call(document.querySelectorAll(".api-type-class-" + typeValue.toLowerCase()), 0);
        for (let name of names) {
            if (name.textContent === typeValue) {
                name.classList.add("highlighting");
            }
        }

    };

    const clearHighlights = function (typeValue) {

        if (lastTypeValue !== typeValue) {
            return;
        }
        lastTypeValue = undefined;

        for (let highlighted of Array.prototype.slice.call(document.querySelectorAll(".highlighting"), 0)) {
            highlighted.classList.remove("highlighting");
        }

    };

    const openType = function (typeValue) {

        let id = typeValue + "()";

        if (mewDocIndex.apis[id]) {
            document.location = "../" + mewDocIndex.apis[id].path;
        }

        for (let key in mewDocIndex.apis) {
            if (mewDocIndex.apis[key].aliases && mewDocIndex.apis[key].aliases[id]) {
                document.location = "../" + mewDocIndex.apis[key].path;
            }
        }

    };

    let apiTypeNames = Array.prototype.slice.call(document.querySelectorAll(".api-type-name"), 0);
    for (let typeName of apiTypeNames) {
        typeName.classList.add("api-type-class-" + typeName.textContent.toLowerCase());
        typeName.addEventListener("mouseenter", function (event) {
            highlightTypes(this.textContent);
        });
        typeName.addEventListener("mouseleave", function (event) {
            clearHighlights(this.textContent);
        });
        typeName.addEventListener("click", function (event) {
            openType(this.textContent);
        });
    }

    let apiNames = Array.prototype.slice.call(document.querySelectorAll(".api-parameter .api-parameter-name, .api-result .api-result-name"), 0);
    for (let name of apiNames) {
        name.classList.add("api-type-class-" + name.textContent);
        name.addEventListener("mouseenter", function (event) {
            highlightTypes(this.textContent);
        });
        name.addEventListener("mouseleave", function (event) {
            clearHighlights(this.textContent);
        });
        name.addEventListener("click", function (event) {
            openType(this.textContent);
        });
    }

});

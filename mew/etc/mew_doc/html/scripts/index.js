const generateTOCEntries = function (ul, list) {

    if (!ul) {
        ul = document.querySelector("#index-toc");
    }
    ul.textContent = "";

    Object.keys(list).forEach((key) => {

        let version = 0;

        let expand = function () {
            ++version;
            let newVersion = version;
            li.classList.remove("collapsed");
            let height = window.getComputedStyle(subul).height;
            subul.style.height = "0";
            setTimeout(function () {
                if (newVersion !== version) { return; }
                subul.style.height = height;
                setTimeout(function () {
                    if (newVersion !== version) { return; }
                    subul.style.height = "";
                }, 350);
            }, 30);
        };

        let collapse = function () {
            ++version;
            let newVersion = version;
            let height = window.getComputedStyle(subul).height;
            subul.style.height = height;
            li.classList.add("collapsed");
            setTimeout(function () {
                if (newVersion !== version) { return; }
                subul.style.height = "";
            }, 30);
        };

        let li = document.createElement("li");
        if (list[key].collapsed) {
            li.classList.add("collapsed");
        }
        li.classList.add("toc-entry");
        let title = key;
        if (list[key].title) {
            title = list[key].title;
        }
        let arrow = document.createElement("div");
        arrow.classList.add("toc-entry-arrow");
        arrow.addEventListener("click", function () {
            if (!subul) { return; }
            if (li.classList.contains("collapsed")) {
                expand();
            } else {
                collapse();
            }
        });
        li.appendChild(arrow);

        let span = document.createElement("span");
        span.classList.add("toc-entry-title");
        if (list[key].classes) {
            list[key].classes.split(/\s+/).forEach((name) => {
                span.classList.add(name);
            });
        }

        let name = document.createElement("span");
        name.textContent = title;
        name.classList.add("toc-entry-name");

        let hasAction = false;
        if (list[key].href) {
            hasAction = true;
            name.classList.add("clickable");
            span.mewDocPath = list[key].href;
            name.addEventListener("click", function () {
                document.querySelector("#index-frame").src = list[key].href;
            });
        }

        span.appendChild(name);

        li.appendChild(span);

        let sublist = list[key].sublist;
        if ((!sublist) && (list[key] instanceof Array)) {
            sublist = list[key];
        }

        let count = list[key].count;
        if ((!count) && sublist) {
            count = Object.keys(sublist).length;
        }
        if (count) {
            let num = document.createElement("span");
            num.classList.add("toc-entry-count");
            num.textContent = count;
            span.appendChild(num);
        }

        let subul = undefined;
        if (sublist && Object.keys(sublist).length) {
            li.classList.add("sublist");
            subul = document.createElement("ul");
            subul.classList.add("toc-list");
            generateTOCEntries(subul, sublist);
            li.appendChild(subul);
            name.classList.add("clickable");
            name.addEventListener("click", function () {
                if (li.classList.contains("collapsed")) {
                    expand();
                } else if (!hasAction) {
                    collapse();
                }
            });
        }

        ul.appendChild(li);

    });

};

let lastKeyword = "";

const generateTOC = function (keyword) {

    if (lastKeyword === keyword) {
        return;
    }

    lastKeyword = keyword;

    let entries = [];

    if (keyword) {

        let regex = new RegExp(keyword.split("").map((c) => {
            if (c === ".") {
                return "\\.(.)*";
            }
            if ("[]()^$*-+|{}?".indexOf(c) !== -1) {
                return "\\" + c;
            }
            return c;
        }).join("[^\\.]*"), "i");

        let titleMap = Object.create(null);

        Object.keys(mewDocIndex.apis).filter((id) => {

            if (regex.test(id)) {
                return true;
            }

            if (mewDocIndex.apis[id].aliases) {
                for (let alias of mewDocIndex.apis[id].aliases) {
                    if (regex.test(alias)) {
                        titleMap[id] = alias;
                        return true;
                    }
                }
            }

            return false;

        }).forEach((id) => {

            let title = titleMap[id];

            entries.push({
                "title": (title ? title : id).replace(/\.prototype\./g, "::"),
                "classes": "api",
                "href": mewDocIndex.apis[id].path
            });
        });

    } else {

        if (mewDocIndex.todos) {
            entries.push({
                "title": "TODO 列表",
                "href": "todos.html",
                "count": mewDocIndex.todos
            });
        }

        const prepareEntrances = function (keys) {

            let result = [];

            let root = Object.create(null);

            keys.forEach(([id, path]) => {
                let container = root;
                let splitted = id.split(".");
                for (let component of splitted.slice(0, -1)) {
                    if (!container[component]) {
                        container[component] = Object.create(null);
                    }
                    container = container[component];
                }
                let last = splitted[splitted.length - 1];
                if (last.slice(-2) === "()") {
                    last = last.slice(0, -2);
                }
                if (!container[last]) {
                    container[last] = Object.create(null);
                }
                if (!container[last]["."]) {
                    container[last]["."] = [];
                }
                container[last]["."].push([id, path]);
            });

            const simplify = function (container) {

                let newContainer = Object.create(null);

                if (container["."]) {
                    newContainer["."] = container["."];
                }

                for (let key in container) {
                    if (key !== ".") {
                        let values = simplify(container[key]);
                        let keys = Object.keys(values);
                        if (keys.length === 1) {
                            if (keys[0] === ".") {
                                newContainer[key] = values;
                            } else {
                                newContainer[key + "." + keys[0]] = values[keys[0]];
                            }
                        } else if (keys.length === 2) {
                            let index = keys.indexOf(".");
                            if ((index !== -1) && (values[keys[index]].length === 1)) {
                                newContainer[key] = Object.create(null);
                                newContainer[key]["."] = values["."];
                                let choices = Object.create(null);
                                for (let subkey in values[keys[1 - index]]) {
                                    if (subkey === ".") {
                                        choices[keys[1 - index]] = Object.create(null);
                                        choices[keys[1 - index]]["."] = values[keys[1 - index]]["."];
                                    } else {
                                        choices[keys[1 - index] + "." + subkey] = values[keys[1 - index]][subkey];
                                    }
                                }
                                let choicesKeys = Object.keys(choices);
                                if (choicesKeys.length === 1) {
                                    newContainer[key + "." + choicesKeys[0]] = choices[choicesKeys[0]];
                                } else {
                                    for (let choiceKey in choices) {
                                        newContainer[key][choiceKey] = choices[choiceKey];
                                    }
                                }
                            } else {
                                newContainer[key] = simplify(container[key]);
                            }
                        } else {
                            newContainer[key] = simplify(container[key]);
                        }
                    }
                }

                return newContainer;

            };

            root = simplify(root);
            let rootKeys = Object.keys(root);
            if (rootKeys.length === 1) {
                if (rootKeys[0] !== ".") {
                    let newRoot = Object.create(null);
                    for (let key in root[rootKeys[0]]) {
                        if (key === ".") {
                            newRoot[rootKeys[0]] = Object.create(null);
                            newRoot[rootKeys[0]]["."] = root[rootKeys[0]]["."];
                        } else {
                            newRoot[rootKeys[0] + "." + key] = root[rootKeys[0]][key];
                        }
                    }
                    root = newRoot;
                }
            } else if (rootKeys.length === 2) {
                let index = rootKeys.indexOf(".");
                if ((index !== -1) && (root["."].length === 1)) {
                    let newRoot = Object.create(null);
                    newRoot["."] = root["."];
                    for (let key in root[rootKeys[1 - index]]) {
                        if (key === ".") {
                            newRoot[rootKeys[1 - index]] = Object.create(null);
                            newRoot[rootKeys[1 - index]]["."] = root[rootKeys[1 - index]]["."];
                        } else {
                            newRoot[rootKeys[1 - index] + "." + key] = root[rootKeys[1 - index]][key];
                        }
                    }
                    root = newRoot;
                }
            }

            const createNode = function ([id, path]) {
                return {
                    "title": id.replace(/\.prototype(\.|$)/g, "::"),
                    "classes": "api",
                    "collapsed": true,
                    "href": path
                };
            };

            const createNodes = function (root, nodes, prefix) {

                let count = 0;

                for (let id in root) {
                    if (id !== ".") {
                        let subcount = 0;
                        let newPrefix = id;
                        if (prefix) {
                            newPrefix = prefix + "." + newPrefix;
                        }
                        let keys = Object.keys(root[id]);
                        let sublist = [];
                        subcount += createNodes(root[id], sublist, newPrefix);
                        if ((sublist.length > 0) && root[id]["."] &&  (root[id]["."].length > 1)) {
                            root[id]["."].slice(1).forEach((id) => {
                                let node = createNode(id);
                                sublist.push(node);
                                ++subcount;
                            });
                        }
                        sublist.sort((a, b) => a.title.replace(/[\(\)]/g, "").localeCompare(b.title.replace(/[\(\)]/g, "")));
                        if (root[id]["."]) {
                            if (keys.length === 1) {
                                root[id]["."].map(createNode).forEach((node) => {
                                    ++subcount;
                                    nodes.push(node);
                                });
                            } else {
                                let node = createNode(root[id]["."][0]);
                                node.count = subcount;
                                ++subcount;
                                nodes.push(node);
                                if (sublist.length > 0) {
                                    node.sublist = sublist;
                                }
                            }
                        } else if (sublist.length > 0) {
                            nodes.push({
                                "title": newPrefix.replace(/\.prototype(\.|$)/g, "::"),
                                "count": subcount,
                                "classes": "api",
                                "collapsed": true,
                                "sublist": sublist
                            });
                        }
                        count += subcount;
                    }
                }
                return count;
            };

            let count = 0;
            let rootNodes = [];
            if (root["."]) {
                count = root["."].length;
                rootNodes = root["."].map(createNode);
            }

            count += createNodes(root, rootNodes);

            rootNodes.sort((a, b) => a.title.replace(/[\(\)]/g, "").localeCompare(b.title.replace(/[\(\)]/g, "")));

            return [count, rootNodes];

        };

        if (mewDocIndex.toc && mewDocIndex.tags[mewDocIndex.toc]) {

            let all = 0;
            let list = [];

            for (let parameter in mewDocIndex.tags[mewDocIndex.toc].apis) {
                let [count, sublist] = prepareEntrances(mewDocIndex.tags[mewDocIndex.toc].apis[parameter].map(([id, key]) => {
                    return [id, mewDocIndex.apis[id].path];
                }));
                all += count;
                let name = parameter ? parameter : "[全局]";
                list.push({
                    "title": name,
                    "classes": "api",
                    "href": mewDocIndex.tags[mewDocIndex.toc].path + "?parameter=" + encodeURIComponent(name),
                    "count": count,
                    "collapsed": true,
                    "sublist": sublist
                });
            }

            list.sort((a, b) => a.title.localeCompare(b.title));

            if (list.length === 1) {
                list[0].title = "API 文档";
                list[0].collapsed = false;
                delete list[0].classes;
                entries.push(list[0]);
            } else {
                entries.push({
                    "title": "API 文档",
                    "count": all,
                    "href": mewDocIndex.tags[mewDocIndex.toc].path,
                    "sublist": list
                });
            }

        } else {
            let [count, list] = prepareEntrances(Object.keys(mewDocIndex.apis).map((key) => {
                return [key, mewDocIndex.apis[key].path];
            }));
            entries.push({
                "title": "API 文档",
                "count": count,
                "sublist": list
            });
        }

        entries.push({
            "title": "标签",
            "sublist": Object.keys(mewDocIndex.tags).filter((name) => {
                return name !== mewDocIndex.toc;
            }).sort().map((name) => {

                let sublist = [];

                let count = 0;
                for (let parameter in mewDocIndex.tags[name].apis) {
                    sublist.push({
                        "title": parameter ? parameter : "[全局]",
                        "classes": "tag",
                        "count": mewDocIndex.tags[name].apis[parameter].length,
                        "href": mewDocIndex.tags[name].path + "?parameter=" + encodeURIComponent(parameter)
                    });
                    count += mewDocIndex.tags[name].apis[parameter].length;
                }
                sublist.sort((a, b) => a.title.localeCompare(b.title));
                return {
                    "title": name,
                    "collapsed": true,
                    "count": count,
                    "sublist": sublist.length > 1 ? sublist : undefined,
                    "href": mewDocIndex.tags[name].path
                };
            })
        });

    }

    generateTOCEntries(undefined, entries);

    updateTOCStates();

};

window.addEventListener("load", function (event) {

    document.title = mewDocIndex.package + "文档";

    document.querySelector("#index-name").textContent = mewDocIndex.package;

    generateTOC();

    const input = document.querySelector("#search-field");

    input.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            input.value = "";
        } else if (event.key === "Enter") {
            document.querySelector(".toc-entry-name").click();
        }
        updateTOC();
    });

    input.addEventListener("paste", updateTOC);
    input.addEventListener("blur", updateTOC);

    input.addEventListener("focus", (event) => {
        input.select();
    });

});

let currentPagePath = undefined;

const updateTOCStates = function (pagePath, force) {

    if ((currentPagePath !== pagePath) || (!pagePath) || force) {

        if (pagePath) {
            currentPagePath = pagePath;
        }

        let titles = Array.prototype.slice.call(document.querySelectorAll(".toc-entry-title"), 0);
        for (let title of titles) {
            if (title.classList.contains("current")) {
                title.classList.remove("current");
            }
            if (currentPagePath && (title.mewDocPath === currentPagePath)) {
                title.classList.add("current");
                let parent = title.parentNode;
                while (parent) {
                    if (parent.classList &&
                        parent.classList.contains("toc-entry") &&
                        parent.classList.contains("collapsed")) {
                        parent.classList.remove("collapsed");
                    }
                    parent = parent.parentNode;
                }
                let top = title.getClientRects()[0].top;
                let toc = document.querySelector("#index-toc");
                if ((top < 80) || (top + 30 >= toc.clientHeight)) {
                    try {
                        toc.scroll({
                            "top": Math.max(0, top + toc.scrollTop - 160),
                            "left": 0,
                            "behavior": "smooth"
                        });
                    } catch (error) {}
                }
            }
        }

    }

};

window.addEventListener("message", function (message) {

    if (message.data && message.data.command) {
        switch (message.data.command) {
            case "focusSearch": {
                let input = document.querySelector(":focus");
                if (!input) {
                    document.querySelector("#search-field").focus();
                }
                break;
            };
            case "highlightTOCEntry": {
                let prefix = document.location.href.split("?")[0].split("/").slice(0, -1).join("/");
                let pagePath = message.data.url.slice(prefix.length + 1);
                updateTOCStates(pagePath);
                break;
            };
            default: {
                break;
            };
        }
    }

});

const updateTOC = function () {

    setTimeout(function () {
        generateTOC(document.querySelector("#search-field").value);
    }, 0);

};

document.addEventListener("keyup", function (event) {
    if (event.key === "s") {
        let input = document.querySelector(":focus");
        if (!input) {
            document.querySelector("#search-field").focus();
        }
    }
});


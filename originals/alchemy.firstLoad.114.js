var stats = {
    init: function() {
        stats.data = {
            lastEvent: "",
            progress: 0,
            progressToday: 0,
            lastChild: 0,
            lastChildName: "",
            lastParents: [],
            lastDate: 0,
            failCount: 0,
            failInRow: [0],
            failParents: [],
            failDate: [],
            numberOfClicks: 0,
            numberOfAFK: 0,
            online: !0,
            logged: !1,
            startDate: (new Date).getTime(),
            maxElementsOnWorkspace: 0,
            elementsPositions: []
        }, stats.initEvents(), stats.initAnalytics()
    },
    initEvents: function() {
        $(document).on("newChildCreated", function(a, b) {
            stats.data.lastChild = b, stats.data.lastChildName = bases.names[b], stats.data.progress = game.progress.length + game.prime.length, stats.data.progressToday += 1, stats.data.failInRow.push(0), stats.data.elementsPositions.push(stats.getElementsPositions()), stats.data.elementsPositions[stats.data.elementsPositions.length - 1] > stats.data.maxElementsOnWorkspace && (stats.data.maxElementsOnWorkspace = stats.data.elementsPositions[stats.data.elementsPositions.length - 1]), stats.data.lastMixAttempt = (new Date).getTime()
        }), $(document).on("updateHistory", function(a, b, c) {
            stats.data.lastParents = b, stats.data.lastDate = c
        }), $(document).on("childCreationFail", function(a, b) {
            stats.data.failCount += 1, stats.data.failInRow[stats.data.failInRow.length - 1] += 1, stats.data.failParents.push(b), stats.data.failDate.push((new Date).getTime()), stats.data.elementsPositions.push(stats.getElementsPositions()), stats.data.elementsPositions[stats.data.elementsPositions.length - 1] > stats.data.maxElementsOnWorkspace && (stats.data.maxElementsOnWorkspace = stats.data.elementsPositions[stats.data.elementsPositions.length - 1]), stats.data.lastMixAttempt = (new Date).getTime()
        }), $(document).on("loginCompleted", function() {
            stats.data.logged = !0, stats.data.loginDate = (new Date).getTime()
        }), $(document).on("online", function() {
            stats.data.online = !0
        }), $(document).on("awayFromKeyboard", function() {
            stats.data.numberOfAFK += 1
        }), $(document).on("click", function() {
            stats.data.numberOfClicks += 1
        }), $(document).on("onbeforeunload", function() {
            stats.data.logoutDate = (new Date).getTime(), stats.data.timeSpent = parseInt(window.localStorage.getItem("timeSpent"), 10) + Math.floor(stats.time.total + stats.time.currentTime)
        }), $(document).on("newChildCreated updateHistory childCreationFail loginCompleted online", function(a) {
            stats.data.lastEvent = a.type, $(document).trigger("statsDataUpdated")
        })
    },
    initAnalytics: function() {
        $("#menu").on("click", function() {
            ga("send", "event", "Menu", "Opened")
        }), $(document).on("menuTabOpened", function(a, b) {
            ga("send", "event", "Menu", "Tab opened", b)
        }), $(document).on("change", "#settingsCheckAlreadyCombined", function() {
            ga("send", "event", "Settings", "Check already combined", this.checked ? "true" : "false")
        }), $(document).on("change", "#settingsMarkFinalElements", function() {
            ga("send", "event", "Settings", "Mark final elements", this.checked ? "true" : "false")
        }), $(document).on("change", "#settingsHideFinalElements", function() {
            ga("send", "event", "Settings", "Hide final elements", this.checked ? "true" : "false")
        }), $(document).on("change", "#settingsTurnOffNotifications", function() {
            ga("send", "event", "Settings", "Turn off notifications", this.checked ? "true" : "false")
        }), $(document).on("change", "#settingsLanguage", function() {
            ga("send", "event", "Settings", "Language", this.options[this.selectedIndex].value)
        }), $(document).on("newChildCreated", function(a, b) {
            ga("send", "event", "Elements", "New element", b), stats.data.failInRow.length >= 2 && stats.data.failInRow[stats.data.failInRow.length - 2] > 0 && ga("send", "event", "Elements", "Fails in streak", stats.data.failInRow[stats.data.failInRow.length - 2] + " ")
        }), $(document).on("childCreationFail", function(a, b) {
            ga("send", "event", "Elements", "Failed parents", b[0] + " | " + b[1])
        }), $(document).on("cloneWorkspaceBox", function(a, b, c) {
            ga("send", "event", "Elements", "Clone element", c.id)
        }), $(document).on("loggedIn", function() {
            ga("send", "event", "Google+", "Logged in", GoogleAPI.player.id)
        }), $(document).on("achievementEarned", function(a, b) {
            ga("send", "event", "Achievements", "Earned", b)
        }), $(document).on("hiddenElementCreated", function(a, b) {
            ga("send", "event", "Elements", "Hidden element", b)
        }), $(document).on("sharedScreenshot", function() {
            ga("send", "event", "Share", "Screenshot")
        }), $(document).on("sharedProgress", function(a, b) {
            ga("send", "event", "Share", "Progress", b + " ")
        }), $(document).on("sharedElement", function(a, b) {
            ga("send", "event", "Share", "Element", b + " ")
        }), $("#clearWorkspace").on("touchstart", function() {
            ga("send", "event", "Elements", "Clear workspace", "Cleared")
        }), window.onbeforeunload = function() {
            ga("send", "event", "Progress", "In session", stats.data.progressToday + " "), ga("send", "event", "Elements", "Fails in session", stats.data.failCount + " ")
        }
    },
    initAnonymous: function() {
        var a;
        if (!stats.data.logged && null === localStorage.getItem("uid")) {
            stats.uid = (new Date).getTime() + "";
            var b = "",
                c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (a = 0; 10 > a; a++) b += c.charAt(Math.floor(Math.random() * c.length));
            stats.uid += b, window.localStorage.setItem("uid", stats.uid)
        }
    },
    getElementsPositions: function() {
        for (var a, b, c = [], d = $("#workspace > .element"), e = 0, f = d.length; f > e; e++) a = $(d[e]).offset(), a.left = Math.floor(a.left), a.top = Math.floor(a.top), a.top > 0 && a.left > 0 && (b = d[e].getAttribute("data-elementId"), c.push({
            position: a,
            id: parseInt(b, 10)
        }));
        return c
    }
};
stats.init();
var menu = {
    init: function() {
        menu.$el = $("#panel"), menu.$container = menu.$el.find(".content"), menu.active = "welcome", menu.initEvents(), menu.canClickMenuTab = !0, menu.data = {
            welcome: {
                initEvents: function() {
                    void 0 != typeof feedback && feedback.initEvents()
                }
            },
            settings: {
                generateData: function() {
                    return {
                        selected: localization.language,
                        languages: localization.languages
                    }
                },
                onCreation: function() {
                    settings.initContent();
                    var a = document.getElementById("settingsDisconnect");
                    GoogleAPI.logged || (a.style.display = "none"), $(document).on("loggedIn", function() {
                        a.style.display = "block"
                    }), $(document).on("loggedOut", function() {
                        a.style.display = "none"
                    })
                }
            },
            leaderboards: {
                initEvents: function() {
                    $(document).trigger("leaderboardsTabShown")
                },
                onCreation: function() {
                    var a = menu.$el[0].querySelector('[data-tabName="leaderboards"]');
                    GoogleAPI.logged || (a.style.display = "none"), $(document).on("loggedIn", function() {
                        a.style.display = "block", menu.setMenuTabsWidth(), menu.refreshIScroll()
                    }), $(document).on("loggedOut", function() {
                        a.style.display = "none", menu.setMenuTabsWidth(), menu.refreshIScroll()
                    })
                }
            },
            achievements: {
                refresh: !0,
                initEvents: function() {
                    $(document).trigger("achievementsTabShown")
                }
            }
        }, localization && localization.loaded ? menu.loadTemplates() : $(document).one("languagePackLoaded", function() {
            menu.loadTemplates()
        })
    },
    initEvents: function() {
        $(document).on("click", "#menu", function() {
            menu.open()
        }), menu.$el.on("click", function(a) {
            a.target.id === menu.$el[0].id && menu.close()
        }), $("#closePanel").on("click", function() {
            menu.close()
        }), $(document).on("keyup", function(a) {
            27 === a.which && menu.close()
        }), $(document).on("languageChanged", function() {
            menu.$container.find("#menuContent").remove(), menu.$container.find("#outerMenuTabs").remove(), menu.loadTemplates()
        }), $(document).on("menuCreated", function() {
            "undefined" != typeof sharing && sharing.init()
        })
    },
    initTabs: function() {
        for (var a in menu.data) menu.data[a].title = localization.get("menu-" + a);
        menu.$container.append(templateEngine(menu.template, menu)), menu.$el.find('[data-tabName="' + menu.active + '"]').addClass("active");
        for (var a in menu.data) {
            var b = menu.data[a].hasOwnProperty("generateData") ? menu.data[a].generateData() : {};
            $($("#" + a).find("div")[0]).append(templateEngine(menu.data[a].template, b)), menu.data[a].hasOwnProperty("onCreation") && menu.data[a].onCreation(), menu.$el.find('[data-tabName="' + a + '"]').on("click", function() {
                if (!menu.canClickMenuTab) return !1;
                var a = $(this),
                    b = a.attr("data-tabName");
                if (menu.data[b].hasOwnProperty("refresh")) {
                    var c = menu.data[b].hasOwnProperty("generateData") ? menu.data[b].generateData() : {};
                    $(menu.$container.find("#" + b).find("div")[0]).empty().append(templateEngine(menu.data[b].template, c))
                }
                menu.active = b, menu.$el.find(".active").removeClass("active"), a.addClass("active"), menu.$container.find(".visible").removeClass("visible").addClass("hidden"), menu.$container.find("#" + b).removeClass("hidden").addClass("visible"), menu.data[b].hasOwnProperty("initEvents") && menu.data[b].initEvents(), iscrollMenu && (iscrollMenu.scrollTo(0, 0, 0), iscrollMenu.refresh()), $(document).trigger("menuTabOpened", [b])
            })
        }
        $("#" + menu.active).removeClass("hidden").addClass("visible"), menu.data[menu.active].hasOwnProperty("initEvents") && menu.data[menu.active].initEvents(), "block" === menu.$el[0].style.display && menu.setMenuTabsWidth(), $(document).trigger("menuCreated")
    },
    loadTemplates: function() {
        var a = localization.getURL("menu.html");
        $.get(loading.getURL(a), function(b, c, d) {
            loading.analyzeModificationDate(a, d.getResponseHeader("Last-Modified")), menu.template = $(b).filter("#menuTemplate").html();
            for (var e in menu.data) menu.data[e].template = $(b).filter("#" + e + "Template").html();
            menu.initTabs(), menu.initIscroll()
        })
    },
    open: function() {
        if (menu.active = "welcome", menu.$el.find(".active").removeClass("active"), menu.$el.find('[data-tabName="' + menu.active + '"]').addClass("active"), menu.$container.find(".visible").removeClass("visible").addClass("hidden"), menu.$container.find("#" + menu.active).removeClass("hidden").addClass("visible"), menu.data[menu.active].hasOwnProperty("refresh")) {
            var a = menu.data[menu.active].hasOwnProperty("generateData") ? menu.data[menu.active].generateData() : {};
            $(menu.$container.find("#" + menu.active).find("div")[0]).empty().append(templateEngine(menu.data[menu.active].template, a)), menu.data[menu.active].hasOwnProperty("initEvents") && menu.data[menu.active].initEvents()
        }
        menu.$el[0].style.display = "block", menu.setMenuTabsWidth(), menu.refreshIScroll()
    },
    close: function() {
        menu.$el.is(":visible") && (menu.$el[0].style.display = "none", menu.canClickMenuTab = !0)
    },
    initIscroll: function() {
        var a = function() {
            iscrollMenuTabs = new IScroll("#outerMenuTabs", {
                mouseWheel: !0,
                scrollX: !0,
                scrollY: !1,
                preventDefaultException: {
                    tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A|LABEL|LI)$/
                },
                eventPassthrough: !1,
                click: !0
            }), iscrollMenu = new IScroll("#menuContent", {
                mouseWheel: !0,
                preventDefaultException: {
                    tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A|LABEL)$/
                }
            }), iscrollMenuTabs.on("scrollStart", function() {
                menu.canClickMenuTab = !1
            }), iscrollMenuTabs.on("scrollEnd", function() {
                menu.canClickMenuTab = !0
            })
        };
        "undefined" != typeof iscrollMenu && "undefined" != typeof iscrollMenuTabs && menu.refreshIScroll(), "undefined" != typeof IScroll ? a() : $(document).one("IScrollLoaded", a)
    },
    refreshIScroll: function() {
        if ("block" === menu.$el[0].style.display) {
            $("#menuContent").css({
                height: $("#panel .content").height() - $("#menuTabs").outerHeight(!0)
            }), "undefined" != typeof iscrollMenu && iscrollMenu && (iscrollMenu.refresh(), iscrollMenu.scrollTo(0, 0, 0));
            var a = 15;
            $("#outerMenuTabs").width($("#panel .content").innerWidth() - $("#closePanel").innerWidth() - a), "undefined" != typeof iscrollMenuTabs && iscrollMenuTabs && iscrollMenuTabs.refresh()
        }
    },
    setMenuTabsWidth: function() {
        for (var a = document.querySelectorAll("#menuTabs li"), b = 15, c = 0; c < a.length; c++) b += a[c].offsetWidth;
        $("#menuTabs").width(b)
    }
};
window.onresize = menu.refreshIScroll, window.addEventListener("orientationChange", menu.refreshIScroll, !1), menu.init();
var notificationsHelpers = {
        checkProgressAndElements: function(a, b) {
            if (game.progress.length < b) return !1;
            for (var c = 0; c < a.length; c++)
                if (-1 === game.progress.indexOf(a[c])) return !1;
            return !0
        },
        checkFailsInRow: function(a) {
            return "childCreationFail" === stats.data.lastEvent && stats.data.failInRow[stats.data.failInRow.length - 1] >= a ? !0 : !1
        }
    },
    notificationsData = {
        elements: {
            isGroup: !0,
            once: !0,
            priority: 9,
            template: "element",
            duration: 15,
            selfBlocking: !0,
            blocker: null,
            isBlocked: function() {
                return null === this.blocker ? !1 : -1 !== game.progress.indexOf(this.list[this.blocker].id) ? (delete this.list[this.blocker], this.blocker = null, !1) : !0
            },
            check: function(a) {
                return game.hasOwnProperty("progress") && -1 === game.progress.indexOf(a.id) && notificationsHelpers.checkFailsInRow(a.failsInRow) && notificationsHelpers.checkProgressAndElements(a.blockers, a.minProgress)
            },
            passData: function(a) {
                return {
                    name: bases.names[a.id],
                    image: bases.images[a.id]
                }
            },
            delay: function(a) {
                var b = 5,
                    c = (new Date).getTime();
                return c > a.timestamp + 1e3 * b && stats.data.lastMixAttempt <= a.timestamp ? !0 : stats.data.lastMixAttempt > a.timestamp ? c : !1
            },
            list: {
                plant: {
                    id: 24,
                    blockers: [13],
                    minProgress: 5,
                    failsInRow: 10
                },
                stone: {
                    id: 27,
                    blockers: [6],
                    minProgress: 6,
                    failsInRow: 15
                },
                swamp: {
                    id: 43,
                    blockers: [24],
                    minProgress: 20,
                    failsInRow: 25
                },
                life: {
                    id: 44,
                    blockers: [43, 11],
                    minProgress: 28,
                    failsInRow: 20
                },
                sand: {
                    id: 28,
                    blockers: [27],
                    minProgress: 30,
                    failsInRow: 20
                },
                metal: {
                    id: 36,
                    blockers: [27],
                    minProgress: 26,
                    failsInRow: 20
                },
                human: {
                    id: 48,
                    blockers: [44],
                    minProgress: 32,
                    failsInRow: 20
                },
                time: {
                    id: 41,
                    blockers: [28],
                    minProgress: 40,
                    failsInRow: 20
                },
                wood: {
                    id: 56,
                    blockers: [42],
                    minProgress: 45,
                    failsInRow: 20
                },
                tool: {
                    id: 53,
                    blockers: [36, 48],
                    minProgress: 36,
                    failsInRow: 20
                },
                farmer: {
                    id: 71,
                    blockers: [48],
                    minProgress: 43,
                    failsInRow: 20
                },
                tree: {
                    id: 42,
                    blockers: [24, 41],
                    minProgress: 42,
                    failsInRow: 20
                },
                livestock: {
                    id: 73,
                    blockers: [48],
                    minProgress: 57,
                    failsInRow: 20
                },
                wheel: {
                    id: 82,
                    blockers: [42, 53],
                    minProgress: 60,
                    failsInRow: 20
                },
                wild_animal: {
                    id: 140,
                    blockers: [44, 42],
                    minProgress: 62,
                    failsInRow: 20
                },
                fruit: {
                    id: 88,
                    blockers: [42, 71],
                    minProgress: 70,
                    failsInRow: 20
                },
                blade: {
                    id: 55,
                    blockers: [27, 36],
                    minProgress: 30,
                    failsInRow: 20
                },
                house: {
                    id: 72,
                    blockers: [53, 172],
                    minProgress: 40,
                    failsInRow: 20
                },
                sun: {
                    id: 108,
                    blockers: [22],
                    minProgress: 20,
                    failsInRow: 20
                },
                sky: {
                    id: 22,
                    blockers: [15],
                    minProgress: 15,
                    failsInRow: 20
                },
                wheat: {
                    id: 84,
                    blockers: [71],
                    minProgress: 80,
                    failsInRow: 20
                },
                rainbow: {
                    id: 110,
                    blockers: [13, 108],
                    minProgress: 60,
                    failsInRow: 20
                },
                electricity: {
                    id: 114,
                    blockers: [11, 36],
                    minProgress: 30,
                    failsInRow: 20
                },
                pig: {
                    id: 165,
                    blockers: [12, 73],
                    minProgress: 75,
                    failsInRow: 20
                },
                glass: {
                    id: 32,
                    blockers: [28],
                    minProgress: 20,
                    failsInRow: 20
                },
                glasses: {
                    id: 185,
                    blockers: [32],
                    minProgress: 30,
                    failsInRow: 20
                },
                mountain: {
                    id: 201,
                    blockers: [19],
                    minProgress: 30,
                    failsInRow: 20
                },
                paper: {
                    id: 208,
                    blockers: [7, 56],
                    minProgress: 70,
                    failsInRow: 20
                },
                letter: {
                    id: 260,
                    blockers: [208, 233],
                    minProgress: 80,
                    failsInRow: 20
                },
                lightbulb: {
                    id: 115,
                    blockers: [32, 114],
                    minProgress: 85,
                    failsInRow: 20
                },
                thread: {
                    id: 432,
                    blockers: [82, 361],
                    minProgress: 100,
                    failsInRow: 20
                },
                moon: {
                    id: 79,
                    blockers: [22, 27],
                    minProgress: 70,
                    failsInRow: 20
                },
                energy: {
                    id: 11,
                    blockers: [],
                    minProgress: 70,
                    failsInRow: 20
                }
            }
        },
        manyFails: {
            priority: 7,
            check: function() {
                return "childCreationFail" === stats.data.lastEvent && stats.data.failCount - 139 === 0 && stats.data.failCount > 0 && game.progress.length > 80 ? !0 : !1
            },
            onShow: function() {
                var a = notifications.$box.width() - 30,
                    b = notifications.$box.height(),
                    c = $($(".notificationLink")[0]),
                    d = c.position(),
                    e = {
                        top: d.top + "px ",
                        left: d.left + "px",
                        right: a - d.left - c.width() + "px ",
                        bottom: b - d.top - c.height() + "px "
                    };
                c.css("padding", e.top + e.right + e.bottom + e.left), c.css("margin", "-" + e.top + "-" + e.right + "-" + e.bottom + "-" + e.left)
            },
            blocker: []
        },
        manyFails2: {
            priority: 7,
            check: function() {
                return "childCreationFail" === stats.data.lastEvent && stats.data.failCount - 200 === 0 && stats.data.failCount > 0 && game.progress.length > 50 ? !0 : !1
            },
            onShow: function() {
                var a = notifications.$box.width() - 35,
                    b = notifications.$box.height(),
                    c = $($(".notificationLink")[0]),
                    d = c.position(),
                    e = {
                        top: d.top + "px ",
                        left: d.left + "px",
                        right: a - d.left - c.width() + "px ",
                        bottom: b - d.top - c.height() + "px "
                    };
                c.css("padding", e.top + e.right + e.bottom + e.left), c.css("margin", "-" + e.top + "-" + e.right + "-" + e.bottom + "-" + e.left)
            },
            blocker: []
        }
    },
    achievementsData = [{
        id: "50elements",
        gapiId: "CgkIz_OApZAJEAIQAg",
        events: "newChildCreated",
        imageNotEarned: "achievement50-locked.png",
        imageEarned: "achievement50.png",
        check: function() {
            return game.progress.length + game.prime.length === 50 ? !0 : !1
        },
        initCheck: function() {
            return game.progress.length + game.prime.length >= 50 ? !0 : !1
        }
    }, {
        id: "100elements",
        gapiId: "CgkIz_OApZAJEAIQAw",
        events: "newChildCreated",
        imageNotEarned: "achievement100-locked.png",
        imageEarned: "achievement100.png",
        check: function() {
            return game.progress.length + game.prime.length === 100 ? !0 : !1
        },
        initCheck: function() {
            return game.progress.length + game.prime.length >= 100 ? !0 : !1
        }
    }, {
        id: "200elements",
        gapiId: "CgkIz_OApZAJEAIQBA",
        events: "newChildCreated",
        imageNotEarned: "achievement200-locked.png",
        imageEarned: "achievement200.png",
        check: function() {
            return game.progress.length + game.prime.length === 200 ? !0 : !1
        },
        initCheck: function() {
            return game.progress.length + game.prime.length >= 200 ? !0 : !1
        }
    }, {
        id: "300elements",
        gapiId: "CgkIz_OApZAJEAIQBw",
        events: "newChildCreated",
        imageNotEarned: "achievement300-locked.png",
        imageEarned: "achievement300.png",
        check: function() {
            return game.progress.length + game.prime.length === 300 ? !0 : !1
        },
        initCheck: function() {
            return game.progress.length + game.prime.length >= 300 ? !0 : !1
        }
    }, {
        id: "400elements",
        gapiId: "CgkIz_OApZAJEAIQCA",
        events: "newChildCreated",
        imageNotEarned: "achievement400-locked.png",
        imageEarned: "achievement400.png",
        check: function() {
            return game.progress.length + game.prime.length === 400 ? !0 : !1
        },
        initCheck: function() {
            return game.progress.length + game.prime.length >= 400 ? !0 : !1
        }
    }, {
        id: "completionist",
        gapiId: "CgkIz_OApZAJEAIQCQ",
        events: "newChildCreated",
        imageNotEarned: "achievement-all-locked.png",
        imageEarned: "achievement-all.png",
        check: function() {
            return game.progress.length + game.prime.length === game.maxProgress ? !0 : !1
        }
    }, {
        id: "hiddenelement",
        gapiId: "CgkIz_OApZAJEAIQCg",
        events: "hiddenElementCreated",
        imageNotEarned: "achievement-hidden-locked.png",
        imageEarned: "achievement-hidden.png",
        check: function() {
            return !0
        },
        initCheck: function() {
            return game.hiddenElements.length >= 1 ? !0 : !1
        }
    }],
    feedback = {
        formUrl: "../feedback/feedbackForm.html",
        initEvents: function() {
            $("#feedbackBtn").on("click", function() {
                feedback.prepareFeedback()
            })
        },
        prepareFeedback: function() {
            var a = "";
            Clay && html2canvas && ($("#panel").hide(), html2canvas(document.body, {
                onrendered: function(b) {
                    var c = new Clay.Screenshot({
                        prompt: !1
                    });
                    c.data = b.toDataURL(), c.save({
                        hideUI: !0
                    }, function(b) {
                        a = b.imageSrc, window.localStorage.setItem("bugSS", a)
                    })
                }
            }))
        }
    };
feedback.initEvents();
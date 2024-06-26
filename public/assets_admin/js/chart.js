"use strict";

$(function() {
    charts.init(), listjs.init(), navbar.init(), tooltip.init(), swiper.init(), highlight.init(), 
    autosizer.init(), $.fancybox.defaults.loop = !0;
});

var listjs = {
    init: function() {
        var t = $(".list-checkbox-all"), e = $(".list-checkbox"), a = $(".list-alert"), r = $(".list-alert-count"), n = $(".list-alert-close");
        function o(t) {
            r.text(e.filter(":checked").length), t ? a.addClass("show").css("z-index", "1035") : a.removeClass("show").css("z-index", "-1");
        }
        t.click(function() {
            this.checked ? (e.prop("checked", !0), o(!0)) : (e.prop("checked", !1), o(!1));
        }), e.click(function() {
            e.is(":checked") ? o(!0) : o(!1);
        }), n.click(function() {
            t.prop("checked", !1), e.prop("checked", !1), o(!1);
        });
    }
}, navbar = {
    init: function() {
        window.utils.isMobile() || this.initDropdownHover(), this.toggleSidebar();
    },
    initDropdownHover: function() {
        $(".navbar .dropdown").each(function(t, e) {
            var a = $(this);
            a.hover(function() {
                a.find("> [data-bs-toggle='dropdown']").attr("aria-expanded", !0), a.find("> .dropdown-menu").addClass("show").attr("data-bs-popper", "none");
            }, function() {
                a.find("> [data-bs-toggle='dropdown']").attr("aria-expanded", !1), a.find("> .dropdown-menu").removeClass("show").removeAttr("data-bs-popper");
            });
        });
    },
    toggleSidebar: function() {
        var t = $('[data-toggle="sidebar"]'), e = $(".navbar-vertical:not(.navbar-vertical-sm)"), a = $(".navbar-vertical.navbar-vertical-sm");
        t.click(function(t) {
            t.preventDefault(), "lg" == $(this).data("sidebar") ? (e.hide(), a.show()) : (e.show(), 
            a.hide());
        });
    }
}, swiper = {
    init: function() {
        $("[data-toggle='swiper']").each(function(t, e) {
            new Swiper(e, $(e).data("options"));
        });
    }
}, tooltip = {
    init: function() {
        $('[data-bs-toggle="tooltip"]').tooltip();
    }
}, highlight = {
    init: function() {
        $("code.hl").each(function(t, e) {
            hljs.highlightBlock(e);
        });
    }
}, autosizer = {
    init: function() {
        autosize($("[data-toggle='autosize']"));
    }
}, charts = {
    init: function() {
        this.defaults(), this.charts(), this.legends();
    },
    defaults: function() {
        Chart.defaults.responsive = !0, Chart.defaults.maintainAspectRatio = !1, Chart.defaults.color = "#95aac9", 
        Chart.defaults.font.family = "SpartanMB", Chart.defaults.font.size = 13, Chart.defaults.layout.padding = 0, 
        Chart.defaults.plugins.legend.display = !1, Chart.defaults.elements.point.radius = 0, 
        Chart.defaults.elements.point.backgroundColor = "#3d569c", Chart.defaults.elements.line.tension = .4, 
        Chart.defaults.elements.line.borderWidth = 3.5, Chart.defaults.elements.line.borderColor = "#3d569c", 
        Chart.defaults.elements.line.backgroundColor = "transparent", Chart.defaults.elements.line.borderCapStyle = "rounded", 
        Chart.defaults.elements.bar.backgroundColor = "#3d569c", Chart.defaults.elements.bar.borderWidth = 0, 
        Chart.defaults.elements.bar.borderRadius = 5, Chart.defaults.elements.bar.borderSkipped = !1, 
        Chart.defaults.datasets.bar.maxBarThickness = 8, Chart.defaults.elements.arc.backgroundColor = "#3d569c", 
        Chart.defaults.elements.arc.borderColor = "#fff", Chart.defaults.elements.arc.borderWidth = 4, 
        Chart.defaults.elements.arc.hoverBorderColor = "#fff", Chart.defaults.plugins.tooltip.enabled = !1, 
        Chart.defaults.plugins.tooltip.mode = "index", Chart.defaults.plugins.tooltip.intersect = !1, 
        Chart.defaults.plugins.tooltip.external = this.tooltip, Chart.defaults.plugins.tooltip.callbacks.label = this.label, 
        Chart.defaults.datasets.doughnut.cutout = "75%", Chart.defaults.scales.linear.grid = {
            borderDash: [ 10 ],
            color: "#e3ebf6",
            drawBorder: !1,
            drawTicks: !1
        }, Chart.defaults.scales.linear.ticks.beginAtZero = !0, Chart.defaults.scales.linear.ticks.padding = 10, 
        Chart.defaults.scales.linear.ticks.stepSize = 10, Chart.defaults.scales.category.grid = {
            drawBorder: !1,
            drawOnChartArea: !1,
            drawTicks: !1
        }, Chart.defaults.scales.category.ticks.padding = 20, Chart.overrides.doughnut.plugins.tooltip.callbacks.title = function(t) {
            return t[0].label;
        }, Chart.overrides.doughnut.plugins.tooltip.callbacks.label = function(t) {
            var e = t.chart.options.plugins.tooltip.callbacks, a = e.beforeLabel() || "", r = e.afterLabel() || "";
            return a + t.formattedValue + r;
        };
    },
    legends: function() {
        var t = document.querySelectorAll('[data-toggle="legend"]');
        t.forEach(function(t) {
            var e, a = Chart.getChart(t), r = document.createElement("div");
            null === (e = a.legend.legendItems) || void 0 === e || e.forEach(function(t) {
                r.innerHTML += '<span class="chart-legend-item"><span class="chart-legend-color" style="background-color: '.concat(t.fillStyle, '"></span>').concat(t.text, "</span>");
            }), document.querySelector(t.dataset.target).appendChild(r);
        });
    },
    charts: function() {
        var t = document.getElementById("earningsChart"), e = document.getElementById("expensesChart"), a = document.getElementById("sourceChart"), r = document.getElementById("ecommerceChart");
        t && new Chart(t, {
            type: "line",
            options: {
                scales: {
                    y: {
                        ticks: {
                            callback: function(t) {
                                return "$" + t + "k";
                            }
                        }
                    }
                }
            },
            data: {
                labels: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
                datasets: [ {
                    label: "Earned",
                    data: [ 3, 12, 7, 13.5, 8, 24, 13, 38, 27, 20, 35, 40 ]
                } ]
            }
        }), e && new Chart(e, {
            type: "bar",
            options: {
                scales: {
                    y: {
                        ticks: {
                            callback: function(t) {
                                return "$" + t + "k";
                            }
                        }
                    }
                }
            },
            data: {
                labels: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
                datasets: [ {
                    label: "This year",
                    data: [ 25, 20, 33, 22, 17, 10, 18, 26, 28, 26, 20, 32 ]
                }, {
                    label: "Last year",
                    data: [ 22, 23, 27, 28, 14, 13, 12, 18, 18, 22, 25, 38 ],
                    backgroundColor: [ "#e8eef5" ]
                } ]
            }
        }), a && new Chart(a, {
            type: "doughnut",
            options: {
                plugins: {
                    tooltip: {
                        callbacks: {
                            afterLabel: function() {
                                return "%";
                            }
                        }
                    }
                }
            },
            data: {
                labels: [ "Facebook", "Dribbble", "Google" ],
                datasets: [ {
                    data: [ 53, 13, 34 ],
                    backgroundColor: [ "#98BFF4", "#f6f9fc", "#E5E5FF" ]
                } ]
            }
        }), r && new Chart(r, {
            type: "bar",
            options: {
                scales: {
                    y: {
                        ticks: {
                            callback: function(t) {
                                return "$" + t + "k";
                            }
                        }
                    }
                }
            },
            data: {
                labels: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
                datasets: [ {
                    label: "This year",
                    data: [ 25, 20, 33, 22, 17, 10, 18, 26, 28, 26, 20, 32 ],
                    backgroundColor: [ "#3d569c" ]
                }, {
                    label: "Last year",
                    data: [ 22, 23, 27, 28, 14, 13, 12, 18, 18, 22, 25, 38 ],
                    backgroundColor: [ "#e8eef5" ]
                } ]
            }
        });
    },
    label: function(t) {
        var e = t.chart.scales[t.dataset.yAxisID || "y"];
        return (t.chart.tooltip.dataPoints.length > 1 ? " " + t.dataset.label + " " : " ") + e.options.ticks.callback.apply(e, [ t.parsed.y, 0, [] ]);
    },
    tooltip: function(t) {
        var e = t.chart, a = t.tooltip, r = function(t) {
            var e = t.canvas.parentNode.querySelector("div");
            if (!e) {
                (e = document.createElement("div")).setAttribute("id", "custom-tooltip"), e.setAttribute("role", "tooltip"), 
                e.classList.add("popover", "bs-popover-top");
                var a = document.createElement("div"), r = document.createElement("div");
                a.classList.add("popover-arrow", "translate-middle-x"), r.classList.add("popover-container"), 
                e.appendChild(a), e.appendChild(r), t.canvas.parentNode.appendChild(e);
            }
            return e;
        }(e);
        if (0 === a.opacity) return r.style.visibility = "hidden";
        if (a.body) {
            var n = a.title || [], o = a.body.map(function(t) {
                return t.lines;
            }), l = document.createElement("div"), i = document.createElement("div");
            n.forEach(function(t) {
                var e = document.createElement("h3");
                e.classList.add("popover-header", "text-center", "text-nowrap");
                var a = document.createTextNode(t);
                e.appendChild(a), l.appendChild(e);
            }), o.forEach(function(t, r) {
                var n = a.labelColors[r], o = document.createElement("span"), l = document.createElement("div");
                o.classList.add("popover-body-color"), o.style.backgroundColor = "line" === e.config.type && "rgba(0,0,0,0.1)" !== n.borderColor ? n.borderColor : n.backgroundColor, 
                l.classList.add("popover-body", "d-flex", "align-items-center", "text-nowrap"), 
                l.classList.add(l.length > 1 ? "justify-content-left" : "justify-content-center");
                var s = document.createTextNode(t);
                l.appendChild(o), l.appendChild(s), i.appendChild(l);
            });
            for (var s = r.querySelector(".popover-container"); s.firstChild; ) s.firstChild.remove();
            s.appendChild(l), s.appendChild(i);
        }
        var d = e.canvas, c = d.offsetLeft, u = d.offsetTop;
        r.style.visibility = "visible", r.style.left = c + a.caretX + "px", r.style.top = u + a.caretY + "px", 
        r.style.transform = "translateX(-50%) translateY(-100%) translateY(-1rem)";
    }
};

window.utils = {
    isMobile: function() {
        return window.innerWidth <= 992;
    }
};
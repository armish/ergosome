(function($, d3, colorbrewer, _, Blob, saveAs) {
    $(document).ready(function() {
        var width = 800,
            height = width,
            radius = width / 2,
            x = d3.scale.linear().range([0, 2 * Math.PI]),
            y = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, radius]),
            padding = 5,
            defaultMin = 8,
            maxFontSize = 11,
            maxMutTypeSize = 7.5,
            duration = 1000;

        $("#download-wheel").click(function(e) {
            e.preventDefault();

            var svgElement = $("#vis").html();
            var blob = new Blob([svgElement], { type: "image/svg+xml"});
            saveAs(blob, "mu-wheel.svg");
        });

         var hashCode = function(text) {
            var hash = 0;
            if (text.length == 0) return hash;
            for (var i = 0, l = text.length; i < l; i++) {
                hash = ((hash<<5)-hash) + text.charCodeAt(i);
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };

        var colFunc = d3.scale.linear()
            .domain([5, 10, 20, 30, 40, 50, 100, 500, 1000])
            .range(colorbrewer.Reds[9]);

        var colour = function(d) {
            return colFunc(getSum(d));
        };

        var partition = d3.layout.partition()
            .sort(null)
            .value(function(d) { return 5.8 - d.depth; });

        var arc = d3.svg.arc()
            .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
            .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
            .innerRadius(function(d) { return Math.max(0, d.y ? y(d.y) : d.y); })
            .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

        var initializeStats = _.once(function(mutTypes, min, max) {
            if($("#range-max").text() == "") {
                $("#range-min").text(defaultMin);
                $("#range-max").text(max);
            }

            _.chain(mutTypes)
                .groupBy(function(aType) { return aType; })
                .each(function(list, aType) {
                    if(aType.length < 1) return;

                    $("#" + aType + " .count").html(
                        _.template($("#muttype-tmpl").html(), list)
                    );
                    $("#" + aType + " input").change(function() {
                        drawWheel();
                    });
                })
            ;
        });

        var reduceMutations = function(mutations) {
            var max = Number.MIN_VALUE;
            var min = Number.MAX_VALUE;
            var filterMin = $("#mutrange").slider("values", 0);
            var filterMax = $("#mutrange").slider("values", 1);
            var mutTypes = [];

            var nodes = [{ children: [], name: "" }, null, null, null, null, null];

            for(var i=0; i < mutations.length; i++) {
                var mut = mutations[i];
                var mutType = mut.muttype.toLowerCase();
                if(mutType.length == 0) { continue } // ship these immediately
                mutTypes.push(mutType);
                var isMutTypeHidden = !$("#" + mutType + " input").is(":checked");

                max = Math.max(mut.count, max);
                min = Math.min(mut.count, min);

                if(mut.count < filterMin || mut.count > filterMax || isMutTypeHidden) { continue; }

                var keywords = _.keys(mut);
                for(var j=1; j < nodes.length; j++) {
                    var node = nodes[j];
                    if(node == null || node.name != mut[keywords[j]]) {
                        for(var k=j; k < nodes.length; k++) {
                            nodes[k] = null;
                        }

                        nodes[j] = {
                            children: [],
                            name: mut[keywords[j]]
                        };

                        nodes[j-1].children.push(nodes[j]);
                    }

                }
            }

            initializeStats(mutTypes, defaultMin, max);

            return {
                children: nodes[0].children,
                max: max,
                min: min
            };
        };

        function isParentOf(p, c) {
            if (p === c) return true;
            if (p.children) {
                return p.children.some(function(d) {
                    return isParentOf(d, c);
                });
            }
            return false;
        }

        function getSum(d)  {
            if(!d.children) {
                return (d.name * 1);
            } else {
                var sums = d.children.map(getSum);
                return _.chain(sums).reduce(function(seed, sum) { return seed + sum; }, 0).value();
            }
        }

        // Interpolate the scales!
        function arcTween(d) {
            var my = maxY(d),
                xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                yd = d3.interpolate(y.domain(), [d.y, my]),
                yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
            return function(d) {
                return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
            };
        }

        function maxY(d) {
            return d.children ? Math.max.apply(Math, d.children.map(maxY)) : d.y + d.dy;
        }

        // http://www.w3.org/WAI/ER/WD-AERT/#color-contrast
        function brightness(rgb) {
            return rgb.r * .299 + rgb.g * .587 + rgb.b * .114;
        }

        $("#mutrange").slider({
            range: true,
            min: 2,
            max: Number.MAX_VALUE,
            values: [ defaultMin, Number.MAX_VALUE ],
            slide: function(event, ui) {
                $("#range-min").text(ui.values[0]);
                $("#range-max").text(ui.values[1]);
            },
            change: function(event, ui) {
                drawWheel();
            }
        });

        var enzymes = {};
        var drawWheel = function() {
            $("#vis").empty();
            var div = d3.select("#vis");

            var vis = div.append("svg")
                .attr("width", width + padding * 2)
                .attr("height", height + padding * 2)
                .append("g")
                .attr("transform", "translate(" + [radius + padding, radius + padding] + ")");

            d3.tsv("data/mutations.tsv", function(error, mutations) {
                var reducedMutations = reduceMutations(mutations);
                $("#mutrange").slider("option", "min", reducedMutations.min);
                $("#range-min-min").text(reducedMutations.min);
                $("#mutrange").slider("option", "max", reducedMutations.max);
                $("#range-max-max").text(reducedMutations.max);

                var nodes = partition.nodes(reducedMutations);

                  var path = vis.selectAll("path").data(nodes);
                  path.enter().append("path")
                      .attr("id", function(d, i) { return "path-" + i; })
                      .attr("d", arc)
                      .attr("fill-rule", "evenodd")
                      .style("fill", colour)
                      .style("stroke", "#aaaaaa")
                      .style("stroke-width", 1)
                      .style("cursor", "pointer")
                      .on("click", click);

                  var text = vis.selectAll("text").data(nodes);
                  var textEnter = text.enter().append("text")
                      .style("fill-opacity", 1)
                      .style("font-family", "sans-serif")
                      .style("cursor", "pointer")
                      .style("fill", function(d) {
                        return brightness(d3.rgb(colour(d))) < 125 ? "#eee" : "#000";
                      })
                      .attr("text-anchor", function(d) {
                        return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
                      })
                      .attr("dy", ".2em")
                      .attr("transform", function(d) {
                        var multiline = (d.name || "").split(" ").length > 1,
                            angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
                            rotate = angle + (multiline ? -.5 : 0);
                        return "rotate(" + rotate + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
                      })
                      .attr("font-size", function(d) {
                              var r = Math.max(0, d.y ? y(d.y) : d.y);
                              var p = Math.abs(
                                  Math.max(0, Math.min(2 * Math.PI, x(d.x)))
                                      - Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)))
                              );
                              var arcWidth = Math.min(r * p * .75, d.depth == 4 ? maxMutTypeSize : maxFontSize);
                              return arcWidth + "px"
                      })
                      .attr("class", function(d) {
                              return d.depth == 4 ? "muttype" : "";
                      })
                      .on("click", click)
                      .each(function(d, i) {
                              if(d.depth == 0) { return; }

                              var titles = [d.name];
                              var tp = d.parent;
                              while(tp) {
                                  titles.push(tp.name);
                                  tp = tp.parent;
                              }
                              titles.pop();
                              titles = titles.reverse();

                              var titleStr = titles.join(" > ");
                              var numOfMuts = getSum(d);
                              var enzyme = enzymes[hashCode(titles[0])];

                              var gene = "";

                              var container = $(_.template($("#wtooltip-base-tmpl").html(),
                                  {
                                      enzyme: enzyme,
                                      gene: gene,
                                      numOfMutations: numOfMuts
                                  }
                              ));

                              switch(d.depth) {
                                  case 1:
                                      var mutatedGenes = _.chain(d.children)
                                          .reduce(function(genes, gene) {
                                              genes.push(gene.name);
                                              return genes;
                                          }, []).value().join(" ");
                                      container
                                          .find("tbody")
                                          .append(
                                          _.template($("#wtooltip-mg-tmpl").html(), {
                                              mutatedGenes: mutatedGenes,
                                              enzyme: enzyme
                                          })
                                      )
                                      ;
                                      break;
                                  case 2:
                                      container
                                          .find("tbody")
                                          .append(
                                          _.template($("#wtooltip-goi-tmpl").html(), {
                                              gene: d.name
                                          })
                                      )
                                      ;
                                      break;
                                  case 3:
                                      container
                                          .find("tbody")
                                          .append(
                                          _.template($("#wtooltip-goi-tmpl").html(), {
                                              gene: d.parent.name
                                          })
                                      )
                                      ;
                                      break;
                                  case 4:
                                      container
                                          .find("tbody")
                                          .append(
                                          _.template($("#wtooltip-goi-tmpl").html(), {
                                              gene: d.parent.parent.name
                                          })
                                      )
                                      ;
                                      break;
                                  case 5:
                                      container
                                          .find("tbody")
                                          .append(
                                          _.template($("#wtooltip-goi-tmpl").html(), {
                                              gene: d.parent.parent.parent.name
                                          })
                                      )
                                      ;
                                      break;
                              }


                              $(this).qtip({
                                content: {
                                    text: container.html(),
                                    title: titleStr
                                },
                                style: {
                                    classes: "qtip-light qtip-rounded qtip-shadow wider-tooltip"
                                },
                                hide: {
                                    fixed: true,
                                    delay: 100,
                                    event: 'mouseout'
                                },
                                show: {
                                    event: 'mouseover'
                                }
                            });
                      })
                  ;

                  textEnter.append("tspan")
                      .attr("x", 0)
                      .text(function(d) { return d.depth ? d.name.split(" ")[0] : ""; });
                  textEnter.append("tspan")
                      .attr("x", 0)
                      .attr("dy", "1em")
                      .text(function(d) { return d.depth ? d.name.split(" ")[1] || "" : ""; });

                  function click(d) {
                    path.transition()
                      .duration(duration)
                      .attrTween("d", arcTween(d));

                    // Somewhat of a hack as we rely on arcTween updating the scales.
                    text.style("visibility", function(e) {
                          return isParentOf(d, e) ? null : d3.select(this).style("visibility");
                        })
                        .transition()
                        .duration(duration)
                        .attrTween("text-anchor", function(d) {
                          return function() {
                            return x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
                          };
                        })
                        .attrTween("transform", function(d) {
                          var multiline = (d.name || "").split(" ").length > 1;
                          return function() {
                            var angle = x(d.x + d.dx / 2) * 180 / Math.PI - 90,
                                rotate = angle + (multiline ? -.5 : 0);
                            return "rotate(" + rotate + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
                          };
                        })
                        .style("fill-opacity", function(e) { return isParentOf(d, e) ? 1 : 1e-6; })
                        .each("end", function(e) {
                          d3.select(this).style("visibility", isParentOf(d, e) ? null : "hidden");
                            var r = Math.max(0, e.y ? y(e.y) : e.y);
                            var r2 = Math.max(0, y(d.y + d.dy));
                            var p = Math.abs(
                                Math.max(0, Math.min(2 * Math.PI, x(e.x)))
                                    - Math.max(0, Math.min(2 * Math.PI, x(e.x + e.dx)))
                            );
                            var isMutType = d3.select(this).attr("class") == "muttype";
                            var arcWidth = Math.min(r * p * .75, isMutType ? maxMutTypeSize : maxFontSize);
                            d3.select(this).style("font-size", arcWidth + "px");
                        });
                  }
            });

        };

        d3.tsv("data/enzymes.tsv", function(enzymeData) {
            for(var i=0; i < enzymeData.length; i++) {
                var enzyme = enzymeData[i];
                enzymes[hashCode(enzyme.ecnumber.split(":")[1])] = enzyme;
            }

            drawWheel();
        });
    });
})(jQuery, d3, colorbrewer, _, Blob, saveAs);

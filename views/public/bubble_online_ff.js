(async function main() {
  let en2ch = await getExplanation();
  let lang = "en";

  var margin = { top: 10, bottom: 80, left: 120, right: 30 };
  // var svgWidth = document.getElementById('chartAside').clientWidth;
  // var svgHeight = svgWidth*0.6>700? 700: svgWidth*0.6;
  var svgWidth = 1200;//850;
  var svgHeight = 650;//690;

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  var svg = d3
    .select("#chartAside")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // scale
  var y = d3
    .scaleLinear()
    .domain([
      0,
      500,
      1000,
      2000,
      4000,
      6000,
      8000,
      10000,
      20000,
      40000,
      60000,
      80000,
      200000,
      400000
    ])

    .range([
      height / 14 * 14,
      height / 14 * 13,
      height / 14 * 12,
      height / 14 * 11,
      height / 14 * 10,
      height / 14 * 9,
      height / 14 * 8,
      height / 14 * 7,
      height / 14 * 6,
      height / 14 * 5,
      height / 14 * 4,
      height / 14 * 3,
      height / 14 * 2,
      height / 14 * 1,
      /*
            console.log([
              height / 14 * 14,
              height / 14 * 13,
              height / 14 * 12,
              height / 14 * 11,
              height / 14 * 10,
              height / 14 * 9,
              height / 14 * 8,
              height / 14 * 7,
              height / 14 * 6,
              height / 14 * 5,
              height / 14 * 4,
              height / 14 * 3,
              height / 14 * 2,
              height / 14 * 1,
            ])*/
    ]);

  var x = d3
    .scaleLinear()
    .domain([
      0,
      50,
      100,
      200,
      300,
      400,
      800,
      1800,
      2900
    ])

    .range([
      width / 9 * 0,
      width / 9 * 1,
      width / 9 * 2,
      width / 9 * 3,
      width / 9 * 4,
      width / 9 * 5,
      width / 9 * 6,
      width / 9 * 7,
      width / 9 * 8,
      /*
            console.log([
              width / 9 * 0,
              width / 9 * 1,
              width / 9 * 2,
              width / 9 * 3,
              width / 9 * 4,
              width / 9 * 5,
              width / 9 * 6,
              width / 9 * 7,
              width / 9 * 8,
            ])
          */
    ]);

  var r = d3
    .scaleLinear()
    // .domain([0, 0.365010869, (0.365010869 + 2 / 3) / 2, 2 / 3, 1])
    .domain([0, 0.05, 0.2, 0.50448195659342, 0.72, 0.9, 1])
    // .range([25, 7, 25, 7, 25]);
    .range([25, 19, 15, 15, 15, 20, 25]);

  var color = d3
    .scaleQuantile()
    // .domain([0, 0.365010869, (0.365010869 + 2 / 3) / 2, 2 / 3, 1])
    .domain([0, 0.2, 0.50448195659342, 0.72, 1])
    // .range(["#1B6AA5", "#748C9D", "#9D7A7F", "#E8110F" ]);
    .range(["#1B6AA5", "#7F7F7F", "#7F7F7F", "#E8110F"]);

  var category = d3
    .scaleQuantile()
    .domain([0, 0.2, 0.50448195659342, 0.72, 1])
    .range(["0", "1", "1", "2"]);

  // 设定bar的最长长度为多少 length of bar
  let tendBarLengthMin = 3;
  let trendBarLength = 117;
  // 设定pivots  set pivots
  let rightAsidePivotFromLeft = 136 + trendBarLength;
  let bluePivot = rightAsidePivotFromLeft - trendBarLength;
  let redPivot = rightAsidePivotFromLeft + trendBarLength;
  // 设定trendbar长度范围 Trendbar length range
  var trendScale = d3
    .scaleLinear()
    .domain([-1, 0, 1])
    //  .domain([0,1])
    .range([trendBarLength, tendBarLengthMin, trendBarLength]);

  var trendTransform = d3
    .scaleLinear()
    .domain([0, 1])
    .range([-1, 1]);

  // axises
  var xAxis = d3
    .axisBottom(x)
    .tickSize(-height + 5)
    .tickValues([
      0,
      50,
      100,
      200,
      300,
      400,
      800,
      1800,
      2900
    ]);

  var yAxis = d3
    .axisLeft(y)
    .tickSize(-width)
    .tickValues([
      0,
      500,
      1000,
      2000,
      4000,
      6000,
      8000,
      10000,
      20000,
      40000,
      60000,
      80000,
      200000,
      400000
    ]);

  let buttonSize = 40;
  let buttonPlay = true;
  let properDateCheck = true;
  console.log("buttonPlay", buttonPlay);
  let videoYOffset = 30;
  let buttonXOffset = -15;

  function createGlow() {
    let glow = svg
      .append("defs")
      .append("filter")
      .attr("id", "glow");
    glow
      .append("feGaussianBlur")
      .attr("class", "blur")
      .attr("result", "coloredBlur")
      .attr("stdDeviation", "4");
    let femerge = glow.append("feMerge");
    femerge.append("feMergeNode").attr("in", "coloredBlur");
    femerge.append("feMergeNode").attr("in", "coloredBlur");
    femerge.append("feMergeNode").attr("in", "coloredBlur");
    femerge.append("feMergeNode").attr("in", "SourceGraphic");
  }
  createGlow();

  function createMaskSvg() {
    let mask = svg
      .append("defs")
      .append("mask")
      .attr("id", "mainMask");
    mask
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("fill", "#333333");
    mask
      .append("rect")
      .attr("width", width + margin.right)
      .attr("height", height)
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("fill", "#ffffff");
  }
  createMaskSvg();
  // let button = svg
  //   .append("image")
  //   .attr("class", "video-button")
  //   .attr("width", buttonSize)
  //   .attr("height", buttonSize)
  //   .attr(
  //     "xlink:href",
  //     d => `public/data/bubble/${buttonPlay ? "play" : "pause"}.svg`
  //   )
  //   .attr(
  //     "transform",
  //     `translate(${margin.left - buttonSize + buttonXOffset},${margin.top +
  //       height +
  //       videoYOffset})`
  //   );

  let sliderHeight = 10;
  let borderRadius = 5;
  let slider = svg
    .append("rect")
    .attr("class", "video-slider")
    .attr("x", margin.left)
    .attr(
      "y",
      margin.top + height + videoYOffset + buttonSize / 2 - sliderHeight / 2
    )
    .attr("width", width)
    .attr("height", sliderHeight)
    .attr("rx", borderRadius)
    .attr("ry", borderRadius);

  let anchorRadius = 10;
  let anchor = svg
    .append("circle")
    .attr("class", "video-anchor")
    .attr("cx", margin.left)
    .attr("cy", margin.top + height + videoYOffset + buttonSize / 2)
    .attr("r", anchorRadius);

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top + height})`)
    .call(xAxis)
    .attr("class", "axis")
    .selectAll("text")
    .attr("dy", 16)
    .style("text-anchor", "middle");
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (width - 16) + " ," + (height + margin.top - 10) + ")"
    )
    .style("text-anchor", "start")
    .text(lang === "en" ? "Tweet" : "讨论量")
    .attr("class", "xLabel");
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .attr("class", "axis")
    .call(yAxis);
  svg
    .append("g")
    .attr("transform", `translate(${margin.left + 36},${margin.top + 8})`)
    .append("text")
    .attr("transform", "rotate(270)")
    .style("text-anchor", "end")
    .text(lang === "en" ? "Retweet" : "支持量")
    .attr("class", "xLabel");

  var bisect = d3.bisector(function (d) {
    return d[0];
  });

  function parseDate(str) {
    var y = str.substr(0, 4),
      m = str.substr(4, 2),
      d = str.substr(6, 2);
    m = parseInt(m) - 1; // month as a number (0-11)
    if (d) return new Date(y, m, d);
    return new Date(y, m, 1);
  }
  function getDataByMonth(data, time) {
    // Dataset format example
    /* {label: "#abtv", 
        forward: 1.6105742383512545, 
        freq: 1.2079306787634407, 
        time: Sun Jan 03 2016 11:54:48 GMT+0800 (China Standard Time), 
        trend: "0.007179008", 
        story: 0}
    */
    return data.map(d => {
      return {
        label: d.label,
        forward: findFreqByMonth(d.value, time), //find cx 
        freq: findForwardByMonth(d.value, time), //find cy
        time: time,
        trend: d.trend,
        story: findStoryLine(d.value, time)
      };
    });
  }

  function findStoryLine(data, time) {
    let index = bisect.left(data, time);
    if (index == 0) {
      return 0 //
    }
    let now = data[index - 1];
    return now[3]; //return story level 
  }

  function findFreqByMonth(data, time) {
    let index = bisect.left(data, time);
    let now = data[index];
    if (index > 0) {
      let last = data[index - 1];
      let timeScale = d3
        .scaleLinear()
        .domain([last[0], now[0]])
        .range([last[1], now[1]]);
      return timeScale(time);
    }
    return now[1];

    // let index = bisect.left(data,time);
    // let now = data[index];
    // if (index > 0) {
    //   let last = data[index-1];
    //   let timeScale = d3.scaleLinear()
    //         .domain([last[0], now[0]])
    //         .range([x(last[1]),x(now[1])]);
    //   return x.invert(timeScale(time));
    // }
    // return now[1];
  }
  function findForwardByMonth(data, time) {
    let index = bisect.left(data, time);
    let now = data[index];
    if (index > 0) {
      let last = data[index - 1];
      let timeScale = d3
        .scaleLinear()
        .domain([last[0], now[0]])
        .range([last[2], now[2]]);
      return timeScale(time);
    }
    return now[2];

    // let index = bisect.left(data,time);
    // let now = data[index];
    // if (index > 0) {
    //   let last = data[index-1];
    //   let timeScale = d3.scaleLinear()
    //         .domain([last[0], now[0]])
    //         .range([y(last[2]),y(now[2])]);
    //   return y.invert(timeScale(time));
    // }
    // return now[2];
  }

  var dataArray = [];
  var trendMap = new Map();
  d3.csv("public/data/hashtag_bubble_deleted0414.csv").then(function (data) {
    data.forEach(d => {
      let tmp = {};
      tmp.label = d.hashtag.trim();
      tmp.trend = d.trend.trim();
      trendMap.set(tmp.label.slice(1), parseFloat(tmp.trend));
      tmp.value = [];
      // start default date      
      for (let label in d) {
        if (
          label !== "hashtag" &&
          label !== "trend" &&
          label.substr(0, 2) !== "re" &&
          label.substr(0, 2) !== "lv"


        ) {
          tmp.value.push([
            parseDate(label),
            parseInt(d[label]),
            parseInt(d["re" + label]),
            parseInt(d["lv" + label]),
          ]);
        }
      }
      tmp.value.push([new Date(2019, 5), tmp.value[40][1], tmp.value[40][2], tmp.value[40][3]]); // 2019/05+1
      tmp.value.sort((a, b) => a[0] - b[0]);
      dataArray.push(tmp);
    });

    let twitterEnglish = getTwitterEnglish();
    let twitterChinese = getTwitterChinese();
    let twitterText = lang === "ch" ? twitterChinese : twitterEnglish;

    let labelSet = dataArray.map(d => d.label.slice(1));
    let labelSet0 = dataArray
      .filter(d => category(d.trend) === "0")
      .sort((a, b) => b.trend - a.trend)
      .map(d => d.label.slice(1));
    let labelSet1 = dataArray
      .filter(d => category(d.trend) === "1")
      .sort((a, b) => b.trend - a.trend)
      .map(d => d.label.slice(1));
    let labelSet2 = dataArray
      .filter(d => category(d.trend) === "2")
      .sort((a, b) => b.trend - a.trend)
      .map(d => d.label.slice(1));

    // let rightSvgWidth = document.getElementsByClassName('aside')[1].offsetWidth;
    let rightAsideSvg = d3
      .select("#rightAside")
      .append("svg")
      .attr("class", "aside")
      .style("position", "absolute")
      .style("height", svgHeight)
      // 与rightAside保持一致吧 Keep up with rightAside
      .style("width", "410")
      .style("z-index", -100);
    let pivotLines = rightAsideSvg.append("g");

    pivotLines
      .append("line")
      .attr("x1", bluePivot)
      .attr("y1", "35")
      .attr("x2", bluePivot)
      .attr("y2", svgHeight - 50)
      .style("stroke-dasharray", "5,5") //dashed array for line
      .style("stroke", "#3179AE");
    pivotLines
      .append("line")
      .attr("x1", rightAsidePivotFromLeft)
      .attr("y1", "35")
      .attr("x2", rightAsidePivotFromLeft)
      .attr("y2", svgHeight - 50)
      .style("stroke-dasharray", "5,5") //dashed array for line
      .style("stroke", "#222");
    pivotLines
      .append("line")
      .attr("x1", redPivot)
      .attr("y1", "35")
      .attr("x2", redPivot)
      .attr("y2", svgHeight - 50)
      .style("stroke-dasharray", "5,5") //dashed array for line
      .style("stroke", "#EE504E");

    // // 制作箭头
    // var defs = rightAsideSvg.append("defs");

    // var arrowMarker = defs.append("marker")
    // 	.attr("id","arrow")
    // 	.attr("markerUnits","strokeWidth")
    // 	.attr("markerWidth","12")
    //   .attr("markerHeight","12")
    //   .attr("viewBox","0 0 12 12")
    //   .attr("refX","6")
    //   .attr("refY","6")
    //   .attr("orient","auto");

    // var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";

    // arrowMarker.append("path")
    // 	.attr("d",arrow_path)
    //   .attr("fill","#DCDCDC");

    let legendGray = 35;
    let legendRed = 78;
    let legendBlue = 78;
    let legendHeight = 20;

    function drawRightLeg(svg, height) {
      let trendLegend = svg.append("g");

      // gray
      trendLegend
        .append("rect")
        .attr("x", rightAsidePivotFromLeft - legendGray)
        .attr("y", height)
        .attr("width", 2 * legendGray)
        .attr("height", legendHeight)
        .attr("fill", "#b2b2b2");

      // red
      trendLegend
        .append("rect")
        .attr("x", rightAsidePivotFromLeft + legendGray)
        .attr("y", height)
        .attr("width", legendRed)
        .attr("height", legendHeight)
        .attr("fill", "#f1706f");
      // red triangle
      trendLegend
        .append("polygon")
        .attr(
          "points",
          `${rightAsidePivotFromLeft +
          legendGray +
          legendRed},${height} ${rightAsidePivotFromLeft +
          legendGray +
          legendRed},${height + legendHeight} ${rightAsidePivotFromLeft +
          legendGray +
          legendRed +
          10},${height + 10}`
        )
        .attr("fill", "#f1706f");

      // blue
      trendLegend
        .append("rect")
        .attr("x", rightAsidePivotFromLeft - legendGray - legendBlue)
        .attr("y", height)
        .attr("width", legendBlue)
        .attr("height", legendHeight)
        .attr("fill", "#76a6ca");
      // blue triangle
      trendLegend
        .append("polygon")
        .attr(
          "points",
          `${rightAsidePivotFromLeft -
          legendGray -
          legendBlue -
          legendHeight / 2},${height +
          legendHeight / 2} ${rightAsidePivotFromLeft -
          legendGray -
          legendBlue},${height} ${rightAsidePivotFromLeft -
          legendGray -
          legendBlue},${height + legendHeight}`
        )
        .attr("fill", "#76a6ca");

      // 文字 Character
      trendLegend
        .append("text")
        .attr("x", rightAsidePivotFromLeft)
        .attr("y", height + legendHeight / 2 + 5)
        .text("Neutral")
        .attr("class", "label-legend")
        // .attr("text-anchor","middle")
        .attr("fill", "#fff");
      trendLegend
        .append("text")
        .attr("x", rightAsidePivotFromLeft - legendGray - legendBlue + 35)
        .attr("y", height + legendHeight / 2 + 5)
        .text("Stay in the EU")
        .attr("class", "label-legend")
        .attr("fill", "#fff");
      trendLegend
        .append("text")
        .attr("x", rightAsidePivotFromLeft + legendGray + legendRed - 35)
        .attr("y", height + legendHeight / 2 + 5)
        .text("Leave the EU")
        .attr("class", "label-legend")
        .attr("fill", "#fff");
    }

    drawRightLeg(rightAsideSvg, 12);
    drawRightLeg(rightAsideSvg, svgHeight - 40);
    createAsidePanel(labelSet2, "labelSet2");
    createAsidePanel(labelSet1, "labelSet1");
    createAsidePanel(labelSet0, "labelSet0");
    tippy(".forTooltip", {
      placement: "right",
      arrow: true,
      animation: "shift-toward",
      theme: "tomato"
    });

    createDownsidePanel(labelSet0.concat(labelSet1, labelSet2));

    var monthText = svg
      .append("g")
      .append("text")
      .attr("x", margin.left + 60)
      .attr("y", margin.top + 120)
      .attr("class", "monthText");
    // Add a dot per state. Initialize the data at 1950, and set the colors.
    let startDate = new Date(2016, 0);
    let limitDate = new Date(2019, 4, 30, 23, 59, 59);
    let endDate = new Date(2019, 5);
    // dataset format example
    /* {label: "#abtv", 
        forward: 1.6105742383512545, 
        freq: 1.2079306787634407, 
        time: Sun Jan 03 2016 11:54:48 GMT+0800 (China Standard Time), 
        trend: "0.007179008", 
        story: 0}
    */
    let dataset = getDataByMonth(dataArray, startDate); // call begining

    let clipPath = svg
      .append("clipPath")
      .attr("id", "chart-area")
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("height", height)
      .attr("width", width + margin.right);
    let svgChart = svg.append("g").attr("id", "chart");

    // 让video按键放在最上面 Put the video button on top
    let button = svg
      .append("image")
      .attr("class", "video-button")
      .attr("width", buttonSize)
      .attr("height", buttonSize)
      .attr(
        "xlink:href",
        d => `public/data/bubble/${buttonPlay ? "play" : "pause"}.svg`
      )
      .attr(
        "transform",
        `translate(${margin.left - buttonSize + buttonXOffset},${margin.top +
        height +
        videoYOffset})`
      );
    // .attr("clip-path", "url(#chart-area)");

    let showupText = svgChart
      .append("g")
      .selectAll(".showupText")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "showupText")
      .attr("data-label", d => d.label.slice(1))
      .text(d => twitterText[d.label.slice(1)])
      .style("fill-opacity", 0);

    // for debug only
    //dd = new Date(2016, 0)
    //dataset.push({ label: "#centroid", forward: 0, freq: 0, time: dd, trend: "0", story: 1 })
    // -----

    var dot = svgChart
      .append("g")
      .attr("class", "dots")
      .selectAll(".dot")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("mask", "url(#mainMask)")
      .attr("data-label", d => d.label.slice(1))

    var text = svgChart
      .append("g")
      .selectAll(".text")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "textLabel")
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y;
      })
      .attr("data-label", d => d.label.slice(1))
      // 让圆上的主题的文字一直显示 Keep the text of the round theme displayed
      .text(d => twitterText[d.label.slice(1)])
      .style("text-anchor", "middle")
      .style("fill", function (d) {
        return "#242424";
      })
      .style("display", function (d) {
        if (!isVisible(d)) {
          return "none";
        }
      });


    let cursorLines = svgChart.append("g").attr("class", "cursor");
    let horizontalCursor = cursorLines
      .selectAll(".horizontal")
      .data(dataset)
      .enter()
      .append("line")
      .attr("class", "horizontal")
      .attr("data-label", d => d.label.slice(1))
      .attr("stroke-opacity", 0);
    let verticalCursor = cursorLines
      .selectAll(".vertical")
      .data(dataset)
      .enter()
      .append("line")
      .attr("class", "vertical")
      .attr("data-label", d => d.label.slice(1))
      .attr("stroke-opacity", 0);

    let cursorText = svg.append("g").attr("class", "cursor-text");
    let horizontalText = cursorText
      .selectAll(".horizontal")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "horizontal")
      .attr("data-label", d => d.label.slice(1))
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "baseline")
      .style("fill-opacity", 0);
    let verticalText = cursorText
      .selectAll(".vertical")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "vertical")
      .attr("data-label", d => d.label.slice(1))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "hanging")
      .style("fill-opacity", 0);



    let textDateLabel = svgChart
      .append("g")
      .selectAll(".text")
      .data(dataset)
      .enter()
      .append("text")
      .attr("class", "textDateLabel")
      .attr("id", d => `textDateLabel-${d.label.slice(1)}`)
      .style("display", "none");

    let mouseoverDot = null;
    let isKeyUp = true;
    let isAnimationFinished = false;
    let timeline = generateTimeline(dataArray);

    // let pastTimeline = initSelectionTimeline(labelSet);

    // 交换顺序 Swap Line and Circle
    let pastLine = initSelectionPastLine(labelSet);
    let pastCircle = initSelectionPastCircle(labelSet);

    preCalcSelectionPast(labelSet, timeline);

    let timer = svg
      .append("svg:text")
      .attr("T", 0)
      .text("");
    const totalTime = 120000;
    const durationTime = 500;
    let easeFunc = d3.easeLinear;

    const dateScale = d3
      .scaleTime()
      .domain([startDate, endDate])
      .range([0, totalTime]);
    const anchorScale = d3
      .scaleLinear()
      .domain([0, width])
      .range([0, totalTime]);

    let { lifeCycle, lifeCycleGradient } = calcLifeCycle(labelSet);
    let showupLifeCycle = calcShowup(lifeCycle);
    renderDownsideWithLifeCycle(lifeCycleGradient);

    initTime();
    startTime(easeFunc, totalTime, totalTime, dateScale);
    disableCursor();

    let checkboxs = d3.selectAll("div.labelRow input");
    let checkAll = d3.selectAll("input.input-all");
    let checkboxLabels = d3.selectAll("div.labelRow label");

    // 绑定监听 Binding bubbles monitoring 
    checkboxs.on("change", checkedHandler);
    checkAll.on("change", checkedAllHandler);
    button.on("click", buttonClickedHandler);
    slider.on("click", sliderClickedHandler);
    anchor.call(
      d3
        .drag()
        .on("start", dragStartedHandler)
        .on("drag", draggedHandler)
        .on("end", dragendedHandler)
    );
    text.on("mouseover", mouseOverHandler);
    text.on("mouseout", mouseOutHandler);
    dot.on("mouseover", mouseOverHandler);
    dot.on("mouseout", mouseOutHandler);
    document.onkeydown = keyDownHandler;
    document.onkeyup = keyUpHandler;

    function calcLifeCycle(labelSet) {
      let tweenValue = getTweenValue();
      let dateInterpolator = d3.interpolateDate(startDate, endDate);
      let formatter = d3.timeFormat("%Y-%m-%d-%H-%M-%S");
      let parser = d3.timeParse("%Y-%m-%d-%H-%M-%S");
      let dateArray = tweenValue.map(t => formatter(dateInterpolator(t)));
      let dataset = dateArray.map(date =>
        getDataByMonth(dataArray, parser(date))
      );

      let lifeCycle = {};
      labelSet.forEach(
        (label, i) =>
          (lifeCycle[label] = calcLifeCycleByLabel(
            dataset.map(data => data[i])
          ))
      );
      // console.log(lifeCycle);

      let lifeCycleGradient = transformLifeCycleToGradient(lifeCycle);

      return {
        lifeCycle,
        lifeCycleGradient
      };
    }

    function calcShowup(lifeCycle) {
      let showupLifeCycle = {};

      Object.keys(lifeCycle).forEach(key => {
        showupLifeCycle[key] = lifeCycle[key].filter(d => d[1] === true);
      });

      return showupLifeCycle;
    }

    function calcLifeCycleByLabel(data) {
      let result = [];

      let visible = isVisible(data[0]);
      result.push([data[0].time, visible]);
      for (let i = 1, len = data.length; i < len; i += 1) {
        if (isVisible(data[i]) !== visible) {
          visible = !visible;
          result.push([data[i].time, visible]);
        }
      }

      return result;
    }

    function isVisible(dataItem) {
      return dataItem.freq >= 500 || dataItem.forward >= 50; //Y||X
    }

    function transformLifeCycleToGradient(lifeCycle) {
      let labels = Object.keys(lifeCycle);

      let gradient = {};
      labels.forEach(label => {
        lifeCycleOfLabel = lifeCycle[label];
        gradient[label] = [];
        gradient[label].push("to right");

        //console.log(lifeCycleOfLabel);

        for (let i = 1, len = lifeCycleOfLabel.length; i < len; i += 1) {
          let color = "";
          if (labelSet0.indexOf(label) !== -1) color = "#76a6ca"; // 留 Stay
          if (labelSet1.indexOf(label) !== -1) color = "#b2b2b2"; // 中 Neutral
          if (labelSet2.indexOf(label) !== -1) color = "#f1706f"; // 脱 Leave

          gradient[label].push(
            `${lifeCycleOfLabel[i][1] ? "white" : color} ${(dateScale(lifeCycleOfLabel[i][0]) /
              totalTime) * 100}%`
          );
          gradient[label].push(
            `${lifeCycleOfLabel[i][1] ? color : "white"} ${(dateScale(lifeCycleOfLabel[i][0]) / totalTime) * 100}%`
          );
        }

        gradient[label] = gradient[label].join(",");
      });

      return gradient;
    }

    function renderDownsideWithLifeCycle(lifeCycleGradient) {
      let labels = Object.keys(lifeCycleGradient);

      labels.forEach(label => {
        d3.select(".downside")
          .select(`#lifeCycleItem-bar-${label}`)
          .style("background", `linear-gradient(${lifeCycleGradient[label]})`);
      });
    }

    function position(dot) {
      dot
        .attr("cx", d => x(d.forward + 1) + margin.left)
        .attr("cy", d => y(d.freq + 1) + margin.top)
        .attr("r", d => {          
          if (!isVisible(d)) {
            return 2;
          } else {
            return r(d.trend);
          }
        })
        .style("fill", function (d) {
          let [max_story, _] = getMaxStory(d.time)
          if (max_story !== 0){
            return max_story == d.story ? color(d.trend) : "#FFFFFF"; //T Highligh:F No Highlight
          }
          else{
            return "#FFFFFF";
          }
        })
        .style("stroke", function (d) {
          let [max_story, _] = getMaxStory(d.time)
          if (max_story !== 0){
            return max_story == d.story ? color(d.trend) : "#DCDCDC"; //T Highligh:F No Highlight
            //return color(d.trend); //always highlight
          }
          else{
            return "#DCDCDC";
          }
        })
        .style("opacity", 1)
        .style("display", function (d) {
          let selectedLabel = getSelectedLabel();
          if (
            !isVisible(d) &&
            selectedLabel.findIndex(label => label === d.label.slice(1)) === -1
          ) {
            return "none";
          }
        });
    }

    function textDateLabelPosition(textDateLabel) {
      textDateLabel
        .attr(
          "transform",
          d =>
            `translate(${x(d.forward + 1) + margin.left}, ${(() => {
              let radius = !isVisible(d) ? 2 : r(d.trend);
              return y(d.freq + 1) + margin.top - radius;
            })()})`
        )
        // .style('opacity',function(d){
        //   if(d.forward>50&&d.freq>1400){
        //     return 1;
        //   }else{
        //     return 0.1;
        //   }
        // })
        .text(d => {
          let time;
          if (d.time <= limitDate) {
            time = d3.timeFormat("%Y.%m")(d.time);
          } else {
            time = d3.timeFormat("%Y.%m")(limitDate);
          }

          return time;
        });
    }

    function horCursorPosition(line) {
      line
        .attr("x1", margin.left)
        .attr("y1", d => y(d.freq + 1) + margin.top)
        .attr("x2", d => x(d.forward + 1) + margin.left - r(d.trend))
        .attr("y2", d => y(d.freq + 1) + margin.top);
    }

    function verCursorPosition(line) {
      line
        .attr("x1", d => x(d.forward + 1) + margin.left)
        .attr("y1", d => y(d.freq + 1) + margin.top + r(d.trend))
        .attr("x2", d => x(d.forward + 1) + margin.left)
        .attr("y2", y.range()[0] + margin.top);
    }

    function horTextPosition(text) {
      text
        .attr(
          "transform",
          d => `translate(${margin.left}, ${y(d.freq + 1) + margin.top})`
        )
        .text(d => parseInt(d.freq) + 1);
    }

    function verTextPosition(text) {
      text
        .attr(
          "transform",
          d =>
            `translate(${x(d.forward + 1) + margin.left}, ${y.range()[0] +
            margin.top})`
        )
        .text(d => parseInt(d.forward) + 1);
    }

    function checkedHandler() {
      let selectedLabel = getSelectedLabel();
      let currentTime = getTime();
      let currentDate = dateScale.invert(currentTime);

      updateMask(selectedLabel);
      updatePast(d3.select(this), currentDate);

      let checkbox = d3.select(this);
      let label = checkbox.attr("name");
      if (checkbox.property("checked")) {
        d3.select(`#lifeCycleRow-${label}`).style("display", "block");

        // d3.select(".header")
        //   .style("outline-color", "#909099")
        //   .html(`${twitterChinese[label]}(#${twitterEnglish[label]}): ${en2ch[label]}`);

        if (selectedLabel.length === labelSet.length) {
          d3.select("input.input-all").property("checked", true);
        }
      } else {
        d3.select(`#lifeCycleRow-${label}`).style("display", "none");
      }
    }

    function checkedAllHandler() {
      let checkboxs = d3.selectAll("div input.input-all");

      checkboxs.each(() => {
        let checkbox = d3.select(this);
        let idName = checkbox.attr("id").substr(0, 9);
        if (checkbox.property("checked")) {
          let boxs = d3
            .selectAll("#" + idName + "Rows div.labelRow input")
            .property("checked", true);
          boxs.each(function () {
            let label = d3.select(this).attr("name");
            d3.select(`#lifeCycleRow-${label}`).style("display", "block");
          });
          // .on('change')();
          // d3.selectAll("div.lifeCycleRow")
          //   .style("display", "block");
        } else {
          let boxs = d3
            .selectAll("#" + idName + "Rows div.labelRow input")
            .property("checked", false);
          boxs.each(function () {
            let label = d3.select(this).attr("name");
            d3.select(`#lifeCycleRow-${label}`).style("display", "none");
          });
          // .on('change')();
          // d3.selectAll("div.lifeCycleRow")
          //   .style("display", "none");
        }
      });

      let currentTime = getTime();
      let currentDate = dateScale.invert(currentTime);
      let selectedLabel = getSelectedLabel();
      updateMask(selectedLabel);
      labelSet.forEach(label =>
        updatePast(d3.select(`#input-${label}`), currentDate)
      );
    }

    function stop4aWhile() {
      setTimeout(() => {
        buttonPlay = false;
        console.log("stop4aWhile", buttonPlay);
        button.attr("xlink:href", `public/data/bubble/pause.svg`);
        stopTime();
      }, 100);
    }
    stop4aWhile();

    function buttonClickedHandler() {
      buttonPlay = !buttonPlay;
      console.log("buttonClickedHandler", buttonPlay);
      button.attr(
        "xlink:href",
        d => `public/data/bubble/${buttonPlay ? "play" : "pause"}.svg`
      );
      if (!buttonPlay) {
        stopTime();
        enableCursor();
      } else {
        if (isAnimationFinished) {
          resetTime();
          startTime(easeFunc, totalTime, totalTime, dateScale);
          disableCursor();
          isAnimationFinished = false;
        } else {
          let timeTodo = totalTime - getTime();
          //startTime(easeFunc, totalTime, timeTodo, dateScale);          
          startTime2(easeFunc, totalTime, timeTodo, dateScale);
          disableCursor();
        }
      }
    }

    function keyDownHandler(event) {
      if (event.keyCode === 32) {
        event.preventDefault();
        if (isKeyUp) {
          isKeyUp = false;
          buttonClickedHandler();
        }
      }
    }

    function keyUpHandler(event) {
      if (event.keyCode === 32) {
        event.preventDefault();
        isKeyUp = true;
      }
    }

    function sliderClickedHandler(event) {
      console.log("sliderClickedHandler", buttonPlay)
      //let hyperParam = 0;
      stopTime();

      let offset = parseFloat(d3.select(".video-slider").attr("x"));
      let minCXPos = offset + anchorScale.domain()[0];
      let maxCXPos = offset + anchorScale.domain()[1];
      //let currentCXPos = Math.max(minCXPos, d3.event.x + hyperParam);
      let currentCXPos = Math.max(minCXPos, d3.event.x);
      currentCXPos = Math.min(maxCXPos, currentCXPos);

      let anchor = d3.select(".video-anchor");
      anchor.attr("cx", currentCXPos);

      let currentTime = anchorScale(currentCXPos - offset);
      setTime(currentTime);

      startTime(easeFunc, totalTime, totalTime - currentTime, dateScale);
      buttonPlay = true;
      button.attr("xlink:href", `public/data/bubble/play.svg`);

      setTimeout(() => {
        buttonPlay = false;
        button.attr("xlink:href", `public/data/bubble/pause.svg`);
        stopTime();
      }, 100);
    }

    function dragStartedHandler() {
      console.log("dragStartedHandler", buttonPlay)
      button.attr("xlink:href", `public/data/bubble/pause.svg`);
      stopTime();
    }

    function draggedHandler() {
      console.log("draggedHandler", buttonPlay)
      let offset = parseFloat(d3.select(".video-slider").attr("x"));
      let minCXPos = offset + anchorScale.domain()[0];
      let maxCXPos = offset + anchorScale.domain()[1];
      let currentCXPos = Math.max(minCXPos, d3.event.x);
      currentCXPos = Math.min(maxCXPos, currentCXPos);

      d3.select(this).attr("cx", currentCXPos);

      let currentTime = anchorScale(currentCXPos - offset);
      setTime(currentTime);
    }

    function dragendedHandler() {
      console.log("dragendedHandler", buttonPlay)
      let currentTime = getTime();

      buttonPlay = true;
      button.attr("xlink:href", `public/data/bubble/play.svg`);
      let timeTodo = totalTime - currentTime;
      startTime(easeFunc, totalTime, timeTodo, dateScale);

      setTimeout(() => {
        buttonPlay = false;
        button.attr("xlink:href", `public/data/bubble/pause.svg`);
        stopTime();
      }, 100);
    }

    function mouseOverHandler() {
      let label = d3.select(this).attr("data-label");
      let selectedLabel = getSelectedLabel();

      mouseoverDot = label;

      // d3.select(`#textDateLabel-${label}`).style("display", "block");

      updateMask(selectedLabel);

      // if (selectedLabel.length === 0) {
      //   d3.select(".header")
      //     .style("outline-color", "#909099")
      //     .html(`${twitterChinese[label]}(#${twitterEnglish[label]}): ${en2ch[label]}`);
      // }

      if (!buttonPlay) {
        d3.selectAll(".cursor")
          .selectAll(`line[data-label = ${label}]`)
          .attr("stroke-opacity", 1);

        d3.selectAll(".cursor-text")
          .selectAll(`text[data-label = ${label}]`)
          .style("fill-opacity", 1);

        d3.selectAll("g.axis")
          .selectAll("g.tick")
          .selectAll("text")
          .style("display", "none");
      }
    }

    function mouseOutHandler() {
      let label = d3.select(this).attr("data-label");

      d3.select(`#textDateLabel-${label}`).style("display", "none");

      mouseoverDot = null;

      let selectedLabel = getSelectedLabel();
      updateMask(selectedLabel);

      if (!buttonPlay) {
        d3.selectAll(".cursor")
          .selectAll(`line[data-label = ${label}]`)
          .attr("stroke-opacity", 0);

        d3.selectAll(".cursor-text")
          .selectAll(`text[data-label = ${label}]`)
          .style("fill-opacity", 0);

        d3.selectAll("g.axis")
          .selectAll("g.tick")
          .selectAll("text")
          .style("display", "block");
      }
    }

    function initTime(totalTime, easeFunc) {
      resetTime();
    }

    function resetTime() {
      timer.attr("T", 0);
    }


    var oldTime = 0;
    function getSlowSeries(t, story, num_frame = 4) {
      timeSeries = []
      if (story == 3) { // renew scale			
        timeSeries = new Array(num_frame)
        timeSeries.fill(0)
        delta = (t - oldTime) / (num_frame)
        timeSeries = timeSeries.map(function (value, index) {
          return oldTime + delta * (index);

        }
        );
      }

      oldTime = t;
      return timeSeries
    }


    var maxStory = []
    function getMaxStory(dateTime) {
      if (maxStory.length == 0) { //find maximum story levels
        let timeline = generateTimeline(dataArray);
        for (date of timeline) {
          // row --> [date, cx, cy, trend]
          //let date = row[0]
          let tmp = []
          for (data of dataArray) { //select all hashtag
            let value = data.value;
            let index = bisect.left(value, date);
            let now = value[index];
            // now -> [date, cx, cy, story]
            tmp.push(now[3]); // push all story leves from all hastags				
          }
          story = Math.max(...tmp) // get maximum story
          maxStory.push([date, story]); //date format, number of maximum story
        }
      }

      let index = 0;
      max_story = 0;
      btw_max_story = 0;
      try {
        index = bisect.left(maxStory, dateTime);

        max_story = maxStory[index - 1][1]; // maximum story levels
        if (index == 1) {
          btw_max_story = 0 - maxStory[index - 1][1];
        } else {
          btw_max_story = Math.abs(maxStory[index - 1][1] - maxStory[index][1]); //btw value of maximum story levels
        }
      } catch (error) { // bug 
        console.log(error)
      }
      //console.log(max_story)
      //console.log(btw_max_story)
      return [max_story, btw_max_story];
    }

    function startTime2(ease, totalTime, timeTodo, dateScale) {


      let monthScale = d3.interpolateDate(
        //dateScale.invert(totalTime - timeTodo),              
        dateScale.invert(getTime()),
        endDate
      );


      let t_list = [];
      let t_new_list = [];

      function myEaseFunc(t) {
        t_list.push(t)

        dateTime = monthScale(t);
        // find maximum story level	
        let [max_story, btw_max_story] = getMaxStory(dateTime);

        if (btw_max_story == 0) { // sinout
          new_t = Math.sin((Math.PI / 2) * t);

        } else if (btw_max_story == 1) { // linear
          new_t = t

        } else if (btw_max_story == 2) { // sinIn
          new_t = 1 - Math.cos((Math.PI / 2) * t);
          //new_t = (1 - Math.cos(Math.PI * t)) / 3; SinInOut

        } else if (btw_max_story == 3) { // CubicIn 
          new_t = t * t * t;

        }
        t_new_list.push(new_t)

        var trace = {
          x: t_list,
          y: t_new_list,
          mode: 'lines'
        };

        Plotly.newPlot('easeFunc', [trace], { title: 'Ease function graph' });
        return [new_t, btw_max_story]
        /*
        if (max_story == 3) {
          //new_t = (1 - Math.cos(Math.PI * t)) / 3; 
          new_t = t * t * t;
          console.log("origin t=", t, ">> slow t=", new_t, "story from date time", dateTime, "| max story=", max_story, "\n");          
          return [new_t, max_story];
        } else {
          console.log("origin t=", t, "story from date time", dateTime, "| max story=", max_story, "\n");
          return [t, max_story];
        }*/

      }


      timer
        .transition()
        .duration(timeTodo)
        .ease(easeFunc)
        .attr("T", totalTime);

      let t_rescale_list = [];

      //https://bl.ocks.org/Kcnarf/9e4813ba03ef34beac6e
      svg
        .transition()
        .duration(timeTodo)
        //.attr("delay", function(d,i){return 1000*i})
        //.attr("duration", function(d,i){return 1000*(i+1)})
        .ease(myEaseFunc)
        .tween("time", () => {
          return function (value) {
            [t, btw_max_story] = value

            let t_rescale = 0;
            if (btw_max_story == 0) {
              t_rescale = 2 * Math.asin(t) / Math.PI;

            } else if (btw_max_story == 1) {
              t_rescale = t;

            } else if (btw_max_story == 2) {
              //t_rescale = Math.acos(1 - 3 * t) / Math.PI; rescale SinInOut
              t_rescale = 2 * Math.acos(1 - t) / Math.PI;

            } else if (btw_max_story == 3) { //rescale

              t_rescale = Math.cbrt(t)

            }
            t_rescale_list.push(t_rescale);

            var trace = {
              x: t_list,
              y: t_rescale_list,
              mode: 'lines'
            };

            Plotly.newPlot('easeFunc2', [trace], { title: 'Tween graph' });

            let dateTime = monthScale(t_rescale);
            tweenYear(dateTime);
            console.log("tween t=", t, "|rescale date=", dateTime);
          };

        });

    }


    function startTime(ease, totalTime, timeTodo, dateScale) {
      timer
        .transition()
        .duration(timeTodo)
        .ease(easeFunc)
        .attr("T", totalTime);

      svg
        .transition()
        .duration(timeTodo)
        .ease(easeFunc)
        .tween("time", () => {
          return function (t) {
            var month = d3.interpolateDate(
              //dateScale.invert(totalTime - timeTodo),              
              dateScale.invert(getTime()),
              endDate
            );
            tweenYear(month(t));
          };
        });
    }

    function stopTime() {
      // timer.transition()
      //   .duration(0);
      // svg.transition()
      //   .duration(0);
      timer.interrupt();
      svg.interrupt();
    }

    function getTime() {
      return timer.attr("T");
    }

    function setTime(currentTime) {
      timer.attr("T", currentTime);
    }

    /*
    var center1 = 100
    var center2 = 100
    var fisheye = d3.fisheye.circular()
    .radius(50)
    .distortion(2);
    fisheye.focus([100,2000])
    */
    function getDistance(center_x, center_y, x, y) {
      return Math.sqrt((center_x - x) ** 2 + (center_y - y) ** 2);
    }

    function getTheHighlighted(dataset) {
      let highlight = [];
      for (d of dataset) {
        if (max_story == d.story && max_story>=1) {
          highlight.push(d);
        }
      }
      console.log("highlight", highlight.length);
      return highlight;
    }
    
    let dataArrayDate = {};
    for (d of dataArray) {
        dataArrayDate[d.label] = d.value;
     }

    function getProperDate(year_month, highlight) {
      let new_date = new Date(year_month);
      let proper_date = new_date;
      let temp_max_distance = 0;
      for (let i = 1; i <= 20; i++) { // find proper day
        new_date.setDate(i); //+1 days
        // find center of new cx, cy for pause
        let sum_x = 0;
        let sum_y = 0;
        let list_new_cx_cy = [];
        for (d of highlight) { // #hashtag is highlighted          
          let value = dataArrayDate[d.label]; //get #hashtag
          let new_cx = findForwardByMonth(value, new_date);
          let new_cy = findFreqByMonth(value, new_date);
          console.log("hashtag", d.label, "generate day:", new_date, "new (cx,cy) =>", new_cx, ",", new_cy);//debug
          sum_x += new_cx;
          sum_y += new_cy;
          list_new_cx_cy.push([new_cx, new_cy]);
        }
        // calculate center of #hashtag is highlighted  
        let center_x = sum_x / highlight.length;
        let center_y = sum_y / highlight.length;
        console.log("new center of generate day:", new_date, " | center(x,y) >>", center_x, center_y);//debug
        // maximum distance
        temp = [];
        for (point of list_new_cx_cy) {
          //temp.push(getDistance(x(center_x), y(center_y), x(point[0]), y(point[1])));          
          temp.push(getDistance(center_x, center_y, point[0], point[1]));
        }
        max_distance = Math.max(...temp);
        console.log("generate day:", new_date, " | maximum distance >>", max_distance);//debug
        if (max_distance > temp_max_distance) {
          temp_max_distance = max_distance;
          proper_date = new_date;
        }
        //list_max_distance[new_date] = max_distance
      }
      console.log("proper_date=", proper_date, "maximum distance >>", temp_max_distance);//debug
      return proper_date;
    }

    // repeat every times
    function tweenYear(year_month_date) {
      // dataset format example 
      /*[ {label: "#abtv", 
        forward: 1.6105742383512545, 
        freq: 1.2079306787634407, 
        time: Sun Jan 03 2016 11:54:48 GMT+0800 (China Standard Time), 
        trend: "0.007179008", 
        story: 0} ,
         
        {label: "#brexitbetrayal", 
        forward: 0, 
        freq: 0, 
        time: Mon Jan 04 2016 07:04:42 GMT+0700 (Indochina Time), 
        trend: "0.794551017", 
        story: 0}
      
        .
        .
        .
         ]
      */

      
      //console.log(">> data Array date", dataArrayDate);

      let dataset = getDataByMonth(dataArray, year_month_date);

      let [max_story, btw_max_story] = getMaxStory(year_month_date);

      // find #hashtag is highlighted 
      let highlight = getTheHighlighted(dataset);

      // calculate proper center       
      if (highlight.length >= 4 && properDateCheck==true) { //check  #hashtag is highlighted  is more than 4 times     
        // generate new days and new (cx, cy) for pause
        //list_max_distance = {};        
        // change dataset
        proper_date  = getProperDate(year_month_date, highlight);
        dataset = getDataByMonth(dataArray, proper_date);

        // find date --> have maximum distance

        // plot new cx ,cy

        let timeScale = d3
        .scaleLinear()
        .domain([timeline[0], timeline[timeline.length-1]])
        .range([0 ,totalTime]);
        // Change time
        let currentTime= timeScale(proper_date);
        setTime(currentTime);
        __plotAll(dataset);

        function myPause() {                         
          buttonClickedHandler();//# stop
          properDateCheck = false;
          // resume
          setTimeout(function () { buttonClickedHandler(); }, 10000);// milli seconds
        }
  
        myPause();

      } else { // #hashtag is not highlighted  is more than 4 times
        if(highlight.length < 4){
          properDateCheck=true;
        }        
        __plotAll(dataset);
      }

     

      // for debug only
      //dd = new Date(2016, 0)      
      //let centroid = [{ label: "#centroid", forward: center_x, freq: center_y, time: dd, trend: 10, story: 1 }];
      //dataset = centroid.concat(dataset)
      //dataset.push({label: "#centroid", forward: center_x, freq: center_y, time: dd, trend: radius, story:1})
      // -----
     

      function __plotAll(dataset) {
        dot.data(dataset)
          .call(position);
        //show_data(year_month_date, max_story, btw_max_story, dataset); //for debug onley
        //console.log('>>>',d3.select("#chartAside").html());	
        //d3.select("#my_dataviz").text( d3.select("#chartAside").html())	
        textDateLabel.data(dataset).call(textDateLabelPosition);
        // updateShowupText(year, dataset, showupText, showupLifeCycle);
        updateTraj(year_month_date);
        horizontalCursor.data(dataset).call(horCursorPosition);
        verticalCursor.data(dataset).call(verCursorPosition);
        horizontalText.data(dataset).call(horTextPosition);
        verticalText.data(dataset).call(verTextPosition);
        textPosition(dataset);
        if (year_month_date <= limitDate) {
          monthText.text(year_month_date.getFullYear() + "/" + (year_month_date.getMonth() + 1));
        }
        else {
          isAnimationFinished = true;
          buttonPlay = false;
          button.attr("xlink:href", `public/data/bubble/pause.svg`);
          enableCursor();
        }
        let tmpYear = new Date(year_month_date);
        updateVideoAnchor(tmpYear);
      }
    }

    // function updateShowupText(year, dataset, showupText, showupLifeCycle) {
    // if (getSelectedLabel().length === 0) {
    //   // let formatter = d3.timeFormat("%Y-%m-%d");
    //   // let trueText = Object.keys(showupLifeCycle).filter(key => {
    //   //   let cycle = showupLifeCycle[key];
    //   //   for (let timestamp of cycle) {
    //   //     if (formatter(timestamp[0]) === formatter(year)) {
    //   //       return true;
    //   //     }
    //   //   }
    //   //   return false;
    //   // });
    //   // console.log(trueText);
    //   showupText.data(dataset)
    //     .attr("transform", d => `translate(${x(d.forward + 1)+margin.left}, ${y(d.freq + 1)+margin.top})`)
    //     // .filter(d => trueText.findIndex(text => text === d.label.slice(1)) >= 0 || (d.forward + 1 >= 800 || d.freq + 1 >= 50000))
    //     .style('opacity',function(d){
    //       if(d.forward>50&&d.freq>1400){
    //         return 1;
    //       }else{
    //         return 0;
    //       }
    //     })
    //     .filter(isVisible)
    //     .style("fill-opacity", 1)
    //     .transition()
    //     .duration(1000)
    //     .style("fill-opacity", 0.1);
    // }
    // }

    function updateTraj(currentDate) {
      let selectedLabel = getSelectedLabel();
      // let date = d3.timeFormat("%Y%m%d")(currentDate);

      selectedLabel.forEach(label => {
        let selector = d3.select(`#input-${label}`);
        updatePast(selector, currentDate);
      });
    }

    function computeCoord(x1, y1, r1, x2, y2, r2) {
      x1 = parseFloat(x1);
      y1 = parseFloat(y1);
      r1 = parseFloat(r1);
      x2 = parseFloat(x2);
      y2 = parseFloat(y2);
      r2 = parseFloat(r2);
      // let dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

      let lineCoord = {
        x1,
        y1,
        x2,
        y2
      };

      return lineCoord;
    }

    function updateVideoAnchor(date) {
      let width = d3.select(".video-slider").attr("width");
      let timeScale = d3
        .scaleTime()
        .domain([startDate, endDate])
        .range([0, width]);
      let pos = parseFloat(timeScale(date));
      pos = Math.min(pos, width);
      d3.select(".video-anchor").attr(
        "cx",
        pos + parseFloat(d3.select(".video-slider").attr("x"))
      );
    }

    function textPosition(textData) {
      text.data(textData).each(function (d) {
        d.width = this.getBBox().width;
        d.forward = d.forward;
        d.freq = d.freq;
        d.x = x(d.forward + 1) + margin.left;
        d.y = y(d.freq + 1) + margin.top;
        d.r = r(d.trend);
        d.height = this.getBBox().height;
      });

      var labels = d3
        .labeler()
        .label(textData)
        .anchor(textData)
        .width(width)
        .height(height)
        .start(0);

      text
        .attr("x", function (d) {
          return d.x;
        })
        .attr("y", function (d) {
          return d.y;
        })
        .style("text-anchor", "middle")
        .style("fill", function (d) {
          return "#242424";
        })
        // .attr('fill-opacity',function(d){
        //   if(d.forward>50&&d.freq>1400){
        //     return 1;
        //   }else{
        //     return 0.1;
        //   }
        // })
        .style("opacity", function (d) {
          if (d.forward > 0 && d.freq > 100) {
            return 1;
          } else {
            return 0;
          }
        })
        .style("display", function (d) {
          if (!isVisible(d)) {
            return "none";
          }
        });
    }

    function createAsidePanel(labelSet, idName) {
      let asideWidth = 190;
      let lineHeight = 24; // 和css联动 work with CSS
      let aside = d3
        .select("#rightAside")
        .append("div")
        .attr("class", "aside")
        .style("height", height / 3);
      // 这句下面还有一句 
      // document.querySelector("div#aside").style.width = `${asideWidth}px`;
      // document.querySelector("div#aside").style.height = `${anchor.attr("cy")}px`;
      // document.querySelector("div#aside").style.margin = `${margin.top}px 0 ${svgHeight - anchor.attr("cy")}px 0`;

      let eleOfAllNnone = aside.append("div").attr("class", "eleOfAllNnone");
      let eleOfLabelRow = aside
        .append("div")
        .attr("class", "eleOfLabelRow")
        .attr("id", idName + "Rows")
        .style("height", height / 3 - 25 + "px")
        .style(
          "max-height",
          `${2 * anchor.attr("cy") - lineHeight - svgHeight}px`
        );

      let eleOfAll = eleOfAllNnone.append("div").attr("class", "allNnone");
      eleOfAll
        .append("input")
        .attr("type", "checkbox")
        .attr("name", "all")
        .attr("class", "input-all")
        .attr("id", idName + "all");
      eleOfAll
        .append("label")
        .attr("class", "label-all")
        .attr("for", idName + "all")
        .html(lang === "ch" ? "全选" : "all");

      let rows = eleOfLabelRow
        .selectAll(".labelRow")
        .data(labelSet)
        .enter()
        .append("div")
        .attr("class", `labelRow ${idName}Row`)
        .attr("id", d => `row-${d}`);

      rows
        .append("div")
        .attr("class", "trendBar")
        .style("width", d => {
          return trendScale(trendTransform(trendMap.get(d))) + "px";
        })
        .style("margin-left", d => {
          if (trendTransform(trendMap.get(d)) >= 0)
            return rightAsidePivotFromLeft + "px";
          else
            return (
              rightAsidePivotFromLeft -
              trendScale(trendTransform(trendMap.get(d))) +
              "px"
            );
        })
        .style("border-top-right-radius", d => {
          if (trendTransform(trendMap.get(d)) >= 0) return "8px";
        })
        .style("border-bottom-right-radius", d => {
          if (trendTransform(trendMap.get(d)) >= 0) return "8px";
        })
        .style("border-top-left-radius", d => {
          if (trendTransform(trendMap.get(d)) <= 0) return "8px";
        })
        .style("border-bottom-left-radius", d => {
          if (trendTransform(trendMap.get(d)) <= 0) return "8px";
        })
        .style("background", d => {
          if (category(trendMap.get(d)) === "2") return "#f1706f";
          if (category(trendMap.get(d)) === "1") return "#b2b2b2";
          if (category(trendMap.get(d)) === "0") return "#76a6ca";
        });

      let rowslabel = rows.append("div").attr("class", "textLabelRow");
      rowslabel
        .append("input")
        .attr("type", "checkbox")
        .attr("class", "squared")
        .attr("name", d => d)
        .attr("id", d => `input-${d}`);

      rowslabel
        .append("label")
        .attr("id", d => `label-${d}`)
        .attr("for", d => `input-${d}`)
        .attr("class", "forTooltip")
        .attr(
          "data-tippy-content",
          d => `${twitterChinese[d]}(#${twitterEnglish[d]}): ${en2ch[d]}`
        )
        .html(d => `${twitterText[d]}`);

      // document.querySelector("div#eleOfLabelRow").style.height = svgHeight/3 - 20 + 'px';
    }

    // 左边圆大小的编码 Encoding the size of the left circle 
    function createDownsidePanel(labelSet) {
      let downsideBlockHeight = 130;
      let downsideTitleHeight = 30;
      let downsideHeight = downsideBlockHeight + downsideTitleHeight;

      let downside = d3
        .select(".container")
        .append("div")
        .attr("class", "downside");

      downside
        .append("div")
        .attr("id", "downside-title")
        .style("width", `${svgWidth}px`)
        .style("height", `${downsideTitleHeight}px`)
        .text("Topic lifetime")
        .style("text-align", "center");

      let slider = d3.select(".video-slider");

      document.querySelector("div.downside").style.width = `${svgWidth}px`;
      document.querySelector(
        "div.downside"
      ).style.height = `${downsideHeight}px`;

      let downsideBlock = downside.append("div").attr("id", "downside-block");

      document.querySelector(
        "div#downside-block"
      ).style.height = `${downsideBlockHeight}px`;

      /*let rows = downsideBlock
        .selectAll(".lifeCycleRow")
        .data(labelSet)
        .enter()
        .append("div")
        .attr("class", "lifeCycleRow")
        .attr("id", d => `lifeCycleRow-${d}`)
        .style("display", "none")
        .on("click", function() {
          let ele = d3.select(this);
          if (ele.style("display") !== "none") {
            ele.style("display", "none");
          }
        });*/

      let rows = downsideBlock
        .selectAll(".lifeCycleRow")
        .data(labelSet)
        .enter()
        .append("div")
        .attr("class", "lifeCycleRow")
        .attr("id", d => `lifeCycleRow-${d}`)
        .style("display", "none");

      rows
        .append("div")
        .attr("class", "lifeCycleItem-label")
        .attr("id", d => `lifeCycleItem-label-${d}`)
        .attr("width", `${margin.left}px`)
        .style("max-width", `${margin.left}px`)
        .style("min-width", `${margin.left}px`)
        .style("min-height", `${slider.attr("height")}px`)
        .html(d => twitterText[d]);

      rows
        .append("div")
        .attr("class", "lifeCycleItem-bar")
        .attr("id", d => `lifeCycleItem-bar-${d}`)
        .attr("width", `${slider.attr("width")}px`)
        .style("max-width", `${slider.attr("width")}px`)
        .style("min-width", `${slider.attr("width")}px`)
        .attr("height", `${slider.attr("height")}px`)
        .style("min-height", `${slider.attr("height")}px`)
        .style("border-radius", `${slider.attr("rx")}px`);
      // .html("sdfadsf");
    }

    // 本函数在mouseover事件里调用 This function is called in the mouseover event
    function updateMask(selectedLabel) {
      if (selectedLabel.length === 0) {
        d3.selectAll(".dot")
          .filter(function (d, i) {
            return mouseoverDot === null || d.label.slice(1) === mouseoverDot;
          })
          .transition()
          .duration(durationTime)
          .attr("opacity", 1);

        d3.selectAll(".dot")
          .filter(function (d, i) {
            return mouseoverDot !== null && d.label.slice(1) !== mouseoverDot;
          })
          .transition()
          .duration(durationTime)
          .attr("opacity", 0.1);

        // d3.selectAll(".textLabel")
        //   .filter(function(d, i) {
        //     return (
        //       mouseoverDot === null || d.label.slice(1) !== mouseoverDot
        //     );
        //   })
        //   .text("");

        d3.selectAll(".textLabel")
          // .filter(function(d, i) {
          //   return mouseoverDot !== null && d.label.slice(1) === mouseoverDot;
          // })
          .text(d => twitterText[d.label.slice(1)]);

        // d3.selectAll(".textLabel")
        //   .filter(function(d, i) {
        //     return mouseoverDot !== null && d.label.slice(1) !== mouseoverDot;
        //   })
        //   .text("");

        return;
      }

      d3.selectAll(".dot")
        .filter(function (d, i) {
          return (
            selectedLabel.findIndex(
              label => label === d3.select(this).attr("data-label")
            ) < 0 &&
            (mouseoverDot === null || d.label.slice(1) !== mouseoverDot)
          );
        })
        .attr("opacity", 0.1);

      d3.selectAll(".dot")
        .filter(function (d, i) {
          return (
            selectedLabel.findIndex(
              label => label === d3.select(this).attr("data-label")
            ) >= 0 ||
            (mouseoverDot !== null && d.label.slice(1) === mouseoverDot)
          );
        })
        .attr("opacity", 1);

      d3.selectAll(".textLabel")
        .filter(function (d, i) {
          return (
            selectedLabel.findIndex(
              label => label === d3.select(this).attr("data-label")
            ) < 0 &&
            (mouseoverDot === null || d.label.slice(1) !== mouseoverDot)
          );
        })
        .text("");

      d3.selectAll(".textLabel")
        .filter(function (d, i) {
          return (
            selectedLabel.findIndex(
              label => label === d3.select(this).attr("data-label")
            ) >= 0 ||
            (mouseoverDot !== null && d.label.slice(1) === mouseoverDot)
          );
        })
        .text(d => twitterText[d.label.slice(1)]);
    }

    function enableCursor() {
      horizontalCursor.style("display", d => {
        if (!isVisible(d)) {
          return "none";
        } else {
          return "block";
        }
      });
      verticalCursor.style("display", d => {
        if (!isVisible(d)) {
          return "none";
        } else {
          return "block";
        }
      });
      horizontalText.style("display", d => {
        if (!isVisible(d)) {
          return "none";
        } else {
          return "block";
        }
      });
      verticalText.style("display", d => {
        if (!isVisible(d)) {
          return "none";
        } else {
          return "block";
        }
      });
    }

    function disableCursor() {
      horizontalCursor.style("display", "none");
      verticalCursor.style("display", "none");
      horizontalText.style("display", "none");
      verticalText.style("display", "none");
    }

    function getSelectedLabel() {
      let selection = d3.selectAll(
        "div.labelRow input[type='checkbox']:checked"
      );

      let selectedLabel = [];
      selection.each(d => selectedLabel.push(d));

      return selectedLabel;
    }

    function generateTimeline(dataArray) {
      let timeline = dataArray[0]["value"].map(d => d[0]);
      // timeline.splice(7, 1);
      return timeline;
    }

    function initSelectionPastCircle(labelSet) {
      let pastCircle = {};
      let gPastCircle = svgChart.append("g").attr("class", "pastCircle");
      labelSet.forEach(
        label =>
          (pastCircle[label] = {
            ele: gPastCircle.append("g").attr("class", `pastCircle-${label}`),
            data: []
          })
      );

      return pastCircle;
    }

    function initSelectionPastLine(labelSet) {
      let pastLine = {};
      let gPastLine = svgChart.append("g").attr("class", "pastLine");
      labelSet.forEach(
        label =>
          (pastLine[label] = {
            ele: gPastLine.append("g").attr("class", `pastLine-${label}`),
            eleMotion: gPastLine
              .append("g")
              .attr("class", `pastLineMotion-${label}`),
            data: []
          })
      );

      return pastLine;
    }

    function preCalcSelectionPast(labelSet, timeline) {
      let tweenValue = getTweenValue();
      let dateInterpolator = d3.interpolateDate(startDate, endDate);
      let formatter = d3.timeFormat("%Y-%m-%d-%H-%M-%S");
      let parser = d3.timeParse("%Y-%m-%d-%H-%M-%S");
      let dateArray = tweenValue.map(t =>
        parser(formatter(dateInterpolator(t)))
      );
      labelSet.forEach((label, index) => {
        calcLabelPast(label, index, timeline.slice(), dateArray);
      });
    }

    function calcLabelPast(label, index, timeline, dateArray) {
      let targetPastCircle = pastCircle[label];
      let targetPastLine = pastLine[label];
      // console.log(dateArray);
      dateArray.forEach(currentDate => {
        // let dateIndex = dateArray.indexOf(currentDate);
        // if (!(dateIndex < dateArray.length - 1 && currentDate.getMonth() !== dateArray[dateIndex + 1].getMonth())) {
        //   return;
        // }
        if (currentDate >= timeline[0]) {
          let data = getDataByMonth(dataArray, currentDate)[index];
          let cx = x(data.forward + 1) + margin.left;
          let cy = y(data.freq + 1) + margin.top;
          let radius = !isVisible(data) ? 2 : r(data.trend);
          let fill = color(data.trend);
          let date = d3.timeFormat("%Y%m%d%H")(currentDate);

          if (targetPastLine["data"].length > 0) {
            let length = targetPastLine["data"].length;
            let prevData = targetPastLine["data"][length - 1];
            let prevDate = prevData["date"];
            let prevLine = targetPastLine["ele"].select(
              `#pastLine-${label}-${prevData["date"]}`
            );
            let lineCoord = computeCoord(
              prevData.cx,
              prevData.cy,
              prevData.r,
              cx,
              cy,
              radius
            );

            // 改成用path Convert to use the path
            let lineLen = Math.sqrt(
              (lineCoord.x2 - lineCoord.x1) * (lineCoord.x2 - lineCoord.x1) +
              (lineCoord.y2 - lineCoord.y1) * (lineCoord.y2 - lineCoord.y1)
            );
            let rotateAngle =
              Math.atan2(
                lineCoord.y2 - lineCoord.y1,
                lineCoord.x2 - lineCoord.x1
              ) *
              (180 / Math.PI);

            prevLine
              .attr(
                "d",
                "M" +
                lineCoord.x1 +
                "," +
                lineCoord.y1 +
                " L" +
                lineCoord.x2 +
                "," +
                lineCoord.y2
              )
              .style("filter", () => {
                if (lineLen < 15 || Math.abs(rotateAngle) < 1) return "none";
                else return "url(#glow)";
              });
          }

          targetPastLine["ele"]
            .append("path")
            .attr("class", "pastLine")
            .classed("disabled", true)
            .attr("id", `pastLine-${label}-${date}`)
            .attr(
              "d",
              "M" +
              (cx + radius) +
              "," +
              (cy + radius) +
              " L" +
              (cx + radius) +
              "," +
              (cy + radius)
            )
            // .style("fill-opacity",0)
            .style("stroke-width", 1)
            .style("stroke", fill)
            .attr("mask", "url(#mainMask)");

          targetPastLine["eleMotion"]
            .append("line")
            .attr("class", "pastLineMotion")
            .classed("disabled", true)
            .attr("id", `pastLineMotion-${label}-${date}`)
            .attr("x1", cx + radius)
            .attr("y1", cy + radius)
            .attr("x2", cx + radius)
            .attr("y2", cy + radius)
            .style("stroke", fill)
            .style("filter", "url(#glow)")
            .attr("mask", "url(#mainMask)");

          // targetPastCircle["ele"]
          //   .append("text")
          //   .attr("class", "pastTime")
          //   .classed(`pastTime-${label}`, true)
          //   .attr("id", `pastTime-${label}-${date}`)
          //   .attr("x", () => {
          //     return cx >= 30 ? cx - 10 : cx + 25;
          //   })
          //   .attr("y", cy - 6)
          //   .text(() => {
          //     let year = currentDate.getFullYear();
          //     let month = currentDate.getMonth();
          //     if (month === 0) {
          //       month = 11;
          //       year -= 1;
          //     } else {
          //       month -= 1;
          //     }
          //     let text = d3.timeFormat("%Y.%m.%d")(new Date(year, month));
          //     return text.slice(0, 7);
          //   })
          //   .style("display", "none");

          targetPastCircle["ele"]
            .append("circle")
            .attr("class", "pastCircle")
            .attr("id", `pastCircle-${label}-${date}`)
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", 2)
            .attr("mask", "url(#mainMask)")
            .style("fill", fill)
            .style("stroke", fill)
            .classed("disabled", true)
            .on("mouseover", function () {
              let tX = cx >= 30 ? cx - 10 : cx + 25;
              let tY = cy - 10;
              let backgroundPadding = 5;
              let fontSize = 13;
              // add background first
              svgChart
                .append("rect")
                .attr("id", "tempTimeBack")
                .attr("width", 50 + 2 * backgroundPadding + "px")
                .attr("height", fontSize + 2 * backgroundPadding + "px")
                .attr("x", tX - backgroundPadding)
                .attr("y", tY - backgroundPadding - fontSize + 1.5)
                .attr("rx", 3)
                .attr("ry", 3)
                .attr("fill", "black")
                .attr("opacity", "0.5");

              // add text
              svgChart
                .append("text")
                .attr("transform", "translate(" + tX + " ," + tY + ")")
                .attr("id", "tempTimeText")
                .attr("fill", "white")
                .text(() => {
                  let year = currentDate.getFullYear();
                  let month = currentDate.getMonth();
                  if (month === 0) {
                    month = 11;
                    year -= 1;
                  } else {
                    month -= 1;
                  }
                  let text = d3.timeFormat("%Y.%m.%d")(new Date(year, month));
                  return text.slice(0, 7);
                })
                .style("font-size", fontSize + "px");
            })
            .on("mouseout", function () {
              d3.selectAll("[id*=tempTime]").remove();
            });

          targetPastCircle["data"].push({
            cx,
            cy,
            r: radius,
            fill,
            date
          });
          targetPastLine["data"].push({
            cx,
            cy,
            r: radius,
            stroke: fill,
            date
          });

          timeline.shift();
        }
      });
    }

    let headSvg = d3
      .select(".header")
      .append("svg")
      .attr("width", 700)
      .attr("height", 60)
      .style("position", "absolute");

    headSvg
      .append("text")
      .attr("transform", "translate(" + 0 + " ," + 40 + ")")
      .text("Brexit topic dynamics")
      .style("font-size", "40px");

    headSvg
      .append("image")
      .attr("xlink:href", "public/left_legend_2.svg")
      .attr("x", 450)
      .attr("y", 0)
      // .attr('width', 400)
      .attr("height", 60);

    function updatePast(selector, currentDate, reRenderLine = false) {
      let label = selector.attr("name");
      let date = d3.timeFormat("%Y%m%d%H")(currentDate);

      let targetPastCircle = pastCircle[label];
      let targetPastLine = pastLine[label];

      // if input is unchecked, we just disable all of them
      if (!selector.property("checked")) {
        targetPastCircle["ele"].selectAll("circle").classed("disabled", true);
        // targetPastLine["ele"].selectAll("line")
        //           .classed("disabled", true);
        targetPastLine["ele"].selectAll("path").classed("disabled", true);
        targetPastLine["eleMotion"].selectAll("line").classed("disabled", true);
        return;
      }
      // else we filter elements by currentDate
      // 是展示轨迹点吗? Is it the track point?
      targetPastCircle["ele"]
        .selectAll("circle")
        .filter(function () {
          return (
            d3
              .select(this)
              .attr("id")
              .split("-")[2] < date
          );
        })
        .classed("disabled", false);

      targetPastCircle["ele"]
        .selectAll("circle")
        .filter(function () {
          // return true;
          return (
            d3
              .select(this)
              .attr("id")
              .split("-")[2] >= date
          );
        })
        .classed("disabled", true);

      // targetPastLine["ele"].selectAll("line")
      targetPastLine["ele"]
        .selectAll("path")
        .filter(function () {
          let nxSibling = d3.select(this.nextSibling);
          let node = d3.select(this);
          return (
            node.attr("id").split("-")[2] < date &&
            nxSibling.attr("id").split("-")[2] < date
          );
        })
        .classed("disabled", false);

      targetPastLine["ele"]
        .selectAll("path")
        // targetPastLine["ele"].selectAll("line")
        .filter(function () {
          let nxSibling = d3.select(this.nextSibling);
          let node = d3.select(this);
          return (
            node.attr("id").split("-")[2] >= date ||
            (node.attr("id").split("-")[2] < date &&
              nxSibling.attr("id").split("-")[2] >= date)
          );
        })
        .classed("disabled", true);

      let index = -1;
      targetPastLine["eleMotion"]
        .selectAll("line")
        .filter(function (_, i) {
          let nxSibling = d3.select(this.nextSibling);
          let node = d3.select(this);
          if (
            node.attr("id").split("-")[2] < date &&
            nxSibling.attr("id").split("-")[2] >= date
          ) {
            index = i;
            return true;
          }
          return false;
        })
        .classed("disabled", false);

      targetPastLine["eleMotion"]
        .selectAll("line")
        .filter(function () {
          let nxSibling = d3.select(this.nextSibling);
          let node = d3.select(this);
          return (
            node.attr("id").split("-")[2] >= date ||
            nxSibling.attr("id").split("-")[2] < date
          );
        })
        .classed("disabled", true);

      if (index >= 0) {
        let data = targetPastLine["data"][index];
        let line = targetPastLine["eleMotion"].select(
          `#pastLineMotion-${label}-${data.date}`
        );
        let targetCircle = d3.select(`.dot[data-label = ${label}]`);
        let lineCoord = computeCoord(
          data.cx,
          data.cy,
          data.r,
          targetCircle.attr("cx"),
          targetCircle.attr("cy"),
          targetCircle.attr("r")
        );
        line
          .attr("x1", lineCoord.x1)
          .attr("y1", lineCoord.y1)
          .attr("x2", lineCoord.x2)
          .attr("y2", lineCoord.y2);
      }
    }
  });
})();

async function getExplanation() {
  let dataset = await d3.csv("public/data/hashtag_bubble_explanation.csv");

  let en2ch = {};

  dataset.forEach(d => (en2ch[d.en] = d.ch));

  return en2ch;
}
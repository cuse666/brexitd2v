(async function main() {

  let events = [];

  let en2ch = await getExplanation();
  let lang = "en";

  var margin = { top: 10, bottom: 135, left: 120, right: 30 };
  // var svgWidth = document.getElementById('chartAside').clientWidth;
  // var svgHeight = svgWidth*0.6>700? 700: svgWidth*0.6;
  var svgWidth = 1200;//850;
  var svgHeight = 700;//690;

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  let timeout = null
  var svg = d3
    .select("#chartAside")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  let options = d3.select("#anotherFunc")
    .append("div")
    .attr("class", "options")
    .style("display", "grid")
    .style("grid-template-rows", "30px 30px 66px 224px");

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
  let captionfontSize = 20;
  let sliderHeight = 10;
  let borderRadius = 5;
  let slider = svg
    .append("rect")
    .attr("class", "video-slider")
    .attr("x", margin.left)
    .attr(
      "y",
      margin.top + height + videoYOffset + buttonSize / 2 - sliderHeight / 2 + 30 + 25
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
    .attr("cy", margin.top + height + videoYOffset + buttonSize / 2 + 30 + 25)
    .attr("r", anchorRadius);
  let anchortext = svg.append("text")
    .attr("class", "anchor-text")
    .text("2016/1")
    .attr("x", margin.left - 20)
    .attr("y", margin.top + height + videoYOffset + buttonSize / 2 + 30 + 25 - 10)
    .attr("font-size", 15)
    .attr("fill", "black")
    .attr("opacity", "0")

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

  d3.select("#showTextArea")
    .append("p")
    .style("font-size", "18px")
    .text("Caption Transcript")
    .style("text-align", "center")
    .style("font-weight", "600")
    .style("color", "#565656");

  d3.select("#showTextArea")
    .append("div")
    .style("margin", "10px")
    .attr("id", "CaptionInstruction")
    .append("text")
    .style("font-size", "15px")
    .text("Here is the caption transcript area. You can delete the captions and edit captions duration here.")
    .style("text-align", "center");

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

    //******************************************************************************************************** */
    //添加一个矩形框，在其上添加文本
    let textHeight = 55
    let showTextArea = svg
      .append("rect")
      .attr("class", "showTextArea")
      .attr("x", margin.left)
      .attr(
        "y",
        margin.top + height + videoYOffset + buttonSize / 2 - textHeight / 2
      )
      .attr("width", width)
      .attr("height", textHeight)
      .attr("rx", borderRadius)
      .attr("ry", borderRadius)
      .attr("opacity", 0.1)

    //.attr("width", `${slider.attr("width")}px`)
    let tempText = "Double click to change the caption"

    function createText() {
      var textforeignObject = svg.append("foreignObject")
        .attr("id", "mytextforeignObject")
        .attr("x", parseInt(showTextArea.attr("x")))
        .attr(
          "y",
          parseInt(showTextArea.attr("y"))
        )
        .attr("height", textHeight)
        .attr("width", width)
        .attr("style", "display:flex; align-items:center;justify-content:center;")
        .style("font-size", captionfontSize + "px")
        .style("font-family", "Arial")
        .on("dblclick", changeText)


      return textforeignObject.append("xhtml:div")
        .attr("style", "width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;text-align:center;")
        // .on("dblclick", changeText)
        // .attr("id", "mytext")
        .append("div")
        .attr("id", "mytext")
        .text(tempText)
    }

    let myText = createText()     //初始创建一个文本

    var TextandDate = {}  //准备设置为一个字典。key是年月日字符串，value是文本

    function createInput() {       //创建一个input框，并且给他加上一些监听事件。
      var foreignObject = svg.append("foreignObject")
        .attr("id", "myforeignObject")
        .attr("x", parseInt(showTextArea.attr("x")))
        .attr(
          "y",
          parseInt(showTextArea.attr("y"))
        )
        .attr("height", showTextArea.attr("height"))
        .attr("width", showTextArea.attr("width"))

      let textArea = foreignObject.append("xhtml:textarea")
        .attr("id", "tt")
        .attr("maxlength", 160)
        .attr("placeholder", "max length: 160")
        .attr("style", "height:50px;resize:none;line-height:50px;width:1045px;text-align:center;")
        .style("font-size", captionfontSize + "px")
        .style("font-family", "Arial")
        .on("blur", inputBlur)
        .on("focus", inputFocus)
        .on("input", inputContent)
      // .on("keypress",logKey)

      let myInput = document.getElementById("tt");
      if (tempText)
        myInput.value = tempText  //初始值
      myInput.focus()       //创建input后，立刻聚焦
      myInput.onkeydown = function (event) {
        if (event.keyCode === 13) {
          myInput.blur()                //直接失去焦点
        }
      }

      function inputContent() {
        textArea.text(this.value)
      }

      function inputBlur() {         //这个函数比较重要，因为他处理输入结束后的情况
        if (this.value.trim().length === 0)
          this.value = ""
        if (this.value.length != 0)
          tempText = this.value
        else
          tempText = ""

        let currentDate = dateScale.invert(getTime())
        //dateString 用于统一格式
        let dateString = (currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate())
        if (currentDate.getMonth() + 1 < 10) //在第5个位置增加一个 0 
          dateString = dateString.slice(0, 5) + "0" + dateString.slice(5)
        if (currentDate.getDate() < 10) //在第8个位置插入一个0
          dateString = dateString.slice(0, 8) + "0" + dateString.slice(8)

        //如果此dateString在TextandDate的keys中的区间中，那么执行修改操作，而不是新增一个
        let change = false;
        var datearr = Object.keys(TextandDate)
        for (let i = 0; i < datearr.length; i++) {
          if (datearr[i].slice(0, 10) <= dateString && dateString <= datearr[i].slice(11)) {
            change = true;
            if (tempText.length != 0)
              TextandDate[datearr[i]] = tempText;
            else { //如果输入为空，不改变数据
              tempText = TextandDate[datearr[i]]
            }
            break;
          }
        }

        d3.select("#myforeignObject").remove()  //删除输入框
        myText = createText() //重新创建一个文本框

        if (change === false) {
          TextandDate[dateString + "-" + dateString] = tempText

          //排序操作
          datearr = Object.keys(TextandDate).sort()
          var tmpobj = {}
          for (let i = 0, len = datearr.length; i < len; i++) {
            if (TextandDate[datearr[i]] != "") //删除空字符
              tmpobj[datearr[i]] = TextandDate[datearr[i]]
          }
          TextandDate = tmpobj
        }

        updateshowTextArea()  //更新文本区域
        console.log(TextandDate)
      }
      function inputFocus() {
        this.select()
      }

      return textArea
    }

    function updateshowTextArea() {   //删除之前所有的文字，再加入现在的文本信息
      let showTextArea = d3.select("#showTextArea") //选中这个区域

      if (document.getElementById("CaptionInstruction"))
        document.getElementById("CaptionInstruction").remove()

      if (document.getElementById("oldTextArea") != null)
        document.getElementById("oldTextArea").remove()

      let textarea = showTextArea.append("div").attr("id", "oldTextArea")

      var datearr = Object.keys(TextandDate)
      for (let i = 0, len = datearr.length; i < len; i++) {
        let singleText = textarea
          .append("div")
          .attr("id", "singleTextArea" + i)
          .style("margin", "10px")
        //时间-时间
        //text
        let datetext1 = singleText.append("div")
          .style("display", "inline")
          .attr("id", "dt1" + i)
          .append("text")
          // .on("dblclick",changeText)
          // .on("mouseover",MouseOverText)
          // .on("mouseout",MouseOutText)
          .text(datearr[i].slice(0, 10) + " - ")

        let datetext2 = singleText.append("div")
          .style("position", "relative")
          .attr("id", "dt2" + i)
          .style("display", "inline")
          .append("text")
          .style("text-decoration", "underline")
          .attr("id", "dttext2" + i)
          .on("dblclick", () => { changedate2(datearr[i], i) })
          .on("mouseover", MouseOverDate)
          .on("mouseout", MouseOutDate)
          .text(datearr[i].slice(11))

        singleText.append("div")
          .style("display", "block")
          .style("word-wrap", "break-word")
          .append("text")
          .attr("id", "ta" + i)
          .on("dblclick", () => { deleteText(datearr[i], i) })
          .on("mouseover", MouseOverText)
          .on("mouseout", MouseOutText)
          .text(TextandDate[datearr[i]])
        singleText.append("hr") //分隔符
          .attr("id", "hr" + i)
      }

      var div2 = textarea.append("div")
        .attr("class", "tooltip1")
        .style("opacity", 0);
      var div1 = textarea.append("div")
        .attr("class", "tooltip2")
        .style("opacity", 0);

      function MouseOutText() {
        div1.transition()
          .duration(500)
          .style("opacity", 0);
      }

      function MouseOverText() {
        div1.transition()
          .duration(200)
          .style("opacity", .9);
        div1.html("Double click to delete the caption")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      }

      function MouseOverDate() {
        div2.transition()
          .duration(200)
          .style("opacity", .9);
        div2.html("Double click to change the duration")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      }

      function MouseOutDate() {
        div2.transition()
          .duration(500)
          .style("opacity", 0);
      }

      function changedate2(datestr, idx) {
        div2.style("opacity", 0);	//悬浮框立刻消失
        let htmlstring = d3.select("#dttext2" + idx)._groups[0][0].innerHTML
        // htmlstring = htmlstring.slice(2)
        // d3.select("#dt2"+idx)._groups[0][0].innerHTML = "2136251321"

        // let top = d3.select("#dt2"+idx)._groups[0][0].offsetTop
        // let left = d3.select("#dt2"+idx)._groups[0][0].offsetLeft
        // let width = d3.select("#dt2"+idx)._groups[0][0].offsetWidth
        // let height = d3.select("#dt2"+idx)._groups[0][0].offsetHeight
        let begindatehtmlstring = d3.select("#dt1" + idx)._groups[0][0].innerHTML.slice(6)  //开始时间的date string

        let inputdate = d3.select("#dt2" + idx).append("div")
          .attr("id", "#dtdiv2" + idx) //div的id
          .style("position", "absolute")
          .style("left", 0)
          .style("top", 0)
          .append("input")
          .attr("id", "#dtinput2" + idx) //div的id
          .attr("type", "date")
          .attr("date-date-format", "YYYY-MM-DD")
          // .attr("pattern","[0-9]{4}-[0-9]{2}-[0-9]{2}")
          // .attr("value", htmlstring.slice(8,10) + "-" +htmlstring.slice(5,7)+ "-" +htmlstring.slice(0,4 ))
          .attr("value", htmlstring.slice(0, 4) + "-" + htmlstring.slice(5, 7) + "-" + htmlstring.slice(8, 10))
          .attr("min", begindatehtmlstring.slice(0, 4) + "-" + begindatehtmlstring.slice(5, 7) + "-" + begindatehtmlstring.slice(8, 10)) //最小值
          .attr("max", "2019-05-30") //指定最晚日期
          .on("blur", inputdateBlur)

        document.getElementById("#dtinput2" + idx).focus()  //立马focus

        function inputdateBlur() { //删除input框
          // console.log(TextandDate)
          // console.log(this.value)
          document.getElementById("#dtinput2" + idx).remove() //删除输入框 
          document.getElementById("#dtdiv2" + idx).remove()

          let changestrformat = this.value.replace("-", "/");  //改变样式
          changestrformat = changestrformat.replace("-", "/")

          //目前为止: changestrformat包含着当前的输入日期；datestr 包含着是开始时间-结束时间； TextandDate是一个对象，key是"开始时间-结束时间",value是要显示的文本   datearr包含所有的key
          //总的逻辑是这样：1、输入的时间不能小于当前开始时间，不得迟于总的结束时间和下一次的开始时间。
          // console.log(datestr)
          // console.log(TextandDate[datestr])
          // console.log(datearr)

          let endDate = "2019/05/30"
          let datearr = Object.keys(TextandDate)
          let len = datearr.length
          let pos = datearr.indexOf(datestr)

          // console.log(datestr)
          // console.log(pos)
          // console.log(changestrformat)
          // console.log(changestrformat ,datestr.slice(0,10))

          if (changestrformat < datestr.slice(0, 10)) {  //输入的值比之前日期小
            changestrformat = datestr.slice(0, 10)
            d3.select("#dttext2" + idx).text(datestr.slice(0, 10))
          } else if (pos === len - 1) { //最后一个位置，那么就要控制它小于最大日期
            if (changestrformat > endDate) {
              changestrformat = endDate
            }
            let tmp1 = datestr.slice(0, 10) + "-" + changestrformat
            let tmp2 = TextandDate[datestr]
            delete TextandDate[datestr]
            TextandDate[tmp1] = tmp2      //改变数组
            d3.select("#dttext2" + idx).text(changestrformat)
          } else {
            let tmpmaxdate = Object.keys(TextandDate)[pos + 1].slice(0, 10)  //下一个位置的日期
            if (changestrformat > tmpmaxdate) {
              changestrformat = tmpmaxdate
            }
            let tmp1 = datestr.slice(0, 10) + "-" + changestrformat
            let tmp2 = TextandDate[datestr]
            // console.log(datestr)
            // console.log(tmp1)
            delete TextandDate[datestr]
            TextandDate[tmp1] = tmp2      //改变数组
            d3.select("#dttext2" + idx).text(changestrformat)
          }
          //排序操作
          datearr = Object.keys(TextandDate).sort()
          var tmpobj = {}
          for (let i = 0, len = datearr.length; i < len; i++) {
            tmpobj[datearr[i]] = TextandDate[datearr[i]]
          }
          TextandDate = tmpobj

          updateshowTextArea()
          console.log(TextandDate)
        }
      }

      function deleteText(datestr, idx) {
        // console.log(datestr)
        // console.log(idx)
        div1.style("opacity", 0);	//悬浮框立刻消失

        delete TextandDate[datestr] //删除数据
        // console.log(TextandDate)

        //删除对应的dom元素
        d3.select("#dt1" + idx).remove()
        d3.select("#dt2" + idx).remove()
        d3.select("#ta" + idx).remove()
        d3.select("#hr" + idx).remove()
        d3.select("#singleTextArea" + idx).remove()
        // this.remove() //删除这个dom元素
      }

      // textsvg.append("text").text("sdfasdfa")
    }

    function changeText() { //改变文本的时候，必须暂停所有
      if (buttonPlay === true) {
        buttonClickedHandler()
      }
      else {     //当自动暂停的时候，改成永久暂停，必须手动点击开始按钮，才重新开始
        if (timeout != null) {
          clearTimeout(timeout)
        }
      }
      // d3.select("#mytext").remove() //删除文字，添加文本框
      d3.select("#mytextforeignObject").remove() //删除文字，添加文本框\
      let textArea = createInput()  //创建一个输入框。输入结束后的处理也在这个函数里面
    }

    //******************************************************************************************************** */
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
      .style("width", "410");
    let pivotLines = rightAsideSvg.append("g");
    let showPathIconG = rightAsideSvg.append("g");
    let hightlightColoredBubbleG = rightAsideSvg.append("g");

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
    let showPathIcon = showPathIconG
      .append("image")
      .attr("height", "35px")
      .attr("width", "35px")
      .attr("xlink:href", "public/icon/path_OFF.png")
      .style("transform", `translate(15px,${height + 105}px)`)
      .style("cursor", "pointer")
      .style("display", "none");
    let hightlightColoredBubbleIcon = hightlightColoredBubbleG
      .append("image")
      .attr("height", "35px")
      .attr("width", "35px")
      .attr("xlink:href", "public/data/bubble/off_icon.png")
      .style("transform", `translate(65px,${height + 103}px)`)
      .style("cursor", "pointer");

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

    function drawRightBottomLeg(svg, height) {
      let trendLegend = svg.append("g");
      let maxRadius = 20, minRadius = 8; //8 11 14 17 20

      // gray
      trendLegend
        .append("circle")
        .attr("cx", rightAsidePivotFromLeft)
        .attr("cy", height + maxRadius)
        .attr("r", minRadius)
        .attr("fill", "#b2b2b2")
        .attr("style", "fill-opacity:1;");

      trendLegend
        .append("circle")
        .attr("cx", rightAsidePivotFromLeft + 8 + 11)
        .attr("cy", height + maxRadius)
        .attr("r", 11)
        .attr("fill", "#b2b2b2")
        .attr("style", "fill-opacity:1;");
      trendLegend
        .append("circle")
        .attr("cx", rightAsidePivotFromLeft - 8 - 11)
        .attr("cy", height + maxRadius)
        .attr("r", 11)
        .attr("fill", "#b2b2b2")
        .attr("style", "fill-opacity:1;");
      //red
      trendLegend
        .append("circle")
        .attr("cx", rightAsidePivotFromLeft + 8 + 11 * 2 + 14)
        .attr("cy", height + maxRadius)
        .attr("r", 14)
        .attr("fill", "#f1706f")
        .attr("style", "fill-opacity:1;")
      trendLegend
        .append("circle")
        .attr("cx", rightAsidePivotFromLeft + 8 + 11 * 2 + 14 * 2 + 17)
        .attr("cy", height + maxRadius)
        .attr("r", 17)
        .attr("fill", "#f1706f")
        .attr("style", "fill-opacity:1;")
      trendLegend
        .append("circle")
        .attr("cx", rightAsidePivotFromLeft + 8 + 11 * 2 + 14 * 2 + 17 * 2 + 20)
        .attr("cy", height + maxRadius)
        .attr("r", 20)
        .attr("fill", "#f1706f")
        .attr("style", "fill-opacity:1;")

      // blue
      trendLegend
        .append("circle")
        .attr("cx", rightAsidePivotFromLeft - 8 - 11 * 2 - 14)
        .attr("cy", height + maxRadius)
        .attr("r", 14)
        .attr("fill", "#76a6ca")
        .attr("style", "fill-opacity:1;")
      trendLegend
        .append("circle")
        .attr("cx", rightAsidePivotFromLeft - 8 - 11 * 2 - 14 * 2 - 17)
        .attr("cy", height + maxRadius)
        .attr("r", 17)
        .attr("fill", "#76a6ca")
        .attr("style", "fill-opacity:1;")
      trendLegend
        .append("circle")
        .attr("cx", rightAsidePivotFromLeft - 8 - 11 * 2 - 14 * 2 - 17 * 2 - 20)
        .attr("cy", height + maxRadius)
        .attr("r", 20)
        .attr("fill", "#76a6ca")
        .attr("style", "fill-opacity:1;")
    }


    drawRightLeg(rightAsideSvg, 12);
    drawRightBottomLeg(rightAsideSvg, svgHeight - 45);
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
    let levelGraph = createLevelGraph();

    var monthText = svg
      .append("g")
      .append("text")
      .attr("x", margin.left + 60)
      .attr("y", margin.top + 120)
      .attr("class", "monthText");
    // Add a dot per state. Initialize the data at 1950, and set the colors.
    let startDate = new Date(2016, 0);
    let limitDate = new Date(2019, 4, 30, 23, 59, 59);
    // let StopDate = limitDate
    //console.log(limitDate)
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
      .attr("xlink:href", `public/data/bubble/${buttonPlay ? "play" : "pause"}.svg`)
      .attr(
        "transform",
        `translate(${margin.left - buttonSize + buttonXOffset},${margin.top +
        height +
        videoYOffset + 30 + 25})`
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

    var levelPath = levelGraph.selectAll("path");

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

    //调整字体大小功能
    let option_fontSize = options.append("div")
      .style("padding-left", "30px")
      .style("margin-top", "5px");
    option_fontSize.append("img")
      .attr("src", "public/icon/BubbleFont.png")
      .attr("height", "25px")
      .attr("width", "25px")
      .style("margin-left", "20px")
      .on("mouseover", () => {
        div3.transition()
          .duration(200)
          .style("opacity", .9);
        div3.html("You can point the mouse on the bubble and adjust the bubble size by scrolling the mouse even while the bubble charts play automatically")
          .style("width", "400px")
          .style("height", "98px")
          .style("left", (d3.event.pageX - 400) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", () => {
        div3.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .style("transform", `translate(0px,5px)`);
    let option_fontSize_input = option_fontSize.append("input")
      .attr("type", "range")
      .attr("min", 10)
      .attr("max", 27)
      .attr("value", 20)
      .attr("class", "undisabled")
      .style("display", "inline")
      .style("margin-left", "10px")
      .style("transform", `translate(0,-6px)`);
    option_fontSize.append("i")
      .attr("class", "cil-text-size")
      .style("font-size", "30px")
      .style("display", "inline-block")
      .style("transform", `translate(0px,3px)`)
      .style("margin-left", "10px");
    function bubbleFontSizeChangeHandler() {
      text.style("font-size", option_fontSize_input.property("value"));
    }

    // 调整caption字体大小
    let option_captionfontSize = options.append("div")
      .style("padding-left", "30px")
      .style("margin-top", "5px");
    option_captionfontSize.append("img")
      .attr("src", "public/icon/caption.png")
      .attr("height", "30px")
      .attr("width", "30px")
      .style("margin-left", "18px")
      .style("transform", `translate(0px,8px)`);
    let option_captionfontSize_input = option_captionfontSize.append("input")
      .attr("type", "range")
      .attr("min", 14)
      .attr("max", 23)
      .attr("value", 20)
      .attr("class", "undisabled")
      .style("display", "inline")
      .style("margin-left", "7px")
      .style("transform", `translate(0,-4px)`);
    option_captionfontSize.append("i")
      .attr("class", "cil-text-size")
      .style("font-size", "30px")
      .style("display", "inline-block")
      .style("transform", `translate(0px,5px)`)
      .style("margin-left", "10px");
    function captionFontSizeChangeHandler() {
      captionfontSize = option_captionfontSize_input.property("value");
      document.getElementById("mytextforeignObject").style.fontSize = captionfontSize;
    }

    //视频时间设置
    let totalTime = 120000;
    let option_totalTime = options.append("div")
      .style("margin-top", "14px")
      .style("padding-left", "5px")
      .style("border-bottom", "dashed 1px #e6e6e6");
    option_totalTime.append("i")
      .attr("class", "cil-clock")
      .style("display", "inline-block")
      .style("font-size", "24px")
      .style("transform", `translate(0,3px)`)
      .style("margin-left", "46px");
    let option_totalTime_input = option_totalTime.append("input")
      .attr("id", "option_totalTime")
      .attr("type", "range")
      .attr("min", "60000")
      .attr("max", "240000")
      .attr("step", "10000")
      .attr("class", "undisabled")
      .style("margin-left", "10px")
      .style("transform", `translate(0,-4px)`);
    document.getElementById("option_totalTime").value = 120000;
    let option_totalTime_button = option_totalTime.append("input")
      .attr("type", "button")
      .attr("value", "Apply")
      .style("border-radius", "5px")
      .style("margin-left", "4px");
    let option_totalTime_label = option_totalTime.append("label")
      .html("2 minutes")
      .attr("for", "option_totalTime")
      .style("display", "block")
      .style("margin-left", "30px");
    function totalTimeInputHandler() {
      let __totalTime = option_totalTime_input.property("value")
      option_totalTime_label.html(msToMinute(__totalTime));
    }
    function msToMinute(ms) {
      let sec = ms / 1000;
      let min = Math.floor(sec / 60);
      sec = sec - min * 60;
      if (sec < 0) {
        sec = 0;
      }
      if (sec == 0) {//如果没有秒数,只显示分钟
        if (min == 1) {//分钟个位时单词没有复数形式
          return `${min} minute`;
        } else {
          return `${min} minutes`;
        }
      } else {//有秒数剩余,显示分钟和秒数
        if (min == 1) {//分钟个位时单词没有复数形式
          if (sec == 1) {//如果秒数为1,单词没有复数形式
            return `${min} min ${sec} sec`;
          } else {
            return `${min} min ${sec} secs`;
          }
        } else {
          if (sec == 1) {//如果秒数为1,单词没有复数形式
            return `${min} mins ${sec} sec`;
          } else {
            return `${min} mins ${sec} secs`;
          }
        }
      }
    }
    function totalTimeButtonClickedHandler() {
      //console.log("clicked");
      let __totalTime = option_totalTime_input.property("value");
      if (window.confirm(`Change totaltime to ${msToMinute(__totalTime)} ?`)) {
        //console.log("confirmed!");
        applyNewTotaltime(__totalTime);
      }
    }
    function applyNewTotaltime(__totalTime) {
      totalTime = __totalTime;
      //console.log("Totaltime updated to: " + __totalTime);
      dateScale = d3
        .scaleTime()
        .domain([startDate, endDate])
        .range([0, totalTime]);
      anchorScale = d3
        .scaleLinear()
        .domain([0, width])
        .range([0, totalTime]);
      //let { ... lifeCycleGradient } = calcLifeCycle(labelSet);
      //renderDownsideWithLifeCycle(lifeCycleGradient);
      initTime();
      buttonClickedHandler();
      setTimeout(() => {
        buttonPlay = false;
        button.attr("xlink:href", `public/data/bubble/pause.svg`);
        stopTime();
        window.alert("Totaltime reset!")
      }, 1);
      //startTime(easeFunc, totalTime, totalTime, dateScale);
    }

    function getMaxHighlightBubbles() {
      let max_story_everyMonth = [];
      let max_topic_everyMonth = [];
      let totalMonth = dataArray[0].value.length;
      let selectedLabel = getSelectedLabel();
      if (selectedLabel.length) {
        let selectedLabelDataArray;
        selectedLabelDataArray = dataArray.filter((d) => getSelectedLabel().includes(d.label.substr(1)));
        //以下两个for循环找到已选择话题各个月的max_story并push至max_story_everyMonth
        for (let i = 0; i < totalMonth; i++) {
          let tempArray = [];
          for (let j = 0; j < selectedLabelDataArray.length; j++) {
            tempArray.push(selectedLabelDataArray[j].value[i][3]);
          }
          max_story_everyMonth.push(Math.max(...tempArray));
        }
        //以下循环根据每个月的max_story找出当月level等于max_story的话题数量并push至max_topic_everyMonth(max_story=0时push显示在屏幕上的且被选择的话题数量)
        for (let i = 0; i < totalMonth; i++) {
          let counter = 0;
          for (let j = 0; j < selectedLabelDataArray.length; j++) {
            if (max_story_everyMonth[i] == 0) {
              if (selectedLabelDataArray[j].value[i][1] >= 50 || selectedLabelDataArray[j].value[i][2] >= 500) {
                counter = counter + 1;
              }
            } else {
              if (selectedLabelDataArray[j].value[i][3] == max_story_everyMonth[i]) {
                counter = counter + 1;
              }
            }
          }
          max_topic_everyMonth.push(counter);
        }
        return Math.max(...max_topic_everyMonth);
      } else {
        //以下两个for循环找到各个月的max_story并push至max_story_everyMonth
        for (let i = 0; i < totalMonth; i++) {
          let tempArray = [];
          for (let j = 0; j < dataArray.length; j++) {
            tempArray.push(dataArray[j].value[i][3]);
          }
          max_story_everyMonth.push(Math.max(...tempArray));
        }
        //以下循环根据每个月的max_story找出当月level等于max_story的话题数量并push至max_topic_everyMonth（max_story=0时将push 0）
        for (let i = 0; i < totalMonth; i++) {
          let counter = 0;
          for (let j = 0; j < dataArray.length; j++) {
            if (dataArray[j].value[i][3] != 0 && dataArray[j].value[i][3] == max_story_everyMonth[i]) {
              counter = counter + 1;
            }
          }
          max_topic_everyMonth.push(counter);
        }
        return Math.max(...max_topic_everyMonth);
      }
    }

    //暂停相关设置
    let option_pauseSetting = options.append("div")
      .style("overflow-y", "scroll");
    let enablePause = true;
    let threshhold = 4;
    let maxHighlightBubbles = getMaxHighlightBubbles();
    let pauseTimeFactor = 0.6;//设置一个可调节的影响暂停时间的因子,这里不是0.5是0.6是因为开始的时候并没有对滑块进行任何操作
    option_pauseSetting.append("div")
      .text("Auto Pause")
      .style("text-align", "center")
      .style("font-size", "18px")
      .style("font-weight", "600")
      .style("padding-top", "15px")
      .style("color", "#565656");
    let option_pauseSetting_content = option_pauseSetting.append("div")
      .attr("id", "option_pauseSetting_content")
      .style("display", "grid")
      .style("grid-template-columns", "50% 1fr")
      .style("padding-top", "13px");
    let option_pauseSetting_content_left = option_pauseSetting_content
      .append("div")//暂停功能内容grid布局的左边部分
      .style("transform", "translate(30px, 0px)")
      .style("width", "100%")
      .style("text-align", "center");
    let option_pauseSetting_content_right = option_pauseSetting_content.append("div").style("margin-top", "5px");//暂停功能内容grid布局的右边部分
    let option_pauseSetting_enablePause_icon = option_pauseSetting_content_left.append("img")
      .attr("src", "public/icon/autopause_ON.png")
      .attr("width", "50px")
      .attr("height", "50px")
      .style("cursor", "pointer");
    let option_pauseSetting_enablePause = option_pauseSetting_content_left.append("input")
      .attr("type", "checkbox")
      .attr("id", "enablePause_input")
      .attr("checked", true)
      .style("display", "none");
    let option_pauseSetting_enablePause_label = option_pauseSetting_content_left.append("label")
      .html("ON")
      .attr("for", "enablePause_input")
      .attr("id", "enablePause")
      .style("font-family", "Helvetica")
      .style("display", "block")
      .style("text-align", "center")
      .style("width", "50%")
      .style("margin", "auto");
    let option_pauseSetting_threshhold = option_pauseSetting_content_left.append("div")
      .attr("class", "option_pauseSetting_threshhold")
      .style("width", "40%")
      .style("text-align", "center")
      .style("margin", "auto")
      .style("margin-top", "10px")
      .style("padding-top", "5px")
      .style("padding-bottom", "5px")
      .style("border", "2px solid gray")
      .style("border-radius", "5px");
    option_pauseSetting_threshhold.append("p")
      .style("width", "150px")
      .text("MINIMUM COLORED BUBBLES")
      .style("display", "inline")
      .style("margin", "0");
    let option_pauseSetting_input = option_pauseSetting_threshhold.append("input")
      .attr("id", "option_pauseSetting_input")
      .attr("value", "4")
      .attr("min", "2")
      .attr("max", `${maxHighlightBubbles}`)
      .attr("step", 1)
      .style("color", "black")
      .style("border-style", "none")
      .style("border-bottom", "2px solid black")
      .style("font-size", "30px")
      .style("width", "50px")
      .style("height", "35px")
      .style("text-align", "center")
      .style("margin", "auto");
    option_pauseSetting_content_right.append("p")
      .text("Long Pause")
      .style("width", "100px")
      .style("font-weight", "bold")
      .style("margin-top", "0")
      .style("margin-left", "5px")
      .style("margin-bottom", "0");
    let option_pauseSetting_timePauseFactor = option_pauseSetting_content_right.append("input")
      .attr("id", "option_pauseSetting_timePauseFactor")
      .attr("type", "range")
      .attr("min", "0.1")
      .attr("max", "1.0")
      .attr("step", "0.01")
      .attr("class", "undisabled")
      .style("transform", "rotate(90deg) translate(0px, 30px)")
      .style("margin-top", "65px")
      .style("margin-bottom", "65px");
    option_pauseSetting_content_right.append("p")
      .text("Brief Pause")
      .style("width", "100px")
      .style("font-weight", "bold")
      .style("margin-left", "5px")
      .style("margin-top", "0");
    document.getElementById("option_pauseSetting_timePauseFactor").value = 0.5;//d3好像改不了input中type为range的value,所以只能用原生来改(1.1-0.6=0.5)
    let option_pauseSetting_msg = option_pauseSetting.append("p")
      .text("(Pause function requires at least TWO hashtags to be selected.)")
      .style("padding", "0 20px")
      .style("text-align", "center")
      .style("display", "none");
    function enablePauseCheckedHandler() {
      let maxHighlightBubbles = getMaxHighlightBubbles();
      if (option_pauseSetting_enablePause.checked) {
        option_pauseSetting_enablePause.checked = false;
        option_pauseSetting_enablePause_label.html("ON");
        option_pauseSetting_enablePause_icon.attr("src", "public/icon/autopause_ON.png");
        option_pauseSetting_input
          .attr("disabled", null)
          .style("background-color", "white");
        option_pauseSetting_timePauseFactor.attr("disabled", null)
          .classed("disabled", null)
          .classed("undisabled", "true");
        option_pauseSetting_content_right.style("color", "black");
        if (maxHighlightBubbles <= 2) {
          option_pauseSetting_msg.style("display", "block");
        }
        enablePause = true;
      } else {
        option_pauseSetting_enablePause.checked = true;
        option_pauseSetting_enablePause_label.html("OFF");
        option_pauseSetting_enablePause_icon.attr("src", "public/icon/autopause_OFF.png");
        option_pauseSetting_input
          .attr("disabled", "true")
          .style("background-color", "rgb(225,228,228 )");
        option_pauseSetting_timePauseFactor.attr("disabled", "true")
          .classed("undisabled", null)
          .classed("disabled", "true");
        option_pauseSetting_content_right.style("color", "grey");
        option_pauseSetting_msg.style("display", "none");
        enablePause = false;
      }
    }
    function threshholdChangedHandler() {
      let inputNumber = Number(option_pauseSetting_input.property("value"));
      if (inputNumber < 2) {
        document.getElementById("option_pauseSetting_input").value = 2;
        threshhold = 2;
      } else if (inputNumber >= 2) {
        threshhold = option_pauseSetting_input.property("value");
      } else {
        threshhold = 4;
      }
    }
    function threshholdInputHandler() {
      let inputNumber = Number(option_pauseSetting_input.property("value"));
      if (inputNumber > maxHighlightBubbles) {
        document.getElementById("option_pauseSetting_input").value = maxHighlightBubbles;
      }
    }
    function pauseTimeFactorInputHandler() {
      let factor = option_pauseSetting_timePauseFactor.property('value');
      pauseTimeFactor = 1.1 - factor;//由于用户直观上会认为大的factor会更快,所以实际赋值对factor做一个颠倒(factor的范围为0.1~1)
    }

    //滑条JS
    $('input[type=range]').wrap("<div class='range'></div>");
    var i = 1;

    $('.range').each(function () {
      this.id = 'range' + i;
      if (this.getElementsByTagName('input')[0].value == 0) {
        this.className = "range"
      } else {
        this.className = "range rangeM"
      }
      i++
    });

    //显示气泡路径开关
    let option_showPast = options.append("div")
      .style("display", "none");
    option_showPast.append('p')//界面改动,这里影藏掉了但是功能保留,请勿删除
      .text("Show bubble path: ")
      .style("font-weight", "bold")
      .style("display", "none");
    let option_showPast_input = option_showPast.append("input")//界面改动,这里影藏掉了但是功能保留,请勿删除
      .attr("type", "checkbox")
      .attr("class", "squared")
      .attr("id", "showPast_input")
      .style("display", "none");
    option_showPast.append("label")//界面改动,这里影藏掉了但是功能保留,请勿删除
      .html("Enable")
      .attr("for", "showPast_input")
      .attr("id", "showPast")
      .style("font-family", "Helvetica")
      .style("display", "none");

    //突出显示彩色气泡开关
    let option_highlightColoredBubbles = options.append("div")//由于布局变动,此处隐藏,但功能保留,请勿删除
      .style("display", "none");
    let highlightColoredBubble = false;
    option_highlightColoredBubbles.append("p")
      .text("Highlight Colored Bubbles: ")
      .style("font-weight", "bold");
    let option_highlightColoredBubbles_input = option_highlightColoredBubbles.append("input")
      .attr("type", "checkbox")
      .attr("class", "squared")
      .attr("id", "enableHighlightColoredBubbles_input");
    option_highlightColoredBubbles.append("label")
      .html("Enable")
      .attr("for", "enableHighlightColoredBubbles_input")
      .attr("id", "enableHighlightColoredBubbles")
      .style("font-family", "Helvetica");
    function enableHighlightColoredBubblesHandler() {
      if (this.checked) {
        highlightColoredBubble = true;
        let selectedLabel = getSelectedLabel();
        updateMask(selectedLabel);
      } else {
        highlightColoredBubble = false;
        let selectedLabel = getSelectedLabel();
        updateMask(selectedLabel);
      }
    }
    function hightlightColoredBubbleIconClickHandler() {
      let hightlightColoredBubblesCheckbox = document.getElementById("enableHighlightColoredBubbles_input");
      if (hightlightColoredBubblesCheckbox.checked) {
        hightlightColoredBubbleIcon.attr("xlink:href", "public/data/bubble/off_icon.png")
      } else {
        hightlightColoredBubbleIcon.attr("xlink:href", "public/data/bubble/on_icon.png")
      }
      hightlightColoredBubblesCheckbox.click();
    }

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
    const durationTime = 500;
    let easeFunc = d3.easeLinear;

    let dateScale = d3
      .scaleTime()
      .domain([startDate, endDate])
      .range([0, totalTime]);
    let anchorScale = d3
      .scaleLinear()
      .domain([0, width])
      .range([0, totalTime]);

    let { lifeCycle, lifeCycleGradient } = calcLifeCycle(labelSet);
    //console.log(lifeCycle);
    // console.log(lifeCycleGradient)
    let showupLifeCycle = calcShowup(lifeCycle);
    renderDownsideWithLifeCycle(lifeCycleGradient);
    // console.log(lifeCycleGradient)
    initTime();
    startTime(easeFunc, totalTime, totalTime, dateScale);
    //disableCursor();

    let checkboxs = d3.selectAll("div.labelRow input");
    let checkAll = d3.selectAll("input.input-all");
    let checkboxLabels = d3.selectAll("div.labelRow label");

    // 绑定监听 Binding bubbles monitoring 
    option_totalTime_input.on("input", totalTimeInputHandler);
    option_totalTime_button.on("click", totalTimeButtonClickedHandler);
    option_showPast_input.on("change", showPastCheckedHandler);
    showPathIcon.on("click", showPastIconClickHandler);
    option_fontSize_input.on("input", bubbleFontSizeChangeHandler);
    option_captionfontSize_input.on("input", captionFontSizeChangeHandler);
    option_pauseSetting_enablePause_icon.on("click", enablePauseCheckedHandler);
    option_pauseSetting_enablePause.on("change", enablePauseCheckedHandler);
    option_pauseSetting_input.on("change", threshholdChangedHandler);
    option_pauseSetting_input.on("input", threshholdInputHandler);
    option_pauseSetting_timePauseFactor.on("input", pauseTimeFactorInputHandler);
    option_highlightColoredBubbles_input.on("change", enableHighlightColoredBubblesHandler);
    hightlightColoredBubbleIcon.on("click", hightlightColoredBubbleIconClickHandler);
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
    text.on("wheel", mouseWheelHandler);
    dot.on("mouseover", mouseOverHandler);
    dot.on("mouseout", mouseOutHandler);
    dot.on("wheel", mouseWheelHandler);
    levelPath.on("mouseover", mouseOverHandlerLevelGraph);
    levelPath.on("mouseout", mouseOutHandlerLevelGraph);
    // document.onkeydown = keyDownHandler;
    // document.onkeyup = keyUpHandler;

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
      //console.log(lifeCycleGradient)

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
      let flag = false;
      for (let i = 1, len = data.length; i < len; i += 1) { //没有考虑到remain  和 leave 全为 true的情况
        if (isVisible(data[i]) !== visible) {
          flag = true;
          visible = !visible;
          result.push([data[i].time, visible]);
        }
      }

      if (flag === false) { //全为true 比如 "leave"和"remain"
        result.push([data[data.length - 1].time, false]);
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
            `${lifeCycleOfLabel[i][1] ? "white" : color} ${(dateScale(lifeCycleOfLabel[i][0]) / totalTime) * 100}%`
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
      let currentTime = d3.select(".dot").data()[0].time;
      let [max_story, _] = getMaxStory(currentTime);
      let selectedLabel = getSelectedLabel();
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
        .style("display", function (d) {
          if (
            !isVisible(d) &&
            selectedLabel.findIndex(label => label === d.label.slice(1)) === -1
          ) {
            return "none";
          }
        });

      dot.style("fill", function (d) {
        if (max_story == 0 && selectedLabel.length) {
          return color(d.trend);
        } else if (max_story !== 0) {
          return max_story <= d.story ? color(d.trend) : "#FFFFFF"; //T Highligh:F No Highlight
        }
        else {
          return "#FFFFFF";
        }
      })
        .style("stroke", function (d) {
          if (max_story == 0 && selectedLabel.length) {
            return color(d.trend);
          } else if (max_story !== 0) {
            return max_story <= d.story ? color(d.trend) : "#DCDCDC"; //T Highligh:F No Highlight
            //return color(d.trend); //always highlight
          }
          else {
            return "#DCDCDC";
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

    function calcEarliestTime(selectedLabel) {  //计算最早开始时间

      let earliestTime = 1, latestTime = 0;
      for (let i = 0, len = selectedLabel.length; i < len; i++) {
        let progress = lifeCycleGradient[selectedLabel[i]]  //string类型
        let arr = progress.split(",");  //按照逗号分开，分为很多段，第一段为"to right",第二段第一个如果为white,则第二个为起始位置，否则开始时间就是getTime()。最后一个如果颜色为white，则其为结束为止；否则，结束位置在时间条的最后
        let beginnode = arr[1].split(" ");
        let beginpos
        if (beginnode[0] === "white")
          beginpos = parseFloat(beginnode[1]) * 0.01
        else
          beginpos = 0
        if (beginpos < earliestTime)
          earliestTime = beginpos;  //更新最早开始时间

        let endnode = arr[arr.length - 1].split(" ");
        let endpos
        if (endnode[0] === "white")
          endpos = parseFloat(endnode[1]) * 0.01
        else
          endpos = 1
        if (endpos > latestTime)
          latestTime = endpos
      }
      return { earliestTime, latestTime }
    }

    function differenceOf2Arrays(array1, array2) {
      var temp = [];
      array1 = array1.toString().split(',').map(String);
      array2 = array2.toString().split(',').map(String);

      for (var i in array1) {
        if (array2.indexOf(array1[i]) === -1) temp.push(array1[i]);
      }
      for (i in array2) {
        if (array1.indexOf(array2[i]) === -1) temp.push(array2[i]);
      }
      return temp.sort((a, b) => a - b);
    }

    let selectedLabelHis = [];
    let needUpdateMaxStory = false;

    function showPastCheckedHandler() {
      let currentTime = getTime();
      let currentDate = dateScale.invert(currentTime);
      updateTraj(currentDate);
    }

    function showPastIconClickHandler() {
      if (getSelectedLabel().length) {
        let showPast_Input = document.getElementById("showPast_input");
        showPast_Input.click();
        if (showPast_Input.checked) {
          showPathIcon.attr("xlink:href", "public/icon/path_ON.png")
        } else {
          showPathIcon.attr("xlink:href", "public/icon/path_OFF.png")
        }
      } else {
        window.alert("Please select topic first.")
      }
    }

    function checkedHandler() {
      needUpdateMaxStory = true;
      maxHighlightBubbles = getMaxHighlightBubbles();

      let selectedLabel = getSelectedLabel();
      let selectingLabel;
      let needHighlight;

      if (selectedLabel.length) {
        //选择话题时显示展示路径勾选项
        showPathIcon.style("display", "inline");
        document.getElementById("hashTagTimelineMsg").style.display = "none";

        //选择话题时隐藏Highlight Colored Bubbles选项
        hightlightColoredBubbleIcon.style('display', 'none');

        if (selectedLabel.length < 2) {//选择的话题小于2,隐藏暂停功能并显示提示信息
          document.getElementById("option_pauseSetting_input").value = 2;
          threshhold = 2;
          option_pauseSetting_msg
            .text("(Pause function requires at least TWO hashtags to be selected.)")
            .style("display", "block");
          document.getElementById("option_pauseSetting_content").style.display = "none";
        } else if (maxHighlightBubbles == 1) {//选择的话题数量满足2个,但是这些话题没有交集(无法暂停),禁用调整,显示提示信息
          document.getElementById("option_pauseSetting_content").style.display = "grid";
          document.getElementById("option_pauseSetting_input").value = 2;
          document.getElementById("option_pauseSetting_input").disabled = true;
          threshhold = 2;
          option_pauseSetting_msg
            .style("display", "block")
            .text("(Minimum Colored Bubbles can be set when there are more than TWO colored bubbles in the same month.)");
        } else if (maxHighlightBubbles == 2) {//选择的话题数量满足2个,这些话题最多只有两个有交集,禁用调整,显示提示信息
          document.getElementById("option_pauseSetting_input").value = maxHighlightBubbles;
          document.getElementById("option_pauseSetting_input").disabled = true;
          threshhold = 2;
          option_pauseSetting_msg
            .style("display", "block")
            .text("(Minimum Colored Bubbles can be set when there are more than TWO colored bubbles in the same month.)");
          document.getElementById("option_pauseSetting_content").style.display = "grid";
        } else {//选择的话题数量满足2个,并且至少有3个话题有交集,启用调整,隐藏提示信息
          document.getElementById("option_pauseSetting_input").value = maxHighlightBubbles;
          document.getElementById("option_pauseSetting_input").disabled = false;
          threshhold = maxHighlightBubbles;
          option_pauseSetting_msg.style("display", "none");
          document.getElementById("option_pauseSetting_content").style.display = "grid";
        }
      } else {
        //没有选择任何话题时隐藏展示路劲设置
        showPathIcon.style("display", "none");
        document.getElementById("hashTagTimelineMsg").style.display = "block";

        //没有选择任何话题时展示Highlight Colored Bubbles选项
        hightlightColoredBubbleIcon.style('display', 'inline');

        document.getElementById("option_pauseSetting_input").value = 4;
        document.getElementById("option_pauseSetting_input").disabled = false;
        threshhold = 4;
        option_pauseSetting_msg.style("display", "none");
        document.getElementById("option_pauseSetting_content").style.display = "grid";
      }

      if (selectedLabelHis.length == 0) {
        selectingLabel = selectedLabel[0];
        selectedLabelHis = selectedLabel;
        needHighlight = true;
      } else {
        selectingLabel = differenceOf2Arrays(selectedLabelHis, selectedLabel)[0];
        if (selectedLabelHis.length < selectedLabel.length) {
          needHighlight = true;
        } else {
          needHighlight = false;
        }
        selectedLabelHis = selectedLabel;
      }
      if (needHighlight) {
        highlightLevelLine(selectingLabel);
      } else {
        cancelHightlightLevelLine(selectingLabel);
      }

      let currentTime = getTime();
      // console.log(currentTime)
      //改变currentTime为selectedLabel中最早出现的那个时刻！！
      //包含的时序数据全部在lifeCycleGradient中
      let { earliestTime, latestTime } = calcEarliestTime(selectedLabel)  //最早开始时间，最迟结束时间的百分比,
      if (selectedLabelHis.length == 0) {
        earliestTime = 0;
        latestTime = 1
      }
      //console.log(earliestTime) //输出百分比

      // let offset = parseFloat(d3.select(".video-slider").attr("x")); //仿照上面的，不知道是否必要
      currentTime = earliestTime * totalTime
      let endTime = latestTime * totalTime //- offset
      // console.log(currentTime) //乘以总时间

      limitDate = dateScale.invert(endTime);  //结束时间
      let currentDate = dateScale.invert(currentTime);
      // console.log(currentDate)  //开始时间

      // startDate = currentDate
      // endDate = limitDate

      updateVideoAnchor(currentDate)
      // console.log(currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate()) 没有问题
      monthText.text(currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate()); //更新月份
      setTime(currentTime)

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
      needUpdateMaxStory = true;
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

      // let currentTime = getTime();
      // let currentDate = dateScale.invert(currentTime);
      let selectedLabel = getSelectedLabel();

      maxHighlightBubbles = getMaxHighlightBubbles()

      //**************************************************************************************************** */
      let { earliestTime, latestTime } = calcEarliestTime(selectedLabel)  //最早开始时间，最迟结束时间的百分比,
      if (selectedLabel.length == 0) {
        earliestTime = 0;
        latestTime = 1
      }
      //console.log(earliestTime) //输出百分比

      //let offset = parseFloat(d3.select(".video-slider").attr("x")); //仿照上面的，不知道是否必要
      currentTime = earliestTime * totalTime
      let endTime = latestTime * totalTime //- offset
      // console.log(currentTime) //乘以总时间

      limitDate = dateScale.invert(endTime);  //结束时间
      let currentDate = dateScale.invert(currentTime);
      // console.log(currentDate)  //开始时间

      // startDate = currentDate
      // endDate = limitDate

      updateVideoAnchor(currentDate)
      // console.log(currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate()) 没有问题
      monthText.text(currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1)); //更新月份
      setTime(currentTime)
      //**************************************************************************************************** */
      updateMask(selectedLabel);
      labelSet.forEach(label =>
        updatePast(d3.select(`#input-${label}`), currentDate)
      );

      let selectingLabel;
      let needHighlight;
      if (selectedLabelHis.length == 0) {
        selectingLabel = selectedLabel;
        selectedLabelHis = selectedLabel;
        needHighlight = true;
      } else {
        selectingLabel = differenceOf2Arrays(selectedLabelHis, selectedLabel);
        if (selectedLabelHis.length < selectedLabel.length) {
          needHighlight = true;
        } else {
          needHighlight = false;
        }
        selectedLabelHis = selectedLabel;
      }
      if (needHighlight) {
        for (let index in selectingLabel) {
          highlightLevelLine(selectingLabel[index]);
        }
      } else {
        for (let index in selectingLabel) {
          cancelHightlightLevelLine(selectingLabel[index]);
        }
      }
      if (selectedLabel.length) {
        //有话题被选择时显示展示路径选项
        showPathIcon.style("display", "inline");
        document.getElementById("hashTagTimelineMsg").style.display = "none";

        //有话题被选择时隐藏Highlight Colored Bubbles选项
        hightlightColoredBubbleIcon.style('display', 'none');

        if (selectedLabel.length < 2) {//选择的话题小于2,隐藏暂停功能并显示提示信息
          document.getElementById("option_pauseSetting_input").value = 2;
          threshhold = 2;
          option_pauseSetting_msg
            .text("(Pause function requires at least TWO hashtags to be selected.)")
            .style("display", "block");
          document.getElementById("option_pauseSetting_content").style.display = "none";
        } else if (maxHighlightBubbles == 1) {//选择的话题数量满足2个,但是这些话题没有交集(无法暂停),禁用调整,显示提示信息
          document.getElementById("option_pauseSetting_content").style.display = "grid";
          document.getElementById("option_pauseSetting_input").value = 2;
          document.getElementById("option_pauseSetting_input").disabled = true;
          threshhold = 2;
          option_pauseSetting_msg
            .style("display", "block")
            .text("(Minimum Colored Bubbles can be set when there are more than TWO colored bubbles in the same month.)");
        } else if (maxHighlightBubbles == 2) {//选择的话题数量满足2个,这些话题最多只有两个有交集,禁用调整,显示提示信息
          document.getElementById("option_pauseSetting_input").value = maxHighlightBubbles;
          document.getElementById("option_pauseSetting_input").disabled = true;
          threshhold = 2;
          option_pauseSetting_msg
            .style("display", "block")
            .text("(Minimum Colored Bubbles can be set when there are more than TWO colored bubbles in the same month.)");
          document.getElementById("option_pauseSetting_content").style.display = "grid";
        } else {//选择的话题数量满足2个,并且至少有3个话题有交集,启用调整,隐藏提示信息
          document.getElementById("option_pauseSetting_input").value = maxHighlightBubbles;
          document.getElementById("option_pauseSetting_input").disabled = false;
          threshhold = maxHighlightBubbles;
          option_pauseSetting_msg.style("display", "none");
          document.getElementById("option_pauseSetting_content").style.display = "grid";
        }
      } else {
        //没有任何话题被选择时隐藏展示路劲选项
        showPathIcon.style("display", "none");
        document.getElementById("hashTagTimelineMsg").style.display = "block";

        //没有任何话题被选择时显示Highlight Colored Bubbles选项
        hightlightColoredBubbleIcon.style('display', 'inline');

        document.getElementById("option_pauseSetting_input").value = 4;
        document.getElementById("option_pauseSetting_input").disabled = false;
        threshhold = 4;
        option_pauseSetting_msg.style("display", "none");
        document.getElementById("option_pauseSetting_content").style.display = "grid";
      }
    }

    function stop4aWhile() {
      setTimeout(() => {
        buttonPlay = false;
        button.attr("xlink:href", `public/data/bubble/pause.svg`);
        stopTime();
      }, 100);
    }
    stop4aWhile();

    function buttonClickedHandler() {
      // console.log(getTime())
      if (timeout != null) {
        clearTimeout(timeout)
      }
      buttonPlay = !buttonPlay;
      button.attr(
        "xlink:href",
        d => `public/data/bubble/${buttonPlay ? "play" : "pause"}.svg`
      );
      if (!buttonPlay) {
        stopTime();
        enableCursor();
      } else {  //buttonPlay === true
        if (isAnimationFinished) { //运行结束
          let selectedLabel = getSelectedLabel();
          //***************************************************************************************************** */
          if (selectedLabel.length != 0) {
            let { earliestTime, latestTime } = calcEarliestTime(selectedLabel)  //最早开始时间，最迟结束时间的百分比,

            // let offset = parseFloat(d3.select(".video-slider").attr("x")); //仿照上面的，不知道是否必要
            currentTime = earliestTime * totalTime
            let endTime = latestTime * totalTime //- offset

            limitDate = dateScale.invert(endTime);  //结束时间
            let currentDate = dateScale.invert(currentTime);

            updateVideoAnchor(currentDate)
            // console.log(currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate())
            monthText.text(currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1)); //更新月份
            setTime(currentTime)

            buttonPlay = !buttonPlay;
            button.attr(
              "xlink:href",
              d => `public/data/bubble/pause.svg`
            );
            //***************************************************************************************************** */
          } else {    //运行结束，没有选中任何标签
            resetTime();
            startTime(easeFunc, totalTime, totalTime, dateScale);
            disableCursor();
          }

          isAnimationFinished = false;
        } else {  //没有运行结束
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
      if (timeout != null) {
        clearTimeout(timeout)
      }
      if (isAnimationFinished)
        isAnimationFinished = false
      //let hyperParam = 0;
      stopTime();

      let offset = parseFloat(d3.select(".video-slider").attr("x")) + 410; // 120 + 410
      let minCXPos = offset + anchorScale.domain()[0]; //120
      let maxCXPos = offset + anchorScale.domain()[1]; //1170 = 120 + 1050
      //let currentCXPos = Math.max(minCXPos, d3.event.x + hyperParam);
      let currentCXPos = Math.max(minCXPos, d3.event.x - 20);
      currentCXPos = Math.min(maxCXPos, currentCXPos);

      let anchor = d3.select(".video-anchor");
      anchor.attr("cx", currentCXPos);
      anchortext.attr("x", currentCXPos - 20).attr("opacity", "0");

      let currentTime = anchorScale(currentCXPos - offset);
      setTime(currentTime);

      let currentDate = dateScale.invert(currentTime);
      anchortext.text(currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate())

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
      let currentDate = dateScale.invert(getTime());

      let offset = parseFloat(d3.select(".video-slider").attr("x"));
      let minCXPos = offset + anchorScale.domain()[0];
      let maxCXPos = offset + anchorScale.domain()[1];
      let currentCXPos = Math.max(minCXPos, d3.event.x);
      currentCXPos = Math.min(maxCXPos, currentCXPos);

      anchortext.attr("x", currentCXPos - 20)
      anchortext.text(currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate())
        .attr("opacity", "1")
      button.attr("xlink:href", `public/data/bubble/pause.svg`);
      stopTime();
    }

    function draggedHandler() {
      if (timeout != null) {  //清楚设置的延时
        clearTimeout(timeout)
      }

      let offset = parseFloat(d3.select(".video-slider").attr("x"));
      let minCXPos = offset + anchorScale.domain()[0];
      let maxCXPos = offset + anchorScale.domain()[1];
      let currentCXPos = Math.max(minCXPos, d3.event.x);
      currentCXPos = Math.min(maxCXPos, currentCXPos);

      d3.select(this).attr("cx", currentCXPos);

      let currentTime = anchorScale(currentCXPos - offset);
      // formatTime(currentTime)
      setTime(currentTime);

      //添加一个随anchor移动的文本框，显示日期
      let currentDate = dateScale.invert(currentTime);
      // console.log(currentDate.getFullYear()+ "/" + (currentDate.getMonth() + 1))
      // anchor.
      anchortext.attr("x", currentCXPos - 20)
        .text(currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate())
    }

    function dragendedHandler() {
      anchortext.attr("opacity", "0")
      if (isAnimationFinished)
        isAnimationFinished = false

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
      levelPath
        .attr("opacity", 0.1)
        .attr("stroke-width", "2px");
      highlightLevelLine(label);
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

        d3.select("#chartAside")
          .selectAll("g.axis")
          .selectAll("g.tick")
          .selectAll("text")
          .style("display", "none");
      }
    }

    function mouseOutHandler() {
      let label = d3.select(this).attr("data-label");
      cancelHightlightLevelLine(label);
      let selectedLabel = getSelectedLabel();
      for (let index in selectedLabel) {
        highlightLevelLine(selectedLabel[index]);
      }

      d3.select(`#textDateLabel-${label}`).style("display", "none");

      mouseoverDot = null;

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

    function mouseWheelHandler() {
      d3.event.preventDefault();
      let direction = d3.event.wheelDelta < 0 ? 'down' : 'up';
      let label = d3.select(this).attr("data-label");
      let overText = text.filter((d) => { return d.label.substr(1) == label });
      let fontSize = overText.style("font-size");
      fontSize = Number(fontSize.substring(0, fontSize.length - 2));
      if (fontSize < 27 && direction === "up") {
        fontSize = fontSize + 1;
      } else if (fontSize > 10 && direction === "down") {
        fontSize = fontSize - 1;
      }
      overText.style("font-size", fontSize);
    }

    function mouseOverHandlerLevelGraph() {
      levelPath.attr("opacity", 0.1);
      let label = d3.select(this).attr("id").substr(16);
      highlightLevelLine(label);
      d3.select("#highlightTopic")
        .text(`#${label}`)
        .attr("fill", function () {
          switch (classifyTopic(label)) {
            case 0:
              return "rgb(27, 106, 165)";
            case 1:
              return "#b2b2b2";
            case 2:
              return "rgb(232, 17, 15)";
          }
        });
    }

    function mouseOutHandlerLevelGraph() {
      let selectedLabel = getSelectedLabel();
      if (!selectedLabel) {
        levelPath.attr("opacity", 0.3);
      }
      let label = d3.select(this).attr("id").substr(16);
      cancelHightlightLevelLine(label);
      for (let index in selectedLabel) {
        highlightLevelLine(selectedLabel[index]);
      }
      d3.select("#highlightTopic")
        .text("");
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
      let selectedLabel = getSelectedLabel();
      if (maxStory.length == 0 || needUpdateMaxStory) { //find maximum story levels
        maxStory = [];
        let timeline = generateTimeline(dataArray);
        let selectedLabelDataArray;
        if (selectedLabel.length != 0) {
          selectedLabelDataArray = dataArray.filter((d) => getSelectedLabel().includes(d.label.substr(1)));
        } else {
          selectedLabelDataArray = dataArray;
        }
        for (date of timeline) {
          // row --> [date, cx, cy, trend]
          //let date = row[0]
          let tmp = []
          for (data of selectedLabelDataArray) { //select all hashtag
            let value = data.value;
            let index = bisect.left(value, date);
            let now = value[index];
            // now -> [date, cx, cy, story]
            tmp.push(now[3]); // push all story leves from all hastags				
          }
          story = Math.max(...tmp) // get maximum story
          maxStory.push([date, story]); //date format, number of maximum story
        }
        needUpdateMaxStory = false;
      }
      let index = 0;
      let max_story = 0;
      let btw_max_story = 0;

      index = bisect.left(maxStory, dateTime);
      max_story = maxStory[index - 1][1]; // maximum story levels

      if (index == 1) {
        btw_max_story = 0 - maxStory[index - 1][1];
      } else {
        btw_max_story = Math.abs(maxStory[index - 1][1] - maxStory[index][1]); //btw value of maximum story levels
      }
      // console.log(max_story)
      // console.log(btw_max_story)
      return [max_story, btw_max_story];
    }

    function startTime2(ease, totalTime, timeTodo, dateScale) {


      let monthScale = d3.scaleLinear()
        .domain([0, 1])
        .range([dateScale.invert(getTime()), endDate]);


      let t_list = [];
      let t_new_list = [];

      // function myEaseFunc(t) {
      //   t_list.push(t)

      //   dateTime = monthScale(t);
      //   // find maximum story level	
      //   let [max_story, btw_max_story] = getMaxStory(dateTime);

      //   if (btw_max_story == 0) { // sinout
      //     new_t = Math.sin((Math.PI / 2) * t);

      //   } else if (btw_max_story == 1) { // linear
      //     new_t = t

      //   } else if (btw_max_story == 2) { // sinIn
      //     new_t = 1 - Math.cos((Math.PI / 2) * t);
      //     //new_t = (1 - Math.cos(Math.PI * t)) / 3; SinInOut

      //   } else if (btw_max_story == 3) { // CubicIn 
      //     new_t = t * t * t;

      //   }
      //   t_new_list.push(new_t)

      //   var trace = {
      //     x: t_list,
      //     y: t_new_list,
      //     mode: 'lines'
      //   };

      //   //Plotly.newPlot('easeFunc', [trace], { title: 'Ease function graph' });
      //   return [new_t, btw_max_story]
      //   /*
      //   if (max_story == 3) {
      //     //new_t = (1 - Math.cos(Math.PI * t)) / 3; 
      //     new_t = t * t * t;
      //     console.log("origin t=", t, ">> slow t=", new_t, "story from date time", dateTime, "| max story=", max_story, "\n");          
      //     return [new_t, max_story];
      //   } else {
      //     console.log("origin t=", t, "story from date time", dateTime, "| max story=", max_story, "\n");
      //     return [t, max_story];
      //   }*/

      // }


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
        .ease(d3.easeLinear)
        .tween("time", () => {
          return function (t) {
            let new_t;
            let dateTime = monthScale(t);
            let [max_story, btw_max_story] = getMaxStory(dateTime);
            if (btw_max_story != 0) {
              let firstDayOfMonth = new Date(dateTime.getTime());
              firstDayOfMonth.setDate(1);
              firstDayOfMonth.setHours(0, 0, 0, 0);
              let lastDayOfMonth = new Date(dateTime.getTime());
              lastDayOfMonth.setDate(33);
              lastDayOfMonth.setDate(0);
              lastDayOfMonth.setHours(23, 59, 59, 999);
              let scale = d3.scaleLinear();
              let t_FirstDayOfMonth = monthScale.invert(firstDayOfMonth);
              let t_LastDayOfMonth = monthScale.invert(lastDayOfMonth);
              scale.domain([t_FirstDayOfMonth, t_LastDayOfMonth])
                .range([0, 1]);
              new_t = scale.invert(d3.easePolyInOut(scale(t), btw_max_story));
            } else {
              new_t = t;
            }

            dateTime = monthScale(new_t);
            // console.log(dateTime)
            tweenYear(dateTime);

            //Plotly.newPlot('easeFunc2', [trace], { title: 'Tween graph' });
          };
        });

    }

    function startTime(ease, totalTime, timeTodo, dateScale) {
      // console.log(dateScale.invert(getTime()))
      timer
        .transition()
        .duration(timeTodo)
        .ease(easeFunc)
        .attr("T", totalTime);
      // console.log(dateScale.invert(getTime()))
      svg
        .transition()
        .duration(timeTodo)
        .ease(easeFunc)
        .tween("time", () => {
          return function (t) {
            // console.log(dateScale.invert(getTime()))
            var month = d3.interpolateDate(
              //dateScale.invert(totalTime - timeTodo),      
              dateScale.invert(getTime()),
              endDate
            );
            // console.log(t)
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

    function getTheHighlighted(dataset) {
      let highlight = [];
      let selectedLabel = getSelectedLabel();
      for (d of dataset) {
        let [max_story] = getMaxStory(d.time);
        if (selectedLabel.length && d.story >= max_story && (d.freq >= 500 || d.forward >= 50)) {
          highlight.push(d);
        } else if (max_story == d.story && max_story >= 1) {
          highlight.push(d);
        }
      }
      return highlight;
    }

    let dataArrayDate = {};
    for (d of dataArray) {
      dataArrayDate[d.label] = d.value;
    }

    function getDistance(center_x, center_y, x, y) {
      return (Math.abs((center_x - x) + (center_y - y)));
    }

    /*
    let tempx_centerx_pow2 = [];
    let sum_tempx_centerx_pow2 = 0;

    function getDistribution(x, center_x, n) {
      tempx_centerx_pow2.push(Math.pow(x - center_x, 2));

      let add = (a, b) =>
        a + b

      sum_tempx_centerx_pow2 = tempx_centerx_pow2.reduce(add)

      sd = Math.sqrt(sum_tempx_centerx_pow2 / (tempx_centerx_pow2.length - 1))

      z = (x - center_x) / (sd/Math.sqrt(n));

      p = 0.005 + (0.0005 - 0.005) * z;

      p = p/(p-1);

      return Math.abs(p);
    }*/

    function getProperDate(year_month_date, highlight) {
      let new_date = new Date(year_month_date);
      let proper_date;
      let temp_max_distance = 0;
      let temp_min_distance = 0;
      let MonthOfDate = new Date(year_month_date);
      MonthOfDate.setDate(33);//将月份变成下个月第一天
      MonthOfDate.setDate(0);//将月份变成上个月最后一天
      let DaysOfTheMonth = MonthOfDate.getDate();
      // console.log(DaysOfTheMonth);
      for (let i = 1; i <= DaysOfTheMonth; i++) { // find proper day
        if (new_date < endDate)
          new_date.setDate(i); //+1 days
        // find center of new cx, cy for pause
        let sum_x = 0;
        let sum_y = 0;
        let list_new_cx_cy = [];
        for (d of highlight) { // #hashtag is highlighted5
          let value = dataArrayDate[d.label]; //get #hashtag
          let new_cx = findForwardByMonth(value, new_date);
          let new_cy = findFreqByMonth(value, new_date);
          //console.log("hashtag", d.label, "new date:", new_date, "new (cx,cy) =>", new_cx, ",", new_cy);//debug
          sum_x += new_cx;
          sum_y += new_cy;
          list_new_cx_cy.push([new_cx, new_cy]);
        }
        // calculate center of #hashtag is highlighted  
        let center_x = sum_x / highlight.length;
        let center_y = sum_y / highlight.length;
        //console.log("new center of new date:", new_date, " | center(x,y) >>", center_x, ",", center_y);//debug

        temp = [];
        for (point of list_new_cx_cy) {
          temp.push(getDistance(center_x, center_y, point[0], point[1]));
          //temp.push(getDistribution(point[0], center_x, list_new_cx_cy.length));
        }

        // find maximum distance
        max_distance = Math.max(...temp);//得到每个月高亮气泡和中心点的最远距离
        //console.log("generate day:", new_date, " | maximum distance >>", max_distance);//debug
        if (max_distance > temp_max_distance) {
          temp_max_distance = max_distance;
          proper_date = new_date.toString();
        }
      }
      return new Date(proper_date);
    }

    let lastProperDate;
    let proper_date;
    let paused = false;
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
         ]*/

      //console.log(">> data Array date", dataArrayDate);
      let selectedLabelDataArray;
      let selectedLabel = getSelectedLabel();
      if (selectedLabel.length != 0) {
        selectedLabelDataArray = dataArray.filter((d) => getSelectedLabel().includes(d.label.substr(1)));
      } else {
        selectedLabelDataArray = dataArray;
      }

      let dataset = getDataByMonth(dataArray, year_month_date);//获取每一帧所有bubble的位置及相关信息
      let datasetSelected = getDataByMonth(selectedLabelDataArray, year_month_date);//获取每一帧已选话题bubble的位置及相关信息

      let [max_story, btw_max_story] = getMaxStory(year_month_date);

      // find #hashtag is highlighted 
      let highlight = getTheHighlighted(datasetSelected);
      let formatTime = d3.timeFormat("%B %d %Y");
      let formatTime2 = d3.timeFormat("%B %Y");
      // // calculate proper center and pause

      function myPause(timePause) {
        // timePause = 5000;
        buttonClickedHandler();//pause
        paused = true;
        // alert("hello")

        timeout = setTimeout(function () { buttonClickedHandler() }, timePause);
      }

      if (lastProperDate == null && highlight.length >= threshhold) {//获取首次暂停时间
        proper_date = getProperDate(year_month_date, highlight);
      } else if (lastProperDate != null && highlight.length >= threshhold && formatTime2(lastProperDate) != formatTime2(year_month_date)) {
        proper_date = getProperDate(year_month_date, highlight);
      }
      if (lastProperDate != null && formatTime(lastProperDate) == formatTime(proper_date)) {
        proper_date = lastProperDate;
      } else {
        paused = false;
      }

      function myNewDate() {
        dataset = getDataByMonth(dataArray, proper_date);

        // find date --> have maximum distance
        // plot new cx ,cy
        //let timeScale = d3 // can change time scale here (may be use to adjust the time for slow motion)
        //  .scaleLinear()
        //  .domain([timeline[0], timeline[timeline.length - 1]])
        //  .range([0, totalTime]);

        // Change time
        // let currentTime = timeScale(proper_date);
        // setTime(currentTime);
        // if (!isAnimationFinished)
        __plotAll(dataset, proper_date);
      }

      // console.log("highlight: " + highlight.length);
      // console.log(threshhold);
      // console.log("paused: " + paused);
      if (enablePause && highlight.length >= threshhold && paused == false && formatTime(proper_date) == formatTime(year_month_date)) {
        let timePause = highlight.length * pauseTimeFactor * 1000;
        myNewDate();
        myPause(timePause);
      }
      else {
        // if (!isAnimationFinished)
        __plotAll(dataset, proper_date);
      }

      // for debug only
      //dd = new Date(2016, 0)      
      //let centroid = [{ label: "#centroid", forward: center_x, freq: center_y, time: dd, trend: 10, story: 1 }];
      //dataset = centroid.concat(dataset)
      //dataset.push({label: "#centroid", forward: center_x, freq: center_y, time: dd, trend: radius, story:1})
      // -----

      function __plotAll(dataset, proper_date) {
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
        if (year_month_date < limitDate) {
          // console.log(year_month_date.getFullYear() + "/" + (year_month_date.getMonth() + 1) + "/" + year_month_date.getDate())
          monthText.text(year_month_date.getFullYear() + "/" + (year_month_date.getMonth() + 1));
        }
        else {
          // console.log("isAnimationFinished == true")
          isAnimationFinished = true;
          buttonPlay = false;
          button.attr("xlink:href", `public/data/bubble/pause.svg`);
          // buttonClickedHandler();
          enableCursor();
        }
        let tmpYear = new Date(year_month_date);
        updateVideoAnchor(tmpYear);
        updateText(tmpYear)
        lastProperDate = proper_date;

        tempText = findProperText(tmpYear)  //找到此时应该显示的文本
        document.getElementById("mytext").innerText = (tempText ? tempText : "")

      }
    }

    function findProperText(tmpYear) {  //返回在tmpYear时刻需要展示的字符串
      //dateString目前的时间
      let dateString = (tmpYear.getFullYear() + "/" + (tmpYear.getMonth() + 1) + "/" + tmpYear.getDate())
      if (tmpYear.getMonth() + 1 < 10) //在第5个位置增加一个 0 
        dateString = dateString.slice(0, 5) + "0" + dateString.slice(5)
      if (tmpYear.getDate() < 10) //在第8个位置插入一个0
        dateString = dateString.slice(0, 8) + "0" + dateString.slice(8)

      let len = Object.keys(TextandDate).length //长度
      if (len != 0) {  //找出区间
        // let tmpdateString;
        let textToshow = ""
        let children = document.getElementById("oldTextArea").childNodes
        for (let i = 0, len = children.length; i < len - 2; i++) { //遍历每一个子节点
          let child = children[i];
          let begin = child.childNodes[0], end = child.childNodes[1]
          begin = begin.childNodes[0].innerText.slice(0, 10) // 开始时间字符串
          end = end.childNodes[0].innerText //结束时间字符串
          child.style.background = ""
          if (begin <= dateString && dateString <= end) {
            child.style.background = "#e6e6e6"
            textToshow = child.childNodes[2].childNodes[0].innerText
          }
        }
        return textToshow
      } else {
        return "Double click to change the caption"
      }
    }

    function updateText(date) {
      //将每次添加的文本信息存储在数组中；然后根据事件显示它。
      //当pause时，弹出对话框，显示是否插入文本。当已有文本时，提示修改文本或者删除文本。
      // console.log(date.getFullYear())
      // console.log(date.getMonth() + 1)
      // console.log(date.getDate())
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
      // console.log(date)
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
        d.x = x(d.forward + 1) + margin.left;
        d.y = y(d.freq + 1) + margin.top;
        d.r = r(d.trend);
        d.height = this.getBBox().height;
      });

      let [max_story] = getMaxStory(textData[0].time);
      let selectedLabel = getSelectedLabel();

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
        .style("display", function (d) {
          if (!isVisible(d)) {
            return "none";
          }
        });

      if (highlightColoredBubble) {
        text.style('opacity', function (d) {
          if (selectedLabel.length) {
            if (selectedLabel.includes(d.label.slice(1))) {
              return 1;
            } else {
              return 0;
            }
          } else if (d.story < max_story || d.story == 0) {
            return 0.1;
          } else {
            return 1;
          }
        })
      }
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
        .attr("name", "All")
        .attr("class", "input-all")
        .attr("id", idName + "All");
      eleOfAll
        .append("label")
        .attr("class", "label-all")
        .attr("for", idName + "All")
        .html(lang === "ch" ? "全选" : "All");

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
          //d => `${twitterChinese[d]}(#${twitterEnglish[d]}): ${en2ch[d]}`
          d => `#${twitterEnglish[d]}: ${en2ch[d]}`
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
        .select("#downmiddle")
        .append("div")
        .attr("class", "downside");

      downside
        .append("div")
        .attr("id", "downside-title")
        .style("width", `${svgWidth}px`)
        .style("height", `${downsideTitleHeight}px`)
        .text("Hashtag Timeline")
        .style("text-align", "center")
        .style("fill", "#565656")
        .style("font-weight", "600")
        .attr("font-size", "18");

      let slider = d3.select(".video-slider");

      document.querySelector("div.downside").style.width = `${svgWidth}px`;
      document.querySelector(
        "div.downside"
      ).style.height = `${downsideHeight}px`;

      let downsideBlock = downside.append("div").attr("id", "downside-block");
      downsideBlock.append("p")
        .attr("id", "hashTagTimelineMsg")
        .html("Hashtag Timeline is the coloured dash bars, show the occurrence of the chosen hashtag bubbles on the bubble chart. You can try to select from the hashtag <b>CHECKBOX</b> on the left-hand side and pressing the <b>PLAY</b> button to see the movement of the bubbles.")
        .style("padding", "0 60px")
        .style("font-size", "15px")
        .style("text-align", "center");

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

    function createLevelGraph() {

      let LevelGraph = d3.select("#downleft")
        .append("div")
        .attr("class", "LevelGraph");

      let svg = LevelGraph.append("svg")
        .attr("height", "210px")
        .attr("width", "100%");

      svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", "190px")
        .attr("y", "18px")
        .style("width", "200px")
        .style("height", "50px")
        .style("fill", "#565656")
        .style("font-weight", "700")
        .attr("font-size", "18")
        .text("Hashtag Pulse");

      svg.append("text")
        .attr("id", "highlightTopic")
        .attr("x", 100)
        .attr("y", 75)
        .attr("font-size", 16)
        .style("font-family", "SimSun")
        .style("font-weight", "700")
        .text("");

      const xScale = d3.scaleTime().domain([new Date(2016, 1), new Date(2019, 5)]).range([0, 400]);
      const xAxis = d3.axisBottom(xScale)
        .ticks(d3.timeYear.every(1));
      const yScale = d3.scaleLinear().domain([3, 0]).range([0, 140]);
      let tick_offset = 400;
      const yAxis = d3.axisLeft(yScale)
        .ticks(3)
        .tickSize(6 + tick_offset);

      svg.append("g")
        .attr("transform", `translate(20,185)`)
        .call(xAxis)
        .attr("class", "axis");

      svg.append("g")
        .attr("transform", `translate(${20 + tick_offset},45)`)
        .call(yAxis)
        .attr("class", "axis");

      let dataset = data.map(function (d) {
        let data = {};
        let color = [];
        let tmp = [];
        let topic = d.hashtag.substr(1);

        switch (classifyTopic(topic)) {
          case 0:
            color.push(["rgb(27, 106, 165)"]);
            break;
          case 1:
            color.push(["#b2b2b2"]);
            break;
          case 2:
            color.push(["rgb(232, 17, 15)"]);
            break;
          default:
            color.push(["black"]);
            break;
        }

        for (let label in d) {
          if (label.substr(0, 2) == "lv") {
            tmp.push([label.substr(2), d[label]]);
          }
        }
        data.color = color;
        data.point = tmp;
        data.topic = topic;
        return data;
      });
      let parseTime = d3.timeParse("%Y%m");
      let linePath = d3.line()
        .x((d) => xScale(parseTime(d[0])))
        .y((d) => yScale(d[1]))
        .curve(d3.curveBasis);
      svg.selectAll("path")
        .data(dataset)
        .enter()
        .append("path")
        .attr("id", (d) => `topicPopularity-${d.topic}`)
        .attr("d", (d) => linePath(d.point))
        .attr("transform", `translate(28,45)`)
        .attr("stroke", (d) => d.color)
        .attr("stroke-width", "2px")
        .attr("fill", "none")
        .attr("opacity", 0.3);

      return LevelGraph;
    }

    function classifyTopic(topic) {
      if (labelSet0.includes(topic)) {
        return 0;
      } else if (labelSet1.includes(topic)) {
        return 1;
      } else if (labelSet2.includes(topic)) {
        return 2;
      }
    }

    function highlightLevelLine(topic) {
      if (getSelectedLabel().length == 1) {
        levelPath
          .attr("opacity", 0.1);
      }
      d3.select(`#topicPopularity-${topic}`)
        .attr("opacity", 1)
        .attr("stroke-width", "5px");
    }

    function cancelHightlightLevelLine(topic) {
      let selectedLabel = getSelectedLabel();
      if (selectedLabel.length == 0) {
        levelPath
          .attr("opacity", 0.3);
      }
      if (!selectedLabel.includes(topic)) {
        d3.select(`#topicPopularity-${topic}`)
          .attr("opacity", 0.1)
          .attr("stroke-width", "2px");
      }
    }

    // 本函数在mouseover事件里调用 This function is called in the mouseover event
    function updateMask(selectedLabel) {
      let currentTime = d3.select(".dot").data()[0].time;
      let [max_story, _] = getMaxStory(currentTime);
      dots = d3.selectAll(".dot");
      labels = d3.selectAll(".textLabel");
      if (selectedLabel.length === 0) {
        dots
          .filter(function (d, i) {
            return mouseoverDot === null || d.label.slice(1) === mouseoverDot;
          })
          .transition()
          .duration(durationTime)
          .style("opacity", 1)
          .style("fill", function (d) {
            if (max_story == 0 && selectedLabel.length) {
              return selectedLabel.includes(d.label.substr(1)) ? color(d.trend) : "#FFFFFF";
            } else if (max_story !== 0) {
              return max_story <= d.story ? color(d.trend) : "#FFFFFF"; //T Highligh:F No Highlight
            }
            else {
              return "#FFFFFF";
            }
          })
          .style("stroke", function (d) {
            if (max_story == 0 && selectedLabel.length) {
              return selectedLabel.includes(d.label.substr(1)) ? color(d.trend) : "#FFFFFF";
            } else if (max_story !== 0) {
              return max_story <= d.story ? color(d.trend) : "#DCDCDC"; //T Highligh:F No Highlight
              //return color(d.trend); //always highlight
            }
            else {
              return "#DCDCDC";
            }
          });

        dots
          .filter(function (d, i) {
            return mouseoverDot !== null && d.label.slice(1) !== mouseoverDot;
          })
          .transition()
          .duration(durationTime)
          .style("opacity", 0.1);

        if (highlightColoredBubble) {
          if (mouseoverDot !== null) {
            labels.filter((d) => {
              return d.label.slice(1) === mouseoverDot;
            })
              .transition()
              .duration(durationTime)
              .style("opacity", 1);

            labels.filter((d) => {
              return d.label.slice(1) !== mouseoverDot;
            })
              .transition()
              .duration(durationTime)
              .style("opacity", 0.1);
          } else {
            labels.filter((d) => {
              return d.story != 0 && d.story == max_story;
            })
              .transition()
              .duration(durationTime)
              .style("opacity", 1);

            labels.filter((d) => {
              return d.story == 0 || d.story < max_story;
            })
              .transition()
              .duration(durationTime)
              .style("opacity", 0.1);
          }
        } else {
          d3.selectAll(".textLabel")
            .filter(function (d, i) {
              return mouseoverDot === null || d.label.slice(1) === mouseoverDot;
            })
            .transition()
            .duration(durationTime)
            .style("opacity", 1);

          d3.selectAll(".textLabel")
            .filter(function (d, i) {
              return mouseoverDot !== null && d.label.slice(1) !== mouseoverDot;
            })
            // .text(d => twitterText[d.label.slice(1)])
            .transition()
            .duration(durationTime)
            .style("opacity", 0.1);
        }

        return;
      }

      dots
        .filter(function (d, i) {//未被选则的，鼠标没有悬停的所有话题
          return (
            selectedLabel.findIndex(
              label => label === d3.select(this).attr("data-label")
            ) < 0 &&
            (mouseoverDot === null || d.label.slice(1) !== mouseoverDot)
          );
        })
        .transition()
        .style("opacity", 0.1)
        .style("fill", function (d) {
          if (d.story >= max_story) {
            switch (classifyTopic(d.label.substr(1))) {
              case 0:
                return "rgb(27, 106, 165)";
              case 1:
                return "#b2b2b2";
              case 2:
                return "rgb(232, 17, 15)";
            }
          } else {
            return "#FFFFFF";
          }
        })
        .style("stroke", function (d) {
          if (d.story >= max_story) {
            return color(d.trend);
          } else {
            return "#DCDCDC";
          }
        });

      dots
        .filter(function (d, i) {//鼠标悬停的话题
          return (
            (mouseoverDot !== null && d.label.slice(1) === mouseoverDot)
          );
        })
        .transition()
        .style("opacity", 1);

      dots
        .filter(function (d, i) {//被选择的所有话题
          return (
            selectedLabel.findIndex(
              label => label === d3.select(this).attr("data-label")
            ) >= 0
          );
        })
        .transition()
        .style("opacity", 1)
        .style("fill", function (d) {
          if (d.story >= max_story) {
            switch (classifyTopic(d.label.substr(1))) {
              case 0:
                return "rgb(27, 106, 165)";
              case 1:
                return "#b2b2b2";
              case 2:
                return "rgb(232, 17, 15)";
            }
          } else {
            return "#FFFFFF";
          }
        })
        .style("stroke", function (d) {
          if (d.story >= max_story) {
            return color(d.trend);
          } else {
            return "#DCDCDC";
          }
        });

      labels
        .filter(function (d, i) {
          return (
            selectedLabel.findIndex(
              label => label === d3.select(this).attr("data-label")
            ) < 0 &&
            (mouseoverDot === null || d.label.slice(1) !== mouseoverDot)
          );
        })
        .transition()
        .style("opacity", 0);

      labels
        .filter(function (d, i) {
          return (
            selectedLabel.findIndex(
              label => label === d3.select(this).attr("data-label")
            ) >= 0 ||
            (mouseoverDot !== null && d.label.slice(1) === mouseoverDot)
          );
        })
        .text(d => twitterText[d.label.slice(1)])
        .transition()
        .style("opacity", 1);
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
      .attr("height", 60)
      .style("position", "absolute");

    headSvg
      .append("text")
      .attr("transform", "translate(" + 0 + " ," + 45 + ")")
      .text("BREXBLE")
      .style("font-size", "60px")
      .style("fill", "#003399");

    let Events2JSON = null;
    function Replayer(Events2JSON) {  // 参数为JSON文件
      // To-do 从文件中解析数组
      let evts = JSON.parse(Events2JSON).events

      let replayer = new rrwebPlayer({ // 回放
        target: document.body, //getElementById("main"), 
        data: {
          events: evts,
          autoPlay: false,
          showController: true
        },
      });
      // replayer.fullscreen()
      function toggleFullscreen() {
        let elem = document.getElementsByClassName("rr-player svelte-1wetjm2")[0]
        //  console.log(elem)
        if (!document.fullscreenElement) {  // 如果没有全屏
          elem.requestFullscreen().catch(err => {
            let elements = document.getElementsByClassName("rr-player svelte-1wetjm2")
            let len = elements.length;
            for (let i = len - 1; i >= 0; i--) {
              if (elements.item(i))
                elements.item(i).parentNode.removeChild(elements.item(i));
            }
            alert(`Open Success! Click Play to play it!`);
          });
        }
      }
      toggleFullscreen()
    }

    document.addEventListener('fullscreenchange', () => {
      // 进入全屏，不操作；退出全屏，删除原视频。
      if (document.fullscreen) {//进入全屏
        console.log("进入全屏")
        let elements = document.getElementsByClassName("replayer-mouse") // 删除鼠标
        if (elements.length != 0)
          elements[0].parentNode.removeChild(elements[0]);

        elements = document.getElementsByClassName("rr-player svelte-1wetjm2")
        let len = elements.length;
        if (len >= 2) { // 如果有多个视频，只删除一个。
          for (let i = len - 1; i >= 1; i--) {
            if (elements.item(i))
              elements.item(i).parentNode.removeChild(elements.item(i));
          }
        }

      }
      else {  // 退出全屏
        console.log("退出全屏")
        let elements = document.getElementsByClassName("rr-player svelte-1wetjm2")
        let len = elements.length;
        for (let i = len - 1; i >= 0; i--) {
          if (elements.item(i))
            elements.item(i).parentNode.removeChild(elements.item(i));
        }
      }
    });

    let middleul = d3.select(".middle-title")
      .append("ul")
      .attr("class", "middle_ul");

    let div3 = d3.select("#main").append("div")
      .attr("class", "tooltip3")
      .style("opacity", 0);

    middleul.append("li")
      .append("a")
      .append("text")
      .attr("class", "about_li")
      .text("About")
      .on("mouseover", () => {
        div3.transition()
          .duration(200)
          .style("opacity", .9);
        div3.html("BREXBLE is a storytelling prototype tool with animated data visualization. This tool supports data storytelling through bubble charts movement and captions.")
          .style("width", "400px")
          .style("height", "98px")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", () => {
        div3.transition()
          .duration(500)
          .style("opacity", 0);
      })

    middleul.append("li")
      .append("a")
      .attr("xlink:href", "public/data/hashtag_bubble_deleted0414.csv")
      .attr("download", "csvfile")
      .append("text")
      .attr("class", "data_li")
      .text("Data")
      .on("mouseover", () => {
        div3.transition()
          .duration(200)
          .style("opacity", .9);
        div3.html("Download the example dataset")
          .style("width", "278px")
          .style("height", "25px")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", () => {
        div3.transition()
          .duration(500)
          .style("opacity", 0);
      })

    middleul.append("li")
      .append("a")
      .append("text")
      .attr("class", "record_li")
      .text("Record")
      .on("mouseover", () => {
        div3.transition()
          .duration(200)
          .style("opacity", .9);
        div3.html("Record the bubble chart as a JSON file")
          .style("width", "350px")
          .style("height", "25px")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", () => {
        div3.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("click", () => { // 先完成设置 -> 选择文件夹以保存 ->选择区域 -> 从头开始
        events = [];
        if (confirm("You have already adjusted the story of the bubble chart and want to record the bubble chart, right?"))
          if (confirm("The bubble chart will automatically play while recording and will save the file when playing is finished. ")) {
            let BorderofMain = document.getElementById("main").style.border;
            let BorderofContainer = document.getElementsByClassName("container")[0].style.border;
            let BorderofChartAside = document.getElementById("chartAside").style.border;

            document.getElementById("main").style.border = "none";
            document.getElementsByClassName("container")[0].style.border = "none";
            document.getElementById("chartAside").style.border = "none";

            let selectedLabel = getSelectedLabel();
            if (selectedLabel.length) {
              let { earliestTime, latestTime } = calcEarliestTime(selectedLabel)
              currentTime = earliestTime * totalTime
              let currentDate = dateScale.invert(currentTime);
              updateVideoAnchor(currentDate)
              setTime(currentTime)
            } else {
              initTime(); // 设置从头开始
            }

            if (!buttonPlay)
              buttonClickedHandler();
            // if (document.getElementById("Replayer"))
            //   document.getElementById("Replayer").remove()

            let stopFn = rrweb.record({ // 记录
              emit(event) {
                if (event && event.data.source != 1 && event.data.source != 2) // 不记录鼠标
                  events.push(event);

                let timeTodo = totalTime - getTime();
                // console.log(timeTodo)
                if (isAnimationFinished || timeTodo < 100) { // 停止录制
                  if (buttonPlay)
                    buttonClickedHandler();
                  console.log("finished")
                  stopFn();
                  let eventOftype4 = null;  // "Meta"
                  let eventOftype2 = null; // "FullSnapshot"
                  for (let i = 0; i < events.length; i++) { // 
                    if (events[i].type === 4)
                      eventOftype4 = events[i];
                    if (events[i].type === 2)
                      eventOftype2 = events[i];
                    if (eventOftype2 && eventOftype4)
                      break;  // 全部找到
                  }
                  if (eventOftype4) {
                    eventOftype4.data.width = 1300
                    eventOftype4.data.height = 800;
                  }

                  let divmain = eventOftype2.data.node.childNodes[1].childNodes[2].childNodes[1].childNodes[1]
                  console.log(divmain)
                  let divcontainer = divmain.childNodes[5]
                  console.log(divcontainer)
                  let divChartaside = divcontainer.childNodes[3]
                  console.log(divChartaside)

                  divcontainer.childNodes = [];
                  divcontainer.childNodes.push(divChartaside);
                  // console.log(divcontainer)
                  divmain.childNodes = [];
                  divmain.childNodes.push(divcontainer);
                  // console.log(divmain)

                  Events2JSON = JSON.stringify({ events });
                  //将json文件保存到其它地方。
                  var blob = new Blob([Events2JSON], { type: "text/plain;charset=utf-8" });
                  saveAs(blob, "events.json");

                  events = [];  // 设为空

                  // Replayer(Events2JSON); // 没有必要立马播放
                  document.getElementById("main").style.border = BorderofMain
                  document.getElementsByClassName("container")[0].style.border = BorderofContainer
                  document.getElementById("chartAside").style.border = BorderofChartAside

                  alert("The JSON file has been recorded successfully!")
                }
              },
            });

          }
      })



    var textNode1 = document.createTextNode("Upload");
    middleul.append("li")
      .append("div")
      .attr("id", "inputFileDiv")
      .attr("class", "file")
      .append("input")
      .attr("type", "file")
      .attr("title", "")
      .attr("id", "files")
      .on("mouseover", () => {
        div3.transition()
          .duration(200)
          .style("opacity", .9);
        div3.html("Upload a JSON file to replay")
          .style("width", "260px")
          .style("height", "25px")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", () => {
        div3.transition()
          .duration(200)
          .style("opacity", 0);
      })
    document.getElementById("inputFileDiv").appendChild(textNode1)
    // .attr("class", "upload_li")
    // .html("Upload")

    let filename = null;
    var inputElement = document.getElementById("files");
    let mouseOverHandler2 = null;
    let mouseOutHandler2 = null;
    let clickHandler2 = null;
    if (inputElement)
      inputElement.addEventListener("change", handleFiles, false);
    function handleFiles() {
      var selectedFile = document.getElementById("files").files[0];//获取读取的File对象
      filename = selectedFile.name;//读取选中文件的文件名
      // var size = selectedFile.size;//读取选中文件的大小
      // console.log("文件名:" + name + "大小：" + size);
      var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
      reader.readAsText(selectedFile);//读取文件的内容

      reader.onload = function () {
        Events2JSON = this.result;
        // Replayer(Events2JSON)
      };
      let replaybutton = document.getElementById("Play")
      let EventListener = function () {
        mouseOverHandler2 && replaybutton.removeEventListener("mouseover", mouseOverHandler2)
        mouseOutHandler2 && replaybutton.removeEventListener("mouseout", mouseOutHandler2)
        clickHandler2 && replaybutton.removeEventListener("click", clickHandler2)
        mouseOverHandler2 = () => {
          div3.transition()
            .duration(200)
            .style("opacity", .9);
          div3.html(filename)
            .style("width", (filename.length * 10) + "px")
            .style("height", "25px")
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY) + "px");
        }
        mouseOutHandler2 = () => {
          div3.transition()
            .duration(500)
            .style("opacity", 0);
        }
        clickHandler2 = () => {
          Replayer(Events2JSON);
        }
        replaybutton.addEventListener("mouseover", mouseOverHandler2)
        replaybutton.addEventListener("mouseout", mouseOutHandler2)
        replaybutton.addEventListener("click", clickHandler2)
      }
      EventListener()

      alert("The JSON file uploaded successfully, click 'Replay' to play the video")
    }

    middleul.append("li")
      .append("text")
      .attr("class", "replay_li")
      .attr("id", "Play")
      .text("Replay")
      .on("mouseover", () => {
        div3.transition()
          .duration(200)
          .style("opacity", .9);
        div3.html("You have to upload a JSON file to replay")
          .style("width", "360px")
          .style("height", "25px")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseout", () => {
        div3.transition()
          .duration(500)
          .style("opacity", 0);
      })



    function updatePast(selector, currentDate, reRenderLine = false) {
      let label = selector.attr("name");
      let date = d3.timeFormat("%Y%m%d%H")(currentDate);

      let targetPastCircle = pastCircle[label];
      let targetPastLine = pastLine[label];

      // if input is unchecked, we just disable all of them
      if (!option_showPast_input.property("checked") || !selector.property("checked")) {
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
initialize();

let input;
let search_result;

async function initialize() {
  // 取得所有路線名稱
  response = await fetch("/Routes");
  data = await response.json();
  // 正常取得資料
  if (data.status === "ok") {
    // 存放資料
    for (element of data.data) {
      // 處理路線
      if (element.RouteName.includes("預")) {
        continue;
      }
      routes_data[element.RouteName] = element;
      push_search_bar_data(element, "RouteName");
    }
  } else {
    console.log(data.message);
  }

  // 產生畫面
  render_page()
}

function render_page(){
  content.display = "flex";
  content.style.justifyContent = "center";
  content.style.backgroundImage = "url('../static/images/bus_background.svg')";
  content.style.backgroundRepeat = "no-repeat";
  content.style.backgroundSize = "cover";

  let title = document.createElement("div");
  title.textContent = "請輸入路線取得公車動態";
  title.style.fontSize = "25px";
  title.style.textAlign = "center";
  title.style.marginTop = "100px";

  let input_div = document.createElement("div");
  input_div.style.textAlign = "center";
  input_div.style.margin = "10px";

  input = document.createElement("input");
  input.style.fontSize = "25px";
  input.style.width = "300px";

  input.addEventListener("input", handleInput);

  let button = document.createElement("div");
  button.textContent = "Go";

  button.style.display = "inline-block";
  button.style.padding = "5px 5px";
  button.style.fontSize = "24px";
  button.style.cursor = "pointer";
  button.style.textAlign = "center";
  button.style.textDecoration = "none";
  button.style.outline = "none";
  button.style.color = "#fff";
  button.style.backgroundColor = "#04AA6D";
  button.style.border = "none";
  button.style.borderRadius = "15px";
  button.style.boxShadow = "0 3px #999";
  button.style.margin = "10px";

  button.addEventListener("mouseover", function () {
    this.style.backgroundColor = "#3e8e41";
  });

  button.addEventListener("mouseout", function () {
    this.style.backgroundColor = "#04AA6D";
  });

  button.addEventListener("mousedown", function () {
    this.style.backgroundColor = "#3e8e41";
    this.style.boxShadow = "0 2px #666";
    this.style.transform = "translateY(4px)";
  });

  button.addEventListener("mouseup", function () {
    this.style.backgroundColor = "#04AA6D";
    this.style.boxShadow = "0 3px #999";
    this.style.transform = "translateY(0)";
  });

  button.addEventListener("click", function () {
    window.location.href = "/realtime/" + input.value;
  });

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      window.location.href = "/realtime/" + input.value;
    }
  });

  search_result = document.createElement("div")

  input_div.appendChild(input);
  input_div.appendChild(button);
  input_div.appendChild(search_result)

  content.appendChild(title);
  content.appendChild(input_div);
}

function handleInput() {

  const searchTerm = input.value.trim();
  clearResults();

  if (searchTerm.length === 0) {
    return;
  }

  const suggestions = fetchSuggestions(searchTerm);
  displayResults(suggestions);
}

function displayResults(suggestions) {
  let routes_div = document.createElement("div");
  routes_div.style.width = "300px"
  routes_div.style.maxHeight = "40vh"
  routes_div.style.overflowY = "scroll"
  routes_div.style.overflowX = "hidden"
  routes_div.style.backgroundColor = "white"
  routes_div.style.transform = "translateX(-30px)"

  if (suggestions.length === 0) {
    return;
  }
  suggestions.forEach((item) => {

    item = item.split(" ")[0];
    // 搜尋結果產生
    let route_div = document.createElement("div");
    route_div.className = "result-route";
    route_div.style.fontSize = "20px";
    route_div.style.cursor = "pointer";
    route_div.style.whiteSpace = "pre";
    route_div.textContent =
      item +
      "    " +
      routes_data[item].DepartureStopName +
      " - " +
      routes_data[item].DestinationStopName;
    route_div.id = item;
    route_div.addEventListener("click", direct_to_page);

    routes_div.appendChild(route_div);
  });
  search_result.style.display = "flex"
  search_result.style.justifyContent = "center"
  search_result.appendChild(routes_div);
}

function fetchSuggestions(searchTerm) {
  // search_bar_data 為搜尋資料的來源
  return search_bar_data.filter((item) => item.includes(searchTerm));
}

function push_search_bar_data(data, attribute) {
  // 加入幹線原路線名稱，搜尋時用原路線可搜尋到
  switch (data[attribute]) {
    case "和平幹線":
      search_bar_data.push(data[attribute] + " 15");
      return;
    case "復興幹線":
      search_bar_data.push(data[attribute] + " 74");
      return;
    case "中山幹線":
      search_bar_data.push(data[attribute] + " 220");
      return;
    case "忠孝幹線":
      search_bar_data.push(data[attribute] + " 232副");
      return;
    case "羅斯福路幹線":
      search_bar_data.push(data[attribute] + " 236");
      return;
    case "仁愛幹線":
      search_bar_data.push(data[attribute] + " 263");
      return;
    case "承德幹線":
      search_bar_data.push(data[attribute] + " 266");
      return;
    case "敦化幹線":
      search_bar_data.push(data[attribute] + " 285");
      return;
    case "內湖幹線":
      search_bar_data.push(data[attribute] + " 287");
      return;
    case "民生幹線":
      search_bar_data.push(data[attribute] + " 518");
      return;
    case "信義幹線":
      search_bar_data.push(data[attribute] + " 588");
      return;
    case "重慶幹線":
      search_bar_data.push(data[attribute] + " 601");
      return;
    case "北環幹線":
      search_bar_data.push(data[attribute] + " 620");
      return;
    case "松江新生幹線":
      search_bar_data.push(data[attribute] + " 642");
      return;
    case "基隆路幹線":
      search_bar_data.push(data[attribute] + " 650");
      return;
    case "南京幹線":
      search_bar_data.push(data[attribute] + " 棕9");
      return;
    case "民權幹線":
      search_bar_data.push(data[attribute] + " 紅32");
      return;
    case "南環幹線":
      search_bar_data.push(data[attribute] + " 綠1");
      return;
    case "東環幹線":
      search_bar_data.push(data[attribute] + " 綠16");
      return;
  }
  search_bar_data.push(data[attribute]);
}

function direct_to_page() {
  window.location.href = "/realtime/" + this.id.split(" ")[0];
}

function clearResults() {
  search_result.replaceChildren()
}
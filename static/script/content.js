initialize();

let last_page_operator_name;

//初始化
async function initialize() {
  // 取得業者名稱與路線總數
  let response = await fetch("/OperatorRoutes");
  let data = await response.json();
  // 生成畫面
  if (data.status === "ok") {
    render_operators(data.data);
    search_bar_data = data.data
  } else {
    console.log(data.message);
  }
}

// 生成每個業者頁面
function render_operators(data) {
  // 建立全部業者 div
  let operators_div = document.createElement("div");
  operators_div.style.display = "flex";
  operators_div.style.flexWrap = "wrap";
  operators_div.style.justifyContent = "center";
  operators_div.style.padding = "20px 20px";

  // 產生每個資料畫面
  for (element of data) {
    // 建立業者 div
    let operator_div = document.createElement("div");
    operator_div.className = "content-element";
    operator_div.style.margin = "10px 10px";
    operator_div.style.padding = "10px 10px";
    operator_div.style.border = "solid 3px black";
    operator_div.style.cursor = "pointer";
    operator_div.id = element.OperatorName;
    operator_div.addEventListener("click", click_operator);

    // 建立業者名稱 div
    let operator_name_div = document.createElement("div");
    operator_name_div.textContent = "業者名稱：" + element.OperatorName;
    operator_name_div.style.fontSize = "2rem";
    operator_div.appendChild(operator_name_div);

    // 建立業者路線數量 div
    let operator_route_count_div = document.createElement("div");
    operator_route_count_div.textContent = "路線總數：" + element.Count;
    operator_route_count_div.style.fontSize = "2rem";
    operator_div.appendChild(operator_route_count_div);

    // 放入 operators_div 中
    operators_div.appendChild(operator_div);
  }
  // 放入 content 中
  content.appendChild(operators_div);
}

// 生成每個路線頁面
function render_operator_routes(data, title) {
  // 改變標題
  let nav_title = document.querySelector(".nav-title");
  let new_nav_title = nav_title.cloneNode(true);
  nav_title.parentNode.replaceChild(new_nav_title, nav_title);
  new_nav_title.textContent = title;
  new_nav_title.setAttribute("href", "/analytics");
  last_page_operator_name = title;
  // 建立全部路線 div
  let routes_div = document.createElement("div");
  routes_div.style.display = "flex";
  routes_div.style.flexWrap = "wrap";
  routes_div.style.justifyContent = "center";
  routes_div.style.padding = "20px 20px";

  // 產生每個路線資料畫面
  for (element of data) {
    // 建立路線 div
    let route_div = document.createElement("div");
    route_div.className = "content-element";
    route_div.style.margin = "10px 10px";
    route_div.style.padding = "10px 10px";
    route_div.style.border = "solid 3px black";
    route_div.style.cursor = "pointer";
    route_div.id = element.RouteName;
    route_div.addEventListener("click", click_route);

    // 建立路線名稱 div
    let route_name_div = document.createElement("div");
    route_name_div.textContent = element.RouteName;
    route_name_div.style.fontSize = "2rem";
    route_name_div.style.textAlign = "center";
    route_div.appendChild(route_name_div);

    // 放入 routes_div 中
    routes_div.appendChild(route_div);
  }
  // 放入 content 中
  content.appendChild(routes_div);
}

// 點選業者
async function click_operator() {
  clear_content();
  // 取得業者路線
  let response = await fetch("/Routes/" + this.id);
  let data = await response.json();
  // 生成畫面
  if (data.status === "ok") {
    render_operator_routes(data.data, this.id);
  } else {
    console.log(data.message);
  }
}

// 點選路線
async function click_route() {
  clear_content();
  // 取得路線與車牌內容
  let responses = await Promise.all([
    fetch("/LastWeek/RouteTrip/" + this.id),
    fetch("/LastMonth/RouteTrip/" + this.id),
    fetch("/LastWeek/PlateTrip/" + this.id),
    fetch("/LastMonth/PlateTrip/" + this.id),
  ]);
  let data = await Promise.all(responses.map((response) => response.json()));
  // 建立資料變數
  let route_last_week;
  let route_last_month;
  let plate_last_week;
  let plate_last_month;
  // 確認狀態
  for (eachData of data) {
    if (eachData.status === "error") {
      console.log(eachData.message);
    } else {
      switch (eachData.message) {
        case "Route Last Week":
          route_last_week = eachData.data;
          break;
        case "Route Last Month":
          route_last_month = eachData.data;
          break;
        case "Plate Last Week":
          plate_last_week = eachData.data;
          break;
        case "Plate Last Month":
          plate_last_month = eachData.data;
          break;
      }
    }
  }
  // 生成 title
  render_title(this.id);
  // 生成即時資訊頁面
  render_realtime_info(this.id);
  // 生成數據頁面
  render_route_plates(
    route_last_week,
    route_last_month,
    plate_last_week,
    plate_last_month
    //this.id
  );
}

// 點選 title 路線
async function click_title_route(operator_name) {
  // 清除 content
  clear_content();
  // websocket 斷線
  if (wsClient.isConnected === true) {
    wsClient.disconnect();
  }
  // 取得業者路線
  let response = await fetch("/Routes/" + operator_name);
  let data = await response.json();
  // 生成畫面
  if (data.status === "ok") {
    render_operator_routes(data.data, operator_name);
  } else {
    console.log(data.message);
  }
}

// 清除 content
function clear_content() {
  content.replaceChildren();
}

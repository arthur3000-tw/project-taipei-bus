initialize();

//初始化
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
  // 確認網址
  let path_name = window.location.pathname;
  try {
    route_name = path_name.split("/")[2];
    render_realtime_info(route_name);
  } catch (e) {}
}

async function render_realtime_info(route_name) {
  // 網頁網址點入，無公車路線
  if (route_name == undefined) {
    return;
  }
  // 清除連線
  if (wsClient != null) {
    wsClient.disconnect();
  }
  // 清除畫面
  clear_content();

  // 取得站牌
  let responses = await Promise.all([
    fetch("/Stops/" + route_name + "/去程"),
    fetch("/Stops/" + route_name + "/返程"),
  ]);
  let data = await Promise.all(responses.map((response) => response.json()));

  // 建立資料變數
  let route_go;
  let route_back;
  // 確認狀態
  for (eachData of data) {
    if (eachData.status === "error") {
      // 由網址進入
      console.log(eachData.message);
      // 錯誤頁面
      let img = document.createElement("img");
      img.src = "../static/images/404.gif";
      img.style.margin = "0 auto";
      content.style.textAlign = "center";
      content.appendChild(img);
      return;
    } else {
      switch (eachData.message) {
        case "去程":
          route_go = eachData.data;
          break;
        case "返程":
          route_back = eachData.data;
          break;
      }
    }
  }

  // 將路線顯示於 search bar
  let route = decodeURI(route_name);
  searchInput.value = route;

  // 產生此路線的站牌
  console.log(route_go);
  console.log(route_back);
  // let routes_div = document.createElement("div");

  // 產生選擇標籤、分頁
  let pages_div = document.createElement("div");
  render_pages(pages_div, ["go", "back", "map", "data"]);
  content.appendChild(pages_div);

  // 產生去程、返程資料
  // render_realtime_stops(route, route_go, "去程", routes_div);
  // render_realtime_stops(route, route_back, "返程", routes_div);
  render_realtime_stops(route, route_go, "去程");
  render_realtime_stops(route, route_back, "返程");

  // 取得地圖資訊
  responses = await Promise.all([
    fetch("/Shape/" + route_name + "/去程"),
    fetch("/Shape/" + route_name + "/返程"),
  ]);
  data = await Promise.all(responses.map((response) => response.json()));

  // 建立資料變數
  let shape_go;
  let shape_back;

  // 確認狀態
  for (eachData of data) {
    if (eachData.status === "error") {
      // 由網址進入
      console.log(eachData.message);
      // 錯誤頁面
      let img = document.createElement("img");
      img.src = "../static/images/404.gif";
      img.style.margin = "0 auto";
      content.style.textAlign = "center";
      content.appendChild(img);
      return;
    } else {
      switch (eachData.message) {
        case "去程":
          shape_go = eachData.data;
          break;
        case "返程":
          shape_back = eachData.data;
          break;
      }
    }
  }

  // 產生地圖資料
  render_realtime_map(route, shape_go, shape_back);

  // content.appendChild(routes_div);

  // 取得公車計算數據
  responses = await Promise.all([
    fetch("/LastWeek/PlateTrip/" + route_name),
    fetch("/LastMonth/PlateTrip/" + route_name),
  ]);
  data = await Promise.all(responses.map((response) => response.json()));
  // 確認狀態
  for (eachData of data) {
    if (eachData.status === "error") {
      console.log(eachData.message);
    } else {
      switch (eachData.message) {
        case "Plate Last Week":
          plate_trip_last_week = eachData.data;
          break;
        case "Plate Last Month":
          plate_trip_last_month = eachData.data;
          break;
      }
    }
  }

  // 取得公車路線計算數據
  responses = await Promise.all([
    fetch("/LastWeek/RouteTrip/" + route_name),
    fetch("/LastMonth/RouteTrip/" + route_name),
  ]);
  data = await Promise.all(responses.map((response) => response.json()));
  // 確認狀態
  for (eachData of data) {
    if (eachData.status === "error") {
      console.log(eachData.message);
    } else {
      switch (eachData.message) {
        case "Route Last Week":
          route_trip_last_week = eachData.data;
          break;
        case "Route Last Month":
          route_trip_last_month = eachData.data;
          break;
      }
    }
  }

  // 產生數據頁面
  render_bus_data(
    route_trip_last_week,
    route_trip_last_month,
    plate_trip_last_week,
    plate_trip_last_month
  );

  // 將數據格式轉換
  plate_trip_last_week = data_to_hash(plate_trip_last_week, "PlateNumb");
  plate_trip_last_month = data_to_hash(plate_trip_last_month, "PlateNumb");

  // 建立連線
  wsClient = new WebSocketClient(
    "/ws/realtime/" + routes_data[route]["RouteID"]
  );

  wsClient.connect();
}

function render_realtime_stops(route, data, direction, routes_div) {
  // 選取按鈕
  if (direction == "去程") {
    button = document.getElementById("pills-go-tab");
  } else if (direction == "返程") {
    button = document.getElementById("pills-back-tab");
  }
  // 產生按鈕名稱
  button.textContent =
    "往" +
    (direction == "去程"
      ? routes_data[route].DestinationStopName
      : direction == "返程"
      ? routes_data[route].DepartureStopName
      : "");

  button.style.fontSize = "30px";

  let route_div = document.createElement("div");
  // 產生路線title
  let title_div = document.createElement("div");
  title_div.style.textAlign = "center";
  title_div.style.fontSize = "36px";
  title_div.style.margin = "0px 20px";
  title_div.style.border = "3px solid black";
  title_div.textContent =
    route +
    "  " +
    routes_data[route].DepartureStopName +
    "-" +
    routes_data[route].DestinationStopName +
    "(" +
    direction +
    ")" +
    "  往" +
    (direction == "去程"
      ? routes_data[route].DestinationStopName
      : direction == "返程"
      ? routes_data[route].DepartureStopName
      : "");
  // 站牌
  let stops_div = document.createElement("div");
  for (element of data) {
    let stop_div = document.createElement("div");
    stop_div.id = element.StopID;
    stop_div.style.display = "flex";
    stop_div.style.flexWrap = "wrap";
    stop_div.style.justifyContent = "center";
    stop_div.style.alignItems = "center";
    // stop_div.style.border = "solid 1px grey";
    stop_div.style.margin = "15px 5px";
    // 預估時間
    let estimate_div = document.createElement("div");
    estimate_div.className = "estimate-time-" + stop_div.id;
    estimate_div.style.width = "15%";
    estimate_div.style.fontSize = "30px";
    estimate_div.textContent = "讀取中..."; // 測試資料
    // 站牌名稱
    let stop_name_div = document.createElement("div");
    stop_name_div.style.width = "30%";
    stop_name_div.style.fontSize = "30px";
    stop_name_div.textContent = element.StopName;
    stop_name_div.style.textAlign = "center";
    stop_name_div.style.margin = "0px 30px";
    // 公車車牌
    let bus_plates_div = document.createElement("div");
    bus_plates_div.className = "bus-plates-" + stop_div.id;
    bus_plates_div.classList.add("bus-plates");
    bus_plates_div.style.width = "30%";

    // let bus_plate_div = document.createElement("div");
    // bus_plate_div.className = "bus-plate-" + stop_div.id;
    // bus_plate_div.style.display = "flex";
    // bus_plate_div.style.flexWrap = "wrap";
    // bus_plate_div.style.justifyContent = "center";
    // bus_plate_div.style.alignItems = "center";

    // let plate_numb = document.createElement("div");
    // plate_numb.textContent = "";
    // let plate_data = document.createElement("div");
    // plate_data.textContent = "";

    // bus_plate_div.appendChild(plate_numb);
    // bus_plate_div.appendChild(plate_data);

    // bus_plates_div.appendChild(bus_plate_div);

    stop_div.appendChild(estimate_div);
    stop_div.appendChild(stop_name_div);
    stop_div.appendChild(bus_plates_div);

    stops_div.appendChild(stop_div);
  }

  route_div.appendChild(title_div);
  route_div.appendChild(stops_div);

  // 放入去程、回程分頁中
  if (direction == "去程") {
    let div = document.getElementById("pills-go");
    div.appendChild(route_div);
  } else if (direction == "返程") {
    let div = document.getElementById("pills-back");
    div.appendChild(route_div);
  }
  // routes_div.appendChild(route_div);
}

function render_pages(pages_div, pages) {
  //
  let ul = document.createElement("ul");
  ul.className = "nav nav-pills mb-3";
  ul.id = "pills-tab";
  ul.role = "tablist";
  //
  let count = 0;
  for (page of pages) {
    let li = create_li_button(page, count);
    ul.appendChild(li);
    count++;
  }
  //
  let div = document.createElement("div");
  div.className = "tab-content";
  div.id = "pills-tabContent";
  //
  count = 0;
  for (page of pages) {
    let page_div = create_page_div(page, count);
    div.appendChild(page_div);
    count++;
  }

  pages_div.appendChild(ul);
  pages_div.appendChild(div);
}

function create_li_button(name, count) {
  let li = document.createElement("li");
  li.className = "nav-item";
  li.role = "presentation";
  let button = document.createElement("button");
  if (count === 0) {
    button.className = "nav-link active";
  } else {
    button.className = "nav-link";
  }
  button.id = `pills-${name}-tab`;
  button.setAttribute("data-bs-toggle", "pill");
  button.setAttribute("data-bs-target", `#pills-${name}`);
  button.type = "button";
  button.role = "tab";
  button.setAttribute("aria-controls", `pills-${name}`);
  button.setAttribute("aria-selected", true);
  li.appendChild(button);
  return li;
}

function create_page_div(name, count) {
  let div = document.createElement("div");
  if (count === 0) {
    div.className = "tab-pane fade show active";
  } else {
    div.className = "tab-pane fade";
  }
  div.id = `pills-${name}`;
  div.role = "tabpanel";
  div.setAttribute("aria-labelledby", `pills-${name}-tab`);
  return div;
}

function render_realtime_map(route, shape_go, shape_back) {
  console.log(shape_go);
  console.log(shape_back);

  // 選取按鈕
  button = document.getElementById("pills-map-tab");
  // 產生按鈕名稱
  button.textContent = "路線地圖";
  button.style.fontSize = "30px";

  let route_div = document.createElement("div");
  // 產生路線title
  let title_div = document.createElement("div");
  title_div.style.textAlign = "center";
  title_div.style.fontSize = "36px";
  title_div.style.margin = "0px 20px";
  title_div.style.border = "3px solid black";
  title_div.textContent =
    route +
    "  " +
    routes_data[route].DepartureStopName +
    "-" +
    routes_data[route].DestinationStopName;

  // 將 linestring 轉為 array
  shape_go = line_string_to_array(shape_go[0]["Shape"]);
  shape_back = line_string_to_array(shape_back[0]["Shape"]);

  // 產生 map div
  map_div = document.createElement("div");
  map_div.id = "map";

  // 產生圖例 div
  legend_div = document.createElement("div");
  legend_div.height = "100px"
  // legend_div.style.border = "2px solid black"
  legend_div.style.display = "flex"
  legend_div.style.justifyContent = "center"

  // 產生去程圖例
  legend_go_div = document.createElement("div")
  legend_go_div.style.display = "flex"
  legend_go_div.style.alignItems = "center"
  legend_go_div.style.justifyContent = "center"

  legend_go_text_div = document.createElement("div");
  legend_go_text_div.textContent = "去程"
  legend_go_text_div.style.fontSize = "25px"
  legend_go_text_div.style.margin = "0 10px"

  legend_go_canvas = document.createElement("canvas")
  legend_go_canvas.width = "100"
  legend_go_canvas.height = "50"
  ctx_go = legend_go_canvas.getContext("2d")
  ctx_go.beginPath();
  ctx_go.moveTo(0, 25);
  ctx_go.lineTo(200, 25);
  ctx_go.lineWidth = 10;
  ctx_go.strokeStyle = "red";
  ctx_go.stroke();

  legend_go_icon_div = document.createElement("div");
  icon_img = document.createElement("img");
  go_icon = localStorage.getItem("bus_go")
  icon_img.src = go_icon
  icon_img.width = "100"
  
  legend_go_icon_div.style.margin = "0 10px"
  legend_go_icon_div.appendChild(icon_img)
  
  legend_go_div.appendChild(legend_go_icon_div)
  legend_go_div.appendChild(legend_go_canvas)
  legend_go_div.appendChild(legend_go_text_div)
  
  legend_div.appendChild(legend_go_div)

  // 產生返程圖例
  legend_back_div = document.createElement("div")
  legend_back_div.style.display = "flex"
  legend_back_div.style.alignItems = "center"
  legend_back_div.style.justifyContent = "center"

  legend_back_text_div = document.createElement("div");
  legend_back_text_div.textContent = "返程"
  legend_back_text_div.style.fontSize = "25px"
  legend_back_text_div.style.margin = "0 10px"

  legend_back_canvas = document.createElement("canvas")
  legend_back_canvas.width = "100"
  legend_back_canvas.height = "50"
  ctx_back = legend_back_canvas.getContext("2d")
  ctx_back.beginPath();
  ctx_back.moveTo(0, 25);
  ctx_back.lineTo(200, 25);
  ctx_back.lineWidth = 10;
  ctx_back.strokeStyle = "blue";
  ctx_back.stroke();

  legend_back_icon_div = document.createElement("div");
  icon_img = document.createElement("img");
  go_icon = localStorage.getItem("bus_back")
  icon_img.src = go_icon
  icon_img.width = "100"
  
  legend_back_icon_div.style.margin = "0 10px"
  legend_back_icon_div.appendChild(icon_img)
  
  legend_back_div.appendChild(legend_back_icon_div)
  legend_back_div.appendChild(legend_back_canvas)
  legend_back_div.appendChild(legend_back_text_div)
  
  legend_div.appendChild(legend_go_div)
  legend_div.appendChild(legend_back_div)

  route_div.appendChild(title_div);
  route_div.appendChild(map_div);
  route_div.appendChild(legend_div)

  // 放入分頁中
  let div = document.getElementById("pills-map");
  div.appendChild(route_div);

  // 畫出 map
  draw_map(shape_go, shape_back, map_div);
}

function draw_map(shape_go, shape_back, map_div) {
  let all_shape = [];
  for (point of shape_go) {
    all_shape.push(point);
  }
  for (point of shape_back) {
    all_shape.push(point);
  }

  map = L.map("map");
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  let line_go = L.polyline(shape_go, { color: "red", opacity: 0.5 })
    .arrowheads({ yawn: 45, fill: true, frequency: "100px", size: "12px" })
    .addTo(map);
  let line_back = L.polyline(shape_back, { color: "blue", opacity: 0.5 })
    .arrowheads({ yawn: 45, fill: true, frequency: "100px", size: "12px" })
    .addTo(map);
  let line_all = L.polyline(all_shape);

  const resizeObserver = new ResizeObserver(() => {
    map.invalidateSize();
    map.fitBounds(line_all.getBounds());
  });

  resizeObserver.observe(map_div);
}

function render_bus_data(
  route_trip_last_week,
  route_trip_last_month,
  plate_trip_last_week,
  plate_trip_last_month
) {
  // 選取按鈕
  button = document.getElementById("pills-data-tab");
  // 產生按鈕名稱
  button.textContent = "數據資料";
  button.style.fontSize = "30px";

  let last_week_div = render_data_div(
    route_trip_last_week,
    plate_trip_last_week,
    "近七天數據"
  );
  let last_month_div = render_data_div(
    route_trip_last_month,
    plate_trip_last_month,
    "近三十天數據"
  );

  // 放入分頁中
  let div = document.getElementById("pills-data");
  div.appendChild(last_week_div);
  div.appendChild(last_month_div);
}

// 生成數據頁面
function render_data_div(route_last_data, plate_last_data, title) {
  // 建立近七天資訊 div
  let data_div = document.createElement("div");
  data_div.style.display = "flex";
  data_div.style.flexDirection = "column";
  data_div.style.padding = "20px 20px";
  data_div.style.border = "3px solid black";
  data_div.style.margin = "20px 20px";

  // 建立資料 title 名稱
  let last_data_title = document.createElement("div");
  last_data_title.style.fontSize = "3rem";
  last_data_title.textContent = title;

  // 建立全部 subroutes 路線 div
  let subroutes_div = document.createElement("div");
  subroutes_div.style.display = "flex";
  subroutes_div.style.flexDirection = "column";
  // subroutes_div.style.alignItems = "center";
  subroutes_div.style.padding = "20px 20px";

  for (route of route_last_data) {
    // 建立 subroute 區塊
    let subroute_div = document.createElement("div");
    subroute_div.style.padding = "20px 20px";
    // 建立 subroute 標題區塊
    let subroute_title_div = document.createElement("div");
    subroute_title_div.style.whiteSpace = "pre-wrap";
    subroute_title_div.style.fontSize = "2.5rem";
    let direction =
      route.Direction == "去程"
        ? "往" + route.DestinationStopName
        : route.Direction == "返程"
        ? "往" + route.DepartureStopName
        : "";
    subroute_title_div.textContent =
      route.OperatorName +
      " ---- " +
      route.SubRouteName +
      " ---- " +
      direction +
      "(" +
      route.Direction +
      ")" +
      " ---- " +
      "平均旅程：" +
      Math.floor(route.AVG_TripTime / 3600) +
      " 小時 " +
      Math.floor((route.AVG_TripTime % 3600) / 60) +
      " 分 " +
      Math.floor((route.AVG_TripTime % 3600) % 60) +
      " 秒";

    // 建立 plates 區塊
    let plates_div = document.createElement("div");
    plates_div.style.display = "flex";
    plates_div.style.flexWrap = "wrap";
    subroutes_div.style.padding = "20px 20px";

    for (plate of plate_last_data) {
      if (
        plate.OperatorName === route.OperatorName &&
        plate.SubRouteName === route.SubRouteName &&
        plate.Direction === route.Direction
      ) {
        // 建立車牌 div
        let plate_div = document.createElement("div");
        plate_div.style.whiteSpace = "pre-wrap";
        plate_div.style.fontSize = "2rem";
        // plate_div.style.border = "solid 2px black";
        plate_div.style.padding = "10px 10px";
        plate_div.style.margin = "10px 10px";
        plate_div.style.display = "flex";
        plate_div.style.width = "90vw";
        // plate_div.style.flexDirection = "column"
        plate_div.style.alignItems = "center";

        context = value_to_string(plate.CompareResult);

        plate_div.textContent =
          plate.PlateNumb +
          " (" +
          context +
          ")" +
          " ， " +
          "平均旅程：" +
          Math.floor(plate.AVG_TripTime / 3600) +
          " 小時 " +
          Math.floor((plate.AVG_TripTime % 3600) / 60) +
          " 分 " +
          Math.floor((plate.AVG_TripTime % 3600) % 60) +
          " 秒" +
          " ， " +
          "數據：" +
          plate.DataCount +
          "筆。";

        let progress_bar_div = createProgressBar(plate.CompareResult);

        plate_div.appendChild(progress_bar_div);
        plates_div.appendChild(plate_div);
      }
    }

    subroute_div.appendChild(subroute_title_div);
    subroute_div.appendChild(document.createElement("hr"));
    subroute_div.appendChild(plates_div);

    subroutes_div.appendChild(subroute_div);
  }

  data_div.appendChild(last_data_title);
  data_div.appendChild(subroutes_div);
  return data_div;
}

// 產生狀態 bar
function createProgressBar(value) {
  // 確保值在 -1 到 1 之間
  value = Math.max(-1, Math.min(1, value));
  // 原本 -1 最快、 1 最慢，改為 1 最快、 -1 最慢
  value = value * -1;
  // 創建容器
  const container = document.createElement("div");
  container.style.width = "100px";
  container.style.height = "15px";
  // container.style.backgroundColor = "#f0f0f0";
  container.style.position = "relative";
  container.style.overflow = "hidden";
  container.style.margin = "10px 10px";
  container.style.border = "solid 1px black";

  // 創建進度條
  const bar = document.createElement("div");
  bar.style.height = "100%";
  bar.style.position = "absolute";
  bar.style.transition = "all 0.5s";

  // 設置顏色和寬度
  if (value < 0) {
    bar.style.right = "50%";
    bar.style.left = "auto";
    bar.style.width = `${Math.abs(value) * 50}%`;
    bar.style.backgroundColor = "red";
  } else {
    bar.style.left = "50%";
    bar.style.width = `${value * 50}%`;
    bar.style.backgroundColor = "green";
  }

  // 添加元素到容器
  container.innerHTML = "";
  container.appendChild(bar);
  return container;
}

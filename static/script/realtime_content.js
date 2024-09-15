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

  // 將數據格式轉換
  plate_trip_last_week = data_to_hash(plate_trip_last_week, "PlateNumb");
  plate_trip_last_month = data_to_hash(plate_trip_last_month, "PlateNumb");

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

  route_div.appendChild(title_div);
  route_div.appendChild(map_div);

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

}

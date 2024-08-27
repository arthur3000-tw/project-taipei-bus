initialize();

//初始化
async function initialize() {
  // 取得所有路線名稱
  response = await fetch("/Routes");
  data = await response.json();
  if (data.status === "ok") {
    for (element of data.data) {
      routes_data[element.RouteName] = element;
    }
    push_search_bar_data(data.data, "RouteName");
  } else {
    console.log(data.message);
  }
}

async function render_realtime_info() {
  // 清除連線
  if (wsClient != null) {
    wsClient.disconnect();
  }
  // 清除畫面
  clear_content();

  // 取得站牌
  let responses = await Promise.all([
    fetch("/Stops/" + this.id + "/去程"),
    fetch("/Stops/" + this.id + "/返程"),
  ]);
  let data = await Promise.all(responses.map((response) => response.json()));
  // 建立資料變數
  let route_go;
  let route_back;
  // 確認狀態
  for (eachData of data) {
    if (eachData.status === "error") {
      console.log(eachData.message);
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
  // 產生此路線的站牌
  console.log(route_go);
  console.log(route_back);
  let routes_div = document.createElement("div");
  render_realtime_stops(this.id, route_go, "去程", routes_div);
  render_realtime_stops(this.id, route_back, "返程", routes_div);
  content.appendChild(routes_div);
  // 建立連線
  wsClient = new WebSocketClient(
    "/ws/realtime/" + routes_data[this.id]["RouteID"]
  );
  wsClient.connect();
}

function render_realtime_stops(route, data, direction, routes_div) {
  let route_div = document.createElement("div");
  // title
  let title_div = document.createElement("div");
  title_div.style.textAlign = "center";
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
    // 預估時間
    let estimate_div = document.createElement("div");
    estimate_div.className = "estimate-time-" + stop_div.id;
    estimate_div.style.width = "30%";
    estimate_div.textContent = "讀取中..."; // 測試資料
    // 站牌名稱
    let stop_name_div = document.createElement("div");
    stop_name_div.style.width = "30%";
    stop_name_div.textContent = element.StopName;
    stop_name_div.style.textAlign = "center";
    // 公車車牌
    let bus_plates_div = document.createElement("div");
    bus_plates_div.style.width = "30%";
    let bus_plate_div = document.createElement("div");
    bus_plate_div.style.display = "flex";
    bus_plate_div.style.flexWrap = "wrap";
    bus_plate_div.style.justifyContent = "center";
    bus_plate_div.style.alignItems = "center";

    let plate_numb = document.createElement("div");
    plate_numb.textContent = "";
    let plate_data = document.createElement("div");
    plate_data.textContent = "";

    bus_plate_div.appendChild(plate_numb);
    bus_plate_div.appendChild(plate_data);

    bus_plates_div.appendChild(bus_plate_div);

    stop_div.appendChild(estimate_div);
    stop_div.appendChild(stop_name_div);
    stop_div.appendChild(bus_plates_div);

    stops_div.appendChild(stop_div);
  }

  route_div.appendChild(title_div);
  route_div.appendChild(stops_div);

  routes_div.appendChild(route_div);
}

function update_realtime_stops(data) {
  for (element of data) {
    update_estimate_div = document.querySelector(
      ".estimate-time-" + element.StopID
    );
    let status;
    switch (element.EstimateTime) {
      case "-1":
        status = "尚未發車";
        break;
      case "-2":
        status = "交管不停靠";
        break;
      case "-3":
        status = "末班車已過";
        break;
      case "-4":
        status = "今日未營運";
        break;
      default:
        status = element.EstimateTime;
    }
    if (status >= 0) {
      status = Math.floor(status / 60);
      if (status > 0) {
        status = status.toString() + "分";
      } else {
        status = "即將進站";
      }
    }
    try {
      update_estimate_div.textContent = status;
      isSuccess = true;
    } catch (e) {
      console.log(e);
      console.log(element);
    }
  }
}

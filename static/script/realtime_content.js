initialize();

//初始化
async function initialize() {
  // 取得所有路線名稱
  response = await fetch("/Routes");
  data = await response.json();
  if (data.status === "ok") {
    for (element of data.data) {
      routes_data[element.RouteName] = element
    }
    push_search_bar_data(data.data, "RouteName");
  } else {
    console.log(data.message);
  }
}

async function render_realtime_info() {
  // 清除連線
  if(wsClient != null){
    wsClient.disconnect()
  }
  // 清除畫面
  clear_content()
  // 建立連線
  wsClient = new WebSocketClient("/ws/realtime/" + this.id);
  wsClient.connect()
  // 取得站牌
  let responses = await Promise.all([
    fetch("/Stops/" + this.id +"/去程"),
    fetch("/Stops/" + this.id +"/返程"),
  ])
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

  console.log(route_go)
  console.log(route_back)
}

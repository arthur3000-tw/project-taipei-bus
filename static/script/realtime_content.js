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

function render_realtime_info() {
  if(wsClient != null){
    wsClient.disconnect()
  }
  clear_content()
  wsClient = new WebSocketClient("/ws/realtime/" + this.id);
  wsClient.connect()
}

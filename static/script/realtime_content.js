initialize();

//初始化
async function initialize() {
    // 取得所有路線名稱
    response = await fetch("/Routes");
    data = await response.json();
    if (data.status === "ok") {
      push_search_bar_data(data.data, "RouteName");
    } else {
      console.log(data.message);
    }
  }

function render_realtime_info(title) {
  console.log(title);
  wsClient.connect();
}

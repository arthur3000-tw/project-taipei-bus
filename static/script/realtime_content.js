let ws;
function render_realtime_info(title) {
  console.log(title);
  ws = new WebSocket("/ws/realtime")
  console.log(ws)
  ws.onmessage = (e) => {
    let data = e.data
    console.log(data)
    ws.send("test test")
  }
  
}

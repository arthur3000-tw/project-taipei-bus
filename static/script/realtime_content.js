function render_realtime_info(title) {
  console.log(title);
  let ws = new WebSocket("/ws/realtime")
  ws.onmessage = (e) => {
    let data = e.data
    console.log(data)
    ws.send("test test")
  }
  
}

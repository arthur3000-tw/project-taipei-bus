class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000; // 3 seconds
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      this.isConnected = true;
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected");
      this.isConnected = false;
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );
      setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      console.log("Max reconnect attempts reached");
    }
  }

  sendMessage(message) {
    if (this.isConnected) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  }

  handleMessage(data) {
    const message = JSON.parse(data);
    console.log("Received message:", message);
    // 在這裡處理接收到的消息
    if (message.message === "Estimate Time"){
      update_realtime_stops(message.data[0])
    } else if(message.message === "Bus Event"){
      update_realtime_bus(message.data[0])
    }
  }
}


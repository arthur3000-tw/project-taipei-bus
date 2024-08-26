from fastapi import WebSocket
from typing import List


class ConnectionManager():
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.route_ids: List[str] = []

    async def connect(self, websocket: WebSocket, route_id: str):
        await websocket.accept()
        await websocket.send_json({"data": "連線成功"})
        self.active_connections.append(websocket)
        self.route_ids.append(route_id)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast_message(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

    async def broadcast_json(self, data: dict):
        for connection in self.active_connections:
            await connection.send_json(data)

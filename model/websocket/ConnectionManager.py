from fastapi import WebSocket
from typing import List


class ConnectionManager():
    def __init__(self):
        self.activeConnections: List[WebSocket] = []
        self.routeNames: List[str] = []

    async def connect(self, websocket: WebSocket, routeName: str):
        await websocket.accept()
        await websocket.send_json({"data": "連線成功", "routeName": routeName})
        self.activeConnections.append(websocket)
        self.route_ids.append(routeName)

    def disconnect(self, websocket: WebSocket):
        self.activeConnections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast_message(self, message: str):
        for connection in self.activeConnections:
            await connection.send_text(message)

    async def broadcast_json(self, data: dict):
        for connection in self.activeConnections:
            await connection.send_json(data)

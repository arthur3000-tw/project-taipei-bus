from fastapi import WebSocket
from typing import List
from model.model.ResponseModel import MyResponse


class ConnectionManager:
    def __init__(self, estimateTimeCache):
        self.activeConnections: List[WebSocket] = []
        self.routeNames: dict = {}
        self.estimateTimeCache = estimateTimeCache

    async def connect(self, websocket: WebSocket, routeName: str):
        await websocket.accept()
        await websocket.send_json({"data": "連線成功", "routeName": routeName})
        self.activeConnections.append(websocket)
        self.routeNames[websocket] = routeName

    def disconnect(self, websocket: WebSocket):
        self.activeConnections.remove(websocket)
        del self.routeNames[websocket]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast_message(self, message: str):
        for connection in self.activeConnections:
            await connection.send_text(message)

    async def broadcast_json(self):
        for connection in self.activeConnections:
            await connection.send_json(MyResponse(status="ok", data=[self.estimateTimeCache.data]).model_dump())

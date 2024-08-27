from fastapi import WebSocket
from typing import List
from model.model.ResponseModel import MyResponse


class ConnectionManager:
    def __init__(self, estimateTimeCache):
        self.activeConnections: List[WebSocket] = []
        self.routeIDs: dict = {}
        self.estimateTimeCache = estimateTimeCache

    async def connect(self, websocket: WebSocket, routeID: str):
        await websocket.accept()
        await websocket.send_json({"data": "連線成功", "routeID": routeID})
        await websocket.send_json(MyResponse(status="ok",
                                             message="Estimate Time",
                                             data=[self.estimateTimeCache.data[int(routeID)]]
                                             ).model_dump())
        self.activeConnections.append(websocket)
        self.routeIDs[websocket] = routeID

    def disconnect(self, websocket: WebSocket):
        self.activeConnections.remove(websocket)
        del self.routeIDs[websocket]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast_message(self, message: str):
        for connection in self.activeConnections:
            await connection.send_text(message)

    async def broadcast_json(self):
        for connection in self.activeConnections:
            await connection.send_json(MyResponse(status="ok",
                                                  message="Estimate Time",
                                                  data=[self.estimateTimeCache.data[int(self.routeIDs[connection])]]
                                                  ).model_dump())

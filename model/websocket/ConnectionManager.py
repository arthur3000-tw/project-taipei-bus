from fastapi import WebSocket
from typing import List
from model.model.ResponseModel import MyResponse


class ConnectionManager:
    def __init__(self, estimateTimeCache, busEventCache, busDataCache):
        self.activeConnections: List[WebSocket] = []
        self.routeIDs: dict = {}
        self.estimateTimeCache = estimateTimeCache
        self.busEventCache = busEventCache
        self.busDataCache = busDataCache

    async def connect(self, websocket: WebSocket, routeID: str):
        await websocket.accept()
        await websocket.send_json({"data": "連線成功", "routeID": routeID})
        await websocket.send_json(MyResponse(status="ok",
                                             message="Estimate Time",
                                             data=[
                                                 self.estimateTimeCache.data[int(routeID)]]
                                             ).model_dump())
        try:
            await websocket.send_json(MyResponse(status="ok",
                                                 message="Bus Event",
                                                 data=[
                                                     self.busEventCache.data[routeID]]
                                                 ).model_dump())
        except KeyError:
            pass
        try:
            await websocket.send_json(MyResponse(status="ok",
                                                 message="Bus Data",
                                                 data=[
                                                     self.busDataCache.data[routeID]]
                                                 ).model_dump())
        except KeyError:
            pass
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

    async def broadcast_json(self, dataName):
        if dataName == "Estimate Time":
            for connection in self.activeConnections:
                await connection.send_json(MyResponse(status="ok",
                                                      message="Estimate Time",
                                                      data=[self.estimateTimeCache.data[int(
                                                          self.routeIDs[connection])]]
                                                      ).model_dump())
        try:
            if dataName == "Bus Event":
                for connection in self.activeConnections:
                    await connection.send_json(MyResponse(status="ok",
                                                          message="Bus Event",
                                                          data=[self.busEventCache.data[
                                                              self.routeIDs[connection]]]
                                                          ).model_dump())
        except KeyError:
            pass
        try:
            if dataName == "Bus Data":
                for connection in self.activeConnections:
                    await connection.send_json(MyResponse(status="ok",
                                                          message="Bus Data",
                                                          data=[self.busDataCache.data[
                                                              self.routeIDs[connection]]]
                                                          ).model_dump())
        except KeyError:
            pass

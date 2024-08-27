from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from apscheduler.schedulers.asyncio import AsyncIOScheduler

router = APIRouter()
scheduler = AsyncIOScheduler()


@router.websocket("/ws/realtime/{route_id}")
async def get_real_time_data(websocket: WebSocket, route_id: str):
    myWebSocket = websocket.app.state.websocket
    await myWebSocket.connect(websocket, route_id)
    try:
        while True:
            data = await websocket.receive_json()
            print(data)
    except WebSocketDisconnect:
        myWebSocket.disconnect(websocket)

from fastapi import APIRouter, WebSocket

router = APIRouter()


@router.websocket("/ws/realtime/{route_id}")
async def get_real_time_data(websocket: WebSocket, route_id: str):
    myWebSocket = websocket.app.state.websocket
    await myWebSocket.connect(websocket, route_id)

from fastapi import APIRouter, WebSocket

router = APIRouter()


@router.websocket("/ws/realtime")
async def get_real_time_data(websocket: WebSocket):
    myWebSocket = websocket.app.state.websocket
    await myWebSocket.connect(websocket)

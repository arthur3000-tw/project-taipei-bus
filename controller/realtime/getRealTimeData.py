from fastapi import APIRouter, Request, WebSocket, WebSocketDisconnect

router = APIRouter()


@router.websocket("/ws/realtime")
async def get_real_time_data(request: Request, websocket: WebSocket):
    myWebSocket = request.app.state.websocket
    await myWebSocket.connect(websocket)

    try:
        while True:
            await myWebSocket.broadcast({"data": "test"})
    except WebSocketDisconnect:
        myWebSocket.disconnect(websocket)

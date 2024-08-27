from fastapi import APIRouter, WebSocket
from apscheduler.schedulers.asyncio import AsyncIOScheduler

router = APIRouter()
scheduler = AsyncIOScheduler()


@router.websocket("/ws/realtime/{route_id}")
async def get_real_time_data(websocket: WebSocket, route_id: str):
    myWebSocket = websocket.app.state.websocket
    await myWebSocket.connect(websocket, route_id)


@router.on_event("startup")
def start_scheduler():
    scheduler.add_job(, "interval", seconds=5)
    scheduler.start()



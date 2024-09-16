from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from datetime import time
from model.model.ResponseModel import MyResponse
from model.get.trip.routePlatesTime import route_plates_time

router = APIRouter()


@router.get("/Route/Plates/TripTime")
async def get_route_plates_time(request: Request, route_name: str,
                                start_time: time, end_time: time):
    myDB = request.app.state.db
    try:
        return route_plates_time(myDB, route_name, start_time, end_time)
    except Exception:
        return JSONResponse(status_code=400, content=MyResponse(status="error", message="無法取得資訊").model_dump())

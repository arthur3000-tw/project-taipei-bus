from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from datetime import datetime, date
from model.model.ResponseModel import MyResponse
from model.get.trip.routeDateTime import route_datetime

router = APIRouter()


@router.get("/Route/TripDateTime")
async def get_route_datetime(request: Request, route_name: str,
                             start_datetime: datetime | date, end_datetime: datetime | date):
    myDB = request.app.state.db
    try:
        return route_datetime(myDB, route_name, start_datetime, end_datetime)
    except Exception:
        return JSONResponse(status_code=400, content=MyResponse(status="error", message="無法取得資訊").model_dump())

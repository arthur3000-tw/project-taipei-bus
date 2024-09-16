from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from model.model.ResponseModel import MyResponse
from model.get.calculated.routeTripLastWeekData import route_trip_last_week_data

router = APIRouter()


@router.get("/LastWeek/RouteTrip/{routeName}")
async def get_route_trip_last_week_data(request: Request, routeName: str):
    myDB = request.app.state.db
    try:
        return route_trip_last_week_data(myDB, routeName)
    except Exception:
        return JSONResponse(status_code=400, content=MyResponse(status="error", message="無法取得資訊").model_dump())

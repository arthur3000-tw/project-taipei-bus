from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from model.model.ResponseModel import MyResponse
from model.get.calculated.routeTripLastMonthData import route_trip_last_month_data

router = APIRouter()


@router.get("/LastMonth/RouteTrip/{routeName}")
async def get_route_trip_last_month_data(request: Request, routeName: str):
    myDB = request.app.state.db
    try:
        return route_trip_last_month_data(myDB, routeName)
    except Exception:
        return JSONResponse(status_code=400, content=MyResponse(status="error", message="無法取得資訊").model_dump())

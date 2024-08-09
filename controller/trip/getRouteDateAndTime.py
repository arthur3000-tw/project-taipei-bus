from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from datetime import time, date
from model.model.ResponseModel import MyResponse
from model.get.trip.routeDateAndTime import route_date_and_time

router = APIRouter()

@router.get("/TripDateAndTime/")
async def get_route_datetime(request:Request,route_name:str,start_date:date,end_date:date,start_time:time,end_time:time):
    myDB = request.app.state.db
    try:
        return route_date_and_time(myDB,route_name,start_date,end_date,start_time,end_time)
    except:
        return JSONResponse(status_code=400,content=MyResponse(status="error",message="無法取得資訊").model_dump())
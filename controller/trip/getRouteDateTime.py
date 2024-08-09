from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from model.model.ResponseModel import MyResponse

router = APIRouter()

@router.get("/TripTime/")
async def get_route_datetime():
    return
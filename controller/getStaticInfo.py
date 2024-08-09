from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from model.get.operators import getOperators
from model.get.routes import getRoutes
from model.model.ResponseModel import MyResponse

router = APIRouter()

@router.get("/Operators")
async def get_operators(request: Request):
    myDB = request.app.state.db
    try:
        return getOperators(myDB)
    except:
        return JSONResponse(status_code=400,content=MyResponse(status="error",message="無法取得所有業者資訊").model_dump())

@router.get("/Routes/{operatorName}")
async def get_routes_by_operator(request:Request,operatorName:str):
    myDB = request.app.state.db
    try: 
        return getRoutes(myDB,operatorName)
    except:
        return JSONResponse(status_code=400,content=MyResponse(status="error",message="無法取得業者所有路線資訊").model_dump())
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from model.get.operators import getOperators
from model.get.routes import getRoutes
from model.get.routesByOperator import getRoutesByOperator
from model.get.operatorRoutesCount import getOperatorRoutesCount
from model.model.ResponseModel import MyResponse

router = APIRouter()


@router.get("/Operators")
async def get_operators(request: Request):
    myDB = request.app.state.db
    try:
        return getOperators(myDB)
    except Exception:
        return JSONResponse(status_code=400, content=MyResponse(status="error", message="無法取得所有業者資訊").model_dump())


@router.get("/Routes")
async def get_routes(request: Request):
    myDB = request.app.state.db
    try:
        return getRoutes(myDB)
    except Exception:
        return JSONResponse(status_code=400, content=MyResponse(status="error", message="無法取得業者所有路線資訊").model_dump())


@router.get("/Routes/{operatorName}")
async def get_routes_by_operator(request: Request, operatorName: str):
    myDB = request.app.state.db
    try:
        return getRoutesByOperator(myDB, operatorName)
    except Exception:
        return JSONResponse(status_code=400, content=MyResponse(status="error", message="無法取得業者所有路線資訊").model_dump())


@router.get("/OperatorRoutes")
async def get_operator_routes_count(request: Request):
    myDB = request.app.state.db
    try:
        return getOperatorRoutesCount(myDB)
    except Exception:
        return JSONResponse(status_code=400, content=MyResponse(status="error", message="無法取得所有業者資訊").model_dump())

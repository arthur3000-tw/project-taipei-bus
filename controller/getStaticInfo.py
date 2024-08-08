from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from model.get.operators import getOperator
from model.model.ResponseModel import MyResponse

router = APIRouter()

@router.get("/operators")
async def get_operators(request: Request):
    myDB = request.app.state.db
    try:
        result = getOperator(myDB)
        return result
    except:
        return JSONResponse(status_code=400,content=MyResponse(status="error",message="無法取得所有業者資訊").model_dump())
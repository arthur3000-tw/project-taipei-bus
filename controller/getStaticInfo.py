from fastapi import APIRouter, Request

router = APIRouter()

@router.get("/operators")
async def get_operators(request: Request):
    myDB = request.app.state.db
    return
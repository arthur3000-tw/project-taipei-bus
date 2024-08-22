from fastapi import APIRouter, Request
from fastapi.responses import FileResponse

router = APIRouter()


# index
@router.get("/", include_in_schema=False)
async def index(request: Request):
    return FileResponse("./static/index.html", media_type="text/html")


# analytics
@router.get("/analytics", include_in_schema=False)
async def analytics(request: Request):
    return FileResponse("./static/analytics.html", media_type="text/html")


# realtime
@router.get("/realtime", include_in_schema=False)
async def realtime(request: Request):
    return FileResponse("./static/realtime.html", media_type="text/html")

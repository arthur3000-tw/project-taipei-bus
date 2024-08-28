from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
# import os
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from contextlib import asynccontextmanager
from datetime import datetime
from pytz import timezone
from model.db import DB
from model.websocket import ConnectionManager
from model.cache import Data
from model.realtime.getEstimateTime import getEstimateTime
from model.realtime.getBusEvent import getBusEvent
from model.get.subrouteIDs import getSubroutesIDs
from model.table.getSubrouteID import getSubrouteIDTable
from controller import staticPage, getStaticInfo
from controller.trip import getRouteDateTime, getRouteTime, getRouteDateAndTime
from controller.trip import getRoutePlatesDateTime, getRoutePlatesTime, getRoutePlatesDateAndTime
from controller.calculated import getRouteTripLastWeekData, getRouteTripLastMonthData
from controller.calculated import getPlateTripLastWeekData, getPlateTripLastMonthData
from controller.realtime import getRealTimeData


# RealTimeData Cache 實體化
busEventCache = Data.DataCache()
estimateTimeCache = Data.DataCache()
# SubRoute ID Cache 實體化
subrouteIDCache = Data.DataCache()
# DB 實體化
myDB = DB.DB(host="localhost", database="taipei_bus")
# myDB = DB.DB(host=os.environ.get("DB_HOST"), database="taipei_bus")
myDB.initialize()
# Websocket 實體化
myWebSocket = ConnectionManager.ConnectionManager(
    estimateTimeCache, busEventCache)
# scheduler 實體化
scheduler = AsyncIOScheduler(timezone=timezone("ROC"))


# 設定啟動及結束動作
@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.start()
    subrouteIDCache.setData(
        getSubrouteIDTable(
            getSubroutesIDs(myDB).model_dump()["data"]
        )
    )
    yield
    scheduler.shutdown()

# 實體化 fastapi
app = FastAPI(lifespan=lifespan)
# 設置靜態檔案路徑
app.mount("/static", StaticFiles(directory='static', html=True))

# db instance 存放於 app.state 中
app.state.db = myDB
# Cache instance 加入 app state 中
app.state.busEventCache = busEventCache
app.state.estimateTimeCache = estimateTimeCache
# websocket instance 存放於 app state 中
app.state.websocket = myWebSocket

# Get Static Info
app.include_router(getStaticInfo.router)

# Get Route Trip Time - DateTime
app.include_router(getRouteDateTime.router)

# Get Route Trip Time - Time
app.include_router(getRouteTime.router)

# Get Route Trip Time - Date And Time
app.include_router(getRouteDateAndTime.router)

# Get Plates Trip Time - DateTime
app.include_router(getRoutePlatesDateTime.router)

# Get Plates Trip Time - Time
app.include_router(getRoutePlatesTime.router)

# Get Plates Trip Time - Date And Time
app.include_router(getRoutePlatesDateAndTime.router)

# Get Last Week Route Trip Data
app.include_router(getRouteTripLastWeekData.router)

# Get Last Month Route Trip Data
app.include_router(getRouteTripLastMonthData.router)

# Get Last Week Plate Trip Data
app.include_router(getPlateTripLastWeekData.router)

# Get Last Month Plate Trip Data
app.include_router(getPlateTripLastMonthData.router)

# Get Real Time Data
app.include_router(getRealTimeData.router)

# Static Pages
app.include_router(staticPage.router)


@scheduler.scheduled_job("interval", seconds=10, next_run_time=datetime.now())
async def start_scheduler():
    await getEstimateTime(myWebSocket, estimateTimeCache)
    await getBusEvent(subrouteIDCache, myWebSocket, busEventCache)

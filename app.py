from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
from model.db import DB
from controller import staticPage, getStaticInfo
from controller.trip import getRouteDateTime,getRouteTime,getRouteDateAndTime

# 實體化 fastapi
app = FastAPI()
# 設置靜態檔案路徑
app.mount("/static",StaticFiles(directory='static', html=True))

# DB 實體化
myDB = DB.DB(host="localhost",database="taipei_bus")
# myDB = DB.DB(host=os.environ.get("DB_HOST"),database="taipei_bus")
myDB.initialize()

# db instance 存放於 app.state 中
app.state.db = myDB

# Get Static Info
app.include_router(getStaticInfo.router)

# Get Route Trip Time - DateTime
app.include_router(getRouteDateTime.router)

# Get Route Trip Time - Time
app.include_router(getRouteTime.router)

# Get Route Trip Time - Date And Time
app.include_router(getRouteDateAndTime.router)

# Static Pages
app.include_router(staticPage.router)
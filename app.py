from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
from model.db import DB
from controller import staticPage

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
app.include_router()

# Static Pages
app.include_router(staticPage.router)
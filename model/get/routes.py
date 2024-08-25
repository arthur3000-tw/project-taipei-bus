from model.model.ResponseModel import MyResponse


def getRoutes(myDB):
    # DB 指令
    sql = "SELECT DISTINCT RouteName FROM routes_info"
    # 執行查詢
    result = myDB.query(sql)
    # 無查詢到資料
    if len(result) == 0:
        return MyResponse(status="error", message="查無資料")
    # 回傳資料
    return MyResponse(status="ok", data=result)

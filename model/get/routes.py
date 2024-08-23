from model.model.ResponseModel import MyResponse


def getRoutes(myDB, operatorName):
    # DB 指令
    sql = "SELECT RouteName, RouteID, SubRouteID FROM routes_info \
           WHERE OperatorName=%s \
           group by RouteName, RouteID, SubRouteID \
           order by RouteName"
    val = (operatorName,)
    # 執行查詢
    result = myDB.query(sql, val)
    print(result)
    # 無查詢到資料
    if len(result) == 0:
        return MyResponse(status="error", message="查無資料")
    # 回傳資料
    return MyResponse(status="ok", data=result)

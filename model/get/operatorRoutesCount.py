from model.model.ResponseModel import MyResponse


def getOperatorRoutesCount(myDB):
    # DB 指令
    sql = "SELECT OperatorName, COUNT(DISTINCT(RouteName)) AS Count FROM routes_info \
           GROUP BY OperatorName \
           ORDER BY Count DESC"
    # 執行查詢
    result = myDB.query(sql)
    # 無查詢到資料
    if len(result) == 0:
        return MyResponse(status="error", message="查無資料")
    # 回傳資料
    return MyResponse(status="ok", data=result)

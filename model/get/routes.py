from model.model.ResponseModel import MyResponse

def getRoutes(myDB,operatorName):
    # DB 指令
    sql = "SELECT OperatorName, RouteName FROM routes_info \
           WHERE OperatorName=%s \
           group by RouteName, OperatorName \
           order by OperatorName"
    val = (operatorName,)
    # 執行查詢
    result = myDB.query(sql)
    # 無查詢到資料
    if len(result) == 0:
        return MyResponse(status="error",message="查無資料")
    return MyResponse(status="ok",data=result)
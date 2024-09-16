from model.model.ResponseModel import MyResponse


def getStopsByRoute(myDB, routeName, direction):
    # DB 指令
    sql = "SELECT DISTINCT StopName, StopID \
           FROM (SELECT StopName, count(StopName), StopID \
                 FROM stops_info \
                 WHERE RouteName=%s \
                 AND Direction=%s \
                 GROUP BY StopName, StopID, StopSequence \
                 ORDER BY StopSequence) AS t"
    val = (routeName, direction)
    # 執行查詢
    result = myDB.query(sql, val)
    # 無查詢到資料
    if len(result) == 0:
        return MyResponse(status="error", message="查無資料")
    # 回傳資料
    return MyResponse(status="ok", message=direction, data=result)

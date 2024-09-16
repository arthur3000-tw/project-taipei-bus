from model.model.ResponseModel import MyResponse


def getShapeByRoute(myDB, routeName, direction):
    # DB 指令
    sql = "SELECT ST_ASTEXT(Shape) AS Shape \
           FROM shapes_info \
           WHERE RouteName=%s \
           AND Direction=%s"
    val = (routeName, direction)
    # 執行查詢
    result = myDB.query(sql, val)
    # 無查詢到資料
    if len(result) == 0:
        return MyResponse(status="error", message="查無資料")
    # 回傳資料
    return MyResponse(status="ok", message=direction, data=result)

from model.model.ResponseModel import MyResponse

# 資料描述：「公車路線」中所有「車牌」平均每趟時間（去程、返程）
# 資料區間：「日期」期間中的「時段」資料
def route_plates_date_time(myDB,route_name,start_date,end_date,start_time,end_time):
    # DB 指令
    sql = "SELECT PlateNumb, Direction, AVG(TripTime), STDDEV(TripTime), COUNT(TripTime) FROM route_time_records \
        WHERE RouteName=%s AND \
        TripStartTime BETWEEN %s AND %s AND \
        Time(TripStartTime) BETWEEN %s AND %s \
        GROUP BY PlateNumb, Direction"
    val = (route_name,start_date,end_date,start_time,end_time)
    # 執行查詢
    result = myDB.query(sql,val)
    # 無查詢到資料
    if len(result) == 0:
        return MyResponse(status="error",message="查無資料")
    # 回傳資料
    return MyResponse(status="ok",data=result)
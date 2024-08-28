import httpx
import gzip
import json


async def async_get_request(address):
    async with httpx.AsyncClient() as client:
        response = await client.get(address)
        compressed_content = response.read()
        decompressed_content = gzip.decompress(compressed_content)
    return decompressed_content


async def getBusEvent(myWebSocket, busEventCache):
    response = await async_get_request(
        "https://tcgbusfs.blob.core.windows.net/blobbus/GetBusEvent.gz")

    results = json.loads(response)

    all_data = {}

    for result in results["BusInfo"]:
        try:
            routeID = subroutID_table[result["RouteID"]]

            if routeID not in all_data:
                all_data[routeID] = []

            all_data[routeID].append({
                "BusID": result["BusID"],
                "CarType": result["CarType"],
                "DutyStatus": result["DutyStatus"],
                "BusStatus": result["BusStatus"],
                "StopID": result["StopID"],
                "GoBack": result["GoBack"],
                "CarOnStop": result["CarOnStop"],
                "DataTime": result["DataTime"]
            })
        except KeyError:
            continue
    
    busEventCache.data = all_data
    await myWebSocket.broadcast_json()
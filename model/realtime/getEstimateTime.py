import httpx
import gzip
import json


async def async_get_request(address):
    async with httpx.AsyncClient() as client:
        response = await client.get(address)
        compressed_content = response.read()
        decompressed_content = gzip.decompress(compressed_content)
    return decompressed_content


async def getEstimateTime(myWebSocket, estimateTimeCache):
    response = await async_get_request(
        "https://tcgbusfs.blob.core.windows.net/blobbus/GetEstimateTime.gz")

    results = json.loads(response)

    all_data = {}

    for result in results["BusInfo"]:
        if result["RouteID"] not in all_data:
            all_data[result["RouteID"]] = {}

        all_data[result["RouteID"]].update({result["StopID"]: {
            "EstimateTime": result["EstimateTime"],
            "GoBack": result["GoBack"]
        }})

    estimateTimeCache.data = all_data
    await myWebSocket.broadcast_json()

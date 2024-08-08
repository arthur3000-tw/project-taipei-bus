from pydantic import BaseModel, Json

class Response(BaseModel):
    status: str
    message: str = None
    data: Json = None
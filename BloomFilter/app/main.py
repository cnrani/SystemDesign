from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from .bloom_filter import BloomFilter

app = FastAPI(
    title="Bloom Filter API",
    description="A REST API for interacting with a Bloom Filter implementation",
    version="1.0.0"
)

# Initialize Bloom Filter with configuration from environment variables
BLOOM_FILTER_SIZE = int(os.getenv("BLOOM_FILTER_SIZE", "1000000"))
FALSE_POSITIVE_RATE = float(os.getenv("FALSE_POSITIVE_RATE", "0.01"))

bloom_filter = BloomFilter(BLOOM_FILTER_SIZE, FALSE_POSITIVE_RATE)

class ElementRequest(BaseModel):
    element: str

@app.post("/api/bloom/add")
async def add_element(request: ElementRequest):
    """
    Add an element to the Bloom Filter.
    """
    try:
        bloom_filter.add(request.element)
        return {"message": f"Element '{request.element}' added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/bloom/check/{element}")
async def check_element(element: str):
    """
    Check if an element exists in the Bloom Filter.
    """
    try:
        exists = bloom_filter.check(element)
        return {
            "element": element,
            "exists": exists,
            "message": "Element might exist" if exists else "Element definitely does not exist"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/bloom/stats")
async def get_stats():
    """
    Get current statistics of the Bloom Filter.
    """
    try:
        return bloom_filter.get_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """
    Root endpoint with basic information.
    """
    return {
        "message": "Welcome to the Bloom Filter API",
        "documentation": "/docs",
        "endpoints": {
            "add": "/api/bloom/add",
            "check": "/api/bloom/check/{element}",
            "stats": "/api/bloom/stats"
        }
    } 
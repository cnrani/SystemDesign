# Bloom Filter Playground

This project demonstrates a practical implementation of a Bloom Filter in a backend system. It includes a REST API service that allows users to interact with the Bloom Filter for membership testing.

## System Design

The system consists of the following components:

1. **Bloom Filter Service**: A Python-based service that implements the Bloom Filter data structure
2. **REST API**: FastAPI-based endpoints to interact with the Bloom Filter
3. **Docker Container**: Containerized application for easy deployment and testing

### Bloom Filter Implementation Details

- Uses multiple hash functions (MurmurHash3) for better distribution
- Configurable size and false positive rate
- Persistent storage of the filter state
- Thread-safe operations

## API Endpoints

- `POST /api/bloom/add`: Add an element to the Bloom Filter
- `GET /api/bloom/check/{element}`: Check if an element exists in the Bloom Filter
- `GET /api/bloom/stats`: Get current statistics of the Bloom Filter

## Running Locally

### Prerequisites

- Docker
- Docker Compose

### Steps to Run

1. Clone the repository
2. Run the following command:
```bash
docker-compose up --build
```

The service will be available at `http://localhost:8000`

### API Documentation

Once the service is running, visit `http://localhost:8000/docs` for interactive API documentation.

## Example Usage

```bash
# Add an element
curl -X POST "http://localhost:8000/api/bloom/add" -H "Content-Type: application/json" -d '{"element": "test@example.com"}'

# Check if element exists
curl "http://localhost:8000/api/bloom/check/test@example.com"

# Get statistics
curl "http://localhost:8000/api/bloom/stats"
```

## Project Structure

```
.
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── app/
│   ├── main.py
│   ├── bloom_filter.py
│   └── config.py
└── tests/
    └── test_bloom_filter.py
``` 
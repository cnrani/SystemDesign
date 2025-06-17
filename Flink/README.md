# Apache Flink Local Playground

This project provides a local development environment for Apache Flink using Docker. It includes a simple example job that processes streaming data.

## Project Structure
```
.
├── docker-compose.yml      # Docker Compose configuration for Flink cluster
├── src/                    # Source code directory
│   └── main/
│       └── python/        # Python Flink jobs
│           └── word_count.py
├── data/                  # Sample data directory
│   └── sample.txt
└── README.md             # This file
```

## Prerequisites
- Docker
- Docker Compose
- Python 3.7+ (for local development)

## Getting Started

1. Start the Flink cluster:
```bash
docker-compose up -d
```

2. Access the Flink Web UI:
- Open http://localhost:8081 in your browser
- You should see the Flink dashboard

3. Submit a job:
```bash
# Submit the example word count job
docker-compose exec jobmanager flink run -py /opt/flink/usrlib/word_count.py
```

4. Monitor the job:
- Go to the Flink Web UI
- Click on "Running Jobs"
- You should see your job running

## Components

- **JobManager**: Manages the Flink cluster and coordinates job execution
- **TaskManager**: Executes the actual tasks
- **Web UI**: Provides a dashboard for monitoring and managing jobs

## Stopping the Cluster

To stop the Flink cluster:
```bash
docker-compose down
```

## Development

To add new Flink jobs:
1. Create your Python file in the `src/main/python` directory
2. Mount the directory in the Docker container
3. Submit the job using the Flink CLI or Web UI

## Troubleshooting

If you encounter any issues:
1. Check the container logs: `docker-compose logs`
2. Ensure all ports are available
3. Verify Docker and Docker Compose are running correctly 

## Updated Docker Compose Configuration

```
services:
  jobmanager:
    build: .
    ports:
      - "8081:8081"
    command: jobmanager
    environment:
      - |
        FLINK_PROPERTIES=
        jobmanager.rpc.address: jobmanager
    volumes:
      - ./src/main/python:/opt/flink/usrlib
    networks:
      - flink-network

  taskmanager:
    build: .
    depends_on:
      - jobmanager
    command: taskmanager
    environment:
      - |
        FLINK_PROPERTIES=
        jobmanager.rpc.address: jobmanager
        taskmanager.numberOfTaskSlots: 2
    volumes:
      - ./src/main/python:/opt/flink/usrlib
    networks:
      - flink-network

networks:
  flink-network:
    driver: bridge 
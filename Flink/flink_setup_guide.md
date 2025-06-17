# Apache Flink Word Count Job Setup and Troubleshooting Guide

## Overview
This document outlines the step-by-step process of setting up and troubleshooting an Apache Flink word count job using Docker and Python.

## Prerequisites
- Docker
- Docker Compose
- Python 3
- Basic understanding of Apache Flink concepts

## Step-by-Step Implementation

### 1. Initial Setup
- Created a basic Flink cluster using Docker Compose
- Set up JobManager and TaskManager containers
- Created a Python word count job (`word_count.py`)

### 2. First Issue - Docker Build
**Problem**: Empty Dockerfile causing build failure

**Solution**: Created proper Dockerfile with:
```
FROM flink:latest
RUN apt-get update && apt-get install -y python3 python3-pip
RUN ln -s /usr/bin/python3 /usr/bin/python
```

### 3. Second Issue - JDK Headers
**Problem**: Missing JDK headers for PyFlink

**Solution**: Updated Dockerfile to include OpenJDK:
```
FROM flink:latest
RUN apt-get update && apt-get install -y openjdk-11-jdk python3 python3-pip
RUN ln -s /usr/bin/python3 /usr/bin/python
```

### 4. Third Issue - File Access
**Problem**: Job couldn't access input file

**Solution**: Added volume mount in docker-compose.yml:
```
volumes:
  - ./data:/opt/flink/data
```

### 5. Fourth Issue - CSV Format
**Problem**: Input file format mismatch

**Solution**: Updated schema in word_count.py to match CSV format:
```
CREATE TABLE source (
    word STRING,
    ts TIMESTAMP(3)
) WITH (
    'connector' = 'filesystem',
    'path' = '/opt/flink/data/sample.txt',
    'format' = 'csv'
)
```

### 6. Final Working Setup
**Components**:
- JobManager (port 8081)
- TaskManager
- Python job with:
  - File source (reading from sample.txt)
  - Word count processing
  - Print sink (output to console)

### 7. Job Execution Flow
1. Submit job:
```
docker-compose exec jobmanager flink run -py /opt/flink/usrlib/word_count.py
```
2. JobManager coordinates execution
3. TaskManager processes data
4. Results printed to TaskManager logs

### 8. Verification
1. Check job status:
```
curl -s http://localhost:8081/jobs
```
2. View results in TaskManager logs:
```
docker-compose logs taskmanager
```
3. Confirm word counts were correct

### 9. Current Working State
- Job successfully processes input file
- Counts words correctly
- Outputs results to console
- Job completes and shows FINISHED status

## Key Learning Points
1. Flink needs proper Python and JDK setup
2. File access requires correct volume mounting
3. Schema must match input data format
4. JobManager coordinates while TaskManager executes
5. Results can be viewed in TaskManager logs

## Architecture Overview
### JobManager (Master)
- Acts as the coordinator/master of the Flink cluster
- Receives and coordinates job execution
- Manages the overall job lifecycle
- Handles job scheduling and resource allocation
- Monitors TaskManager health
- Stores job metadata and checkpoints

### TaskManager (Worker)
- Executes the actual tasks/work
- Runs source tasks (reading from file)
- Performs data processing (word counting)
- Handles sink operations (printing results)
- Manages actual data processing

## Example Output
```
+I[hello, 1]
+I[world, 1]
+I[flink, 1]
+I[is, 1]
+I[awesome, 1]
-U[hello, 1]
+U[hello, 2]
-U[flink, 1]
+U[flink, 2]
+I[streaming, 1]
+I[processing, 1]
-U[is, 1]
+U[is, 2]
+I[powerful, 1]
```

## Output Format Explanation
- `+I`: Insert - new word count being added
- `-U`: Update - word count being updated
- `+U`: New value - count after update

## Final Word Counts
- hello: 2
- world: 1
- flink: 2
- is: 2
- awesome: 1
- streaming: 1
- processing: 1
- powerful: 1

## Next Steps for Production Setup
1. Add monitoring and metrics
2. Implement high availability
3. Configure security
4. Set up resource management
5. Implement state management
6. Add data management policies
7. Set up development tools
8. Configure operational tools

---

This document provides a comprehensive guide to setting up and troubleshooting a basic Flink word count job. It can be used as a reference for future Flink implementations and as a starting point for more complex Flink applications. 
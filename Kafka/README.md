# Kafka Playground 🚀

A Docker-based Kafka playground for local development and testing. This setup includes Kafka, Zookeeper, Kafka UI, and Kafka Connect for a complete streaming platform experience.

## Features

- 🐳 **Docker Compose** setup with all necessary services
- 🎛️ **Kafka UI** for visual topic and message management
- 🔧 **Kafka Connect** for data integration
- 📝 **Example scripts** for producers, consumers, and admin operations
- 🧪 **Test suite** for validation
- 📊 **Monitoring** and management tools

## Services Included

| Service | Port | Description |
|---------|------|-------------|
| Kafka | 9092 | Main Kafka broker |
| Zookeeper | 2181 | Kafka coordination service |
| Kafka UI | 8080 | Web interface for Kafka management |
| Kafka Connect | 8083 | Data integration platform |

## Quick Start

### 1. Prerequisites

- Docker and Docker Compose installed
- Node.js (for running examples)

### 2. Start Kafka Services

```bash
# Start all services in the background
npm run docker:up

# Check logs
npm run docker:logs

# Stop services
npm run docker:down
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Verify Setup

```bash
# Test connection and basic functionality
npm start

# Run comprehensive tests
npm test
```

## Usage Examples

### Basic Operations

```bash
# Create topics and show cluster info
npm run admin

# Send test messages
npm run producer

# Consume messages (run in separate terminal)
npm run consumer
```

### Web Interface

- **Kafka UI**: http://localhost:8080
  - View topics, partitions, and messages
  - Create and manage topics
  - Monitor consumer groups
  - Browse message content

- **Kafka Connect**: http://localhost:8083
  - Manage connectors
  - View connector status
  - Configure data pipelines

## Project Structure

```
kafka-playground/
├── docker-compose.yml      # Docker services configuration
├── package.json           # Node.js dependencies and scripts
├── index.js              # Main entry point
├── examples/             # Example scripts
│   ├── producer.js       # Message producer example
│   ├── consumer.js       # Message consumer example
│   └── admin.js          # Admin operations example
├── test/
│   └── test.js          # Test suite
└── README.md            # This file
```

## Example Code

### Producer Example

```javascript
const { kafka } = require('./index');

const producer = kafka.producer();
await producer.connect();

await producer.send({
  topic: 'my-topic',
  messages: [{
    key: 'user-123',
    value: JSON.stringify({ 
      event: 'user_signup',
      userId: 123,
      timestamp: new Date().toISOString()
    })
  }]
});
```

### Consumer Example

```javascript
const { kafka } = require('./index');

const consumer = kafka.consumer({ groupId: 'my-group' });
await consumer.connect();
await consumer.subscribe({ topic: 'my-topic' });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const data = JSON.parse(message.value.toString());
    console.log('Received:', data);
  }
});
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Run main application |
| `npm run producer` | Run example producer |
| `npm run consumer` | Run example consumer |
| `npm run admin` | Run admin operations |
| `npm test` | Run test suite |
| `npm run docker:up` | Start Docker services |
| `npm run docker:down` | Stop Docker services |
| `npm run docker:logs` | View service logs |
| `npm run docker:restart` | Restart services |

## Configuration

### Kafka Configuration

The Kafka broker is configured with:
- Auto topic creation enabled
- Single replica (suitable for development)
- JMX monitoring enabled
- Optimized for local development

### Topic Configuration

Default topic settings:
- 3 partitions for `test-topic`
- 1 day retention period
- Delete cleanup policy

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 2181, 8080, 8083, and 9092 are available
2. **Docker memory**: Kafka requires sufficient memory allocation
3. **Connection timeouts**: Wait for services to fully start (30-60 seconds)

### Useful Commands

```bash
# Check service status
docker-compose ps

# View specific service logs
docker-compose logs kafka

# Restart specific service
docker-compose restart kafka

# Clean up everything (including volumes)
docker-compose down -v
```

### Manual Kafka Commands

```bash
# Enter Kafka container
docker exec -it kafka bash

# List topics
kafka-topics --bootstrap-server localhost:9092 --list

# Create topic
kafka-topics --bootstrap-server localhost:9092 --create --topic my-topic --partitions 3 --replication-factor 1

# Send messages
kafka-console-producer --bootstrap-server localhost:9092 --topic my-topic

# Consume messages
kafka-console-consumer --bootstrap-server localhost:9092 --topic my-topic --from-beginning
```

## Development Tips

1. **Use Kafka UI** for visual debugging and topic management
2. **Monitor logs** with `npm run docker:logs` during development
3. **Test with different consumer groups** to understand message delivery
4. **Experiment with partitioning** for scalability testing
5. **Use unique topic names** in tests to avoid conflicts

## Next Steps

- Add schema registry for Avro/JSON schema management
- Implement Kafka Streams examples
- Add monitoring with Prometheus and Grafana
- Create more complex producer/consumer patterns
- Add SSL/SASL security configuration

## Resources

- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [KafkaJS Documentation](https://kafka.js.org/)
- [Confluent Platform](https://docs.confluent.io/)

Happy streaming! 🎉 
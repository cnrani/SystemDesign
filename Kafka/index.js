const { Kafka } = require('kafkajs');

// Kafka client configuration
const kafka = new Kafka({
  clientId: 'kafka-playground',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

async function main() {
  console.log('🚀 Kafka Playground Started!');
  console.log('📊 Kafka UI available at: http://localhost:8080');
  console.log('🔧 Kafka Connect available at: http://localhost:8083');
  console.log('');

  try {
    // Test connection
    const admin = kafka.admin();
    await admin.connect();
    console.log('✅ Connected to Kafka successfully!');

    // List existing topics
    const topics = await admin.listTopics();
    console.log('📋 Existing topics:', topics);

    await admin.disconnect();

    console.log('');
    console.log('Available commands:');
    console.log('  npm run producer  - Run example producer');
    console.log('  npm run consumer  - Run example consumer');
    console.log('  npm run admin     - Run admin operations');
    console.log('  npm run test      - Run basic tests');

  } catch (error) {
    console.error('❌ Error connecting to Kafka:', error.message);
    console.log('💡 Make sure Kafka is running: npm run docker:up');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { kafka };

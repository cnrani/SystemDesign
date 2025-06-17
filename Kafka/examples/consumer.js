const { kafka } = require('../index');

async function runConsumer() {
  const consumer = kafka.consumer({
    groupId: 'test-group',
    sessionTimeout: 30000,
    heartbeatInterval: 3000
  });

  try {
    await consumer.connect();
    console.log('🔗 Consumer connected to Kafka');

    const topic = 'test-topic';
    await consumer.subscribe({ topic: topic, fromBeginning: true }); //subscribe to the topic and read from the beginning
    console.log(`📥 Subscribed to topic: ${topic}`);

    await consumer.run({ //run the consumer
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = message.value ? message.value.toString() : null;
          const key = message.key ? message.key.toString() : null;
          const headers = message.headers || {};

          // Parse JSON if possible
          let parsedValue;
          try {
            parsedValue = JSON.parse(value);
          } catch {
            parsedValue = value;
          }

          console.log('📨 Received message:');
          console.log(`  Topic: ${topic}`);
          console.log(`  Partition: ${partition}`);
          console.log(`  Offset: ${message.offset}`);
          console.log(`  Key: ${key}`);
          console.log(`  Value:`, parsedValue);
          console.log(`  Headers:`, Object.fromEntries(
            Object.entries(headers).map(([k, v]) => [k, v.toString()])
          ));
          console.log(`  Timestamp: ${new Date(parseInt(message.timestamp)).toISOString()}`);
          console.log('---');

        } catch (error) {
          console.error('❌ Error processing message:', error);
        }
      },
    });

  } catch (error) {
    console.error('❌ Consumer error:', error);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down consumer...');
  process.exit(0);
});

if (require.main === module) {
  console.log('🎯 Starting consumer... Press Ctrl+C to stop');
  runConsumer().catch(console.error);
}

module.exports = { runConsumer }; 
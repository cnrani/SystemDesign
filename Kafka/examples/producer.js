const { kafka } = require('../index');
const { v4: uuidv4 } = require('uuid');

async function runProducer() {
  const producer = kafka.producer();

  try {
    await producer.connect();
    console.log('🔗 Producer connected to Kafka');

    const topic = 'test-topic';

    // Send messages in a loop
    for (let i = 0; i < 10; i++) {
      const message = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        message: `Hello Kafka! Message #${i + 1}`,
        data: {
          counter: i + 1,
          random: Math.random()
        }
      };

      await producer.send({
        topic: topic,
        messages: [
          {
            key: message.id,
            value: JSON.stringify(message),
            headers: {
              'content-type': 'application/json',
              'producer': 'kafka-playground'
            }
          }
        ]
      });

      console.log(`📤 Sent message ${i + 1}:`, message.message);

      // Wait 1 second between messages
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('✅ All messages sent successfully!');

  } catch (error) {
    console.error('❌ Producer error:', error);
  } finally {
    await producer.disconnect();
    console.log('🔌 Producer disconnected');
  }
}

if (require.main === module) {
  runProducer().catch(console.error);
}

module.exports = { runProducer }; 
const { kafka } = require('../index');
const { v4: uuidv4 } = require('uuid');

async function runTests() {
  console.log('🧪 Running Kafka playground tests...\n');

  const admin = kafka.admin();
  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: 'test-group-' + uuidv4() });

  try {
    // Test 1: Connection
    console.log('Test 1: Testing connection...');
    await admin.connect();
    await producer.connect();
    await consumer.connect();
    console.log('✅ All clients connected successfully\n');

    // Test 2: Topic creation
    console.log('Test 2: Creating test topic...');
    const testTopic = 'test-topic-' + uuidv4();
    try {
      await admin.createTopics({
        topics: [{
          topic: testTopic,
          numPartitions: 1,
          replicationFactor: 1
        }]
      });
      console.log(`✅ Topic '${testTopic}' created successfully\n`);
    } catch (error) {
      console.log(`ℹ️  Topic creation skipped: ${error.message}\n`);
    }

    // Test 3: Message production and consumption
    console.log('Test 3: Testing message production and consumption...');

    const testMessage = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      content: 'Test message from Kafka playground',
      testData: { number: 42, success: true }
    };

    // Set up consumer first
    await consumer.subscribe({ topic: testTopic, fromBeginning: true });

    let messageReceived = false;
    const messagePromise = new Promise((resolve) => {
      consumer.run({
        eachMessage: async ({ message }) => {
          const receivedMessage = JSON.parse(message.value.toString());
          console.log('📨 Message received:', receivedMessage.content);
          messageReceived = true;
          resolve(receivedMessage);
        }
      });
    });

    // Give consumer time to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Send message
    await producer.send({
      topic: testTopic,
      messages: [{
        key: testMessage.id,
        value: JSON.stringify(testMessage)
      }]
    });
    console.log('📤 Test message sent');

    // Wait for message to be received
    const receivedMessage = await Promise.race([
      messagePromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout waiting for message')), 10000)
      )
    ]);

    if (receivedMessage.id === testMessage.id) {
      console.log('✅ Message round-trip successful\n');
    } else {
      throw new Error('Message content mismatch');
    }

    // Test 4: Topic cleanup
    console.log('Test 4: Cleaning up test topic...');
    await admin.deleteTopics({ topics: [testTopic] });
    console.log('✅ Test topic deleted successfully\n');

    console.log('🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await Promise.all([
      admin.disconnect(),
      producer.disconnect(),
      consumer.disconnect()
    ]);
    console.log('🔌 All clients disconnected');
  }
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests }; 
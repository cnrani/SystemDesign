const { kafka } = require('../index');

async function runAdmin() {
  const admin = kafka.admin();

  try {
    await admin.connect();
    console.log('🔗 Admin client connected to Kafka');

    // Create topics
    const topicsToCreate = [
      {
        topic: 'test-topic',
        numPartitions: 3,
        replicationFactor: 1,
        configEntries: [
          { name: 'cleanup.policy', value: 'delete' },
          { name: 'retention.ms', value: '86400000' } // 1 day
        ]
      },
      {
        topic: 'events-topic',
        numPartitions: 1,
        replicationFactor: 1 // default is 7 days
      }
    ];
    // consequitively is correct word instead of synchrounously 
    console.log('📝 Creating topics...');
    try {
      await admin.createTopics({
        topics: topicsToCreate,
        waitForLeaders: true, // wait for leaders to be elected. Zookeeper is used to elect leaders and others are followers 
        timeout: 30000
      });
      console.log('✅ Topics created successfully');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Topics already exist');
      } else {
        throw error;
      }
    }

    // List topics
    console.log('\n📋 Listing all topics:');
    const topics = await admin.listTopics();
    topics.forEach(topic => console.log(`  - ${topic}`));

    // Get topic metadata
    console.log('\n📊 Topic metadata:');
    const metadata = await admin.fetchTopicMetadata({ topics: ['test-topic'] });
    metadata.topics.forEach(topic => {
      console.log(`  Topic: ${topic.name}`);
      console.log(`  Partitions: ${topic.partitions.length}`);
      topic.partitions.forEach(partition => {
        console.log(`    Partition ${partition.partitionId}: Leader ${partition.leader}`);
      });
    });

    // List consumer groups
    console.log('\n👥 Consumer groups:');
    const groups = await admin.listGroups();
    if (groups.groups.length === 0) {
      console.log('  No consumer groups found');
    } else {
      groups.groups.forEach(group => {
        console.log(`  - ${group.groupId} (${group.protocolType})`);
      });
    }

    // Get cluster info
    console.log('\n🏢 Cluster information:');
    const clusterInfo = await admin.describeCluster();
    console.log(`  Cluster ID: ${clusterInfo.clusterId}`);
    console.log(`  Controller: ${clusterInfo.controller}`);
    console.log(`  Brokers: ${clusterInfo.brokers.length}`);
    clusterInfo.brokers.forEach(broker => {
      console.log(`    Broker ${broker.nodeId}: ${broker.host}:${broker.port}`);
    });

  } catch (error) {
    console.error('❌ Admin error:', error);
  } finally {
    await admin.disconnect();
    console.log('\n🔌 Admin client disconnected');
  }
}

if (require.main === module) {
  runAdmin().catch(console.error);
}

module.exports = { runAdmin }; 
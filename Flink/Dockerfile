# Use the official Flink image as the base
FROM flink:1.17.0

# Install OpenJDK and Python
RUN apt-get update && \
    apt-get install -y openjdk-11-jdk python3 python3-pip && \
    mkdir -p /opt/java/openjdk && \
    ln -sf /usr/lib/jvm/java-11-openjdk-arm64/include /opt/java/openjdk/include && \
    pip3 install apache-flink

# Set Python 3 as default
RUN ln -sf /usr/bin/python3 /usr/bin/python && \
    ln -sf /usr/bin/pip3 /usr/bin/pip

# Set environment variables
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-arm64
ENV PATH=$JAVA_HOME/bin:$PATH

# Switch back to flink user
USER flink 
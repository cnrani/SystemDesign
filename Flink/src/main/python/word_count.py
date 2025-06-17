from pyflink.datastream import StreamExecutionEnvironment
from pyflink.table import StreamTableEnvironment, EnvironmentSettings
from pyflink.table.expressions import col
from pyflink.table.window import Tumble

def word_count():
    """
    A simple Flink job that performs word count on streaming data.
    This example demonstrates:
    1. Creating a streaming environment
    2. Reading from a file
    3. Processing the data using SQL
    4. Writing results to a print sink
    """
    # Create a streaming environment
    env = StreamExecutionEnvironment.get_execution_environment()
    
    # Create a table environment
    settings = EnvironmentSettings.new_instance().in_streaming_mode().build()
    t_env = StreamTableEnvironment.create(env, settings)

    # Create a source table that reads from a file
    source_ddl = """
        CREATE TABLE source (
            word STRING,
            ts TIMESTAMP(3)
        ) WITH (
            'connector' = 'filesystem',
            'path' = '/opt/flink/data/sample.txt',
            'format' = 'csv'
        )
    """

    # Create a sink table that prints to console
    sink_ddl = """
        CREATE TABLE sink (
            word STRING,
            w_count BIGINT
        ) WITH (
            'connector' = 'print'
        )
    """

    # Register the source and sink tables
    t_env.execute_sql(source_ddl)
    t_env.execute_sql(sink_ddl)

    # Create a query to count words
    t_env.sql_query("""
        SELECT 
            word,
            COUNT(*) as w_count
        FROM source
        GROUP BY word
    """).execute_insert('sink')

if __name__ == '__main__':
    word_count() 
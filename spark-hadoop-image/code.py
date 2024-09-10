from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, TimestampType
from pyspark.sql import Row
import os
from datetime import datetime
import subprocess

# Get Hadoop host from environment variable
hadoop_host_name = os.getenv('HADOOP_HOST', 'localhost')
hadoop_host = f"hdfs://{hadoop_host_name}:9000"

print("Contents of /etc/hosts:")
with open("/etc/hosts", "r") as hosts_file:
    print(hosts_file.read())

# Execute curl command to hadoop-master:9000
print(f"Attempting to curl {hadoop_host_name}:9000")
curl_result = subprocess.run(["curl", f"{hadoop_host_name}:9000"], capture_output=True, text=True)


# Initialize the Spark session
spark = SparkSession.builder \
    .appName("spark_hadoop") \
    .getOrCreate()

# Define a schema for the data
schema = StructType([
    StructField("user_id", StringType(), True),
    StructField("logged_in_time", TimestampType(), True)
])

# Create sample data
sample_data = [
    Row(user_id="user_1", logged_in_time=datetime(2024, 9, 1, 8, 30)),
    Row(user_id="user_2", logged_in_time=datetime(2024, 9, 1, 9, 45)),
    Row(user_id="user_3", logged_in_time=datetime(2024, 9, 1, 10, 0)),
    Row(user_id="user_4", logged_in_time=datetime(2024, 9, 1, 11, 15)),
]

# Create a DataFrame from the sample data
df = spark.createDataFrame(sample_data, schema)

# Print the DataFrame (optional)
df.show()

# Get the current date in dd/mm/yy format
current_date = datetime.now().strftime("%d_%m_%y")

# Define the HDFS path including the current date
hdfs_path = f"{hadoop_host}/user/logged_in_times_{current_date}.csv"

# Write the DataFrame as a CSV file to the Hadoop host (HDFS) with overwrite mode
df.write.mode("overwrite").csv(hdfs_path, header=True)

print(f"Data written to {hdfs_path}")



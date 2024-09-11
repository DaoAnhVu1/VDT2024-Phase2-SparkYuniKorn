from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, TimestampType
from pyspark.sql import Row
import os
from datetime import datetime
import time

hadoop_host_name = os.getenv('HADOOP_HOST', 'localhost')
hadoop_host = f"hdfs://{hadoop_host_name}:9000"

print(hadoop_host)

spark = SparkSession.builder \
    .appName("spark_hadoop") \
    .getOrCreate()

schema = StructType([
    StructField("user_id", StringType(), True),
    StructField("logged_in_time", TimestampType(), True)
])

time.sleep(10000)

# sample_data = [
#     Row(user_id="user_1", logged_in_time=datetime(2024, 9, 1, 8, 30)),
#     Row(user_id="user_2", logged_in_time=datetime(2024, 9, 1, 9, 45)),
#     Row(user_id="user_3", logged_in_time=datetime(2024, 9, 1, 10, 0)),
#     Row(user_id="user_4", logged_in_time=datetime(2024, 9, 1, 11, 15)),
# ]

# df = spark.createDataFrame(sample_data, schema)
# df.show()

# current_date = datetime.now().strftime("%d_%m_%y")
# hdfs_path = f"{hadoop_host}/user/logged_in_times_{current_date}.csv"

# df.write.mode("overwrite").csv(hdfs_path, header=True)

# print(f"Data written to {hdfs_path}")

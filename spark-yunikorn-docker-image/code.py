from pyspark.sql import SparkSession
from datetime import datetime
import os

aws_access = os.getenv('AWS_ACCESS', 'hello')
aws_secret = os.getenv('AWS_SECRET', 'hi')

print()
print(aws_access)
print(aws_secret)
print()

spark = SparkSession.builder \
    .appName("aws_s3") \
    .getOrCreate()

# Set S3 credentials
spark._jsc.hadoopConfiguration().set("fs.s3a.access.key", aws_access)
spark._jsc.hadoopConfiguration().set(
    "fs.s3a.secret.key", aws_secret)

s3_path = "s3a://sample-datalake-vdt02"

current_hour = datetime.now().hour

# Read the CSV file for the current hour
df = spark.read.csv(f"{s3_path}/raw_data/{current_hour}", header=True)

total_order = df.count()
total_amount = df.agg({"Amount": "sum"}).collect()[0][0]

# Count occurrences of each status
status_count_df = df.groupBy("Status").count()

# Collect status counts into a dictionary
status_count_dict = {row["Status"]: row["count"]
                     for row in status_count_df.collect()}

# Create a DataFrame for results
result_data = {
    "Total Orders": [total_order],
    "Total Amount": [total_amount]
}

# Add status counts to the result DataFrame
for status, count in status_count_dict.items():
    result_data[f"Status_{status}"] = [count]

# Convert result_data to a DataFrame
result_df = spark.createDataFrame(
    [(result_data["Total Orders"][0], result_data["Total Amount"][0]
      ) + tuple(result_data.get(f"Status_{status}", [0])[0] for status in status_count_dict)],
    schema=["Total Orders", "Total Amount"] +
    [f"Status_{status}" for status in status_count_dict]
)

# Write the result to S3
result_df.write.csv(
    f"{s3_path}/processed_data/{current_hour}", mode="overwrite", header=True)

print(f"Processed data for hour {current_hour}")

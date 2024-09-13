
from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, TimestampType
from pyspark.sql import Row
import os
from datetime import datetime
import time

spark = SparkSession.builder \
    .appName("spark_hadoop") \
    .getOrCreate()

time.sleep(10000)
from __future__ import annotations

import logging

from spark_on_k8s.client import ExecutorInstances, PodResources, SparkOnK8S

aws_access = 'your key'
aws_secret = 'your key'

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    spark_client = SparkOnK8S()
    spark_client.submit_app(
        image="spark-yunikorn-docker-image",
        app_path="local:///opt/spark/source/code.py",
        app_name="aws-s3",
        namespace="spark",
        service_account="spark",
        app_waiter="log",
        image_pull_policy="Never",
        ui_reverse_proxy=True,
        driver_resources=PodResources(cpu=1, memory=512, memory_overhead=128),
        executor_resources=PodResources(
            cpu=1, memory=512, memory_overhead=128),
        executor_instances=ExecutorInstances(initial=1),
        secret_values={
            "AWS_ACCESS": aws_access,
            "AWS_SECRET": aws_secret
        }
    )

# Batch processcing with Spark on K8S and Yunikorn resource scheduler

## Step 1: Start minikube or any other k8s service
To simulate a Kubernetes environment locally, use Minikube. Install Minikube and run the following command:
```sh
minikube start
```

## Step 2: Set up minikube
There are several things we need to set up on our k8s to run spark job.
- Create a namespace:  
  ```sh˝
  kubectl create namespace spark
  ```

- Create a service account with namespace:  
  ```sh
  kubectl create serviceaccount spark -n spark
  ```

- Bind admin role to the service account:    
  ```sh
  kubectl create clusterrolebinding spark-cluster-admin-binding \
  --clusterrole=cluster-admin \
  --serviceaccount=spark:spark \
  --namespace=spark
  ```

## Step 3: Setting up Yunikorn resource scheduler
To set up Yunikorn as the main resource scheduler for K8s, we will run:
```sh
helm repo add yunikorn https://apache.github.io/yunikorn-release
helm repo update
kubectl create namespace yunikorn
helm install yunikorn yunikorn/yunikorn --namespace yunikorn
```


## Step 4: Build Spark Docker image for minikube
Ensure you run ```eval $(minikube docker-env)``` to activate the Minikube environment before building an image. The Docker image must be available within Minikube, which you can check with: ```docker images```

For the Spark data processing code, we will include it inside a Spark image that supports Kubernetes. Download the required JAR files for Spark, which are ```hadoop-aws``` and ```aws-java-sdk-bundle```, ensuring both versions are compatible. One working combination is ```hadoop-aws:3.3.2``` and ```aws-java-sdk-bundle:1.12.115```.

Our Spark application will be executed in this image and when we change the code just build the image again. We will run ```spark-submit``` within the Dockerfile to run the Spark appication.

```sh
eval $(minikube docker-env)
docker build -t spark-yunikorn-docker-image ./spark-yunikorn-docker-image
```

## Step 5: Submit spark job to k8s
In this demo, there are 2 ways to submit spark job to K8s

### Use spark-on-k8s python packages
```sh
python ./submit-script/submit.py
```

### Use command line with Apache Spark
```sh
./spark/bin/spark-submit \
--master k8s://https://127.0.0.1:65168 \
--deploy-mode cluster \
--name aws-s3 \
--conf spark.kubernetes.container.image=spark-yunikorn-docker-image \
--conf spark.kubernetes.namespace=spark \
--conf spark.kubernetes.authenticate.driver.serviceAccountName=spark \
--conf spark.kubernetes.container.image.pullPolicy=Never \
--conf spark.driver.memory=1024m \
--conf spark.driver.cores=1 \
--conf spark.executor.memory=1024m \
--conf spark.executor.cores=1 \
--conf spark.kubernetes.driverEnv.AWS_ACCESS=your_key \
--conf spark.kubernetes.driverEnv.AWS_SECRET=your_key \
--conf spark.kubernetes.executorEnv.AWS_ACCESS=your_key\
--conf spark.kubernetes.executorEnv.AWS_SECRET=your_key \
--conf spark.driver.extraJavaOptions="-Divy.cache.dir=/tmp -Divy.home=/tmp" \
local:///opt/spark/source/code.py

```
FROM apache/spark:latest

USER root

RUN mkdir -p /opt/spark/source

RUN mkdir -p /opt/spark/conf

# Run this if not already install the jar file
# RUN curl -o /opt/spark/jars/hadoop-aws-3.3.2.jar https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/3.3.2/hadoop-aws-3.3.2.jar \
#     && curl -o /opt/spark/jars/aws-java-sdk-bundle-1.12.115.jar https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk-bundle/1.12.115/aws-java-sdk-bundle-1.12.115.jar

COPY hadoop-aws-3.3.2.jar /opt/spark/jars/
COPY aws-java-sdk-bundle-1.12.115.jar /opt/spark/jars/

COPY log4j2.properties /opt/spark/conf/log4j2.properties

COPY code.py /opt/spark/source/code.py
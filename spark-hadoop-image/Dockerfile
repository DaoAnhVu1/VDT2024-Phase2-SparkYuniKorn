FROM apache/spark:3.5.2

USER root

RUN mkdir -p /opt/spark/source /opt/spark/conf

COPY log4j2.properties /opt/spark/conf/log4j2.properties
COPY code.py /opt/spark/source/code.py
COPY inject_hosts.sh /opt/spark/source/inject_hosts.sh

RUN chmod +x /opt/spark/source/inject_hosts.sh

RUN /opt/spark/source/inject_hosts.sh

RUN apt-get update && apt-get install -y curl

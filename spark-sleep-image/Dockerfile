FROM apache/spark:3.5.2

USER root

RUN mkdir -p /opt/spark/source /opt/spark/conf

# Copy configuration and code files
COPY code.py /opt/spark/source/
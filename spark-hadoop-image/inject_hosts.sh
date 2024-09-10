#!/bin/bash

# Get the custom IP from the environment variable, or default to "127.0.0.1"
CUSTOM_IP=${CUSTOM_IP:-"127.0.0.1"}

# The hostname to map
HOSTNAME="hadoop-master"

# Update /etc/hosts with the custom IP and hostname
echo "$CUSTOM_IP $HOSTNAME" >> /etc/hosts

# Print the updated /etc/hosts for verification (optional)
cat /etc/hosts

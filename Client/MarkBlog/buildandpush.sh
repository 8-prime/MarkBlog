#!/bin/bash

# Define the Docker build and push commands
docker_build_command="docker build -t 8prime/markblogclient ."
docker_push_command="docker push 8prime/markblogclient"

# Execute the Docker build command
echo "Running Docker build..."
eval $docker_build_command

# Check the exit status of the Docker build command
if [ $? -eq 0 ]; then
    echo "Docker build completed successfully."
    
    # Execute the Docker push command
    echo "Running Docker push..."
    eval $docker_push_command

    # Check the exit status of the Docker push command
    if [ $? -eq 0 ]; then
        echo "Docker push completed successfully."
    else
        echo "Docker push failed."
    fi
else
    echo "Docker build failed."
fi

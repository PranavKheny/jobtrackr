# Use the official Python 3.13 image
FROM python:3.13-slim

# Create a non-root user and group for security
RUN addgroup --system mlgroup && adduser --system --group mluser

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your source code and models into the container
COPY src/ ./src/

# Change ownership of the /app directory to the non-root user
RUN chown -R mluser:mlgroup /app

# Switch to the non-root user
USER mluser

# Expose the port the FastAPI server runs on
EXPOSE 8000

# Command to run the server when the container starts
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
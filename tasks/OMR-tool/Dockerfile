FROM python:3.12-alpine

RUN pip install poetry==1.8.3

# Updates package manager for alpine and installs poppler-utils
# This is needed for the PDF2Image
RUN apk update
RUN apk add poppler-utils
# Set environment variables for poetry
# Sets a redundant virtualenv to fully isolate the project 
# (prevents issues with the container's poetry installation getting messed up) 
ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

WORKDIR /app

# Copies dependency files first
COPY pyproject.toml poetry.lock ./

# First, does not install dev dependencies to keep the image small
# Then, runs --no-root to prevent installing the project itself in this first step
#       This is done to prevent dependencies being installed on every code change
# Finally, Removes the poetry cache as it is not necessary for a container
RUN poetry install --without dev --no-root 

RUN rm -rf $POETRY_CACHE_DIR

# Copies the project files separately to prevent re-installing dependencies on every code change
COPY omr_tool ./omr_tool
# Copies the object inference module to the container
COPY object_inference ./object_inference
# Copies the trained model to the container
COPY model_training/trained_model_onnx/weights ./model_training/trained_model_onnx/weights

# Installs the project itself
RUN poetry install --without dev

ENTRYPOINT [ "poetry", "run", "python", "-m", "omr_tool.app"]


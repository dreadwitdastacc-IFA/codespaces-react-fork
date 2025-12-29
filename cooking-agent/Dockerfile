FROM ghcr.io/astral-sh/uv:latest

WORKDIR /app

# Copy project files
COPY pyproject.toml .
COPY uv.lock .
COPY src ./src

# Install dependencies using uv
RUN uv sync --frozen

CMD ["uv", "run", "python", "src/cli.py"]

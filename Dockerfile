FROM python:3.7-alpine3.13
COPY src .
RUN apk update && \
    apk upgrade && \
    pip install fastapi && \
    pip install uvicorn && \
    pip install jinja2
EXPOSE 8000
CMD ["uvicorn", "main:app"]
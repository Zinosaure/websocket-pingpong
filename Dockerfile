FROM tiangolo/uvicorn-gunicorn:python3.9-alpine3.14

COPY src .

RUN apk update && \
    apk upgrade && \
    pip install fastapi && \
    pip install jinja2
    
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
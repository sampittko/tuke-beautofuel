FROM python:3.8.6

RUN pip3 install fastapi uvicorn requests pydantic

EXPOSE 1338

COPY ./app ./app

CMD ["uvicorn", "app.main:app", "--port", "1338"]
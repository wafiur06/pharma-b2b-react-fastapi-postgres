FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
# Jodi apnar main file er nam 'main.py' na hoy, tobe nicher line e 'main:app' change kore sothik nam din
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

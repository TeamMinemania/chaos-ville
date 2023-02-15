FROM python:3

WORKDIR /usr/src/app

#COPY requirements.txt ./
#RUN pip install --no-cache-dir -r requirements.txt

COPY ./data.jsonl .

RUN pip install --upgrade pandas openai

# CMD [ "python", "./your-daemon-or-script.py" ]
CMD ["openai", "tools", "fine_tunes.prepare_data", "-f", "data.jsonl"]
'''
API Machine Learning
---------------------------
Autor: Inove Coding School
Version: 1.0
 
Descripcion:
Se utiliza Flask para crear un WebServer que levanta un
modelo de inteligencia artificial con machine learning
y realizar predicciones o clasificaciones

Ejecución: Lanzar el programa y abrir en un navegador la siguiente dirección URL
http://127.0.0.1:5000/

'''

__author__ = "Inove Coding School"
__email__ = "INFO@INOVE.COM.AR"
__version__ = "1.0"

import traceback
import json

from flask import Flask, request, jsonify, render_template, redirect
from flask_socketio import SocketIO
from flask_socketio import send, emit

app = Flask(__name__)
app.secret_key = 'ptSecret'
app.config['SECRET_KEY'] = 'ptSecret'
socketio = SocketIO(app)

# mqtt
import paho.mqtt.client as mqtt
client = mqtt.Client()

def on_connect(client, userdata, flags, rc):
    print("MQTT Conectado")
    client.subscribe("/sensores/celular/light")


def mqtt_connect():
    if client.is_connected() is False:
        try:
            client.connect("localhost", 1883, 10)
            print("Conectado al servidor MQTT")
            client.loop_start()
        except:
            print("No pudo conectarse")


def on_message(client, userdata, msg):
    light_value = str(msg.payload.decode("utf-8"))
    socketio.emit('light', int(light_value))


@app.route('/')
def home():
    mqtt_connect()
    return render_template('index.html')


@socketio.on('socket_event')
def handle_my_custom_event(data):
    client.publish("/sensores/celular/data", json.dumps(data))


@app.route('/light/<val>')
def light(val):
    socketio.emit('light', int(val))
    return f"light: {val}"


if __name__ == "__main__":
    client.on_connect = on_connect
    client.on_message = on_message

    # Certificados SSL:
    # https://blog.miguelgrinberg.com/post/running-your-flask-application-over-https
    app.run(debug=True, host="0.0.0.0", port=5005, ssl_context='adhoc')
![logotipo](inove.jpg)
# Celular Extractor
### Extractor de datos de celular basado en Flask

Este es un proyecto realizado por miembros de inove como un servicio para incorporar delemetría de los sensores de un celular para el programa de ejemplos del curso de Python IoT.

# Comenzando 🚀
El objetivo de este proyecto es dar un ejemplo de aplicación de Python en la generación de datos de sensores del tipo IoT (aceleŕometro, compass, GPS). Este proyecto se basa en tomar la telemetría de un celular y compartir dicha información por mqtt.

__IMPORTANTE__: La aplicación se desarrollo con certificados SSL no verificados, es por ello que cuando ingrese a la URL el explorador le consultará si "está seguro" que desea ingresar a la página "no segura". Su URL se verá como la siguiente:
```sh
https://<ip_host_flask>:5005
```

# Pre-requisitos 📋
Para poder ejecutar esta aplicación, será necesario tener instalada la versión 3.7 de Python o superior.\
Instale las librerias que se comentan en requirements.txt

# Tópicos de MQTT
Por defecto la aplicación busca conectarse a un broker MQTT local (localhost) en el puerto 1883. Los datos de telemetría de los sensores del celular son enviados al tópico:
```
/sensores/celular/data
```
Ejemplo usando mosquitto sub:
```sh
$ mosquitto_sub -t "/sensores/celular/data"
```

Puede controlar el estado de la linterna de la cámara (ON=1, OFF=0) desde el siguiente tópico:
```
/sensores/celular/light
```
Ejemplo usando mosquitto pub:
```sh
$ mosquitto_pub -t "/sensores/celular/light" -m 1
```

# Instalación y pruebas 🔧⚙️
Descargue el repositorio en su pc, luego lanzar el servicio de Docker con el siguiente comando:
```
docker build -t inove_chatbot .
docker run -d -p 8051:5000 -v $(pwd)/model:/opt/bot/model inove_chatbot
```
Or desde el docker-compose
```
docker-compose build
docker-compose up
```

Una vez levantado el server, ingresar con su celular a la página. Deberá conocer la IP del servidor en su red local para poder ingresar:
```ssh
https://<ip_host_flask>:5005
```
Inmediatamente después podrá ver en su MQTT broker la telemetría que evoluciona a medida que mueve el celular. Los comandos para ver los mensajes que llegan y como controlar la linterna por mqtt se encuentran en la sección anterior.


# Autores ✒️
### Miembros de Inove (coding school)
:octocat: Hernán Contigiani\
:octocat: Hector Vergara\
:octocat: Javier Carguno

# Licencia 📄
Este proyecto está bajo la Licencia de Inove (coding school) para libre descarga y uso. Este proyecto tiene un propósito educativo y de muestra, por ello, no nos responsabilizaremos por su uso indebido. Así mismo, no existe garantía en su implementación debido a que se trata de una demostración de uso gratuito con propósitos educativos. 
### :copyright: Inove (coding school) 2022.

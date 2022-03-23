
const consoleOutput = document.getElementById("console");
const log = function (msg) {
  consoleOutput.innerText = `${consoleOutput.innerText}\n${msg}`;
  console.log(msg);
}

let data = {
    light: false,
    latitude: -34.55,
    longitude: -58.496,
    heading: 0,
    acell_x: 0,
    acell_y: 0,
    acell_z: 0,
    giro_gamma: 0,
    giro_beta: 0,
    gir_alpha: 0,
}

// Evaluar si el explorador soporta el uso de mediaDevices
let SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator;
if (SUPPORTS_MEDIA_DEVICES) {
    // Obtener las camaras
    navigator.mediaDevices.enumerateDevices().then(devices => {

        const cameras = devices.filter((device) => device.kind === 'videoinput');

        // Evaluar si se ha encontra una camara
        if (cameras.length === 0) {
            log('No se ha encontrado ninguna cámara');
        }
        // Crear un stream y obtener el video track
        navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'environment',
        }
        }).then(stream => {
            const track = stream.getVideoTracks()[0];

            // Crear un image capture object y obtener la camara capabilities
            const imageCapture = new ImageCapture(track)
            imageCapture.getPhotoCapabilities().then(capabilities => {
                //let there be light!
                const btn = document.querySelector('#switch');
                const torchSupported = !!capabilities.torch || (
                'fillLightMode' in capabilities &&
                capabilities.fillLightMode.length != 0 &&
                capabilities.fillLightMode != 'none'
                );

                // ¿Se encuentra la linterna soportada?
                if (torchSupported) {
                    let torch = 0;
                    function switch_torch(value) {
                        try {
                            // Apagar o prender la linterna
                            track.applyConstraints({
                                advanced: [{
                                //torch: (torch = !torch)
                                torch: value
                                }]
                            });
                            // registrar último estado ingresado
                            torch = value;
                        } catch (err) {
                            log(err);
                        }
                    }
                    btn.addEventListener('click', function (e) {
                        // cambiar el estado actual
                        data.light = !data.light;
                    });
                    (function my_func() {
                        // Si cambio el estado deseado de la linterna
                        // actuar
                        if(data.light != torch) {
                            switch_torch(data.light);
                        }
                        setTimeout( my_func, 500 );
                    })();
                } 
                else {
                    log("No se encontró linterna");
                }
            }).catch(log);
        }).catch(log);
    }).catch(log);

  //The light will be on as long the track exists
}
else {
    log("Error, su device no soporta el uso de estas herramientas")
}

if ('DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', deviceOrientationHandler, false);
  } else {
    log('Device Orientation API not supported.');
  }
  
function deviceOrientationHandler (eventData) {
    let tiltLR = eventData.gamma;
    let tiltFB = eventData.beta;
    let dir = eventData.alpha;

    document.getElementById("doTiltLR").innerHTML = "gamma: " + Math.round(tiltLR);
    document.getElementById("doTiltFB").innerHTML = "beta: " + Math.round(tiltFB);
    document.getElementById("doDirection").innerHTML = "alpha: " + Math.round(dir);
    data.gamma = Math.round(tiltLR);
    data.beta = Math.round(tiltFB);
    data.alhpa = Math.round(dir);

    let logo = document.getElementById("imgLogo");
    logo.style.webkitTransform = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";
    logo.style.MozTransform = "rotate(" + tiltLR + "deg)";
    logo.style.transform = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";
}

/* Acelerometro */
let accelerometer = new Accelerometer();
accelerometer.addEventListener('reading', function(e) {
    document.getElementById('accelerometer').innerHTML = 'x: ' + e.target.x + ' y: ' + e.target.y + ' z: ' + e.target.z;
    data.acell_x = e.target.x;
    data.acell_y = e.target.y;
    data.acell_z = e.target.z;
});
accelerometer.start();


/* sensor orientacion */
let compass = document.getElementById('compass');
let sensor = new AbsoluteOrientationSensor();
sensor.addEventListener('reading', function(e) {
  let q = e.target.quaternion;
  heading = Math.atan2(2*q[0]*q[1] + 2*q[2]*q[3], 1 - 2*q[1]*q[1] - 2*q[2]*q[2])*(180/Math.PI);
  if(heading < 0) heading = 360+heading;
  heading = Math.round(heading);
  data.heading = heading;
  document.getElementById('heading').innerHTML = 'rotate(' + heading + 'deg)';
  
});
sensor.start();

/* GPS */
/* debe estar activada la posicion */
if (navigator && navigator.geolocation) {
    /* una vez por segundo consultar la ubicacion */
     (function my_func() {
        navigator.geolocation.getCurrentPosition(gpsCallback, errorCallback);
        setTimeout( my_func, 1000 );
    })();
}
else {
    log('Geolocation is not supported');
}
function errorCallback() {}
function gpsCallback(position) {
    data.latitude = position.coords.latitude;
    data.longitude = position.coords.longitude;
    document.getElementById('gps').innerHTML = position.coords.latitude + ',' + position.coords.longitude;
}

let socket_connected = false;
let socket = io();
    socket.on("connect", function() {
        socket_connected = true;
        socket.on('light', function (msg) {
            data.light = Number(msg);
        });
    });

(function my_func() {
    if (socket_connected == true){
        socket.emit("socket_event", data);
    }
    setTimeout( my_func, 500 );
})();

const consoleOutput = document.getElementById("console");
const log = function (msg) {
  consoleOutput.innerText = `${consoleOutput.innerText}\n${msg}`;
  console.log(msg);
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
                    let torch = false;
                    function switch_torch() {
                        try {
                            // Apagar o prender la linterna
                            track.applyConstraints({
                                advanced: [{
                                torch: (torch = !torch)
                                }]
                            });
                        } catch (err) {
                            log(err);
                        }
                    }
                    btn.addEventListener('click', function (e) {
                        switch_torch();
                    });
                    /*(function my_func() {
                        // your code
                        switch_torch();
                        setTimeout( my_func, 3000 );
                    })();*/
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

    let logo = document.getElementById("imgLogo");
    logo.style.webkitTransform = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";
    logo.style.MozTransform = "rotate(" + tiltLR + "deg)";
    logo.style.transform = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";
}

/* Acelerometro */
let accelerometer = new Accelerometer();
accelerometer.addEventListener('reading', function(e) {
    document.getElementById('accelerometer').innerHTML = 'x: ' + e.target.x + ' y: ' + e.target.y + ' z: ' + e.target.z;
});
accelerometer.start();


/* sensor orientacion */
let compass = document.getElementById('compass');
let sensor = new AbsoluteOrientationSensor();
sensor.addEventListener('reading', function(e) {
  var q = e.target.quaternion;
  heading = Math.atan2(2*q[0]*q[1] + 2*q[2]*q[3], 1 - 2*q[1]*q[1] - 2*q[2]*q[2])*(180/Math.PI);
  if(heading < 0) heading = 360+heading;
  heading = Math.round(heading);
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
    document.getElementById('gps').innerHTML = position.coords.latitude + ',' + position.coords.longitude;
}
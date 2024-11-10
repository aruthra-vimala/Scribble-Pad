let model;
const videoElement = document.getElementById('video');
const statusElement = document.getElementById('status');

async function setupWebcam() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    return new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
            resolve();
        };
    });
}

async function loadModel() {
    model = await mobilenet.load();
    statusElement.innerText = "Model loaded. Click 'Start Detection'";
}

async function startDetection() {
    if (!model) {
        alert("Model not loaded. Please wait.");
        return;
    }
    statusElement.innerText = "Starting detection...";
    detectFrame();
}

async function detectFrame() {
    const predictions = await model.classify(videoElement);
    const harassmentDetected = predictions.some(
        (prediction) => prediction.className === "person" && prediction.probability > 0.8
    );

    if (harassmentDetected) {
        sendSosMessage();
    }

    requestAnimationFrame(detectFrame);
}

async function sendSosMessage() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const message = `SOS Alert! Potential harassment detected. Location: ${latitude}, ${longitude}`;
            alert(message);
            window.open(`https://wa.me/YOUR_PHONE_NUMBER?text=${encodeURIComponent(message)}`);
        });
    } else {
        alert("Geolocation not supported by your browser.");
    }
}

loadModel();
setupWebcam();

const video = document.getElementById('video');
const output = document.getElementById('output');

// Access the user's webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });

// Placeholder function for ASL recognition
const recognizeASL = async () => {
    // Add your ML model and logic here
    // For now, just simulating ASL detection
    setInterval(() => {
        output.innerText = "Detected Sign: Hello";  // Replace with actual detected sign
    }, 2000);
};

// Call the function to start recognizing ASL
recognizeASL();

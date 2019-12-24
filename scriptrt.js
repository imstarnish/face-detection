const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
	const l = document.getElementById('load');
	l.style.display = 'none';
	document.body.append("model loaded");
	document.querySelector('button').addEventListener('click', async (e) => {
		const stream = await navigator.mediaDevices.getUserMedia({
		video: true,
		audio: false
		})
		document.querySelector('video').srcObject = stream;	
	})
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  const container = document.getElementById('container');
  container.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})

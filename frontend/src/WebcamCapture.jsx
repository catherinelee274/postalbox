class WebcamCapture extends React.Component {
    constructor(props) {
        super(props);
        this.webcamRef = React.useRef(null);
    }

    capture() {
        const imgSrc = this.webcamRef.current.getScreenshot();
        console.log(imgSrc);
    }

    render() {
        return (<>
            <Webcam
                audio={false}
                height={720}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={1280}
                videoConstraints={videoConstraints}
            />
            <button onClick={capture}>Capture photo</button>
        </>)
    }
}

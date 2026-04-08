"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { Video, Square, RotateCcw, CheckCircle, Camera, Mic } from "lucide-react";

interface Props {
  onRecorded: (blob: Blob | null) => void;
  patientName: string;
}

export function VideoConsent({ onRecorded, patientName }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [state, setState] = useState<"idle" | "camera" | "countdown" | "recording" | "recorded" | "error">("idle");
  const [countdown, setCountdown] = useState(3);
  const [recordTime, setRecordTime] = useState(0);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const MAX_DURATION = 5;

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setState("camera");
    } catch {
      setErrorMsg("Camera access denied. Please allow camera and microphone permissions.");
      setState("error");
    }
  }, []);

  const startCountdown = useCallback(() => {
    setState("countdown");
    setCountdown(3);
    let count = 3;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        startRecording();
      }
    }, 1000);
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current, { mimeType: "video/webm" });
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
      onRecorded(blob);
      setState("recorded");
      // Stop camera
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
    mediaRecorderRef.current = recorder;
    recorder.start();
    setState("recording");
    setRecordTime(0);

    // Auto-stop after MAX_DURATION
    const interval = setInterval(() => {
      setRecordTime(prev => {
        if (prev >= MAX_DURATION - 1) {
          clearInterval(interval);
          recorder.stop();
          return MAX_DURATION;
        }
        return prev + 1;
      });
    }, 1000);
  }, [onRecorded]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  const retake = useCallback(() => {
    setRecordedUrl(null);
    onRecorded(null);
    startCamera();
  }, [onRecorded, startCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [recordedUrl]);

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
      <div className="flex items-center gap-2 mb-1">
        <Video className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="font-semibold">Video KYC Consent</h3>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">
        Record a short video (3-5 seconds) saying <strong>&ldquo;I, {patientName}, agree to this procedure&rdquo;</strong>
      </p>

      {/* Idle state */}
      {state === "idle" && (
        <button
          onClick={startCamera}
          className="w-full border-2 border-dashed border-[var(--color-border)] rounded-lg py-12 flex flex-col items-center gap-3 hover:border-[var(--color-primary)] hover:bg-blue-50/50 transition-colors cursor-pointer"
        >
          <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
            <Camera className="w-6 h-6 text-[var(--color-primary)]" />
          </div>
          <div className="text-center">
            <p className="font-medium text-sm">Open Camera</p>
            <p className="text-xs text-[var(--color-muted)] mt-1">Camera & microphone access required</p>
          </div>
        </button>
      )}

      {/* Error state */}
      {state === "error" && (
        <div className="border border-red-200 bg-red-50 rounded-lg p-4 text-center">
          <p className="text-sm text-red-700 mb-3">{errorMsg}</p>
          <button onClick={startCamera} className="text-sm text-[var(--color-primary)] font-medium hover:underline">
            Try Again
          </button>
        </div>
      )}

      {/* Camera / Recording states */}
      {(state === "camera" || state === "countdown" || state === "recording") && (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full rounded-lg bg-black aspect-video object-cover"
            style={{ transform: "scaleX(-1)" }}
          />

          {/* Countdown overlay */}
          {state === "countdown" && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center mb-3">
                  <span className="text-5xl font-bold text-white">{countdown}</span>
                </div>
                <p className="text-white text-sm font-medium">Get ready to speak...</p>
              </div>
            </div>
          )}

          {/* Recording indicator */}
          {state === "recording" && (
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              REC {recordTime}s / {MAX_DURATION}s
            </div>
          )}

          {/* Recording progress bar */}
          {state === "recording" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 rounded-b-lg overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-1000 ease-linear"
                style={{ width: `${(recordTime / MAX_DURATION) * 100}%` }}
              />
            </div>
          )}

          {/* Prompt text overlay */}
          {(state === "camera" || state === "recording") && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/70 backdrop-blur-sm text-white rounded-lg px-4 py-2.5 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Mic className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium uppercase tracking-wide">Say aloud:</span>
                </div>
                <p className="text-sm font-medium">&ldquo;I, {patientName}, agree to this procedure&rdquo;</p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-3 mt-4">
            {state === "camera" && (
              <button
                onClick={startCountdown}
                className="bg-red-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-red-700 flex items-center gap-2"
              >
                <div className="w-3 h-3 bg-white rounded-full" />
                Start Recording
              </button>
            )}
            {state === "recording" && (
              <button
                onClick={stopRecording}
                className="bg-red-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-red-700 flex items-center gap-2"
              >
                <Square className="w-3 h-3 fill-white" />
                Stop
              </button>
            )}
          </div>
        </div>
      )}

      {/* Recorded / Preview state */}
      {state === "recorded" && recordedUrl && (
        <div>
          <div className="relative">
            <video
              ref={previewRef}
              src={recordedUrl}
              controls
              playsInline
              className="w-full rounded-lg bg-black aspect-video object-cover"
            />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              Recorded
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={retake}
              className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Video
            </button>
            <div className="flex items-center gap-2 text-sm text-[var(--color-success)] font-medium">
              <CheckCircle className="w-4 h-4" />
              Video consent captured
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

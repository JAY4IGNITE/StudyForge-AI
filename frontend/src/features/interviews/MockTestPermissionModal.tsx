import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, Shield, CheckCircle2, AlertTriangle, Play, Eye, Activity, Lock } from 'lucide-react';

interface MockTestPermissionModalProps {
  onPermissionsGranted: (permissions: { camera: boolean; mic: boolean; telemetryConsent: boolean }) => void;
  targetRole?: string;
  mode?: string;
}

export const MockTestPermissionModal: React.FC<MockTestPermissionModalProps> = ({
  onPermissionsGranted,
  targetRole = 'Software Engineer',
  mode = 'Behavioral'
}) => {
  const [hasMicAccess, setHasMicAccess] = useState(false);
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const [telemetryConsent, setTelemetryConsent] = useState(true);
  const [micLevel, setMicLevel] = useState(0);
  const [testingStream, setTestingStream] = useState<MediaStream | null>(null);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  // Pre-flight test stream
  const handleTestSensors = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setTestingStream(stream);
      setHasCameraAccess(true);
      setHasMicAccess(true);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      // Simple mic level test
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setMicLevel(Math.min(100, Math.round((avg / 128) * 100)));
        if (stream.active) requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (err) {
      console.warn('Sensor access denied or restricted', err);
    }
  };

  useEffect(() => {
    handleTestSensors();
    return () => {
      if (testingStream) {
        testingStream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const handleStartRound = (allowCamera: boolean) => {
    if (testingStream) {
      testingStream.getTracks().forEach(t => t.stop());
    }
    onPermissionsGranted({
      camera: allowCamera && hasCameraAccess,
      mic: hasMicAccess,
      telemetryConsent,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-xl bg-[#111621] border border-[#1E2532] rounded-3xl p-6 text-slate-200 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1E2532] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl">
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Mock Test Permission & Sensor Gateway</h2>
              <p className="text-xs text-slate-400">Target Role: <span className="text-indigo-400 font-semibold">{targetRole}</span> • Mode: <span className="text-purple-400 font-semibold">{mode}</span></p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center gap-1">
            <Lock className="w-3 h-3" /> Auditable Standard
          </span>
        </div>

        {/* Pre-flight Live Sensor Preview */}
        <div className="grid grid-cols-2 gap-4">
          {/* Camera Box */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-indigo-400" /> Video Sensor
              </span>
              {hasCameraAccess ? (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              ) : (
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Blocked
                </span>
              )}
            </div>

            <div className="h-32 bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-800">
              {hasCameraAccess ? (
                <video ref={videoPreviewRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
              ) : (
                <div className="text-center p-2 text-slate-500 space-y-1">
                  <Camera className="w-6 h-6 mx-auto opacity-50" />
                  <p className="text-[10px]">Camera stream not detected or permission pending</p>
                </div>
              )}
            </div>
          </div>

          {/* Microphone Box */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-purple-400" /> Audio Sensor
              </span>
              {hasMicAccess ? (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              ) : (
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Blocked
                </span>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-medium block">Microphone Signal Meter:</span>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-100" style={{ width: `${micLevel}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Speak to test input level before proceeding into the simulation.
              </p>
            </div>
          </div>
        </div>

        {/* Auditable Data Terms & Consent Check */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={telemetryConsent}
              onChange={(e) => setTelemetryConsent(e.target.checked)}
              className="mt-1 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block">Auditable Sensor Telemetry Agreement</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                I consent to transparent non-verbal posture variance and real-time speech pacing analysis for this mock test round. Raw signals will be logged for self-audit. No fake data will be generated.
              </p>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => handleStartRound(false)}
            className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Continue with Camera Off (Degraded Mode)
          </button>

          <button
            onClick={() => handleStartRound(true)}
            disabled={!hasMicAccess || !telemetryConsent}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <Play className="w-4 h-4 fill-white" />
            Grant Permissions & Begin Mock Test
          </button>
        </div>
      </div>
    </div>
  );
};

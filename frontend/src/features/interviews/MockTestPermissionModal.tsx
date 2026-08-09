import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, Shield, CheckCircle2, AlertTriangle, Play, Lock } from 'lucide-react';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';

interface MockTestPermissionModalProps {
  onPermissionsGranted: (permissions: { camera: boolean; mic: boolean; telemetryConsent: boolean }) => void;
  targetRole?: string;
  mode?: string;
}

export const MockTestPermissionModal: React.FC<MockTestPermissionModalProps> = ({
  onPermissionsGranted,
  targetRole = 'Software Engineer',
  mode = 'Behavioral',
}) => {
  const [hasMicAccess, setHasMicAccess] = useState(false);
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const [telemetryConsent, setTelemetryConsent] = useState(true);
  const [micLevel, setMicLevel] = useState(0);
  const [testingStream, setTestingStream] = useState<MediaStream | null>(null);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const handleTestSensors = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setTestingStream(stream);
      setHasCameraAccess(true);
      setHasMicAccess(true);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

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
        testingStream.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartRound = (allowCamera: boolean) => {
    if (testingStream) {
      testingStream.getTracks().forEach((t) => t.stop());
    }
    onPermissionsGranted({
      camera: allowCamera && hasCameraAccess,
      mic: hasMicAccess,
      telemetryConsent,
    });
  };

  return (
    <Dialog open>
      <DialogContent className="max-w-xl space-y-6 rounded-3xl">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-ember/30 bg-ember/15 p-3">
              <Shield className="h-6 w-6 text-ember" />
            </div>
            <div>
              <h2 className="font-display text-lg font-medium text-foreground">
                Mock Test Permission &amp; Sensor Gateway
              </h2>
              <p className="text-xs text-muted-foreground">
                Target role: <span className="font-semibold text-ember">{targetRole}</span> • Mode:{' '}
                <span className="font-semibold text-steel">{mode}</span>
              </p>
            </div>
          </div>
          <Badge variant="gold" className="gap-1 rounded-full">
            <Lock className="h-3 w-3" /> Auditable standard
          </Badge>
        </div>

        {/* Sensor preview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col justify-between space-y-2 rounded-2xl border border-border bg-background p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Camera className="h-3.5 w-3.5 text-ember" /> Video sensor
              </span>
              {hasCameraAccess ? (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-gold">
                  <CheckCircle2 className="h-3 w-3" /> Ready
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-destructive">
                  <AlertTriangle className="h-3 w-3" /> Blocked
                </span>
              )}
            </div>

            <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary/20">
              {hasCameraAccess ? (
                <video ref={videoPreviewRef} autoPlay muted playsInline className="h-full w-full scale-x-[-1] object-cover" />
              ) : (
                <div className="space-y-1 p-2 text-center text-muted-foreground">
                  <Camera className="mx-auto h-6 w-6 opacity-50" />
                  <p className="text-[10px]">Camera stream not detected or permission pending</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-3 rounded-2xl border border-border bg-background p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Mic className="h-3.5 w-3.5 text-steel" /> Audio sensor
              </span>
              {hasMicAccess ? (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-gold">
                  <CheckCircle2 className="h-3 w-3" /> Ready
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-destructive">
                  <AlertTriangle className="h-3 w-3" /> Blocked
                </span>
              )}
            </div>

            <div className="space-y-2">
              <span className="block text-[10px] font-medium text-muted-foreground">Microphone signal meter:</span>
              <div className="h-3 overflow-hidden rounded-full border border-border bg-secondary/40 p-0.5">
                <div
                  className="h-full rounded-full bg-ember-gradient transition-all duration-100"
                  style={{ width: `${micLevel}%` }}
                />
              </div>
              <p className="text-[10px] leading-tight text-muted-foreground">
                Speak to test input level before proceeding into the simulation.
              </p>
            </div>
          </div>
        </div>

        {/* Consent */}
        <div className="rounded-2xl border border-border bg-secondary/20 p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox
              checked={telemetryConsent}
              onCheckedChange={(v) => setTelemetryConsent(v === true)}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <span className="block text-xs font-semibold text-foreground">
                Auditable sensor telemetry agreement
              </span>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                I consent to transparent non-verbal posture variance and real-time speech pacing analysis for this
                mock test round. Raw signals will be logged for self-audit. No fake data will be generated.
              </p>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={() => handleStartRound(false)} className="text-xs">
            Continue with camera off (degraded mode)
          </Button>
          <Button
            size="sm"
            onClick={() => handleStartRound(true)}
            disabled={!hasMicAccess || !telemetryConsent}
            className="gap-2 text-xs"
          >
            <Play className="h-4 w-4 fill-current" />
            Grant permissions &amp; begin mock test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

# Behavioral Mock Testing System - Technical & Accuracy Specification

> **Version**: 2.0  
> **Status**: Active Standard  
> **Target System**: StudyForge AI Behavioral & Interview Simulation Engine

---

## 1. Overview & Principles

The StudyForge AI Behavioral Mock Testing System evaluates candidate responses, communication pacing, non-verbal posture, eye contact, and response structure.

### Core Principles
1. **Zero Fabrication**: No metric or score may be generated using non-deterministic random numbers (`Math.random()`). All metrics must originate from verified hardware sensors or calibrated algorithms.
2. **Explicit Candidate Permission**: Audio recording, speech recognition, and computer vision analysis require explicit candidate confirmation prior to starting each mock test round.
3. **Auditable & Transparent Signal Processing**: Every score calculation attached to an interview turn includes an auditable telemetry payload (`raw_metrics`, `confidence_score`, `sampling_frames`, `detection_source`).
4. **Graceful Degraded Mode**: If hardware sensors (microphone/camera) are disabled or fail, the system transitions to an explicit `DEGRADED` or `DISABLED` mode with clear UI transparency rather than generating dummy fallbacks.

---

## 2. Telemetry & Metric Definitions

### A. Posture & Head Stability Score ($S_{\text{posture}}$)
Calculated via real-time canvas pixel centroid variance across video frame buffers:
$$V_{\text{centroid}} = \frac{1}{N} \sum_{i=1}^{N} \left| C_i - C_{\text{baseline}} \right|$$
$$S_{\text{posture}} = \max\left(0, \min\left(100, 100 - (V_{\text{centroid}} \times 1.5)\right)\right)$$

* **Sampling Rate**: 10 Hz (every 100 ms).
* **Baseline**: Calculated during pre-test permission calibration (2 seconds stillness).

### B. Eye Contact & Attention Score ($S_{\text{eye}}$)
Monitors luminance variance and horizontal pupil center bounds within the facial region of interest (ROI):
* **Target Boundary**: Face centroid kept within $25\%$ of canvas center.
* **Score**: 100% when centered; degrades by $-2\%$ for every $100\text{ ms}$ out of boundary.

### C. Speech Rate & Pacing (WPM)
Calculated strictly from speech recognition transcript word count divided by speech duration:
$$\text{WPM} = \frac{\text{Word Count}}{\text{Active Speech Duration (Minutes)}}$$

* **Optimal Range**: 110 – 160 WPM.
* **Penalty Rules**:
  * $> 180\text{ WPM}$: Speed warning flag triggered ($-\text{clarity points}$).
  * $< 80\text{ WPM}$: Slow pacing warning flag triggered.

### D. Filler Word Density
Regular expression scanning across localized transcript against standardized filler word corpus (`um`, `uh`, `like`, `you know`, `basically`, `actually`, `literally`):
$$\text{Filler Density} = \frac{\text{Filler Word Count}}{\text{Total Word Count}} \times 100$$

---

## 3. Error Handling & Validation Rules

| Error Code | Trigger Condition | System Behavior |
| :--- | :--- | :--- |
| `PERMISSIONS_DENIED` | Candidate rejects camera/mic access | Pause test, display permission request dialog with instructions. |
| `AUDIO_SILENCE_DETECTED` | Audio level $< 5\%$ for $> 10$ seconds during response | Prompt user to speak or check microphone input. |
| `CAMERA_FEED_LOST` | WebGL/Video stream ended unexpectedly | Set vision telemetry to `DISABLED_BY_USER`, log event in audit trail. |
| `TRANSCRIPT_TOO_SHORT` | Word count $< 3$ words on turn submission | Request candidate to elaborate before submitting turn. |
| `METRIC_OUT_OF_BOUNDS` | Raw score calculated $<0$ or $>100$ | Clamped to $[0, 100]$ range; flagged for telemetry audit. |

---

## 4. Fallback Algorithms

When camera or video sensor signals are unavailable:
1. `vision_telemetry.status` is set to `"disabled"` or `"sensor_unavailable"`.
2. `posture_score`, `eye_contact_percentage`, and `shoulder_alignment_score` return `null` (not 0 or fake 90%).
3. The overall evaluation report marks non-verbal section as `"Not Assessed (Camera Off)"` and adjusts radar report weights to focus 100% on verbal/STAR structure & content.

---

## 5. Accuracy & Telemetry Audit Payload Schema

Every turn payload sent to `/interviews/{session_id}/turns` includes the following mandatory telemetry audit schema:

```json
{
  "user_answer": "In my previous role, I led a migration...",
  "audio_duration_seconds": 42 border-slate-800,
  "vision_metrics": {
    "status": "active",
    "detection_source": "canvas_pixel_variance",
    "eye_contact_percentage": 88.5,
    "head_pose_stability": 91.2,
    "posture_score": 93.0,
    "shoulder_alignment_score": 94.0,
    "attention_score": 89.0,
    "frame_samples_processed": 420,
    "signal_confidence": 0.96
  },
  "audio_metrics": {
    "status": "active",
    "wpm_raw": 138.2,
    "filler_word_count": 1,
    "speech_clarity_score": 95.0,
    "average_volume_db": -18.4
  }
}
```

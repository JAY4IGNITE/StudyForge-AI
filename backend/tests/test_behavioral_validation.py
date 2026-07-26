import pytest
from app.services.behavioral_validator import BehavioralValidator

def test_valid_turn_telemetry():
    res = BehavioralValidator.validate_and_normalize_turn(
        user_answer="In my last project at TechCorp, I led a microservices refactoring using Python and Redis.",
        audio_duration_seconds=12.0,
        vision_metrics={
            "status": "active",
            "detection_source": "canvas_pixel_variance",
            "posture_score": 92.5,
            "eye_contact_percentage": 88.0,
            "head_pose_stability": 94.0,
            "shoulder_alignment_score": 95.0,
            "attention_score": 90.0,
            "frame_samples_processed": 120,
            "signal_confidence": 0.96
        }
    )

    assert res["is_valid"] is True
    assert "TRANSCRIPT_TOO_SHORT" not in res["validation_flags"]
    assert res["auditable_telemetry"]["audio"]["word_count"] > 10
    assert res["auditable_telemetry"]["audio"]["wpm_raw"] > 0
    assert res["auditable_telemetry"]["vision"]["status"] == "active"
    assert res["auditable_telemetry"]["vision"]["posture_score"] == 92.5
    assert res["auditable_telemetry"]["has_sensor_fallbacks"] is False

def test_short_transcript_validation():
    res = BehavioralValidator.validate_and_normalize_turn(
        user_answer="Yes.",
        audio_duration_seconds=2.0
    )

    assert res["is_valid"] is False
    assert "TRANSCRIPT_TOO_SHORT" in res["validation_flags"]

def test_vision_disabled_fallback_policy():
    res = BehavioralValidator.validate_and_normalize_turn(
        user_answer="I managed the deployment pipeline and configured GitHub Actions CI/CD workflows.",
        audio_duration_seconds=15.0,
        vision_metrics={"status": "disabled"}
    )

    assert res["is_valid"] is True
    assert "VISION_SENSOR_DISABLED" in res["validation_flags"]
    assert res["auditable_telemetry"]["has_sensor_fallbacks"] is True
    assert res["auditable_telemetry"]["vision"]["status"] == "disabled"
    assert res["auditable_telemetry"]["vision"]["posture_score"] is None
    assert res["auditable_telemetry"]["vision"]["eye_contact_percentage"] is None

def test_filler_word_detection_and_pacing():
    res = BehavioralValidator.validate_and_normalize_turn(
        user_answer="Um basically I like think we actually should test literally everything uh carefully.",
        audio_duration_seconds=4.0
    )

    audio = res["auditable_telemetry"]["audio"]
    assert audio["filler_word_count"] >= 4
    assert "um" in audio["filler_word_breakdown"]
    assert "actually" in audio["filler_word_breakdown"]
    assert audio["speech_clarity_score"] < 100.0

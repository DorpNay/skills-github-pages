"""UTC timestamp helpers for valid-time and recorded-time memory facts."""
from __future__ import annotations

from datetime import datetime, timezone


class TemporalError(ValueError):
    pass


def normalize_timestamp(value: str | datetime | None, *, field_name: str = "timestamp") -> str | None:
    if value is None:
        return None
    if isinstance(value, str):
        raw = value.strip()
        if not raw or len(raw) > 64:
            raise TemporalError(f"{field_name} must be an ISO-8601 timestamp")
        try:
            parsed = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        except ValueError as exc:
            raise TemporalError(f"{field_name} must be an ISO-8601 timestamp") from exc
    elif isinstance(value, datetime):
        parsed = value
    else:
        raise TemporalError(f"{field_name} must be an ISO-8601 timestamp")
    if parsed.tzinfo is None:
        raise TemporalError(f"{field_name} must include an explicit UTC offset")
    return parsed.astimezone(timezone.utc).isoformat(timespec="microseconds").replace("+00:00", "Z")


def validate_validity_window(valid_from: str | datetime | None,
                             valid_until: str | datetime | None) -> tuple[str | None, str | None]:
    start = normalize_timestamp(valid_from, field_name="valid_from")
    end = normalize_timestamp(valid_until, field_name="valid_until")
    if start and end and datetime.fromisoformat(end.replace("Z", "+00:00")) <= datetime.fromisoformat(start.replace("Z", "+00:00")):
        raise TemporalError("valid_until must be later than valid_from")
    return start, end


def is_valid_at(valid_from: str | None, valid_until: str | None, at: str | datetime) -> bool:
    moment = normalize_timestamp(at, field_name="at")
    if moment is None:
        raise TemporalError("at must be an ISO-8601 timestamp")
    point = datetime.fromisoformat(moment.replace("Z", "+00:00"))
    start = datetime.fromisoformat(valid_from.replace("Z", "+00:00")) if valid_from else None
    end = datetime.fromisoformat(valid_until.replace("Z", "+00:00")) if valid_until else None
    return (start is None or start <= point) and (end is None or point < end)

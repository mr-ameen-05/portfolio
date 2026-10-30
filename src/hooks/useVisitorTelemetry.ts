import { useState, useEffect } from 'react';
import { VisitorTelemetry, getVisitorTelemetrySync, subscribeVisitorTelemetry } from '../lib/osint';

export function useVisitorTelemetry(): VisitorTelemetry {
  const [telemetry, setTelemetry] = useState<VisitorTelemetry>(getVisitorTelemetrySync);

  useEffect(() => {
    return subscribeVisitorTelemetry(data => {
      setTelemetry({ ...data });
    });
  }, []);

  return telemetry;
}

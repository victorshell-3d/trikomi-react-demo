import { useState } from 'react';
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode
} from 'react';
import { Icon } from '../foundation/Icon';

interface CaptureActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

function CaptureAction({
  label,
  className,
  type = 'button',
  ...props
}: CaptureActionProps) {
  const rootClassName = [
    'vs-capture-action',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      {...props}
      className={rootClassName}
      type={type}
      aria-label={label}
    />
  );
}

export interface MocapCaptureBarProps extends HTMLAttributes<HTMLDivElement> {
  recording?: boolean;
  defaultRecording?: boolean;
  onRecordingChange?: (recording: boolean) => void;
  onSnapshot?: () => void;
  onPause?: () => void;
  disabled?: boolean;
}

export function MocapCaptureBar({
  recording,
  defaultRecording = false,
  onRecordingChange,
  onSnapshot,
  onPause,
  disabled = false,
  className,
  role,
  'aria-label': ariaLabel = 'MOCAP capture controls',
  ...props
}: MocapCaptureBarProps) {
  const [uncontrolledRecording, setUncontrolledRecording] = useState(defaultRecording);
  const isRecording = recording ?? uncontrolledRecording;
  const rootClassName = [
    'vs-capture-bar',
    'vs-glass-strong',
    className
  ].filter(Boolean).join(' ');

  const toggleRecording = () => {
    if (disabled) return;
    const nextRecording = !isRecording;
    if (recording === undefined) setUncontrolledRecording(nextRecording);
    onRecordingChange?.(nextRecording);
  };

  return (
    <div
      {...props}
      className={rootClassName}
      role={role ?? 'group'}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
    >
      <CaptureAction
        label="Capture snapshot"
        disabled={disabled}
        onClick={onSnapshot}
      >
        <Icon size={20} aria-hidden="true">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </Icon>
      </CaptureAction>
      <button
        className="vs-record-button"
        type="button"
        disabled={disabled}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        aria-pressed={isRecording}
        onClick={toggleRecording}
      >
        <span
          className={[
            'vs-record-button__dot',
            isRecording && 'vs-record-button__dot--recording'
          ].filter(Boolean).join(' ')}
          aria-hidden="true"
        />
      </button>
      <CaptureAction
        label="Pause MOCAP stream"
        disabled={disabled}
        onClick={onPause}
      >
        <Icon size={20} aria-hidden="true">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </Icon>
      </CaptureAction>
    </div>
  );
}

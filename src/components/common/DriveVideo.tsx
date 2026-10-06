interface DriveVideoProps {
  fileId: string;
  title: string;
  className?: string;
  aspectClassName?: string;
}

/** Responsive Google Drive preview used for customer-provided video creatives. */
export function DriveVideo({
  fileId,
  title,
  className = '',
  aspectClassName = 'aspect-video',
}: DriveVideoProps) {
  return (
    <div className={`${aspectClassName} overflow-hidden rounded-xl border border-ink-500 bg-ink-900 ${className}`}>
      <iframe
        src={`https://drive.google.com/file/d/${fileId}/preview`}
        title={title}
        className="h-full w-full border-0"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    </div>
  );
}

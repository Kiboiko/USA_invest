interface LocalVideoProps {
  src: string;
  title: string;
  poster?: string;
  className?: string;
  aspectClassName?: string;
}

export function LocalVideo({
  src,
  title,
  poster,
  className = '',
  aspectClassName = 'aspect-video',
}: LocalVideoProps) {
  return (
    <div className={`${aspectClassName} overflow-hidden rounded-xl border border-ink-500 bg-ink-900 ${className}`}>
      <video
        className="h-full w-full object-cover"
        controls
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={title}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support HTML video.
      </video>
    </div>
  );
}

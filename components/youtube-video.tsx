'use client';

import { Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type Video = { id: string; title: string };

// The round play button. Its right edge is pinned so the circle stays in
// the middle, and on hover it grows leftward to show a label, like the Play
// all button on the Gallery page.
const PLAY_BUTTON_STYLE = {
  position: 'absolute',
  right: 'calc(50% - 1.5rem)',
  top: '50%',
  transform: 'translateY(-50%)',
  height: '3rem',
  display: 'inline-flex',
  flexDirection: 'row-reverse',
  alignItems: 'center',
  borderRadius: '9999px',
  whiteSpace: 'nowrap',
} as const;

const FILL = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
} as const;

// One player with a row of small thumbnails under it to switch between
// videos. Until the visitor clicks play it shows either a still thumbnail, or
// with `preview` a silent looping preview of the first video. Clicking play
// starts the video from the beginning with sound and the full controls.
//
// It uses the standard player address, because the no-cookie one cannot see
// that a visitor is signed in to YouTube and can stop with a "sign in to
// confirm you're not a bot" screen. The still-thumbnail mode loads nothing
// from YouTube before the click. The preview mode loads the player with the
// page.
export default function YouTubeVideo({
  videos,
  preview = false,
  playGrows = 'left',
}: {
  videos: Video[];
  preview?: boolean;
  // Which way the play button stretches on hover to show its label.
  playGrows?: 'left' | 'right';
}) {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = videos[selected];
  const showPreview = preview && !playing && selected === 0;
  const previewRef = useRef<HTMLIFrameElement>(null);
  // YouTube draws its own dark play/pause button in the middle of the player
  // for a few seconds whenever playback starts. The still image stays over
  // the preview until that has faded, so it is never seen.
  const [previewClear, setPreviewClear] = useState(false);

  // Loops the silent preview. YouTube's own loop setting needs a playlist,
  // which puts previous and next buttons on the player, so instead the
  // preview is told to go back to the start whenever it reaches the end.
  useEffect(() => {
    if (!showPreview) return;
    const frame = previewRef.current;
    if (!frame) return;

    const send = (message: object) =>
      frame.contentWindow?.postMessage(JSON.stringify(message), '*');
    const subscribe = () =>
      send({ event: 'listening', id: 'preview', channel: 'widget' });

    let clearTimer = 0;
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.contentWindow) return;
      if (typeof event.data !== 'string') return;
      let data: { event?: string; info?: unknown };
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      const state =
        data.event === 'onStateChange'
          ? data.info
          : data.event === 'infoDelivery'
            ? (data.info as { playerState?: number } | null)?.playerState
            : undefined;
      if (typeof state !== 'number') return;
      // 1 means playing: uncover the preview once YouTube's button is gone.
      if (state === 1) {
        if (!clearTimer) {
          clearTimer = window.setTimeout(() => setPreviewClear(true), 4000);
        }
        return;
      }
      // Anything else (loading, buffering, paused, ended) is when YouTube
      // shows its dark circle, so the still image covers the preview again.
      window.clearTimeout(clearTimer);
      clearTimer = 0;
      setPreviewClear(false);
      // 0 means the video has ended: start over.
      if (state === 0) {
        send({ event: 'command', func: 'seekTo', args: [0, true] });
        send({ event: 'command', func: 'playVideo', args: [] });
      }
    };

    window.addEventListener('message', onMessage);
    frame.addEventListener('load', subscribe);
    subscribe();
    // If the player never reports that it is playing, the still image simply
    // stays, so YouTube's dark circle is never shown.
    return () => {
      window.clearTimeout(clearTimer);
      window.removeEventListener('message', onMessage);
      frame.removeEventListener('load', subscribe);
    };
  }, [showPreview]);

  return (
    <div>
      {/* A darker purple frame shows evenly around the video, like the
          hero photos. The margin keeps it inside the layout. */}
      <div className="relative m-4">
      <div aria-hidden className="absolute -inset-4 rounded-2xl bg-brand-800" />
      <div
        className="overflow-hidden rounded-xl bg-black shadow-xl shadow-black/25"
        style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}
      >
        {playing ? (
          <iframe
            key={`full-${current.id}`}
            src={`https://www.youtube.com/embed/${current.id}?autoplay=1&rel=0&playsinline=1`}
            title={current.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            style={{ ...FILL, border: 0 }}
          />
        ) : (
          <>
            {showPreview ? (
              // Silent, looping, with YouTube's own controls hidden. It sits
              // under the play button and cannot be clicked or focused, and
              // is slightly enlarged so YouTube's title and logo are cropped.
              <iframe
                key={`preview-${current.id}`}
                ref={previewRef}
                src={`https://www.youtube.com/embed/${current.id}?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0&rel=0&playsinline=1&enablejsapi=1`}
                title=""
                aria-hidden
                tabIndex={-1}
                allow="autoplay; encrypted-media"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{
                  ...FILL,
                  border: 0,
                  pointerEvents: 'none',
                  transform: 'scale(1.35)',
                }}
              />
            ) : null}
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play video with sound: ${current.title}`}
              className="video-play group"
              style={FILL}
            >
              {/* The still image. Over a preview it fades away once the
                  preview is clear to show. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${current.id}/maxresdefault.jpg`}
                alt=""
                style={{
                  ...FILL,
                  objectFit: 'cover',
                  opacity: showPreview && previewClear ? 0 : 1,
                  transition: 'opacity 0.6s ease',
                }}
              />
              <span
                aria-hidden
                className="video-play-button bg-accent-400 text-black"
                style={
                  playGrows === 'right'
                    ? {
                        ...PLAY_BUTTON_STYLE,
                        right: 'auto',
                        left: 'calc(50% - 1.5rem)',
                        flexDirection: 'row',
                      }
                    : PLAY_BUTTON_STYLE
                }
              >
                <span
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: '3rem',
                    height: '3rem',
                    flex: 'none',
                  }}
                >
                  <Play
                    className="h-4 w-4"
                    style={{ marginLeft: '2px' }}
                    fill="currentColor"
                  />
                </span>
                <span
                  className={`video-play-label font-display text-sm font-bold tracking-tight ${
                    playGrows === 'right' ? 'video-play-label-right' : ''
                  }`}
                >
                  Play video
                </span>
              </span>
            </button>
          </>
        )}
      </div>
      </div>

      {videos.length > 1 ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginTop: '0.75rem',
          }}
        >
          {videos.map((video, index) => {
            const active = index === selected;
            return (
              <button
                key={video.id}
                type="button"
                onClick={() => {
                  setSelected(index);
                  setPlaying(true);
                }}
                aria-pressed={active}
                aria-label={`Play video: ${video.title}`}
                className="group text-left"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  flex: '1 1 14rem',
                  minWidth: 0,
                }}
              >
                <span
                  className="overflow-hidden rounded-md"
                  style={{
                    position: 'relative',
                    flex: 'none',
                    width: '5.5rem',
                    aspectRatio: '16 / 9',
                    outline: active
                      ? '2px solid var(--color-accent-400)'
                      : '1px solid rgba(255, 255, 255, 0.3)',
                    outlineOffset: active ? '2px' : 0,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    style={{ ...FILL, objectFit: 'cover' }}
                  />
                </span>
                <span
                  className={`text-sm font-medium leading-snug transition-colors ${
                    active
                      ? 'text-white'
                      : 'text-brand-200 group-hover:text-white'
                  }`}
                >
                  {video.title}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

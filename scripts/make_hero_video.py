from __future__ import annotations

import math
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "images" / "kean-hero-cinematic.png"
OUTPUT = ROOT / "public" / "videos" / "kean-hero-ambient.mp4"

WIDTH = 1920
HEIGHT = 1080
FPS = 24
DURATION = 10
FRAMES = FPS * DURATION


def cover_crop(image: Image.Image, width: int, height: int) -> Image.Image:
    src_w, src_h = image.size
    target_ratio = width / height
    src_ratio = src_w / src_h

    if src_ratio > target_ratio:
        crop_w = int(src_h * target_ratio)
        left = (src_w - crop_w) // 2
        box = (left, 0, left + crop_w, src_h)
    else:
        crop_h = int(src_w / target_ratio)
        top = max(0, min(src_h - crop_h, 50))
        box = (0, top, src_w, top + crop_h)

    return image.crop(box).resize((width, height), Image.Resampling.LANCZOS)


def soft_region_mask(width: int, height: int, top: float, bottom: float) -> np.ndarray:
    y = np.linspace(0, 1, height, dtype=np.float32)[:, None]
    fade_in = np.clip((y - top) / 0.08, 0, 1)
    fade_out = np.clip((bottom - y) / 0.12, 0, 1)
    return np.repeat(np.minimum(fade_in, fade_out), width, axis=1)


def blurred_noise(width: int, height: int, seed: int, blur: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    small = rng.normal(0.0, 1.0, (height // 8, width // 8)).astype(np.float32)
    im = Image.fromarray(((small - small.min()) / (small.max() - small.min()) * 255).astype(np.uint8))
    im = im.resize((width, height), Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(blur))
    arr = np.asarray(im).astype(np.float32) / 255.0
    return arr * 2.0 - 1.0


def shift_wrap(arr: np.ndarray, dx: int, dy: int) -> np.ndarray:
    return np.roll(np.roll(arr, dy, axis=0), dx, axis=1)


def make_sky_mask(base_arr: np.ndarray) -> np.ndarray:
    red = base_arr[:, :, 0]
    green = base_arr[:, :, 1]
    blue = base_arr[:, :, 2]
    maxc = np.max(base_arr, axis=2)
    minc = np.min(base_arr, axis=2)
    saturation = (maxc - minc) / np.maximum(maxc, 0.001)
    y = np.linspace(0, 1, HEIGHT, dtype=np.float32)[:, None]

    top_weight = np.clip((0.66 - y) / 0.22, 0, 1)
    colorful_sky = saturation > 0.20
    blue_sky = (blue > green * 0.95) & (blue > red * 0.72)
    orange_cloud = (red > 0.38) & (red > blue * 1.05) & (saturation > 0.18)

    mask = ((colorful_sky | blue_sky | orange_cloud).astype(np.float32)) * top_weight
    mask_img = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(9))
    return np.asarray(mask_img).astype(np.float32) / 255.0


def wave_roi(base_arr: np.ndarray, frame: np.ndarray, box: tuple[int, int, int, int], phase: float, amp: float) -> None:
    x1, y1, x2, y2 = box
    roi = base_arr[y1:y2, x1:x2, :]
    h, w, _ = roi.shape
    warped = np.empty_like(roi)
    yy = np.arange(h, dtype=np.float32)
    shifts = np.sin(yy * 0.22 + phase) * amp

    for row, shift in enumerate(shifts):
        left = int(math.floor(shift))
        frac = shift - left
        a = np.roll(roi[row], left, axis=0)
        b = np.roll(roi[row], left + 1, axis=0)
        warped[row] = a * (1.0 - frac) + b * frac

    x_fade = np.minimum(np.linspace(0, 1, w), np.linspace(1, 0, w))
    y_fade = np.minimum(np.linspace(0, 1, h), np.linspace(1, 0, h))
    mask = np.clip(np.outer(y_fade, x_fade) * 4.5, 0, 1).astype(np.float32)
    frame[y1:y2, x1:x2, :] = (
        frame[y1:y2, x1:x2, :] * (1.0 - mask[:, :, None])
        + warped * mask[:, :, None]
    )


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    base = cover_crop(Image.open(SOURCE).convert("RGB"), WIDTH, HEIGHT)
    base_arr = np.asarray(base).astype(np.float32) / 255.0

    sky_mask = make_sky_mask(base_arr)
    road_mask = soft_region_mask(WIDTH, HEIGHT, 0.70, 1.0)

    luminance = (
        base_arr[:, :, 0] * 0.2126
        + base_arr[:, :, 1] * 0.7152
        + base_arr[:, :, 2] * 0.0722
    )
    light_mask = np.clip((luminance - 0.58) / 0.35, 0, 1)
    light_mask *= np.clip(np.linspace(0.15, 1.0, HEIGHT, dtype=np.float32)[:, None], 0, 1)
    light_mask = np.power(light_mask, 1.7)

    sky_noise_a = blurred_noise(WIDTH, HEIGHT, 11, 42)
    sky_noise_b = blurred_noise(WIDTH, HEIGHT, 29, 42)
    road_noise_a = blurred_noise(WIDTH, HEIGHT, 47, 18)
    road_noise_b = blurred_noise(WIDTH, HEIGHT, 83, 18)

    ffmpeg = subprocess.Popen(
        [
            "ffmpeg",
            "-y",
            "-f",
            "rawvideo",
            "-pix_fmt",
            "rgb24",
            "-s",
            f"{WIDTH}x{HEIGHT}",
            "-r",
            str(FPS),
            "-i",
            "-",
            "-an",
            "-c:v",
            "libx264",
            "-preset",
            "slow",
            "-crf",
            "18",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            str(OUTPUT),
        ],
        stdin=subprocess.PIPE,
    )

    assert ffmpeg.stdin is not None

    for index in range(FRAMES):
        t = index / FRAMES
        phase = math.sin(t * math.tau)
        phase2 = math.sin(t * math.tau + 1.4)
        blend = (math.sin(t * math.tau) + 1.0) / 2.0

        frame = base_arr.copy()

        cloud_shift = int(round(22 * math.sin(t * math.tau)))
        cloud_lift = int(round(5 * math.sin(t * math.tau + 0.9)))
        shifted_sky = shift_wrap(base_arr, cloud_shift, cloud_lift)
        frame = frame * (1.0 - sky_mask[:, :, None] * 0.45) + shifted_sky * (
            sky_mask[:, :, None] * 0.45
        )

        sky_noise = sky_noise_a * (1.0 - blend) + sky_noise_b * blend
        sky_breathe = (0.018 * phase + 0.010 * sky_noise) * sky_mask
        frame[:, :, 0] += sky_breathe * 0.85
        frame[:, :, 1] += sky_breathe * 0.22
        frame[:, :, 2] += sky_breathe * 0.55

        wave_phase = t * math.tau * 2.2
        wave_roi(base_arr, frame, (760, 500, 890, 585), wave_phase, 4.0)
        wave_roi(base_arr, frame, (820, 625, 895, 675), wave_phase + 0.8, 2.4)

        light_breathe = (0.035 * phase2 + 0.012 * math.sin(t * math.tau * 2.0)) * light_mask
        frame += light_breathe[:, :, None] * np.array([1.0, 0.72, 0.34], dtype=np.float32)

        road_noise = road_noise_a * blend + road_noise_b * (1.0 - blend)
        road_shimmer = (0.018 * road_noise + 0.012 * phase) * road_mask
        frame += road_shimmer[:, :, None] * np.array([1.0, 0.55, 0.25], dtype=np.float32)

        frame = np.clip(frame, 0, 1)
        ffmpeg.stdin.write((frame * 255).astype(np.uint8).tobytes())

    ffmpeg.stdin.close()
    code = ffmpeg.wait()
    if code != 0:
        raise SystemExit(code)

    print(OUTPUT)


if __name__ == "__main__":
    main()

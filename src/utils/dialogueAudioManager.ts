/**
 * DialogueAudioManager - Centralized Singleton Audio Manager
 *
 * Enforces a single active audio instance across the entire application to prevent overlapping dialogue.
 * Manages section-based dialogue playback, browser autoplay policies (user gesture requirement),
 * and hardware-smooth fade-out transitions on forward and rapid backward scrolling.
 */
class DialogueAudioManager {
  private static instance: DialogueAudioManager | null = null;

  // Single active audio element
  private audio: HTMLAudioElement | null = null;

  // Web Audio API nodes for click-free gain ramping
  private audioCtx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;

  // State
  private currentClipUrl: string | null = null;
  private currentSectionId: string | null = null;
  private isPlaying: boolean = false;
  private hasUserInteracted: boolean = false;
  private isMuted: boolean = true;
  private targetVolume: number = 0.85;

  // Fade animation reference to cancel overlapping transitions
  private fadeAnimationId: number | null = null;
  private pendingPlay: { clipUrl: string; sectionId: string } | null = null;

  private constructor() {
    if (typeof window !== "undefined") {
      this.initAudioElement();
      this.initUserInteractionListeners();
    }
  }

  public static getInstance(): DialogueAudioManager {
    if (!DialogueAudioManager.instance) {
      DialogueAudioManager.instance = new DialogueAudioManager();
    }
    return DialogueAudioManager.instance;
  }

  /**
   * Initializes the single HTMLAudioElement and attaches Web Audio API GainNode
   */
  private initAudioElement() {
    this.audio = new Audio();
    this.audio.preload = "auto";
    this.audio.volume = this.targetVolume;

    // Reset playing state when audio reaches natural completion
    this.audio.addEventListener("ended", () => {
      this.isPlaying = false;
      this.currentClipUrl = null;
    });

    // Initialize Web Audio API for seamless click-free gain ramping
    try {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.setValueAtTime(this.targetVolume, this.audioCtx.currentTime);

        this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);
        this.sourceNode.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);
      }
    } catch {
      // Fallback gracefully to direct HTMLAudioElement volume interpolation
      this.audioCtx = null;
      this.gainNode = null;
    }
  }

  /**
   * Listens for any user interaction to unlock browser autoplay restrictions
   */
  private initUserInteractionListeners() {
    const handleInteraction = () => {
      this.hasUserInteracted = true;

      // Resume AudioContext if suspended by browser autoplay policy
      if (this.audioCtx && this.audioCtx.state === "suspended") {
        this.audioCtx.resume().catch(() => {});
      }

      // Execute any pending dialogue play that was waiting for interaction
      if (this.pendingPlay) {
        const { clipUrl, sectionId } = this.pendingPlay;
        this.pendingPlay = null;
        this.playDialogue(clipUrl, sectionId);
      }

      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("click", handleInteraction);
    };

    window.addEventListener("pointerdown", handleInteraction, { passive: true, once: true });
    window.addEventListener("touchstart", handleInteraction, { passive: true, once: true });
    window.addEventListener("keydown", handleInteraction, { passive: true, once: true });
    window.addEventListener("wheel", handleInteraction, { passive: true, once: true });
    window.addEventListener("scroll", handleInteraction, { passive: true, once: true });
    window.addEventListener("click", handleInteraction, { passive: true, once: true });
  }

  /**
   * Called when a section enters the viewport.
   * 1. Checks if the section has an associated dialogue clip.
   * 2. If another dialogue is already playing, fades it out smoothly.
   * 3. Plays the new dialogue only if the user has interacted with the site at least once.
   */
  public onSectionEnter(sectionId: string, dialogueClipUrl?: string | null) {
    if (!dialogueClipUrl) {
      // Section has no dialogue clip -> smoothly stop any existing dialogue
      this.stopCurrentDialogue(250);
      this.currentSectionId = sectionId;
      return;
    }

    this.playDialogue(dialogueClipUrl, sectionId);
  }

  /**
   * Called when a section leaves the viewport (scrolling forward or backward)
   */
  public onSectionLeave(sectionId: string) {
    if (this.currentSectionId === sectionId) {
      this.stopCurrentDialogue(250);
    }
  }

  /**
   * Plays a dialogue clip, fading out any existing audio and fading in the new one.
   */
  public playDialogue(clipUrl: string, sectionId: string, fadeDurationMs: number = 220) {
    if (!this.audio) return;

    // If this dialogue clip is already actively playing for this section, do not restart
    if (this.currentSectionId === sectionId && this.currentClipUrl === clipUrl && this.isPlaying) {
      return;
    }

    // If user has not yet interacted with the page, store as pending to fulfill browser autoplay policy
    if (!this.hasUserInteracted) {
      this.pendingPlay = { clipUrl, sectionId };
      this.currentSectionId = sectionId;
      return;
    }

    // Cancel any pending play of another section
    this.pendingPlay = null;

    // Step 2: If another dialogue is currently playing, smoothly fade it out first
    if (this.isPlaying) {
      this.stopCurrentDialogue(fadeDurationMs);
    } else {
      this.cancelOngoingFade();
    }

    // If muted globally by user, register section without unmuting audio
    if (this.isMuted) {
      this.currentSectionId = sectionId;
      this.currentClipUrl = clipUrl;
      return;
    }

    this.currentSectionId = sectionId;
    this.currentClipUrl = clipUrl;

    // Configure single audio instance
    if (this.audio.src !== clipUrl) {
      this.audio.src = clipUrl;
    }
    this.audio.currentTime = 0;

    // Start with zero volume for smooth fade-in
    this.audio.volume = 0;
    if (this.gainNode && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(0.0001, now);
    }

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.fadeIn(fadeDurationMs);
        })
        .catch(() => {
          // Autoplay was blocked; wait for next user interaction
          this.isPlaying = false;
          this.hasUserInteracted = false;
          this.pendingPlay = { clipUrl, sectionId };
          this.initUserInteractionListeners();
        });
    }
  }

  /**
   * Smoothly fades in the audio to target volume
   */
  private fadeIn(durationMs: number) {
    if (!this.audio) return;

    this.cancelOngoingFade();

    // Hardware Web Audio API ramp
    if (this.gainNode && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(Math.max(0.0001, this.gainNode.gain.value), now);
      this.gainNode.gain.linearRampToValueAtTime(this.targetVolume, now + durationMs / 1000);
    }

    // Smooth software volume interpolation loop
    const startTime = performance.now();
    const startVol = this.audio.volume;
    const target = this.targetVolume;

    const step = () => {
      if (!this.audio) return;
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      this.audio.volume = startVol + (target - startVol) * progress;

      if (progress < 1) {
        this.fadeAnimationId = requestAnimationFrame(step);
      } else {
        this.audio.volume = target;
        this.fadeAnimationId = null;
      }
    };

    this.fadeAnimationId = requestAnimationFrame(step);
  }

  /**
   * Handles Backward & Rapid Scrolling:
   * Wraps stopping the current dialogue in a quick fade-out loop using Web Audio API gain nodes
   * and requestAnimationFrame / interval volume decay so audio transitions smoothly without clipping harshly.
   */
  public stopCurrentDialogue(fadeDurationMs: number = 250): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audio || (!this.isPlaying && this.audio.paused)) {
        this.isPlaying = false;
        resolve();
        return;
      }

      this.cancelOngoingFade();

      // Web Audio API hardware gain ramp
      if (this.gainNode && this.audioCtx) {
        try {
          const now = this.audioCtx.currentTime;
          this.gainNode.gain.cancelScheduledValues(now);
          this.gainNode.gain.setValueAtTime(Math.max(0.0001, this.gainNode.gain.value), now);
          this.gainNode.gain.linearRampToValueAtTime(0.0001, now + fadeDurationMs / 1000);
        } catch {
          // Ignore audioCtx timing errors
        }
      }

      // Smooth volume fade-out loop
      const startTime = performance.now();
      const initialVol = this.audio.volume;

      const fadeStep = () => {
        if (!this.audio) {
          resolve();
          return;
        }

        const elapsed = performance.now() - startTime;
        const progress = Math.min(1, elapsed / fadeDurationMs);

        // Smooth cubic ease-out fade to prevent harsh pops
        const factor = Math.max(0, 1 - progress);
        this.audio.volume = Math.max(0, initialVol * factor);

        if (progress < 1) {
          this.fadeAnimationId = requestAnimationFrame(fadeStep);
        } else {
          // Fully faded out -> pause and reset
          this.audio.pause();
          this.audio.volume = 0;
          this.audio.currentTime = 0;
          this.isPlaying = false;
          this.currentClipUrl = null;
          this.fadeAnimationId = null;
          resolve();
        }
      };

      this.fadeAnimationId = requestAnimationFrame(fadeStep);
    });
  }

  /**
   * Cancels any active fade animation
   */
  private cancelOngoingFade() {
    if (this.fadeAnimationId !== null) {
      cancelAnimationFrame(this.fadeAnimationId);
      this.fadeAnimationId = null;
    }
  }

  /**
   * Synchronizes mute state with the header audio controls
   */
  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.pendingPlay = null;
      this.cancelOngoingFade();
      if (this.audio) {
        this.audio.pause();
        this.audio.volume = 0;
        this.audio.currentTime = 0;
      }
      if (this.gainNode && this.audioCtx) {
        try {
          const now = this.audioCtx.currentTime;
          this.gainNode.gain.cancelScheduledValues(now);
          this.gainNode.gain.setValueAtTime(0.0001, now);
        } catch {
          // Ignore audioCtx timing errors
        }
      }
      this.isPlaying = false;
    } else if (this.currentClipUrl && this.currentSectionId) {
      this.playDialogue(this.currentClipUrl, this.currentSectionId);
    }
  }

  /**
   * Sets the global target volume for dialogues
   */
  public setVolume(volume: number) {
    this.targetVolume = Math.max(0, Math.min(1, volume));
    if (this.isPlaying && this.audio && !this.isMuted) {
      this.audio.volume = this.targetVolume;
      if (this.gainNode && this.audioCtx) {
        this.gainNode.gain.setValueAtTime(this.targetVolume, this.audioCtx.currentTime);
      }
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentSectionId(): string | null {
    return this.currentSectionId;
  }
}

export const dialogueAudioManager = DialogueAudioManager.getInstance();
export default dialogueAudioManager;

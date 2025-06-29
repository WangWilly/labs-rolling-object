// Landing Page Controller
class LandingPage {
    constructor() {
        this.video = null;
        this.videoLoading = null;
        this.enterSection = null;
        this.audioPermission = null;
        this.enterButton = null;
        this.skipButton = null;
        this.allowAudioButton = null;
        this.continueSilentButton = null;
        
        this.videoLoaded = false;
        this.videoEnded = false;
        this.userInteracted = false;
        this.audioEnabled = false;
        this.playAttempts = 0;
        this.maxPlayAttempts = 10;
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.updateViewportHeight();
        this.handleVideoLoad();
        
        // Ensure viewport height is updated after initial render
        setTimeout(() => this.updateViewportHeight(), 100);
        
        // Additional update for mobile devices
        if (this.isMobileDevice()) {
            setTimeout(() => this.updateViewportHeight(), 500);
        }
    }

    setupElements() {
        this.video = document.getElementById('intro-video');
        this.videoLoading = document.getElementById('video-loading');
        this.enterSection = document.getElementById('enter-section');
        this.audioPermission = document.getElementById('audio-permission');
        this.enterButton = document.getElementById('enter-btn');
        this.skipButton = document.getElementById('skip-video');
        this.allowAudioButton = document.getElementById('allow-audio');
        this.continueSilentButton = document.getElementById('continue-silent');
    }

    setupEventListeners() {
        // Video events
        if (this.video) {
            this.video.addEventListener('loadeddata', () => this.onVideoLoaded());
            this.video.addEventListener('ended', () => this.onVideoEnded());
            this.video.addEventListener('error', () => this.onVideoError());
            this.video.addEventListener('canplay', () => this.onVideoCanPlay());
        }

        // Button events
        if (this.enterButton) {
            this.enterButton.addEventListener('click', () => this.enterMainSite());
        }

        if (this.skipButton) {
            this.skipButton.addEventListener('click', () => this.skipVideo());
        }

        if (this.allowAudioButton) {
            this.allowAudioButton.addEventListener('click', () => this.allowAudio());
        }

        if (this.continueSilentButton) {
            this.continueSilentButton.addEventListener('click', () => this.continueSilent());
        }

        // Enhanced viewport handling for mobile
        window.addEventListener('resize', () => this.updateViewportHeight());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.updateViewportHeight(), 200);
        });
        
        // Handle mobile browser UI changes (address bar hide/show)
        window.addEventListener('scroll', () => this.updateViewportHeight());
        
        // Visual viewport API for better mobile support
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => this.updateViewportHeight());
        }

        // User interaction detection (keep for audio permission)
        document.addEventListener('click', () => this.onUserInteraction(), { once: true });
        document.addEventListener('touchstart', () => this.onUserInteraction(), { once: true });
        document.addEventListener('keydown', () => this.onUserInteraction(), { once: true });
        
        // Additional video event listeners for better autoplay
        if (this.video) {
            this.video.addEventListener('loadstart', () => console.log('Video load started'));
            this.video.addEventListener('loadedmetadata', () => {
                console.log('Video metadata loaded');
                if (!this.isSafari()) {
                    this.tryPlayVideo();
                }
            });
            this.video.addEventListener('canplaythrough', () => {
                console.log('Video can play through');
                // This is especially important for Safari
                if (this.isSafari()) {
                    setTimeout(() => this.tryPlayVideo(), 200);
                } else {
                    this.tryPlayVideo();
                }
            });
            
            // Safari-specific events
            if (this.isSafari()) {
                this.video.addEventListener('progress', () => {
                    if (this.video.buffered.length > 0) {
                        const bufferedEnd = this.video.buffered.end(this.video.buffered.length - 1);
                        const duration = this.video.duration;
                        if (bufferedEnd > duration * 0.1) { // 10% buffered
                            console.log('Safari: Sufficient video buffered');
                            setTimeout(() => this.tryPlayVideo(), 100);
                        }
                    }
                });
                
                this.video.addEventListener('suspend', () => {
                    console.log('Safari: Video loading suspended');
                    // Safari might suspend loading, try to resume
                    setTimeout(() => {
                        if (!this.videoEnded && this.video.readyState >= 2) {
                            this.tryPlayVideo();
                        }
                    }, 1000);
                });
            }
        }
    }

    updateViewportHeight() {
        // Update CSS custom property for viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Also update visual viewport height if available (better mobile support)
        if (window.visualViewport) {
            const vvh = window.visualViewport.height * 0.01;
            document.documentElement.style.setProperty('--vvh', `${vvh}px`);
        }
    }

    onUserInteraction() {
        this.userInteracted = true;
        console.log('User interaction detected');
        
        // For Safari, user interaction is crucial for video playback
        if (this.isSafari() && this.video && !this.videoEnded) {
            console.log('Safari: Attempting video play after user interaction');
            // Reset play attempts since user has interacted
            this.playAttempts = 0;
            setTimeout(() => this.tryPlayVideo(), 100);
        } else {
            this.tryPlayVideo();
        }
    }

    handleVideoLoad() {
        if (!this.video) {
            this.onVideoError();
            return;
        }

        // Show loading indicator
        this.showLoading();

        // Set optimal attributes for autoplay, especially for Safari
        this.video.muted = true;
        this.video.playsInline = true;
        this.video.defaultMuted = true;
        this.video.volume = 0;
        this.video.setAttribute('webkit-playsinline', 'true');
        this.video.setAttribute('playsinline', 'true');
        this.video.setAttribute('muted', 'true');
        this.video.setAttribute('autoplay', 'true');
        
        // Safari-specific optimizations
        if (this.isSafari()) {
            // For Safari, we need to be more patient and try different approaches
            this.video.preload = 'auto';
            this.video.setAttribute('preload', 'auto');
        }
        
        // Try to load and play the video immediately
        this.video.load();
        
        // Staggered attempts with longer delays for Safari
        const delays = [100, 300, 800, 1500, 3000];
        delays.forEach((delay, index) => {
            setTimeout(() => {
                if (!this.videoEnded && this.playAttempts <= index + 1) {
                    this.tryPlayVideo();
                }
            }, delay);
        });
        
        // Extended timeout for Safari which can be slower
        setTimeout(() => {
            if (!this.videoLoaded && !this.videoEnded) {
                console.log('Video load timeout - showing enter section');
                this.onVideoError();
            }
        }, 20000); // 20 seconds timeout for Safari
    }

    onVideoLoaded() {
        console.log('Video loaded successfully');
        this.videoLoaded = true;
        this.video.classList.add('loaded');
        
        // For Safari, wait a bit longer before hiding loading
        const hideDelay = this.isSafari() ? 500 : 0;
        setTimeout(() => this.hideLoading(), hideDelay);
        
        // Try to play video, but be more patient with Safari
        if (this.isSafari()) {
            // Safari needs a moment to be ready
            setTimeout(() => this.tryPlayVideo(), 300);
        } else {
            this.tryPlayVideo();
        }
    }

    onVideoCanPlay() {
        console.log('Video can play');
        // For Safari, this is a better indicator that we should try playing
        if (this.isSafari()) {
            setTimeout(() => this.tryPlayVideo(), 100);
        } else {
            this.tryPlayVideo();
        }
    }

    tryPlayVideo() {
        if (!this.video || this.videoEnded) return;
        
        // Don't try if we haven't loaded yet and it's not Safari
        if (!this.videoLoaded && !this.isSafari()) return;
        
        this.playAttempts++;
        const maxAttempts = this.isSafari() ? 15 : this.maxPlayAttempts; // More attempts for Safari
        
        if (this.playAttempts > maxAttempts) {
            console.log(`Max play attempts reached (${maxAttempts}), showing enter section`);
            this.showEnterSection();
            return;
        }

        // Set video properties for better autoplay success
        this.video.muted = true;
        this.video.volume = 0;
        this.video.playsInline = true;
        this.video.defaultMuted = true;
        
        // For Safari, try to ensure video is ready
        if (this.isSafari() && this.video.readyState < 2) {
            console.log(`Safari: Video not ready (readyState: ${this.video.readyState}), attempt ${this.playAttempts}`);
            // Try again later if video isn't ready
            setTimeout(() => this.tryPlayVideo(), 1000);
            return;
        }
        
        const playPromise = this.video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log(`Video started playing automatically (attempt ${this.playAttempts})`);
                this.playAttempts = 0; // Reset attempts on success
            }).catch(error => {
                console.log(`Video autoplay failed (attempt ${this.playAttempts}/${maxAttempts}):`, error.name, error.message);
                
                // Special handling for Safari
                if (this.isSafari()) {
                    // Safari might need more time or user interaction
                    if (error.name === 'NotAllowedError') {
                        console.log('Safari blocked autoplay - showing enter section');
                        this.showEnterSection();
                        return;
                    }
                    
                    // For other Safari errors, be more patient
                    if (this.playAttempts < maxAttempts) {
                        const delay = Math.min(2000, 500 * this.playAttempts); // Progressive delay
                        setTimeout(() => this.tryPlayVideo(), delay);
                    } else {
                        this.showEnterSection();
                    }
                } else {
                    // Non-Safari browsers
                    if (this.playAttempts < maxAttempts) {
                        setTimeout(() => this.tryPlayVideo(), 1000);
                    } else {
                        this.showEnterSection();
                    }
                }
            });
        } else {
            // Fallback for older browsers
            try {
                this.video.play();
                console.log(`Video started playing (fallback method, attempt ${this.playAttempts})`);
                this.playAttempts = 0; // Reset attempts on success
            } catch (error) {
                console.log(`Video play failed (fallback, attempt ${this.playAttempts}/${maxAttempts}):`, error);
                
                if (this.playAttempts < maxAttempts) {
                    const delay = this.isSafari() ? Math.min(2000, 500 * this.playAttempts) : 1000;
                    setTimeout(() => this.tryPlayVideo(), delay);
                } else {
                    this.showEnterSection();
                }
            }
        }
    }

    onVideoEnded() {
        console.log('Video ended');
        this.videoEnded = true;
        this.showEnterSection();
    }

    onVideoError() {
        console.log('Video failed to load');
        this.hideLoading();
        this.showEnterSection();
    }

    skipVideo() {
        if (this.video) {
            this.video.pause();
        }
        this.videoEnded = true;
        this.showEnterSection();
    }

    showLoading() {
        if (this.videoLoading) {
            this.videoLoading.classList.remove('hidden');
        }
    }

    hideLoading() {
        if (this.videoLoading) {
            this.videoLoading.classList.add('hidden');
        }
    }

    showEnterSection() {
        if (this.enterSection) {
            // Hide video loading if still showing
            this.hideLoading();
            
            // If we're on Safari and the video never played, offer a play option
            if (this.isSafari() && this.video && !this.videoEnded && this.videoLoaded) {
                this.addVideoPlayOption();
            }
            
            this.enterSection.classList.remove('hidden');
            this.enterSection.classList.add('show');
        }
    }
    
    addVideoPlayOption() {
        // Check if we already added the play video button
        if (document.getElementById('play-video-btn')) return;
        
        const enterContent = this.enterSection.querySelector('.enter-content');
        if (enterContent) {
            // Create a "Play Video" button
            const playVideoBtn = document.createElement('button');
            playVideoBtn.id = 'play-video-btn';
            playVideoBtn.className = 'skip-button';
            playVideoBtn.textContent = '▶️ Play Introduction Video';
            playVideoBtn.style.marginBottom = '1rem';
            
            playVideoBtn.addEventListener('click', () => {
                // Hide enter section and try to play video
                this.hideEnterSection();
                this.showLoading();
                this.playAttempts = 0; // Reset attempts
                this.videoEnded = false;
                
                // Try to play video with user interaction
                this.video.play().then(() => {
                    console.log('Safari: Video playing after user click');
                    this.hideLoading();
                }).catch(error => {
                    console.log('Safari: Video still failed after user click:', error);
                    this.hideLoading();
                    this.showEnterSection();
                });
            });
            
            // Insert before the main enter button
            const enterButton = enterContent.querySelector('.enter-button');
            if (enterButton) {
                enterContent.insertBefore(playVideoBtn, enterButton);
            }
        }
    }

    hideEnterSection() {
        if (this.enterSection) {
            this.enterSection.classList.add('hidden');
            this.enterSection.classList.remove('show');
        }
    }

    showAudioPermission() {
        if (this.audioPermission) {
            this.audioPermission.classList.remove('hidden');
            this.audioPermission.classList.add('show');
        }
    }

    hideAudioPermission() {
        if (this.audioPermission) {
            this.audioPermission.classList.add('hidden');
            this.audioPermission.classList.remove('show');
        }
    }

    allowAudio() {
        this.audioEnabled = true;
        this.hideAudioPermission();
        this.redirectToMainSite(true);
    }

    continueSilent() {
        this.audioEnabled = false;
        this.hideAudioPermission();
        this.redirectToMainSite(false);
    }

    enterMainSite() {
        // Check if we need to ask for audio permission on mobile
        if (this.isMobile() && !this.audioEnabled) {
            this.hideEnterSection();
            this.showAudioPermission();
        } else {
            this.redirectToMainSite(this.audioEnabled);
        }
    }

    redirectToMainSite(withAudio = false) {
        // Add transition effect
        document.body.style.transition = 'opacity 1s ease-out';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            // Redirect to main site with audio preference
            const url = withAudio ? 'main.html?audio=enabled' : 'main.html?audio=disabled';
            window.location.href = url;
        }, 1000);
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
    }
    
    isMobileDevice() {
        return this.isMobile();
    }
    
    isSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
               /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    // Utility method to add button hover sound effects (optional)
    playButtonSound() {
        // Could add a subtle sound effect for button interactions
        // This would require audio files and proper audio context handling
    }
}

// Initialize landing page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const landingPage = new LandingPage();
    
    // Global error handler for unhandled promises
    window.addEventListener('unhandledrejection', function(event) {
        console.log('Unhandled promise rejection:', event.reason);
        // Ensure user can still proceed even if something fails
        if (landingPage && !landingPage.videoEnded) {
            landingPage.showEnterSection();
        }
    });
    
    // Global error handler
    window.addEventListener('error', function(event) {
        console.log('Global error:', event.error);
        // Ensure user can still proceed even if something fails
        if (landingPage && !landingPage.videoEnded) {
            landingPage.showEnterSection();
        }
    });
});

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LandingPage;
}

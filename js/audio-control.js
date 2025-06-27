// Audio Control Script
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('chanting-audio');
    const audioToggle = document.getElementById('audio-toggle');
    let isPlaying = false;
    let userInteracted = false;

    // Set initial volume (adjust as needed)
    audio.volume = 0.3;

    // Function to toggle audio
    function toggleAudio() {
        if (!userInteracted) {
            userInteracted = true;
        }

        if (isPlaying) {
            audio.pause();
            audioToggle.textContent = '🔇';
            audioToggle.classList.add('muted');
            audioToggle.title = 'Play Chanting';
            isPlaying = false;
        } else {
            audio.play().then(() => {
                audioToggle.textContent = '🔊';
                audioToggle.classList.remove('muted');
                audioToggle.title = 'Pause Chanting';
                isPlaying = true;
            }).catch(error => {
                console.log('Audio play failed:', error);
                // Fallback for browsers that require user interaction
                audioToggle.textContent = '🔇';
                audioToggle.classList.add('muted');
                audioToggle.title = 'Click to Play Chanting';
            });
        }
    }

    // Audio toggle button event
    audioToggle.addEventListener('click', toggleAudio);

    // Try to autoplay (will only work if browser allows it)
    function attemptAutoplay() {
        if (userInteracted) {
            audio.play().then(() => {
                audioToggle.textContent = '🔊';
                audioToggle.classList.remove('muted');
                audioToggle.title = 'Pause Chanting';
                isPlaying = true;
            }).catch(() => {
                // Autoplay failed, user needs to interact first
                audioToggle.textContent = '🔇';
                audioToggle.classList.add('muted');
                audioToggle.title = 'Click to Play Chanting';
            });
        }
    }

    // Listen for any user interaction to enable autoplay
    document.addEventListener('click', function enableAudio() {
        if (!userInteracted) {
            userInteracted = true;
            // Try to start playing after first user interaction
            setTimeout(attemptAutoplay, 1000);
        }
    }, { once: true });

    // Handle audio loading errors
    audio.addEventListener('error', function(e) {
        console.log('Audio loading error:', e);
        audioToggle.textContent = '❌';
        audioToggle.title = 'Audio not available';
        audioToggle.disabled = true;
    });

    // Audio ended event (though it's on loop)
    audio.addEventListener('ended', function() {
        if (isPlaying) {
            audio.play();
        }
    });

    // Set initial state
    audioToggle.textContent = '🔇';
    audioToggle.classList.add('muted');
    audioToggle.title = 'Click to Play Chanting';
});

// Handle dynamic viewport height changes on mobile
function updateViewportHeight() {
    // Update CSS custom property for viewport height
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

// Initial call
updateViewportHeight();

// Update on resize (handles mobile browser toolbar show/hide)
window.addEventListener('resize', updateViewportHeight);
window.addEventListener('orientationchange', function() {
    // Small delay to ensure the orientation change is complete
    setTimeout(updateViewportHeight, 100);
});

/*
 * Erevos - Dark Ops AI Intelligence - JavaScript
 * Clean, accessible, performance-focused implementation
 * Focus: Progressive enhancement, accessibility, and minimal dependencies
 */

'use strict';

/**
 * Copy token address to clipboard
 */
function copyTokenAddress() {
  const fullAddress = "4x7BmK2nQvCp8fGhX9rL3wY5sT1uV6eR7iO8pA9sD2fH3jK4mN5qW6eR7tY8uI9oP0";
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Modern async clipboard API
      navigator.clipboard.writeText(fullAddress).then(() => {
        showCopyFeedback();
        console.log('Token address copied to clipboard');
      }).catch((err) => {
        console.error('Clipboard API failed:', err);
        fallbackCopy();
      });
    } else {
      // Fallback for older browsers or non-secure contexts
      fallbackCopy();
    }
  } catch (error) {
    console.error('Copy function error:', error);
    fallbackCopy();
  }
  
  function fallbackCopy() {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = fullAddress;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, fullAddress.length);
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        showCopyFeedback();
        console.log('Token address copied using fallback method');
      } else {
        console.error('Fallback copy failed');
        alert('Copy failed. Please manually copy: ' + fullAddress);
      }
    } catch (err) {
      console.error('Fallback copy error:', err);
      alert('Copy failed. Please manually copy: ' + fullAddress);
    }
  }
  
  function showCopyFeedback() {
    const button = document.getElementById('tokenAddress');
    if (!button) return;
    
    const caAddress = button.querySelector('.ca-address');
    const copyIcon = button.querySelector('.copy-icon');
    
    if (caAddress && copyIcon) {
      const originalText = caAddress.textContent;
      const originalIcon = copyIcon.textContent;
      
      // Show feedback
      caAddress.textContent = 'Copied!';
      copyIcon.textContent = '✓';
      
      // Reset after 2 seconds
      setTimeout(() => {
        caAddress.textContent = originalText;
        copyIcon.textContent = originalIcon;
      }, 2000);
    }
  }
}

/**
 * Blood Loading and Authentication Controller
 * Handles loading screen, wallet authentication, and app flow
 */
class BloodFlowController {
  constructor() {
    this.loadingProgress = 0;
    this.loadingDuration = 10000; // 10 seconds
    this.isAuthenticated = false;
    this.connectedWallet = null;
    
    this.init();
  }

  init() {
    // Check if user is already authenticated in this session
    const sessionAuth = sessionStorage.getItem('bloodAuth');
    const sessionWallet = sessionStorage.getItem('bloodWallet');
    
    if (sessionAuth === 'true' && sessionWallet) {
      console.log('User already authenticated in session, skipping loading/auth flow');
      this.isAuthenticated = true;
      this.connectedWallet = JSON.parse(sessionWallet);
      this.skipToMainContent();
      return;
    }
    
    // Start normal loading sequence for new users
    this.startLoadingSequence();
    this.setupWalletButtons();
    
    // Use proper event-driven wallet detection
    this.setupWalletDetection();
  }

  /**
   * Skip directly to main content for authenticated users
   */
  skipToMainContent() {
    const loadingScreen = document.getElementById('loadingScreen');
    const authScreen = document.getElementById('authScreen');
    const mainContent = document.getElementById('mainContent');

    if (loadingScreen) loadingScreen.style.display = 'none';
    if (authScreen) authScreen.style.display = 'none';
    if (mainContent) {
      mainContent.classList.remove('hidden');
      
      // Ensure video background loads properly
      const video = mainContent.querySelector('.video-background video');
      if (video) {
        // Force video to start playing if it's not already
        video.play().catch(error => {
          console.log('Video autoplay prevented by browser policy:', error);
        });
        
        // Ensure video is visible
        const videoBackground = mainContent.querySelector('.video-background');
        if (videoBackground) {
          videoBackground.style.display = 'block';
          videoBackground.style.visibility = 'visible';
          videoBackground.style.opacity = '1';
        }
      }
      
      // Initialize the main UI controller
      setTimeout(() => {
        new ErevosUI();
      }, 100);
    }
    
    console.log('Authenticated user - showing main content immediately');
  }

  /**
   * Setup proper wallet detection using event-driven approach
   */
  setupWalletDetection() {
    console.log('Setting up wallet detection...');
    
    // Listen for Ethereum provider injection (MetaMask, etc.)
    if (window.ethereum) {
      console.log('Ethereum provider already available');
      this.detectWallets();
    } else {
      console.log('Waiting for ethereum provider...');
      window.addEventListener('ethereum#initialized', () => {
        console.log('Ethereum provider initialized');
        this.detectWallets();
      });
      
      // Fallback - some wallets don't fire the event
      setTimeout(() => {
        if (window.ethereum) {
          console.log('Ethereum provider found via timeout');
          this.detectWallets();
        }
      }, 3000);
    }

    // Listen for Solana provider injection (Phantom, Solflare)
    if (window.solana) {
      console.log('Solana provider already available');
      this.detectWallets();
    } else {
      console.log('Waiting for solana provider...');
      
      // Phantom specific ready event
      window.addEventListener('phantom#initialized', () => {
        console.log('Phantom provider initialized');
        this.detectWallets();
      });
      
      // General solana provider detection with polling
      const checkSolanaProvider = () => {
        if (window.solana) {
          console.log('Solana provider found');
          this.detectWallets();
        } else {
          console.log('Still waiting for solana provider...');
          setTimeout(checkSolanaProvider, 1000);
        }
      };
      
      // Start checking after a short delay
      setTimeout(checkSolanaProvider, 1000);
    }

    // Also run detection on page load as fallback
    window.addEventListener('load', () => {
      console.log('Page fully loaded, running wallet detection');
      setTimeout(() => {
        this.detectWallets();
      }, 2000);
    });
  }

  /**
   * Detect available wallets using standard methods
   */
  detectWallets() {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`=== WALLET DETECTION DEBUG [${timestamp}] ===`);
    console.log('Document ready state:', document.readyState);
    console.log('Current URL:', window.location.href);
    console.log('User agent:', navigator.userAgent);
    console.log('Window object keys containing wallet terms:', 
      Object.keys(window).filter(key => 
        key.toLowerCase().includes('solana') || 
        key.toLowerCase().includes('phantom') || 
        key.toLowerCase().includes('ethereum') || 
        key.toLowerCase().includes('metamask') || 
        key.toLowerCase().includes('solflare')
      )
    );
    
    // Check if running in secure context
    console.log('Secure context (HTTPS):', window.isSecureContext);
    
    // Detailed Phantom detection
    console.log('--- PHANTOM DETECTION ---');
    console.log('window.solana exists:', !!window.solana);
    if (window.solana) {
      console.log('window.solana properties:', Object.keys(window.solana));
      console.log('window.solana.isPhantom:', window.solana.isPhantom);
      console.log('window.solana.isConnected:', window.solana.isConnected);
      console.log('window.solana.publicKey:', window.solana.publicKey);
    }
    
    // Detailed MetaMask detection
    console.log('--- METAMASK DETECTION ---');
    console.log('window.ethereum exists:', !!window.ethereum);
    if (window.ethereum) {
      console.log('window.ethereum properties:', Object.keys(window.ethereum));
      console.log('window.ethereum.isMetaMask:', window.ethereum.isMetaMask);
      console.log('window.ethereum.selectedAddress:', window.ethereum.selectedAddress);
    }
    
    // Detailed Solflare detection
    console.log('--- SOLFLARE DETECTION ---');
    console.log('window.solflare exists:', !!window.solflare);
    if (window.solflare) {
      console.log('window.solflare properties:', Object.keys(window.solflare));
    }
    
    console.log('=== END DEBUG ===');
    
    // Now do the actual detection without redirects or auto-connections
    if (window.solana && window.solana.isPhantom) {
      console.log('✅ Phantom wallet detected');
    } else {
      console.log('❌ Phantom wallet not detected');
    }

    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log('✅ MetaMask wallet detected');
    } else {
      console.log('❌ MetaMask wallet not detected');
    }

    if (window.solflare) {
      console.log('✅ Solflare wallet detected');
    } else {
      console.log('❌ Solflare wallet not detected');
    }
  }

  /**
   * Manual wallet detection trigger (for debugging)
   * Call this from console: window.bloodFlow.detectWallets()
   */
  manualDetectWallets() {
    console.log('🔍 Manual wallet detection triggered');
    this.detectWallets();
  }


  /**
   * Update wallet card status
   */
  updateWalletStatus(card, status) {
    const connectText = card.querySelector('.connect-text');
    if (connectText && status === 'Install Required') {
      connectText.textContent = 'INSTALL';
      connectText.style.color = '#ff6666';
    }
  }

  /**
   * Start the loading sequence
   */
  startLoadingSequence() {
    const progressBar = document.getElementById('progressBar');
    const percentageDisplay = document.getElementById('loadingPercentage');
    const loadingScreen = document.getElementById('loadingScreen');
    const authScreen = document.getElementById('authScreen');

    if (!progressBar || !percentageDisplay || !loadingScreen || !authScreen) {
      console.error('Loading elements not found');
      return;
    }

    const startTime = Date.now();
    const updateInterval = 50; // Update every 50ms for smooth animation

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / this.loadingDuration) * 100, 100);
      
      progressBar.style.width = `${progress}%`;
      percentageDisplay.textContent = `${Math.floor(progress)}%`;
      
      if (progress < 100) {
        setTimeout(updateProgress, updateInterval);
      } else {
        // Loading complete, transition to auth screen
        setTimeout(() => {
          this.transitionToAuth();
        }, 500);
      }
    };

    updateProgress();
  }

  /**
   * Transition from loading to authentication screen
   */
  transitionToAuth() {
    const loadingScreen = document.getElementById('loadingScreen');
    const authScreen = document.getElementById('authScreen');

    if (loadingScreen && authScreen) {
      loadingScreen.classList.add('fade-out');
      
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        authScreen.classList.remove('hidden');
        
        // Only check for existing connections after auth screen is shown
        this.checkForExistingConnections();
      }, 1000);
    }
  }

  /**
   * Check for existing wallet connections (only called when auth screen is shown)
   * Note: Disabled auto-skip - users must always authenticate on each visit
   */
  async checkForExistingConnections() {
    try {
      // Log existing connections but don't auto-skip auth
      if (window.solana && window.solana.isPhantom && window.solana.isConnected) {
        console.log('Phantom is already connected, but user must still authenticate');
      }

      if (window.ethereum && window.ethereum.isMetaMask && window.ethereum.selectedAddress) {
        console.log('MetaMask is already connected, but user must still authenticate');
      }
      
      // Always show auth screen - no auto-skip
      console.log('Auth screen displayed - user must manually select wallet');
    } catch (error) {
      console.log('Error checking existing connections:', error);
    }
  }

  /**
   * Setup wallet connection buttons
   */
  setupWalletButtons() {
    const walletButtons = document.querySelectorAll('.wallet-card');
    
    walletButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const walletType = e.currentTarget.getAttribute('data-wallet');
        this.connectWallet(walletType);
      });
    });
  }

  /**
   * Connect to specified wallet
   */
  async connectWallet(walletType) {
    const button = document.querySelector(`[data-wallet="${walletType}"]`);
    if (!button) return;

    // Add loading state to button
    const walletName = button.querySelector('.wallet-name');
    const connectText = button.querySelector('.connect-text');
    const originalName = walletName.textContent;
    const originalConnect = connectText.textContent;
    
    walletName.textContent = 'CONNECTING...';
    connectText.textContent = 'WAIT...';
    button.disabled = true;
    button.style.pointerEvents = 'none';
    button.style.opacity = '0.7';

    try {
      let wallet = null;
      
      switch (walletType) {
        case 'phantom':
          wallet = await this.connectPhantom();
          break;
        case 'solflare':
          wallet = await this.connectSolflare();
          break;
        case 'metamask':
          wallet = await this.connectMetaMask();
          break;
        default:
          throw new Error('Unsupported wallet type');
      }

      if (wallet) {
        this.connectedWallet = wallet;
        this.isAuthenticated = true;
        
        // Show success state briefly
        walletName.textContent = 'CONNECTED';
        connectText.textContent = 'SUCCESS';
        button.style.background = 'linear-gradient(135deg, rgba(255, 68, 68, 0.3), rgba(255, 68, 68, 0.1))';
        button.style.borderColor = '#ff4444';
        button.style.boxShadow = '0 0 20px rgba(255, 68, 68, 0.6)';
        button.style.transform = 'translateY(-2px) translateZ(20px)';
        
        setTimeout(() => {
          this.transitionToMainContent();
        }, 1500);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      
      // Show error state
      walletName.textContent = 'CONNECTION FAILED';
      connectText.textContent = 'ERROR';
      button.style.background = 'linear-gradient(135deg, rgba(255, 0, 64, 0.2), rgba(255, 0, 64, 0.1))';
      button.style.borderColor = '#ff0040';
      button.style.boxShadow = '0 0 20px rgba(255, 0, 64, 0.4)';
      
      // Reset button after delay
      setTimeout(() => {
        walletName.textContent = originalName;
        connectText.textContent = originalConnect;
        button.style.background = '';
        button.style.borderColor = '';
        button.style.boxShadow = '';
        button.style.transform = '';
        button.style.pointerEvents = '';
        button.style.opacity = '';
        button.disabled = false;
        
        // If wallet wasn't installed, keep showing install text
        if (error.message.includes('not installed')) {
          connectText.textContent = 'INSTALL';
          connectText.style.color = '#ff6666';
        }
      }, 3000);
    }
  }

  /**
   * Connect to Phantom wallet
   */
  async connectPhantom() {
    try {
      console.log('=== PHANTOM CONNECTION ATTEMPT ===');
      console.log('window.solana exists:', !!window.solana);
      console.log('window.solana.isPhantom:', window.solana?.isPhantom);
      
      // Remove download redirect for debugging
      if (!window.solana || !window.solana.isPhantom) {
        console.error('❌ Phantom not detected during connection attempt');
        throw new Error('Phantom wallet not detected. Please ensure it is installed and enabled.');
      }

      console.log('Phantom detected, requesting connection...');
      console.log('Available methods on window.solana:', Object.keys(window.solana));
      
      // Standard Phantom connection - this will open the wallet popup
      const response = await window.solana.connect();
      console.log('Phantom connection response:', response);
      
      if (response && response.publicKey) {
        console.log('✅ Phantom connected successfully');
        return {
          type: 'phantom',
          publicKey: response.publicKey.toString(),
          address: response.publicKey.toString()
        };
      } else {
        throw new Error('Failed to get public key from Phantom');
      }
    } catch (error) {
      console.error('❌ Phantom connection error:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // Handle user rejection
      if (error.code === 4001 || error.message.includes('User rejected')) {
        throw new Error('Connection rejected by user');
      }
      // Handle not installed
      else if (error.message.includes('not detected')) {
        throw error;
      }
      // Handle other errors
      else {
        throw new Error(`Connection failed: ${error.message}`);
      }
    }
  }

  /**
   * Connect to Solflare wallet
   */
  async connectSolflare() {
    try {
      console.log('=== SOLFLARE CONNECTION ATTEMPT ===');
      console.log('window.solflare exists:', !!window.solflare);
      
      // Remove download redirect for debugging
      if (!window.solflare) {
        console.error('❌ Solflare not detected during connection attempt');
        throw new Error('Solflare wallet not detected. Please ensure it is installed and enabled.');
      }

      console.log('Solflare detected, checking connection state...');
      console.log('Available methods on window.solflare:', Object.keys(window.solflare));
      
      // Check if Solflare is already connected and disconnect first to reset state
      if (window.solflare.isConnected) {
        console.log('Solflare is already connected, disconnecting first to reset state...');
        try {
          await window.solflare.disconnect();
        } catch (disconnectError) {
          console.log('Disconnect error (may be normal):', disconnectError);
        }
      }

      console.log('Attempting fresh Solflare connection...');
      
      // Connect to Solflare - this should return the connection result
      const response = await window.solflare.connect();
      console.log('Solflare connection response:', response);
      
      // Solflare uses different property access than Phantom
      // Try multiple ways to get the public key
      let publicKey = null;
      
      if (response && response.publicKey) {
        publicKey = response.publicKey;
      } else if (window.solflare.publicKey) {
        publicKey = window.solflare.publicKey;
      } else if (window.solflare.wallet && window.solflare.wallet.publicKey) {
        publicKey = window.solflare.wallet.publicKey;
      }
      
      console.log('Extracted publicKey:', publicKey);
      
      if (publicKey) {
        console.log('✅ Solflare connected successfully');
        return {
          type: 'solflare',
          publicKey: publicKey.toString(),
          address: publicKey.toString()
        };
      } else {
        throw new Error('Failed to get public key from Solflare - no publicKey found in response');
      }
    } catch (error) {
      console.error('❌ Solflare connection error:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // Handle user rejection
      if (error.code === 4001 || error.message.includes('rejected') || error.message.includes('User rejected')) {
        throw new Error('Connection rejected by user');
      }
      // Handle not installed
      else if (error.message.includes('not detected')) {
        throw error;
      }
      // Handle other errors
      else {
        throw new Error(`Connection failed: ${error.message}`);
      }
    }
  }

  /**
   * Connect to MetaMask wallet
   */
  async connectMetaMask() {
    try {
      console.log('=== METAMASK CONNECTION ATTEMPT ===');
      console.log('window.ethereum exists:', !!window.ethereum);
      console.log('window.ethereum.isMetaMask:', window.ethereum?.isMetaMask);

      // Remove download redirect for debugging
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.error('❌ MetaMask not detected during connection attempt');
        throw new Error('MetaMask wallet not detected. Please ensure it is installed and enabled.');
      }

      console.log('MetaMask detected, requesting accounts...');
      console.log('Available methods on window.ethereum:', Object.keys(window.ethereum));

      // Standard MetaMask connection - this will open the wallet popup
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      console.log('MetaMask accounts response:', accounts);
      
      if (accounts && accounts.length > 0) {
        console.log('✅ MetaMask connected successfully');
        return {
          type: 'metamask',
          publicKey: accounts[0],
          address: accounts[0]
        };
      } else {
        throw new Error('No accounts found');
      }
    } catch (error) {
      console.error('❌ MetaMask connection error:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // Handle user rejection
      if (error.code === 4001) {
        throw new Error('Connection rejected by user');
      }
      // Handle pending request
      else if (error.code === -32002) {
        throw new Error('Connection request already pending');
      }
      // Handle not installed
      else if (error.message.includes('not detected')) {
        throw error;
      }
      // Handle other errors
      else {
        throw new Error(`Connection failed: ${error.message}`);
      }
    }
  }

  /**
   * Transition to main content after successful authentication
   */
  transitionToMainContent() {
    const authScreen = document.getElementById('authScreen');
    const mainContent = document.getElementById('mainContent');

    // Save authentication state to session storage
    sessionStorage.setItem('bloodAuth', 'true');
    sessionStorage.setItem('bloodWallet', JSON.stringify(this.connectedWallet));
    console.log('Authentication state saved to session');

    if (authScreen && mainContent) {
      authScreen.classList.add('fade-out');
      
      setTimeout(() => {
        authScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        
        // Ensure video background loads properly
        const video = mainContent.querySelector('.video-background video');
        if (video) {
          // Force video to start playing if it's not already
          video.play().catch(error => {
            console.log('Video autoplay prevented by browser policy:', error);
          });
          
          // Ensure video is visible
          const videoBackground = mainContent.querySelector('.video-background');
          if (videoBackground) {
            videoBackground.style.display = 'block';
            videoBackground.style.visibility = 'visible';
            videoBackground.style.opacity = '1';
          }
        }
        
        // Initialize the main UI controller
        new ErevosUI();
      }, 1000);
    }
  }

  /**
   * Force re-authentication (clears session)
   */
  forceReauth() {
    console.log('Forcing re-authentication, clearing session');
    sessionStorage.removeItem('bloodAuth');
    sessionStorage.removeItem('bloodWallet');
    this.isAuthenticated = false;
    this.connectedWallet = null;
    
    // Reload the page to restart the flow
    window.location.reload();
  }

  /**
   * Show wallet auth screen for wallet switching
   */
  showWalletAuth() {
    const authScreen = document.getElementById('authScreen');
    const mainContent = document.getElementById('mainContent');
    
    if (authScreen && mainContent) {
      mainContent.classList.add('hidden');
      authScreen.classList.remove('hidden');
      authScreen.style.display = 'flex';
      authScreen.classList.remove('fade-out');
      
      console.log('Wallet auth screen displayed for wallet switching');
    }
  }
}

/**
 * Erevos UI Controller
 * Handles core functionality with emphasis on accessibility and performance
 */
class ErevosUI {
  constructor() {
    this.isInitialized = false;
    
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    try {
      this.ensureScrollToTop();
      this.setupEventListeners();
      this.setupAccessibilityFeatures();
      this.setupPerformanceOptimizations();
      this.setupSecurityFeatures();
      
      this.isInitialized = true;
      console.log('Blood Liquidation Intelligence UI initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Blood UI:', error);
    }
  }

  /**
   * Ensure page loads at the top when refreshed
   */
  ensureScrollToTop() {
    // Immediately scroll to top
    window.scrollTo(0, 0);
    
    // Also ensure it happens after DOM is fully loaded
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => {
        window.scrollTo(0, 0);
      });
    }
    
    // Handle browser back/forward navigation
    window.addEventListener('beforeunload', () => {
      window.scrollTo(0, 0);
    });
    
    // Handle page show event (when page is restored from cache)
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        window.scrollTo(0, 0);
      }
    });
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Smooth scrolling for anchor links
    this.setupSmoothScrolling();
    
    // Form enhancements
    this.setupFormEnhancements();
    
    // Button interactions
    this.setupButtonInteractions();
    
    
    // Scroll-triggered animations
    this.setupScrollAnimations();
    
    // Parallax effects
    this.setupParallaxEffects();
    
    // Advanced component interactions
    this.setupAdvancedInteractions();
  }

  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        
        // Skip empty hash or just # links
        if (!targetId || targetId === '#') {
          return;
        }
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Prevent default behavior immediately and stop propagation
          event.preventDefault();
          event.stopPropagation();
          
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          let extraOffset = 20;
          
          // Special handling for docs page sections
          if (document.body.classList.contains('docs-page')) {
            // Reduce offset slightly to position one scroll click lower
            extraOffset = -15; // Negative offset to scroll down a bit more
          }
          
          const targetPosition = Math.max(0, targetElement.offsetTop - headerHeight - extraOffset);
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update focus for accessibility
          setTimeout(() => {
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus({ preventScroll: true });
            targetElement.addEventListener('blur', () => {
              targetElement.removeAttribute('tabindex');
            }, { once: true });
          }, 100);
        }
      }, { passive: false });
    });
  }

  /**
   * Setup form enhancements
   */
  setupFormEnhancements() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Add loading states
      form.addEventListener('submit', (_event) => {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.setAttribute('aria-busy', 'true');
          
          const originalText = submitButton.textContent;
          submitButton.textContent = 'Processing...';
          
          // Reset after a delay (in real app, this would be after actual submission)
          setTimeout(() => {
            submitButton.disabled = false;
            submitButton.removeAttribute('aria-busy');
            submitButton.textContent = originalText;
          }, 2000);
        }
      });
    });
  }

  /**
   * Setup button interactions
   */
  setupButtonInteractions() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      // Add ripple effect on click
      button.addEventListener('click', this.createRippleEffect.bind(this));
      
      // Keyboard interaction feedback
      button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          button.classList.add('btn-active');
        }
      });
      
      button.addEventListener('keyup', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          button.classList.remove('btn-active');
        }
      });
    });
  }


  /**
   * Create subtle ripple effect for buttons
   */
  createRippleEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      transform: scale(0);
      animation: erevos-ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    // Ensure button has relative positioning
    if (getComputedStyle(button).position === 'static') {
      button.style.position = 'relative';
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * Setup accessibility features
   */
  setupAccessibilityFeatures() {
    // Announce theme changes to screen readers
    this.createAriaLiveRegion();
    
    // Skip link functionality
    this.setupSkipLink();
    
    // Focus management
    this.setupFocusManagement();
    
    // Reduced motion support
    this.setupReducedMotionSupport();
    
    // High contrast support
    this.setupHighContrastSupport();
  }

  /**
   * Create ARIA live region for announcements
   */
  createAriaLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'erevos-aria-live-region';
    document.body.appendChild(liveRegion);
  }

  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message) {
    const liveRegion = document.getElementById('erevos-aria-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * Setup skip link functionality
   */
  setupSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (event) => {
        event.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.focus();
        }
      });
    }
  }

  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Ensure focusable elements are properly managed
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
      // Ensure all interactive elements have visible focus indicators
      element.addEventListener('focus', () => {
        element.classList.add('focused');
      });
      
      element.addEventListener('blur', () => {
        element.classList.remove('focused');
      });
    });
  }

  /**
   * Setup reduced motion support
   */
  setupReducedMotionSupport() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
  }

  /**
   * Setup high contrast support
   */
  setupHighContrastSupport() {
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (prefersHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }
  }

  /**
   * Setup security features
   */
  setupSecurityFeatures() {
    // Basic security measures for dark ops theme
    this.setupCSPCompliance();
    this.setupSecureNavigation();
  }

  /**
   * Setup CSP compliance
   */
  setupCSPCompliance() {
    // Ensure all inline styles are properly handled
    // This would be expanded in a real security-focused application
    console.log('CSP compliance measures initialized');
  }

  /**
   * Setup secure navigation
   */
  setupSecureNavigation() {
    // Add security attributes to external links
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    
    externalLinks.forEach(link => {
      if (!link.hasAttribute('rel')) {
        link.setAttribute('rel', 'noopener noreferrer');
      }
      if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
      }
    });
  }

  /**
   * Setup scroll-triggered animations
   */
  setupScrollAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.feature-item, .intelligence-item, .stat-item, .integration-item');
    animatedElements.forEach((el, index) => {
      el.classList.add('animate-on-scroll');
      if (index < 6) el.classList.add(`stagger-${index + 1}`);
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
  }

  /**
   * Setup parallax effects
   */
  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero, .stats');
    parallaxElements.forEach(el => el.classList.add('parallax-slow'));

    let ticking = false;
    const updateParallax = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const rate = scrolled * -0.5;
          
          parallaxElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
              el.style.transform = `translate3d(0, ${rate}px, 0)`;
            }
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateParallax, { passive: true });
  }

  /**
   * Setup advanced component interactions
   */
  setupAdvancedInteractions() {
    // Enhanced card hover effects
    const cards = document.querySelectorAll('.feature-item, .intelligence-item, .integration-item');
    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.createParticleEffect(e.currentTarget);
      });
      
      card.addEventListener('mousemove', (e) => {
        this.updateCardTilt(e);
      });
      
      card.addEventListener('mouseleave', (e) => {
        this.resetCardTilt(e.currentTarget);
      });
    });

    // Logo interaction
    const logo = document.querySelector('.logo');
    if (logo) {
      logo.addEventListener('click', () => {
        this.createLogoEffect();
      });
    }

  }

  /**
   * Create particle effect on card hover
   */
  createParticleEffect(element) {
    const particles = 3;
    for (let i = 0; i < particles; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--color-accent);
        border-radius: 50%;
        pointer-events: none;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: particle-float 2s ease-out forwards;
      `;
      element.appendChild(particle);
      
      setTimeout(() => particle.remove(), 2000);
    }
  }

  /**
   * Update card tilt effect
   */
  updateCardTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
  }

  /**
   * Reset card tilt
   */
  resetCardTilt(card) {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  }

  /**
   * Create logo click effect
   */
  createLogoEffect() {
    const logo = document.querySelector('.logo-icon');
    if (logo) {
      logo.style.animation = 'none';
      setTimeout(() => {
        logo.style.animation = 'logo-pulse 0.6s ease-out';
      }, 10);
    }
  }


  /**
   * Setup performance optimizations
   */
  setupPerformanceOptimizations() {
    // Lazy load images (if any are added)
    this.setupLazyLoading();
    
    // Debounce scroll events
    this.setupScrollOptimization();
    
    // Monitor performance
    this.setupPerformanceMonitoring();
  }

  /**
   * Setup lazy loading for images
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Setup scroll optimization
   */
  setupScrollOptimization() {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll-based functionality would go here
          // For example, updating navigation highlight based on section
          this.updateNavigationHighlight();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Update navigation highlight based on current section
   */
  updateNavigationHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"], .docs-nav-link[href^="#"]');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100; // Adjusted to match scroll positioning
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
    
    // Update header transparency based on scroll
    const header = document.querySelector('.header');
    if (header) {
      if (scrollPosition > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // This would integrate with a real performance monitoring solution
      console.log('Performance monitoring initialized for Blood');
    }
    
    // Simple performance logging
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(`Blood loaded in ${loadTime.toFixed(2)}ms`);
      
      // Log navigation timing
      if (performance.navigation) {
        console.log('Navigation type:', performance.navigation.type);
      }
    });
  }
}

/**
 * Enhanced Error handling and logging for security-focused application
 */
class ErevosErrorHandler {
  static init() {
    // Global error handler with security considerations
    window.addEventListener('error', (event) => {
      const errorInfo = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      console.error('Blood JavaScript error:', errorInfo);
      
      // In production, this would send errors to a secure logging service
      // with proper data sanitization
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Blood unhandled promise rejection:', {
        reason: event.reason,
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
      
      // Prevent the default browser behavior
      event.preventDefault();
    });

    // Security-focused error reporting
    window.addEventListener('securitypolicyviolation', (event) => {
      console.error('CSP Violation:', {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy
      });
    });
  }
}

/**
 * Enhanced utility functions for dark ops theme
 */
const ErevosUtils = {
  /**
   * Debounce function calls
   */
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  },

  /**
   * Throttle function calls
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Check if element is in viewport
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Secure random string generation
   */
  generateSecureId(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    if (window.crypto && window.crypto.getRandomValues) {
      const array = new Uint8Array(length);
      window.crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
      }
    } else {
      // Fallback for older browsers
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    return result;
  },

  /**
   * Sanitize HTML to prevent XSS
   */
  sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// Add enhanced animation styles for Erevos theme
const style = document.createElement('style');
style.textContent = `
  @keyframes erevos-ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @keyframes erevos-glow {
    0%, 100% {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
    50% {
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
    }
  }
  
  .btn-active {
    transform: translateY(1px);
  }
  
  .focused {
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
  
  .nav-link.active {
    color: var(--color-accent);
  }
  
  .nav-link.active::after {
    width: 100%;
  }
  
  .reduce-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .high-contrast .btn-secondary {
    border-width: 2px;
  }
  
  .high-contrast .feature-item:hover,
  .high-contrast .intelligence-item:hover {
    border-width: 2px;
  }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ErevosErrorHandler.init();
    // Start with the loading flow instead of main UI
    const bloodFlow = new BloodFlowController();
    // Expose globally for debugging
    window.bloodFlow = bloodFlow;
  });
} else {
  ErevosErrorHandler.init();
  // Start with the loading flow instead of main UI
  const bloodFlow = new BloodFlowController();
  // Expose globally for debugging
  window.bloodFlow = bloodFlow;
}

// Export for testing or module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BloodFlowController, ErevosUI, ErevosErrorHandler, ErevosUtils };
}

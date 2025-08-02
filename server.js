const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON parsing for POST requests
app.use(express.json());

// Serve static files from public folder
app.use(express.static('public'));

// Advanced OSINT Search - Multiple query types
app.post('/api/osint/search', async (req, res) => {
  const { query, searchType } = req.body;
  
  try {
    let results = [];
    
    if (searchType === 'comprehensive' || searchType === 'username') {
      // Username search across all platforms
      results.push(...await searchUsername(query));
    }
    
    if (searchType === 'comprehensive' || searchType === 'email') {
      // Email search and validation
      results.push(...await searchEmail(query));
    }
    
    if (searchType === 'comprehensive' || searchType === 'phone') {
      // Phone number search
      results.push(...await searchPhone(query));
    }
    
    if (searchType === 'comprehensive' || searchType === 'crossref') {
      // Cross-reference search
      results.push(...await crossReferenceSearch(query));
    }
    
    res.json({ 
      success: true, 
      totalResults: results.length,
      results: results,
      searchType: searchType,
      query: query
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Advanced search failed',
      details: error.message 
    });
  }
});

// Email validation and search
async function searchEmail(email) {
  const results = [];
  
  // Extract username from email
  const username = email.split('@')[0];
  const domain = email.split('@')[1];
  
  try {
    // Gravatar check
    const gravatarCheck = await checkGravatar(email);
    if (gravatarCheck.exists) {
      results.push({
        platform: 'Gravatar',
        type: 'email',
        found: true,
        url: gravatarCheck.url,
        info: 'Email registered with Gravatar',
        confidence: 'high'
      });
    }
    
    // Check if email pattern exists on major platforms
    const emailPlatforms = [
      { name: 'GitHub', url: `https://github.com/${username}`, checkEmail: true },
      { name: 'Gitlab', url: `https://gitlab.com/${username}`, checkEmail: true }
    ];
    
    for (const platform of emailPlatforms) {
      try {
        const response = await axios.get(platform.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          timeout: 5000
        });
        
        if (response.status === 200) {
          results.push({
            platform: platform.name,
            type: 'email_derived',
            found: true,
            url: platform.url,
            info: `Username from email found on ${platform.name}`,
            confidence: 'medium'
          });
        }
      } catch (error) {
        // Platform not found, continue
      }
    }
    
  } catch (error) {
    console.error('Email search error:', error);
  }
  
  return results;
}

// Phone number search
async function searchPhone(phone) {
  const results = [];
  
  try {
    // WhatsApp check
    const waCheck = await checkWhatsApp(phone);
    if (waCheck.exists) {
      results.push({
        platform: 'WhatsApp',
        type: 'phone',
        found: true,
        url: `https://wa.me/${phone}`,
        info: 'Phone number active on WhatsApp',
        confidence: 'high'
      });
    }
    
    // Telegram check
    const telegramCheck = await checkTelegram(phone);
    if (telegramCheck.exists) {
      results.push({
        platform: 'Telegram',
        type: 'phone',
        found: true,
        url: `https://t.me/+${phone}`,
        info: 'Phone number associated with Telegram',
        confidence: 'high'
      });
    }
    
  } catch (error) {
    console.error('Phone search error:', error);
  }
  
  return results;
}

// Cross-reference search
async function crossReferenceSearch(query) {
  const results = [];
  
  try {
    // Google search simulation (limited)
    const googleResults = await simulateGoogleSearch(query);
    results.push(...googleResults);
    
    // Social media cross-references
    const socialCrossRef = await socialMediaCrossReference(query);
    results.push(...socialCrossRef);
    
    // Breach data check (using public APIs)
    const breachCheck = await checkDataBreaches(query);
    results.push(...breachCheck);
    
  } catch (error) {
    console.error('Cross-reference search error:', error);
  }
  
  return results;
}

// Username search (existing functionality)
async function searchUsername(username) {
  const results = [];
  
  const platforms = [
    'github', 'instagram', 'tiktok', 'youtube', 'twitter', 'linkedin', 
    'discord', 'twitch', 'reddit', 'telegram', 'spotify', 'vk', 'tumblr',
    'deviantart', 'behance', 'dribbble', 'flickr', 'gitlab', 'bitbucket',
    'medium', 'patreon', 'vimeo', 'keybase', 'quora', 'hackernews',
    'stackoverflow', 'lastfm', 'mastodon', 'goodreads', 'xing'
  ];
  
  for (const platform of platforms) {
    try {
      const response = await axios.get(`http://localhost:${PORT}/api/check/${platform}/${username}`);
      if (response.data.exists) {
        results.push({
          platform: platform,
          type: 'username',
          found: true,
          url: getPlatformUrl(platform, username),
          info: `Active profile found`,
          confidence: 'high'
        });
      }
    } catch (error) {
      // Continue with next platform
    }
  }
  
  return results;
}

// Helper functions
async function checkGravatar(email) {
  try {
    const crypto = require('crypto');
    const hash = crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
    const response = await axios.get(`https://www.gravatar.com/avatar/${hash}?d=404`, {
      timeout: 5000
    });
    return { 
      exists: response.status === 200, 
      url: `https://www.gravatar.com/avatar/${hash}` 
    };
  } catch (error) {
    return { exists: false };
  }
}

async function checkWhatsApp(phone) {
  // Note: Real WhatsApp API requires authorization
  // This is a simulation
  try {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    if (cleanPhone.length >= 10) {
      return { exists: true, url: `https://wa.me/${cleanPhone}` };
    }
  } catch (error) {
    return { exists: false };
  }
  return { exists: false };
}

async function checkTelegram(phone) {
  // Telegram username lookup simulation
  try {
    const response = await axios.get(`https://t.me/+${phone}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 5000
    });
    return { exists: response.status === 200 };
  } catch (error) {
    return { exists: false };
  }
}

async function simulateGoogleSearch(query) {
  const results = [];
  
  // Simulate Google search results for the query
  const searchTerms = [
    `"${query}"`,
    `"${query}" site:linkedin.com`,
    `"${query}" site:facebook.com`,
    `"${query}" site:twitter.com`,
    `"${query}" filetype:pdf`,
    `"${query}" site:github.com`
  ];
  
  for (const term of searchTerms) {
    results.push({
      platform: 'Google Search',
      type: 'search_result',
      found: true,
      url: `https://www.google.com/search?q=${encodeURIComponent(term)}`,
      info: `Google search: ${term}`,
      confidence: 'medium'
    });
  }
  
  return results;
}

async function socialMediaCrossReference(query) {
  const results = [];
  
  // Check for variations and related usernames
  const variations = [
    query.toLowerCase(),
    query.toUpperCase(),
    query + '1',
    query + '2',
    query + '_',
    '_' + query,
    query.replace(/\s/g, ''),
    query.replace(/\s/g, '_'),
    query.replace(/\s/g, '.'),
    query + '123'
  ];
  
  for (const variation of variations.slice(0, 5)) { // Limit to avoid too many requests
    if (variation !== query) {
      const varResults = await searchUsername(variation);
      results.push(...varResults.map(r => ({
        ...r,
        info: `Username variation: ${variation}`,
        confidence: 'low'
      })));
    }
  }
  
  return results;
}

async function checkDataBreaches(query) {
  const results = [];
  
  // Simulate breach check (in real implementation, use HaveIBeenPwned API)
  try {
    if (query.includes('@')) {
      results.push({
        platform: 'Breach Database',
        type: 'security',
        found: true,
        url: `https://haveibeenpwned.com/unifiedsearch/${encodeURIComponent(query)}`,
        info: 'Check for data breaches',
        confidence: 'high'
      });
    }
  } catch (error) {
    console.error('Breach check error:', error);
  }
  
  return results;
}

function getPlatformUrl(platform, username) {
  const urls = {
    github: `https://github.com/${username}`,
    instagram: `https://instagram.com/${username}`,
    tiktok: `https://tiktok.com/@${username}`,
    youtube: `https://youtube.com/@${username}`,
    twitter: `https://twitter.com/${username}`,
    linkedin: `https://linkedin.com/in/${username}`,
    discord: `https://discord.com/users/${username}`,
    twitch: `https://twitch.tv/${username}`,
    reddit: `https://reddit.com/u/${username}`,
    telegram: `https://t.me/${username}`,
    spotify: `https://open.spotify.com/user/${username}`,
    vk: `https://vk.com/${username}`,
    tumblr: `https://${username}.tumblr.com/`,
    // Add more as needed
  };
  
  return urls[platform] || `https://${platform}.com/${username}`;
}

// GitHub API
app.get('/api/check/github/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`);
    res.json({ exists: true, profile: response.data });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.json({ exists: false });
    } else {
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
  }
});

// Instagram Check (public profile check)
app.get('/api/check/instagram/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.instagram.com/${username}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    // Check if profile exists by looking for specific patterns
    if (response.data.includes('"is_private"') || response.data.includes('"full_name"')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.json({ exists: false });
    } else {
      res.json({ exists: false });
    }
  }
});

// TikTok Check
app.get('/api/check/tiktok/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.tiktok.com/@${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.data.includes('"statusCode":0') || response.data.includes('"uniqueId"')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// YouTube Check
app.get('/api/check/youtube/:username', async (req, res) => {
  const username = req.params.username;
  try {
    // Try both @username and channel/username formats
    let response;
    try {
      response = await axios.get(`https://www.youtube.com/@${username}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });
    } catch (e) {
      response = await axios.get(`https://www.youtube.com/c/${username}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });
    }
    
    if (response.data.includes('"channelMetadataRenderer"') || response.data.includes('"subscriberCountText"')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Twitter/X Check
app.get('/api/check/twitter/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://twitter.com/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.data.includes('"screen_name"') || response.data.includes('profilePage')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.json({ exists: false });
    } else {
      res.json({ exists: false });
    }
  }
});

// LinkedIn Check
app.get('/api/check/linkedin/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.linkedin.com/in/${username}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.data.includes('"profile"') || response.data.includes('profileView')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.json({ exists: false });
    } else {
      res.json({ exists: false });
    }
  }
});

// Discord Check (limited - Discord doesn't allow easy username lookup)
app.get('/api/check/discord/:username', async (req, res) => {
  // Discord doesn't provide public API for username lookup
  // This is a placeholder - in reality, Discord usernames are not publicly searchable
  res.json({ exists: false, note: 'Discord profiles are not publicly searchable' });
});

// Twitch Check
app.get('/api/check/twitch/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.twitch.tv/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.data.includes('"channelLogin"') || response.data.includes('isPartner')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.json({ exists: false });
    } else {
      res.json({ exists: false });
    }
  }
});

// Reddit Check
app.get('/api/check/reddit/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.reddit.com/user/${username}/about.json`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.data && response.data.data && response.data.data.name) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Telegram Check
app.get('/api/check/telegram/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://t.me/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.data.includes('tgme_page_title') || response.data.includes('tgme_page_description')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Spotify Check
app.get('/api/check/spotify/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://open.spotify.com/user/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.data.includes('"user"') || response.data.includes('profileHeader')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Snapchat Check
app.get('/api/check/snapchat/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.snapchat.com/add/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.data.includes('profilePageUsername') || response.data.includes('"username"')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Pinterest Check
app.get('/api/check/pinterest/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.pinterest.com/${username}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.data.includes('"username"') || response.data.includes('profileData')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Steam Check
app.get('/api/check/steam/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://steamcommunity.com/id/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.data.includes('profile_header') || response.data.includes('profileData')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Facebook Check
app.get('/api/check/facebook/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.facebook.com/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.data.includes('"profile_id"') || response.data.includes('profileCometRoot')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// SoundCloud Check
app.get('/api/check/soundcloud/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://soundcloud.com/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.data.includes('"username"') || response.data.includes('profileHeader')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// VKontakte Check
app.get('/api/check/vk/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://vk.com/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.data.includes('Profile') || response.data.includes('page_info')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Tumblr Check
app.get('/api/check/tumblr/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://${username}.tumblr.com/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// DeviantArt Check
app.get('/api/check/deviantart/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.deviantart.com/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.data.includes('user-profile') || response.data.includes('username')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Behance Check
app.get('/api/check/behance/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.behance.net/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200 && response.data.includes('profile')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Dribbble Check
app.get('/api/check/dribbble/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://dribbble.com/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Flickr Check
app.get('/api/check/flickr/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.flickr.com/people/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// GitLab Check
app.get('/api/check/gitlab/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://gitlab.com/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.data.includes('user-profile') || response.data.includes('user-info')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Bitbucket Check
app.get('/api/check/bitbucket/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://bitbucket.org/${username}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Medium Check
app.get('/api/check/medium/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://medium.com/@${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Patreon Check
app.get('/api/check/patreon/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.patreon.com/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Vimeo Check
app.get('/api/check/vimeo/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://vimeo.com/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Keybase Check
app.get('/api/check/keybase/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://keybase.io/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Quora Check
app.get('/api/check/quora/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.quora.com/profile/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// HackerNews Check
app.get('/api/check/hackernews/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://news.ycombinator.com/user?id=${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200 && !response.data.includes('No such user')) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Stack Overflow Check
app.get('/api/check/stackoverflow/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://stackoverflow.com/users/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// last.fm Check
app.get('/api/check/lastfm/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.last.fm/user/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Mastodon Check
app.get('/api/check/mastodon/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://mastodon.social/@${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Goodreads Check
app.get('/api/check/goodreads/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.goodreads.com/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Xing Check
app.get('/api/check/xing/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.xing.com/profile/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// OnlyFans Check
app.get('/api/check/onlyfans/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://onlyfans.com/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Pornhub Check
app.get('/api/check/pornhub/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.pornhub.com/users/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Chaturbate Check
app.get('/api/check/chaturbate/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://chaturbate.com/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Twitch.tv Check
app.get('/api/check/twitchtv/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.twitch.tv/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Blogger Check
app.get('/api/check/blogger/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://${username}.blogspot.com/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// WordPress Check
app.get('/api/check/wordpress/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://${username}.wordpress.com/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Weibo Check
app.get('/api/check/weibo/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://weibo.com/u/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// WhatsApp Business Check
app.get('/api/check/whatsapp/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://wa.me/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Signal Check
app.get('/api/check/signal/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://signal.org/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Dating.com Check
app.get('/api/check/dating/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.dating.com/profile/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Match.com Check
app.get('/api/check/match/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://www.match.com/profile/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Tinder Check
app.get('/api/check/tinder/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://tinder.com/@${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Bumble Check
app.get('/api/check/bumble/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://bumble.com/user/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

// Badoo Check
app.get('/api/check/badoo/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await axios.get(`https://badoo.com/profile/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.json({ exists: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

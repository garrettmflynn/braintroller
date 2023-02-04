export function getOS() {
    var userAgent = window.navigator.userAgent,
        platform = (window.navigator as any)?.userAgentData?.platform || window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', "darwin", "macOS"],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = platform;
  
    if (macosPlatforms.indexOf(platform) !== -1) return 'mac';
    else if (iosPlatforms.indexOf(platform) !== -1) return 'ios';
    else if (windowsPlatforms.indexOf(platform) !== -1) return 'windows';
    else if (/Android/.test(userAgent)) return 'android';
    else if (/Linux/.test(platform))  return 'linux';
  
    return os;
  }
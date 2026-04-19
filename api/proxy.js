const https = require('https');
const http = require('http');
const url = require('url');

module.exports = async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const parsed = url.parse(targetUrl);
    const protocol = parsed.protocol === 'https:' ? https : http;
    const baseUrl = `${parsed.protocol}//${parsed.host}`;

    protocol.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    }, (proxyRes) => {
      // Remove headers that block embedding
      res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'text/html');
      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');

      let body = '';
      proxyRes.on('data', chunk => body += chunk);
      proxyRes.on('end', () => {
        // Rewrite all relative URLs to absolute so assets load
        body = body
          .replace(/(href|src|action)="\/(?!\/)/g, `$1="${baseUrl}/`)
          .replace(/(href|src|action)='\/(?!\/)/g, `$1='${baseUrl}/`)
          // Fix relative CSS/JS imports
          .replace(/url\(\/(?!\/)/g, `url(${baseUrl}/`);

        res.status(200).send(body);
      });
    }).on('error', (err) => {
      res.status(500).send(`Proxy error: ${err.message}`);
    });

  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
};

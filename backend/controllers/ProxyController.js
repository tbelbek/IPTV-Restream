const request = require('request');
const url = require('url');
const path = require('path');
const ChannelService = require('../services/ChannelService');

function getBaseUrl(fullUrl) {
    const parsedUrl = url.parse(fullUrl);
    return `${parsedUrl.protocol}//${parsedUrl.host}${path.dirname(parsedUrl.pathname)}/`;
}

function getRequestOptions(targetUrl, base64Headers) {
    let requestOptions = { url: targetUrl };
    if (base64Headers) {
        try {
            const parsedHeaders = JSON.parse(Buffer.from(base64Headers, 'base64').toString('ascii'));
            requestOptions.headers = parsedHeaders.reduce((acc, header) => {
                acc[header.key] = header.value;
                return acc;
            }, {});
        } catch (e) {
            console.error('Failed to parse headers:', e);
        }
    }
    return requestOptions;
}

function rewriteUrls(body, proxyBaseUrl, headers, originalUrl) {
    let isMaster = true;
    const baseUrl = originalUrl ? getBaseUrl(originalUrl) : '';

    if(body.indexOf('#EXT-X-STREAM-INF') !== -1) {
        isMaster = false;
    }

    let lines = body.split('\n');
    return lines.map(line => {
        line = line.trim();

        if (line.startsWith('#')) {
            // Replace #EXT-X-KEY URI
            return line.replace(
                /URI="([^"]+)"/,
                (_, originalKeyUrl) => {
                    // If the key URL is relative, make it absolute
                    const absoluteKeyUrl = originalKeyUrl.startsWith('http') ? 
                        originalKeyUrl : 
                        url.resolve(baseUrl, originalKeyUrl);
                    return `URI="${proxyBaseUrl}key?url=${encodeURIComponent(absoluteKeyUrl)}${headers ? `&headers=${headers}` : ''}"`;
                }
            );
        } else if (line.length > 0) {
            // Handle segment URLs
            if (line.startsWith('http')) {
                // Absolute URL case
                if(line.indexOf(`${proxyBaseUrl}key`) !== -1) {
                    return line;
                }
                
                if(line.indexOf('.m3u8') !== -1) {
                    isMaster = false;
                }

                return `${proxyBaseUrl}${isMaster ? 'segment' : 'channel'}?url=${encodeURIComponent(line)}${headers ? `&headers=${headers}` : ''}`;
            } else {
                // Relative URL case - combine with base URL
                const absoluteUrl = url.resolve(baseUrl, line);
                return `${proxyBaseUrl}${isMaster ? 'segment' : 'channel'}?url=${encodeURIComponent(absoluteUrl)}${headers ? `&headers=${headers}` : ''}`;
            }
        }
        return line; // Return empty lines unchanged
    });
}

module.exports = {
    channel(req, res) {
        let { url: targetUrl, channelId, headers } = req.query;

        if(!targetUrl) {
            const channel = channelId ? 
                ChannelService.getChannelById(parseInt(channelId)) : 
                ChannelService.getCurrentChannel();

            if (!channel) {
                res.status(404).json({ error: 'Channel not found' });
                return;
            }
            targetUrl = channel.url;
            if(channel.headers && channel.headers.length > 0) {
                headers = Buffer.from(JSON.stringify(channel.headers)).toString('base64');
            }
        }

        
        request(getRequestOptions(targetUrl, headers), (error, response, body) => {
            if (error) {
                res.status(500).json({ error: 'Failed to fetch m3u8 file' });
                return;
            }

            const proxyBaseUrl = `${req.protocol}://${req.get('host')}/proxy/`;
            const rewrittenBody = rewriteUrls(body, proxyBaseUrl, headers, targetUrl).join('\n');

            //res.set('Content-Type', 'application/vnd.apple.mpegurl');
            res.send(rewrittenBody);
        });
    },

    segment(req, res) {
        let { url: targetUrl, headers } = req.query;

        if (!targetUrl) {
            res.status(400).json({ error: 'Missing url query parameter' });
            return;
        }

        console.log('Proxy request to:', targetUrl);

        req.pipe(request(getRequestOptions(targetUrl, headers))).pipe(res);
    },

    key(req, res) {
        module.exports.segment(req, res);
    }
};
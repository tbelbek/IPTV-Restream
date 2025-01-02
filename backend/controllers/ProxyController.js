const request = require('request');
const ChannelService = require('../services/ChannelService');
const ProxyHelperService = require('../services/proxy/ProxyHelperService');

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

        console.log('Proxy playlist request to:', targetUrl);
        
        request(ProxyHelperService.getRequestOptions(targetUrl, headers), (error, response, body) => {
            if (error) {
                res.status(500).json({ error: 'Failed to fetch m3u8 file' });
                return;
            }

            const proxyBaseUrl = '/proxy/';
            const rewrittenBody = ProxyHelperService.rewriteUrls(body, proxyBaseUrl, headers, targetUrl).join('\n');

            //res.set('Content-Type', 'application/vnd.apple.mpegurl');
            res.send(rewrittenBody);
        }).on('error', (err) => {
            console.error('Unhandled error:', err);
            res.status(500).send('Proxy request failed');
        });
    },

    segment(req, res) {
        let { url: targetUrl, headers } = req.query;

        if (!targetUrl) {
            res.status(400).json({ error: 'Missing url query parameter' });
            return;
        }

        console.log('Proxy request to:', targetUrl);

        req.pipe(
            request(ProxyHelperService.getRequestOptions(targetUrl, headers))
                .on('error', (err) => {
                    console.error('Unhandled error:', err);
                    res.status(500).send('Proxy request failed');
                })
        ).pipe(res);
    },

    key(req, res) {
        module.exports.segment(req, res);
    }
};
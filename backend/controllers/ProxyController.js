const request = require('request');

const ChannelService = require('../services/ChannelService');

module.exports = {
    channel(req, res) {
        const { url } = req.query;

        //REMOVE, use url instead
        const { channelId } = req.query;

        console.log('ChannelId: ', channelId);

        var targetUrl = null;
        
        if(!url) {
            const channel = ChannelService.getChannelById(parseInt(channelId));
            if (!channel) {
                res.status(404).json({ error: 'Channel not found' });
                return;
            }
            targetUrl = channel.url;
        } else {
            targetUrl = url;
        }
        

        console.log('Fetching m3u8 file from: ', targetUrl);

        request(targetUrl, (error, response, body) => {
            if (error) {
                res.status(500).json({ error: 'Failed to fetch m3u8 file' });
                return;
            }

            var isMaster = true;

            if(body.indexOf('#EXT-X-STREAM-INF') != -1) {
                isMaster = false;
            }

            const proxyBaseUrl = `${req.protocol}://${req.get('host')}/proxy/`;

            var rewrittenBody = body.replace(
                /URI="([^"]+)"/,
                (_, originalUrl) => `URI="${proxyBaseUrl}key?url=${encodeURIComponent(originalUrl)}"`
            );

            rewrittenBody = rewrittenBody.replace(/(https?:\/\/[^\s]+)/g, (match) => {

                //if match includes key endpoint then skip
                if(match.indexOf(`${proxyBaseUrl}key`) != -1) {
                    return match;
                }
                
                if(match.indexOf('.m3u8') != -1) {
                    isMaster = false;
                }
                //if its master (playlist with segment list) then load segments
                return `${proxyBaseUrl}${isMaster ? 'segment' : 'channel'}?url=${encodeURIComponent(match)}`;
            });

            //res.set('Content-Type', 'application/vnd.apple.mpegurl');
            res.send(rewrittenBody);
        });
        
    },


    segment(req, res) {

        const targetUrl = req.query.url;
        console.log('Proxy request to: ', targetUrl);

        if (!targetUrl) {
            res.status(400).json({ error: 'Missing url query parameter' });
            return;
        }

        const { channelId, key } = req.query;
        
        const channel = ChannelService.getChannelById(5);
        if (!channel) {
            res.status(404).json({ error: 'Channel not found' });
            return;
        }

        const { headers } = channel;
        const options = {
            targetUrl,
            headers: headers.reduce((acc, header) => {
                acc[header.key] = header.value;
                return acc;
            }, {}),
        };

        req.pipe(request(targetUrl, options)).pipe(res);
    },

    key(req, res) {
        const targetUrl = req.query.url;
        console.log('Proxy request to: ', targetUrl);

        if (!targetUrl) {
            res.status(400).json({ error: 'Missing url query parameter' });
            return;
        }

        const { channelId, key } = req.query;
        
        const channel = ChannelService.getChannelById(5);
        if (!channel) {
            res.status(404).json({ error: 'Channel not found' });
            return;
        }

        const { headers } = channel;
        const options = {
            targetUrl,
            headers: headers.reduce((acc, header) => {
                acc[header.key] = header.value;
                return acc;
            }, {}),
        };

        //TODO: set Content-Type header
        req.pipe(request(targetUrl, options)).pipe(res);
    }
};
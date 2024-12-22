const request = require('request');

const ChannelService = require('../services/ChannelService');

module.exports = {
    channel(req, res) {
        let { url, channelId, headers } = req.query;

        let targetUrl = null;  
        if(url) {
            targetUrl = url;
        } else {
            //Use current channel
            const channel = channelId ? ChannelService.getChannelById(parseInt(channelId)) : ChannelService.getCurrentChannel();
            if (!channel) {
                res.status(404).json({ error: 'Channel not found' });
                return;
            }
            targetUrl = channel.url;
            headers = Buffer.from(JSON.stringify(channel.headers)).toString('base64');  
        }
        
        request(targetUrl, (error, response, body) => {
            if (error) {
                res.status(500).json({ error: 'Failed to fetch m3u8 file' });
                return;
            }

            //Master => Playlist with segment list
            let isMaster = true;

            if(body.indexOf('#EXT-X-STREAM-INF') != -1) {
                isMaster = false;
            }

            const proxyBaseUrl = `${req.protocol}://${req.get('host')}/proxy/`;

            //Replace EXT-X-KEY URI
            let rewrittenBody = body.replace(
                /URI="([^"]+)"/,
                (_, originalUrl) => `URI="${proxyBaseUrl}key?url=${encodeURIComponent(originalUrl)}${headers ? `&headers=${headers}` : ''}"`
            );

            rewrittenBody = rewrittenBody.replace(/(https?:\/\/[^\s]+)/g, (match) => {

                //if match includes key endpoint then skip
                if(match.indexOf(`${proxyBaseUrl}key`) != -1) {
                    return match;
                }
                
                if(match.indexOf('.m3u8') != -1) {
                    isMaster = false;
                }
                //if its master (playlist with segment list) then load segments next
                return `${proxyBaseUrl}${isMaster ? 'segment' : 'channel'}?url=${encodeURIComponent(match)}${headers ? `&headers=${headers}` : ''}`;
            });

            //res.set('Content-Type', 'application/vnd.apple.mpegurl');
            res.send(rewrittenBody);
        });
        
    },


    segment(req, res) {
        let { url, headers }= req.query;

        if (!url) {
            res.status(400).json({ error: 'Missing url query parameter' });
            return;
        }

        console.log('Proxy request to: ', url);

        let options = undefined;
        if(headers) {
            headers = JSON.parse(Buffer.from(headers, 'base64').toString('ascii'));

            options = {
                targetUrl: url,
                headers: headers.reduce((acc, header) => {
                    acc[header.key] = header.value;
                    return acc;
                }, {}),
            };
        }

        req.pipe(request(url, options)).pipe(res);
    },

    key(req, res) {
        //Just use the segment endpoint for now
        module.exports.segment(req, res);
    }
};
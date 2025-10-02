const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { buyerName, productName, price } = JSON.parse(event.body);
        
        // Validate required fields
        if (!buyerName || !productName || !price) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Discord webhook URL (set this in Netlify environment variables)
        const webhookURL = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookURL) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Webhook URL not configured' })
            };
        }

        // Create Discord message
        const discordMessage = {
            content: `<@&1379850753987969066> 🛒 New Order!\nBuyer: ${buyerName}\nProduct: ${productName}\nPrice: $${price}`
        };

        // Send to Discord
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordMessage)
        });

        if (!response.ok) {
            throw new Error(`Discord API responded with ${response.status}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Order sent to Discord' })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
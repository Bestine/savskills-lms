const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

/**
 * Send verification email using AWS SES
 */
async function sendVerificationEmail(email, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

    const params = {
        Source: process.env.SES_FROM_EMAIL,
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Subject: {
                Data: 'Verify Your Savskill Account',
                Charset: 'UTF-8'
            },
            Body: {
                Html: {
                    Data: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: 'Arial', sans-serif; background: #f5f5f5; padding: 20px; }
                                .container { background: white; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 10px; }
                                .logo { text-align: center; font-size: 32px; font-weight: bold; color: #6366f1; margin-bottom: 30px; }
                                .content { color: #333; line-height: 1.6; }
                                .button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
                                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="logo">Savskill</div>
                                <div class="content">
                                    <h2>Welcome to Savskill!</h2>
                                    <p>Thank you for joining our leadership transformation platform. We're excited to support your journey to becoming a transformative leader.</p>
                                    <p>Please verify your email address by clicking the button below:</p>
                                    <p style="text-align: center;">
                                        <a href="${verificationUrl}" class="button">Verify Email Address</a>
                                    </p>
                                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                                    <p style="word-break: break-all; color: #6366f1;">${verificationUrl}</p>
                                    <p>If you didn't create this account, please ignore this email.</p>
                                </div>
                                <div class="footer">
                                    <p>© 2024 Savskill. Building the next transformative leader.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
                    Charset: 'UTF-8'
                },
                Text: {
                    Data: `Welcome to Savskill!\n\nPlease verify your email by visiting: ${verificationUrl}\n\nIf you didn't create this account, please ignore this email.`,
                    Charset: 'UTF-8'
                }
            }
        }
    };

    try {
        const result = await ses.sendEmail(params).promise();
        console.log('Verification email sent:', result.MessageId);
        return result;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}

module.exports = {
    sendVerificationEmail
};

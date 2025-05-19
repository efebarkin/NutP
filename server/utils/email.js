import nodemailer from 'nodemailer';
import 'dotenv/config';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASSWORD || '',
      },
    });
  }

  /**
   * Send verification code to user's email
   * @param {string} to - Recipient email
   * @param {string} code - 6-digit verification code
   * @returns {Promise} - Nodemailer send result
   */
  async sendVerificationCode(to, code) {
    const mailOptions = {
      from: '"NutP" <nutp@hmail.com>',
      to,
      subject: 'Email Doğrulama Kodu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #34D399;">NutP Email Doğrulama</h2>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin-bottom: 15px; font-size: 16px;">Merhaba,</p>
            <p style="margin-bottom: 20px; font-size: 16px;">NutP hesabınızı doğrulamak için aşağıdaki kodu kullanın:</p>
            <div style="background-color: #34D399; color: white; font-size: 24px; font-weight: bold; text-align: center; padding: 15px; border-radius: 5px; letter-spacing: 5px; margin-bottom: 20px;">
              ${code}
            </div>
            <p style="margin-bottom: 5px; font-size: 14px; color: #666;">Bu kod 10 dakika boyunca geçerlidir.</p>
            <p style="font-size: 14px; color: #666;">Eğer bu işlemi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.</p>
          </div>

          <div style="text-align: center; font-size: 12px; color: #999;">
            <p>© ${new Date().getFullYear()} NutP. Tüm hakları saklıdır.</p>
          </div>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  /**
   * Generate a random 6-digit verification code
   * @returns {string} - 6-digit code
   */
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

const emailService = new EmailService();
export default emailService;

const crypto = require('crypto');

module.exports = function validateTelegramInitData(req, res, next) {
  const initData = req.headers['x-telegram-init-data'];
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!initData) {
    req.telegramUser = null;
    return next();
  }

  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  const params = Array.from(urlParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const calculatedHash = crypto.createHmac('sha256', secretKey).update(params).digest('hex');

  if (calculatedHash === hash) {
    const userStr = urlParams.get('user');
    if (userStr) {
      req.telegramUser = JSON.parse(userStr);
    }
    return next();
  } else {
    return res.status(403).json({ status: false, message: 'Invalid Telegram WebApp initData hash' });
  }
};
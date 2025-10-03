from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes
import os

TOKEN = "8288840321:AAFhOT_8B3Uw9DEoUf3KXi7GCQ2qMxC6q0M"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    welcome_text = """🌳 *Welcome to DREVO!*

🚀 *The Future of Gaming & Cryptocurrency*

DREVO is an innovative project combining gaming with real economic value. Earn coins now and get ready for our blockchain launch!

📈 *Future Vision:*
• Blockchain integration
• Real monetary value
• Exchange listings
• Community-driven development

👥 *Join Our Community:*
📢 @drevocoin - Official Channel
💬 @drevocommunity - Discussion Group

🎮 *Start earning today!*"""

    keyboard = [
        [InlineKeyboardButton("🎮 Play DREVO Game", web_app={"url": "https://reynusha.github.io/drevo/"})],
        [
            InlineKeyboardButton("📢 Channel", url="https://t.me/drevocoin"),
            InlineKeyboardButton("💬 Community", url="https://t.me/drevocommunity")
        ]
    ]
    
    await update.message.reply_photo(
        photo="https://i.postimg.cc/Cx3NHDG6/Lumii-20251003-171556202.jpg",
        caption=welcome_text,
        parse_mode="Markdown",
        reply_markup=InlineKeyboardMarkup(keyboard)
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🆘 *DREVO Bot Help*\n\n"
        "*/start* - Launch the game\n"
        "*/help* - Show this message\n\n"
        "🎮 Play, earn, and get ready for blockchain!",
        parse_mode="Markdown"
    )

def main():
    app = Application.builder().token(TOKEN).build()
    
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    
    print("🤖 DREVO Bot is running...")
    app.run_polling()

if __name__ == "__main__":
    main()

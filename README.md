# Megekko Order Bot
A Telegram bot to check your NVIDIA order status at Megekko.

This bot is used for the dutch webshop [megekko.nl](https://megekko.nl) to check what my position in queue is.

## This project is discontinued
This project is discontinued because my card is being delivered tomorrow so I can't check my place in line anymore. This does not take away that several features are still missing:
* Store your place in line in a variable, and only send a message if your place in line has improved after the hourly check.
* Check if the function returned your place in line instead of an error. In the case of an error, run it again until you get a number.
* Send a quiet message the length of the line has changed, this is not as important as my actual place in line so I don't want to receive a notification.
* Show an inline button you can press to retrieve your place in line.
* Edit the wait time between each update.

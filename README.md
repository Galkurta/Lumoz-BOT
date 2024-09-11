# Lumoz Quidditch Bot

This project is a bot for automating interactions with the Lumoz Quidditch game. It manages user accounts, collects rewards, and handles various game-related tasks.

## Features

- Automatic user authentication
- New user gift collection
- USDT and Snitch reward collection
- Multi-account support
- Configurable logging

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v12.0.0 or higher)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/Galkurta/Lumoz-BOT.git
   ```

2. Navigate to the project directory:

   ```
   cd Lumoz-BOT
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Configuration

1. If you're a new user, register for [Lumoz Quidditch](https://t.me/Lumoz_Quidditch_Bot/Match?startapp=inviteUAXHC&text=%F0%9F%A7%99)

2. Edit `data.txt` file in the project root directory.

3. Add your account authorization tokens to `data.txt`, one per line. You can obtain these tokens after registering and logging into your account.

## Usage

To run the bot, use the following command:

```
node main.js
```

The bot will process each account in `data.txt` sequentially, collecting rewards and updating account information.

## Logging

The bot uses the `loglevel` library for logging. The default log level is set to "info". You can adjust the log level in the `setupLogging` method of the `Lumoz` class if needed.

## Error Handling

The bot is designed to handle various errors gracefully. Here are some common errors you might encounter and how to address them:

### 500 Internal Server Error

If you encounter a 500 Internal Server Error, it usually indicates a problem on the server side. Here's what you can do:

1. **Wait and retry**: The server might be temporarily overloaded. Wait for a few minutes and try running the bot again.

2. **Check your network connection**: Ensure you have a stable internet connection.

3. **Verify account credentials**: Double-check that the authorization tokens in `data.txt` are correct and up to date.

4. **Reduce request frequency**: If the error persists, try increasing the wait time between requests by modifying the `countdown` durations in the `main` method.

5. **Check for announcements**: Visit the official Lumoz website or community forums to see if there are any announced server issues or maintenance periods.

### Other Common Errors

- **401 Unauthorized**: This usually means your authorization token is invalid or expired. Update the token in `data.txt`.
- **429 Too Many Requests**: The bot is making requests too frequently. Increase the wait times between requests.
- **404 Not Found**: The API endpoint might have changed. Check for any updates to the Lumoz API and update the URLs in the bot accordingly.

If you encounter persistent errors that you can't resolve, please open an issue on the GitHub repository with details about the error and the steps to reproduce it.

## Contributing

Contributions to this project are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Disclaimer

This bot is for educational purposes only. Use it at your own risk. The developers are not responsible for any consequences resulting from the use of this bot.

## Contact

If you have any questions or feedback, please open an issue on the GitHub repository.

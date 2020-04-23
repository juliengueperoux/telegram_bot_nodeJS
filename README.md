# Telegram Bot to discover precise moment of a video

## Presentation

This server communicates with a telegram bot to make collaborate the user and a simple binary search algorithm in order to find a precise moment in a video.  
  
### 2 distinct parts:

**Lib folder** : containing all non-specific development
* Binary search algorithm
* Log file initialization
* Event bus initialization
    
**Bin folder** : Specific development:
* extern_api : wrapper of the video API
* telegram_bot : wrapper of the telegram bot
* test_context : main part, contain all the logic
 
In order to send messages to the telegram bot every time we want, an event bus does the link between the test context and the telegram bot. Each time the test context wants to send a message to the user, it emits a message on the event bus.

## What makes the code maintainable :

1. Strict separation between the modules
2. Pertinent project architecture :
	* Separation between specific and non-specific
	* Separation between interface specific and the rest
3. Log files that allow you to quickly find any problem
4. Some other prerequisite to write maintainable code :
   * Write comments on every possible difficult code understanding
   * Explicit names of methods, variables and classes
   * Think that you could have to read your code in a very long time

## Built With :

* node-telegram-bot-api
* js-event-bus
* Simple-node-logger

## Authors

Julien GUEPEROUX

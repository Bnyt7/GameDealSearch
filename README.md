# GameDealSearch

This is the final project for my WWW Technology course at TBU (Tomas Bata University) around 2023-2024. The purpose of this project was to learn how to make a website using Bootstrap, use an API and how to store persistent data. 

This web application uses [CheapShark's API](https://apidocs.cheapshark.com/). CheapShark is a price comparison website for digital PC Games, checking prices across multiple stores such as Steam, GreenManGaming, Fanatical, and many others. The API was free and easy to use, without any authorization or API key needed. The layout was also inspired by applications like SteamDB or IsThereAnyDeal.

The user can search a game, sort the list by **DealRating** (According to CS : Deal Rating is on a scale from 0 to 10.
It factors in price, percent off, metacritic score, release date, price history, and more.), **Title**, **Saving**, **Price**, **Reviews**, **Recent**.
They can also set the min/max price in dollars.

The website will then show a table of deals with the game's **title** (or the closest title), **Steam Rating**, **Deal Rating**, **a link to the store**, and a possibility to **add/remove** the deal to/from a "Wishlist"

![image of a table](/DealsTable.png)
The list of wishlisted games is stored inside localStorage in **JSON format**. A button can be toggled to show or hide the wishlisted games. 



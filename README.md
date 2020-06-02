# Liverpool

Liverpool is a card game which is very similar to Liverpool Rummy (https://en.wikipedia.org/wiki/Liverpool_rummy). So if you want to understand the basic rules, have a look on the wiki page first.

I made this game mainly to play online with my friends if it's not possible to meet in person.

But as I mentioned it is very similar but not equal to Liverpool Rummy. There are some differences, I will try to list them here:

* There are 8 rounds, not 7
* No Jokers are included, so you don't have wild cards
* The score of the cards also differs: Ace is 1 Point, 2 through 10 are the corresponding score 2 through 10. J, Q and K are 11, 12 and 13 points. 
* If a player going out as the only player in a round he will get -50 points
* the so called "turning the corner" for a run is allowed completely. So K A 2 3 is allowed.

The requirements for each round of play are as follows:

* First - 2 sets
* Second - 1 set & 1 run
* Third - 2 runs
* Fourth - 3 sets
* Fifth - 2 sets & 1 run
* Sixth - 1 set & 2 runs
* Seventh - 3 runs
* Eighth - 3 sets & 1 run with no remaining cards in hand, no final discard

## How to start a game
The players meet in the lobby and can set their user name. After that a user can create a game by setting a game name. All the other players can join the game. There is a minimum of 3 players and a maximum of 4 players to start a game.

## Technical stuff
The project is written in ASP.NET Core using .NET Core 3.1 with a React.JS UI. The design is made in bootstrap. The complete communication between UI and backend is done via WebSockets using the SignalR library. No effort was made to make the backend secure in any way.

The basic game logic is checked from the backend completely, so it will deny a turn if it's not correct.

The backend itself can handle multiple games simultaneously.

At the moment the UI is only in German, but will be changed in the near future.

If you find an issue feel free to open a bug here on GitHub. 

## Hints
Some adblocker blocks the ace of diamonds because the image name is AD.png. Make sure to add the game URL to the white list of your adblocker.

## License
The game itself and all code is done by me (excluding the initial design part in bootstrap which was done by a friend). 

Everything in this repository is licensed under MIT license EXCEPT the images of the playing cards which are licensed under LGPL 3.0. The card images were generated from the vector graphics of:

> Vector Playing Card Library 
> VERSION 3.1 - RELEASED 6/9/2019
>
> Licensed under https://www.gnu.org/licenses/lgpl-3.0.html
>
> Chris Aguilar 
> conjurenation@gmail.com         
> https://totalnonsense.com/open-source-vector-playing-cards/
>
> Alternate Joker by John Merrill
> john@delirus.net
> Colored version of alternate Joker by Chris Aguilar
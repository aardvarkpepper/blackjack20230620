2023 June 20 Blackjack

playerTurns and playerPrompt use involved async / await.

Current Issues:

Learn to use development branch.

Implement max decks (eight?)

Cycle players to dilute dealer advantage, clockwise, counterclockwise, random

Add max players based on number of cards in deck, that also accounts for "blank card" below.

e.g. a single 52 card deck does not support 30 players.

But also, if a "blank card" i.e. cut card is placed about 25% up.  Cut card is not dealt to player of course, but remainder of round is dealt out.

Add "blank card" that is never dealt that is placed near bottom to indicate when to reshuffle.

If players tied, it's a "push" if they're only players.  If some players tied for top, they "win" others "lose", how to handle bets?

On player turn, entering 0 to exit just exits readline.  The promise is never fulfilled, but maybe that's not an issue?

Transitioning between turns is abrupt, perhaps insert "press enter to continue".

If blank card not implemented, have to re-initialize deck every round, or otherwise do something to fix when cards run out of deck.

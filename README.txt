SINTRLAB QUEST update for sintrlab.ca (the Manufacturing Simulator is now called Sintrlab Quest)

TOP-LEVEL files (next to the home page; replace what is there):
  index.html         the home page: the only change is the nav label, "Manufacturing Simulator" -> "Sintrlab Quest"
  simulators.html    the game (Sintrlab Quest: The Ornament Run)
  site-nav.js        the shared menu: the dropdown is now labelled "Sintrlab Quest"; also lets each simulator run inside the game
  simulators.json    the menu list; its first entry is "The Ornament Run" (the game), then the nine simulators

simulators/ folder (all ten pages are included):
  The pages themselves are unchanged apart from wording: the browser-tab title, the small breadcrumb above each heading and the
  feedback email subject now say "Sintrlab Quest" instead of "Manufacturing Simulator". Uploading them is recommended, but the
  menu and the game work without it.

Privacy: no accounts, no names, no server. Each browser gets a random player number; progress stays in that browser; a passport
file or a save code moves it or hands it in. Neither is tamper-proof.

Testing: add ?debug=1 to the game's address for a small console helper. Leave it out for students.

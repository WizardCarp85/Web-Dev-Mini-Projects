# Pokémon Evolution Chain Finder

A small web app that finds and visualizes a Pokémon's evolution chain using the public PokeAPI (https://pokeapi.co). Enter a Pokémon name or ID and the app fetches species data, follows the evolution_chain URL, and displays the full evolution tree.

## Features
- Lookup by Pokémon name or ID
- Displays evolution stages in order (including branched evolutions)
- Shows sprites and basic info for each stage
- Graceful error handling for unknown names/IDs

## How it works (technical)
1. Query PokeAPI /pokemon-species/{id or name} to get species info.
2. Read the species' `evolution_chain.url` field.
3. Fetch the evolution chain resource and traverse the nested chain structure to build a linear/branched evolution representation.
4. For each Pokémon in the chain, fetch `/pokemon/{name}` for sprite and stats as needed.

## Installation
- Clone the repository:
  git clone <repo-url> 
- Change to the project folder:
  cd Pokedex
- Install dependencies (if using npm/yarn):
  npm install
  or
  yarn

## Run locally
- Start dev server (example):
  npm start
  or
  yarn start
- Open http://localhost:3000 (or the port shown by your dev server)

## Usage
- Type a Pokémon name (e.g., "eevee", "charmander") or numeric ID into the search input.
- Submit to fetch and render the evolution chain.
- Click a sprite to view more details if the UI supports it.

## Example responses
- eevee → multiple branched evolutions (Vaporeon, Jolteon, etc.)
- bulbasaur → bulbasaur → ivysaur → venusaur

## Notes & Tips
- PokeAPI has rate limits; cache results when possible.
- Names are case-insensitive but prefer lowercase for consistency.
- For advanced uses, store fetched evolution data to avoid repeated API calls.

## Contributing
- Contributions welcome (bug fixes, UI improvements, caching).
- Open a PR and describe your change; include screenshots for UI tweaks.

## License
- MIT (or your preferred license)


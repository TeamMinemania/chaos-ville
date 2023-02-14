const createGame = `
    mutation createGame($createGameInput: GameCreateInput!) {
  createGame(input: $createGameInput) {
    _id
    scenes
  }
}

`;
export { createGame };
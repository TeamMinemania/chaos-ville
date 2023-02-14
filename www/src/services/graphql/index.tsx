const createGame = `
    mutation createGame($createGameInput: GameCreateInput!) {
  createGame(input: $createGameInput) {
    _id
  }
}

`;
export { createGame };
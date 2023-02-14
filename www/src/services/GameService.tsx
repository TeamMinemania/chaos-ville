import { gql } from "@apollo/client";
import client from "./Apollo";

import { createGame } from "./graphql";

// eslint-disable-next-line import/prefer-default-export
export class GameService {
    public static createGame(query: any) {
        return client
            .query({
                query: gql(createGame),
                variables: {
                    input: query,
                },
            })
            .then((response) => {
                return response?.data?.createGame;
            });
    }
}
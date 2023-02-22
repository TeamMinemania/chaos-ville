import config from "config";
import {connect, set} from "mongoose";
import {buildSchema, emitSchemaDefinitionFile} from "type-graphql";
import {UserResolver} from "./user/User.resolver";
import {GameResolver} from "./game/Game.resolver";
import {Container} from "typedi";
import path from "path";

export const getApolloConfig = async () => {
    const debug = process.env.NODE_ENV === 'dev' ? true : false;
    const url = config.get<string>('db.host');
    set("strictQuery", false);
    await connect(
        url,
        {}
    );
    console.log('connected!');
    const schema = await buildSchema({
        resolvers: [UserResolver, GameResolver],
        container: Container,
        emitSchemaFile: debug ? path.resolve(__dirname, "schema.gql") : false, // debug
        validate: {
            forbidUnknownValues: false
        }
    });
    if (debug) {
        await emitSchemaDefinitionFile('/home/user1a/WebstormProjects/gardenplanner-lambda/schema.gql', schema);
    }
    const apolloConfig = {
        schema,
        introspection: true,
        playground: {
            endpoint: '/dev/graphql',
        },
        debug: debug,
        // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    }
    return apolloConfig;
}
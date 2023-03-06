import {Container} from "typedi";
import {GameService} from "./Game.service";
import {Game, GameCreateInput, GameUpdateInput} from "./Game";
import {Field} from "type-graphql/dist/decorators/Field";

describe('GameService', () => {
    let service: GameService;
    beforeEach(() => {
        // service = Container.get('GameService');
    });
    it('should exist', () => {
        expect(service).toBeTruthy();
    });
    describe('GameService.list', () => {


        it('should list users', async () => {
            const entity = new GameUpdateInput();
            const metadataKey = 'typegoose:properties'; // Symbol("Field");
            const metaDataResults  = Reflect.getMetadata(metadataKey, GameUpdateInput);

            metaDataResults.forEach((r) => {

            });
        });

    });
})
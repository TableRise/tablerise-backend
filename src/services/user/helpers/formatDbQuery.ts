/*
This helper is used to clean moongose documents extra_propetiers when using object destructing { ...MoogooseQueryReturnedObject }( for example, propertie ._doc)
               MoogooseQueryReturnedObjectComesWith =  
                {
                    '$__': InternalCache {
                        activePaths: StateMachine { paths: [Object], states: [Object] },
                        skipId: true
                        },
                    '$isNew': false,
                    _doc: { },
                    ...
                }
*/

export function formatDbQuery ( queryObj: any | null ) : any {
    return JSON.parse(JSON.stringify(queryObj));
}

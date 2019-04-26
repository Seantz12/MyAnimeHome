let setContext = (conv, name, lifespan, params = undefined, saveContext = true) => {
    let session = conv.data.mySession;
    if(saveContext) {
        session.lastContext = {name, lifespan, params};
    }
    conv.contexts.set(name, lifespan, params);
}

module.exports.setContext = setContext;
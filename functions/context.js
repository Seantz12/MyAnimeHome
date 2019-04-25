let setContext = (conv, name, lifespan, saveContext = true) => {
    let session = conv.data.mySession;
    if(saveContext) {
        session.lastContext = {name, lifespan};
    }
    conv.contexts.set(name, lifespan);
}

module.exports.setContext = setContext;
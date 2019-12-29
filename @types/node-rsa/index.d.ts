declare module 'node-rsa' { 
    interface NodeRsa {
        decrypt(message: string, encoding?: string): Buffer;
        encrypt(message: string, encoding?: string): Buffer;
    }

    interface NodeRsaConstructor {
        new (privateKey: object): NodeRsa;
    }




    let ong: NodeRsaConstructor;
    export = ong;
}

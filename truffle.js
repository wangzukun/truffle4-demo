module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    //配置rpc目录路径，端口参考客户端
    networks: {
        development: {
            host: "localhost",
            port: 7545,
            network_id: "*"
        }
    }

};

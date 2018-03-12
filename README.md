# 以太坊(Ethereum)智能合约NodeJS / Web3调用教程
参考链接：http://truffle.tryblockchain.org/ (原文较老，在基础上做了更新)

##  1、环境配置：
本地运行环境：`Node.js`、`Npm`、`Truffle`、`Solidity`，版本如下：

```
localhost:~ wangzukun$ node -v
v8.9.4
localhost:~ wangzukun$ npm -v
5.6.0
localhost:~ wangzukun$ truffle version
Truffle v4.1.3 (core: 4.1.3)
Solidity v0.4.19 (solc-js)
```
> 第一步：安装`Solidity`

```
localhost:~ wangzukun$ npm install -g solc --save
```
> 第二步：安装`Solidity`的开发框架`Truffle4`

```
localhost:~ wangzukun$ npm install -g truffle --save
```

> 第三步：安装开发客户端，在本地模拟以太坊运行环境

- 适用开发的客户端：

    [EtherumJS TestRPC](https://github.com/trufflesuite/ganache-cli)

    当开发基于`Truffle4`的应用时，我们推荐使用`EthereumJS TestRPC`。它是一个完整的在内存中的区块链，仅仅存在于你开发的设备上。它在执行交易时是实时返回，而不等待默认的出块时间，这样你可以快速验证你新写的代码，当出现错误时，也能即时反馈给你。它同时还是一个支持自动化测试的功能强大的客户端。`Truffle4`充分利用它的特性，能将测试运行时间提速近90%。

    `EtherumJS TestRPC`安装好的截图如下，红框内的为`RPC Server`地址：http://127.0.0.1 ，在后续配置中将会用到。

    ![TestRPC](https://github.com/wangzukun/truffle4-demo/blob/master/screenshot/3-rpc.jpeg)


- 适用正式发布的客户端

    [Geth (go-ethereum)](https://github.com/ethereum/go-ethereum)

    [WebThree(cpp-ethereum)](https://github.com/ethereum/webthree-umbrella)

    [More](https://www.ethereum.org/cli)

    对此有许多官方和非官方的以太坊客户端可供选择。最好使用`EtherumJS TestRPC`客户端充分测试后，再使用这些客户端。这些是完整的客户端实现，包括挖矿，网络，块及交易的处理，`Truffle4`可以在不需要额外配置的情况下发布到这些客户端。

## 2、项目初始化

在你想放工程的任何位置，创建一个文件夹`truffle4-demo`，来做为你的工程根目录。进入目录，通过`truffle init`命令初始化项目。

```
localhost:~ wangzukun$ mkdir -p /Users/wangzukun/Documents/workSpace/git/truffle4-demo
localhost:~ wangzukun$ cd /Users/wangzukun/Documents/workSpace/git/truffle4-demo
localhost:truffle4-demo wangzukun$ truffle init
```

正确执行后，我们将得到下面这样的目录结构：

![目录结构](https://github.com/wangzukun/truffle4-demo/blob/master/screenshot/1-project-dic.jpeg)

目录结构简单说明如下：

- contracts/ - Truffle默认的合约文件存放地址。
- migrations/ - 存放发布脚本文件
- test/ - 用来测试应用和合约的测试文件
- truffle.js、truffle-config.js - Truffle的配置文件


## 3、新建一个合约
在`./contracts`目录下创建一个自己的合约文件`Test.sol`。调用该合约`sayHi`方法时，输出`Hi Wangzukun！`

```solidity
pragma solidity ^0.4.17;

contract Test{
    function sayHi() returns (string){
        return "Hi Wangzukun!";
    }
}
```

修改`./migrations/1_initial_migration.js`代码，完整代码如下：

```solidity
var Migrations = artifacts.require("./Migrations.sol");
//引入自定义合约
var Test = artifacts.require("./Test.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  //部署引入的自定义合约
  deployer.deploy(Test);
};
```

接着修改`truffle.js`配置，注意端口号为`7545`，同上述开发客户端的端口号。

```
networks: {
    development: {
        host: "localhost",
        port: 7545,
        network_id: "*"
    }
}
```

## 4、编译、运行合约

> 进入到工程目录`./truffle4-demo`，通过`truffle compile`命令编译合约：

```
localhost:truffle4-demo wangzukun$ truffle compile
```

此时会在`./build`目录下生成编译后的文件，格式为：`*.json`。

> 部署合约到本地开发客户端上：

```
localhost:truffle4-demo wangzukun$ truffle migrate
```

> 如果已部署过合约，可使用使用`truffle migrate --reset`来强制重编译并发布所有合约，由于合约移植是懒编译的，如果发现已经发布过，且发布的版本号没有变化就不会再发布，所以使用`--reset`。请务必弄清楚为何使用`--reset`再使用这个命令。

```
localhost:truffle4-demo wangzukun$ truffle migrate --reset
```

> 控制台调用合约：

```
localhost:truffle4-demo wangzukun$ truffle console
truffle(development)> Test.deployed().then(function(instance){return instance.sayHi.call();});
'Hi wangzukun!'
```

## 5、`NodeJS`集成`Truffle4`

> 如果想要在`NodeJS`环境使用`Truffle4`合约，就要手动集成这`Web3`、`truffle-contract`两个模块。在集成前，我们需要创建工程的npm包管理环境，首先进入`truffle4-demo`工程目录，使用`npm init`来初始化工程的`npm`包管理环境：

```
localhost:truffle4-demo wangzukun$ npm init
```

成功初始化后，在项目根目录下会生成`package.json`目录，初始化过程如下：

![初始化](https://github.com/wangzukun/truffle4-demo/blob/master/screenshot/2-init.jpeg)

> 接着安装`truffle-contract`包(安`装truffle-contract`包时，会自动安装`Web3`，故无需再次安装web3包)：

```
localhost:truffle4-demo wangzukun$ npm install truffle-contract --save
```

> 编写`Node.js`调用合约代码，在项目根目录下创建`testWeb3.js`文件


```
//要在NodeJS中使用Truffle，我们要先引入web3
var Web3 = require('web3');
var contract = require("truffle-contract");

//http://localhost:7545地址为开发客户端地址
var provider = new Web3.providers.HttpProvider("http://localhost:7545");

//使用truffle-contract包的contract()方法
//请务必使用你自己编译的Test.json文件内容
var Test = contract(
    **此处输入为./build/contracts/Test.json文件中的内容**
);

Test.setProvider(provider);

//没有默认地址，会报错
//UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 3): Error: invalid address
//务必设置为自己的钱包地址，如果不知道，可通过开发者客户端查看

Test.defaults({
    from : "0xf17f52151EbEF6C7334FAD080c5704D77216b732"
});

var instance;

Test.deployed().then(function(instance){
    return instance.sayHi.call();
}).then(function(result){
    console.log(result);
});
```

> `NodeJS`运行合约，最终会输出`Hi wangzukun!`


```
localhost:truffle4-demo wangzukun$ node testWeb3.js
'Hi wangzukun!'
```


> 如运行中发现任何问题，欢迎留言交流～

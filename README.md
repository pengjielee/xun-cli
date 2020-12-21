一个Nodejs命令行工具，可以查看日期、查看天气、查看本机IP地址。

## 全局安装

```
$ npm install -g xun-cli
```

## 使用 

1. 查看日期

```
$ xun-cli date
```

2. 查看指定城市天气

默认显示北京的天气，支持的城市有北京、上海、天津、杭州、成都、郑州。

```
$ xun-cli weather 
$ xun-cli weather shanghai
$ xun-cli weather tianjin
$ xun-cli weather hangzhou
$ xun-cli weather chengdu
$ xun-cli weather zhenzhou
```

3. 查看热门城市天气

```
$ xun-cli hot
```


4. 查看本机IP地址

```
$ xun-cli ip
```

5. 查看帮助 

```
$ xun-cli help
```
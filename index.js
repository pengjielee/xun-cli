#!/usr/bin/env node

const chalk = require('chalk');
const figlet = require('figlet');
const yargs = require('yargs');
const shell = require('shelljs');
const fetch = require('node-fetch');
const dayjs = require('dayjs');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const serve = require('koa-static');
const Koa = require('koa');

const gitignoreContent = `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
`;

const prettierContent = `module.exports = {
  printWidth: 100, // 一行最大多少字符
  tabWidth: 2, // tab占用的字符数
  useTabs: false, // 是否使用tab代替空格
  semi: true, // 是否每句后都加分号
  singleQuote: true, // 是否使用单引号
  trailingComma: 'all', // 数组尾逗号。
  bracketSpacing: true, // {foo: xx}还是{ foo: xx }
  jsxBracketSameLine: false,
  arrowParens: 'avoid', //剪头函数参数是否使用（）
  endOfLine: 'auto',
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'html',
        htmlWhitespaceSensitivity: 'ignore',
      },
    },
  ],
};
`;

// 输出一个漂亮的LOGO
console.log(
  chalk.yellow(
    figlet.textSync('XUN-CLI', {
      horizontalLayout: 'full',
    })
  )
);

// 获取天气信息
const getWeatherInfo = async (city) => {
  const hotCity = {
    beijing: '101010100',
    shanghai: '101020100',
    tianjin: '101030100',
    hangzhou: '101210101',
    chengdu: '101270101',
    zhenzhou: '101180101',
  };

  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const location = hotCity[city] ? hotCity[city] : '';
  if (location) {
    const res = await fetch(
      `https://devapi.heweather.net/v7/weather/now?key=ea27fd16a12c45938ae787b4059fdaba&location=${location}`
    );
    const data = await res.json();
    if (data.code === '200') {
      const now = data.now;
      console.log(
        chalk.green(
          `\r\n${cityName}: ${now.text}，${now.temp}摄氏度，${now.windDir}\r\n`
        )
      );
    } else {
      console.log(`Ops, something error!`);
    }
  } else {
    console.log(`${cityName} does not support.`);
  }
};

// 输出支持的命令
yargs
  .scriptName('xun-cli')
  .usage('$0 <cmd> [args]')
  .command(
    'date',
    '显示当前日期',
    (yargs) => {},
    function (argv) {
      const date = dayjs().format('YYYY-MM-DD HH:mm:ss');
      console.log(chalk.green(`\r\n当前日期： ${date}\r\n`));
    }
  )
  .command(
    'hot',
    '热门城市查看天气',
    (yargs) => {},
    function (argv) {
      const questions = [
        {
          type: 'list',
          name: 'city',
          choices: [
            'beijing',
            'shanghai',
            'tianjin',
            'hangzhou',
            'chengdu',
            'zhenzhou',
          ],
          message: '选择城市',
          default: function () {
            return 'beijing';
          },
        },
      ];
      inquirer.prompt(questions).then((answers) => {
        getWeatherInfo(answers.city);
      });
    }
  )
  .command(
    'weather [city]',
    '查看指定城市天气（默认beijing）',
    (yargs) => {
      yargs.positional('city', {
        type: 'string',
        default: 'beijing',
        describe: '要查询的城市',
      });
    },
    async function (argv) {
      const city = argv.city.toLowerCase();
      getWeatherInfo(city);
    }
  )
  .command(
    'ip',
    '查看本机IP',
    (yargs) => {},
    function (argv) {
      var ip_address = shell.exec(
        "ifconfig -a|grep inet|grep -v 127.0.0.1|grep -v inet6 | awk '{print $2}' | tr -d 'addr:'",
        { silent: true }
      ).stdout;
      console.log(chalk.green(`本机IP：\r\n${ip_address}`));
    }
  )
  .command(
    'git',
    '创建git忽略文件',
    (yargs) => {},
    function (argv) {
      const distPath = path.join(process.cwd(), '.gitignore');
      console.log(distPath);
      const result = fs.writeFile(distPath, gitignoreContent, (err) => {
        if (err) {
          console.log(chalk.red('创建.gitignore文件失败'));
        }
        console.log(chalk.green(`创建.gitignore文件成功`));
      });
    }
  )
  .command(
    'prettier',
    '创建prettier配置文件',
    (yargs) => {},
    function (argv) {
      const distPath = path.join(process.cwd(), '.prettierrc.js');
      // fs.writeFileSync(distPath, prettierContent);
      const result = fs.writeFile(distPath, gitignoreContent, (err) => {
        if (err) {
          console.log(chalk.red('创建.prettierrc.js文件失败'));
        }
        console.log(chalk.green('创建.prettierrc.js文件成功'));
      });
    }
  )
  .command(
    'serve [port]',
    'serve a static site',
    (yargs) => {
      yargs.positional('port', {
        type: 'string',
        default: 5000,
        describe: '绑定的端口',
      });
    },
    function (argv) {
      const port = argv.port;
      const app = new Koa();
      app.use(serve(path.resolve(process.cwd())));
      app.listen(port);
      console.log(`listening on port ${port}`);
    }
  )
  .help().argv;

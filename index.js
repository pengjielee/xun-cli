#!/usr/bin/env node

const chalk = require('chalk');
const figlet = require('figlet');
const yargs = require('yargs');
const shell = require('shelljs');
const fetch = require('node-fetch');
const dayjs = require('dayjs');
const inquirer = require('inquirer');

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
        `${cityName}: ${now.text}，${now.temp}摄氏度，${now.windDir}`
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
      console.log(`当前日期： ${date}`);
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
      console.log(`本机IP：${ip_address}`);
    }
  )
  .help().argv;

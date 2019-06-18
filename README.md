
<img src="https://i.imgur.com/gtXdkk6.png" align="right" width="256"/>

# [Swap-UI](https://github.com/alxarno/swap-ui)


![](https://img.shields.io/badge/price-free-%235F2FE1.svg)
![](https://img.shields.io/badge/version-0.0.1-green.svg)
> Web user interface for swap messenger

Current application allows you all basic functions for [swap messenger server](https://github.com/alxarno/swap)

## Capabilities 
* [Sign In and Sign Up](#singin)
* [2 languages](#langs) ([Russian](https://github.com/alxarno/swap-ui/blob/master/src/language/langs/ru.ts), [English](https://github.com/alxarno/swap-ui/blob/master/src/language/langs/en.ts))
* [Change nickname (not username)](#usersettings)
* [Create chats](#newchat)
* [Invite people to the chat](#search)
* [Block people in the your chat](#ban)
* [Leave chats](#leave)
* [Instant Messaging](#messages)
* [Upload docs](#docs)
* [Image preview](#images)
* [Audio recording](#record)
* [Listen audio records](#listen)

<img src="https://i.imgur.com/FvgzttD.gif" name="singin"/>

## Built With
* [TypeScript](http://www.typescriptlang.org/)
* [React](https://github.com/facebook/react)
* [MobX](https://github.com/mobxjs/mobx)
* [Webpack](https://github.com/webpack)
* [SASS](https://sass-lang.com/)

## Instalation and run

Swap-UI requires Node.js to run.

Install all deps and start the dev server.
```
git clone https://github.com/alxarno/swap-ui
cd swap-ui
npm i
./dev.sh
```
For working with server API, you also need start [swap server](https://github.com/alxarno/swap) and change server address in [index.ts](https://github.com/alxarno/swap-ui/blob/master/src/index.ts)

## Build 

Build available by webpack

You can execute build.sh to build 

```
./build.sh
```

Resulte will appear in `dist` folder

## Screens
# <img src="https://i.imgur.com/Ck8ib85.png" name="langs"/>
# <img src="https://i.imgur.com/MqM0t3T.png" name="usersettings"/>
# <img src="https://i.imgur.com/7fHeDw6.png" name="newchat"/>
# <img src="https://i.imgur.com/Os2RQLP.png" name="search"/>
# <img src="https://i.imgur.com/gdXW1nj.png" name="ban"/>
# <img src="https://i.imgur.com/v2IE3pL.png" name="leave"/>
# <img src="https://i.imgur.com/NuAY857.png" name="messages"/>
# <img src="https://i.imgur.com/ZkYkwS9.png" name="docs"/>
# <img src="https://i.imgur.com/0AysHRQ.png" name="images"/>
# <img src="https://i.imgur.com/K7IRjDz.png" name="record"/>
# <img src="https://i.imgur.com/vtjWCQ4.png" name="listen"/>

License
----
GPL-3.0
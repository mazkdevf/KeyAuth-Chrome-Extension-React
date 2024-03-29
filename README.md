# KeyAuth-Chrome-Extension in React
- A Chrome extension tool built with Vite, TypeScript, and TailwindCSS utilizing Manifest v3.
- Demonstrates how to execute requests to the server-side (keyauth.win), focusing primarily on this functionality.

## Installation

1. Ensure that your `Node.js` version is **14** or higher.
2. Modify or configure the name of your extension in `src/manifest`.
3. Execute `npm install` to install the necessary dependencies.

## Preview

![img](https://github.com/mazkdevf/KeyAuth-Chrome-Extension-React/assets/79049205/c27996bd-b0b6-4f7b-a587-64d39dca035f)
![img](https://github.com/mazkdevf/KeyAuth-Chrome-Extension-React/assets/79049205/19659c9d-ca51-4615-a76d-e711578d1e5a)
![img](https://github.com/mazkdevf/KeyAuth-Chrome-Extension-React/assets/79049205/90eb734d-1cb8-4d87-a355-459d3f540233)
![img](https://github.com/mazkdevf/KeyAuth-Chrome-Extension-React/assets/79049205/bb337f0d-6efb-4b8e-b801-573d78ac30b1)
![img](https://github.com/mazkdevf/KeyAuth-Chrome-Extension-React/assets/79049205/4f1f859d-29be-43a7-813c-b51678173d54)

## Developing

1. run the command

```shell
$ cd KeyAuth-Chrome-Extension-React
```

1. Change Application Credentials in `package.json` > `KeyAuth`

```json
  "KeyAuth": {
    "AppName": "",
    "OwnerId": "",
    "Version": "1.0"
  },
```

2. run the command

```shell
$ npm run dev
```

3. open `chrome://extensions/` in your Chrome browser
4. click 'Load unpacked', and select `KeyAuth-Chrome-Extension-React/build` folder
5. click 'Update' button when you modify the code
6. Done!

### Chrome Extension Developer Mode

1. set your Chrome browser 'Developer mode' up
2. click 'Load unpacked', and select `KeyAuth-Chrome-Extension-React/build` folder

### Normal FrontEnd Developer Mode

1. access `http://0.0.0.0:3000/`
2. when debugging popup page, open `http://0.0.0.0:3000//popup.html`

## Packing

After the development of your extension run the command

```shell
$ npm run build
```

Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store. Just take a look at the [official guide](https://developer.chrome.com/webstore/publish) to more infos about publishing.

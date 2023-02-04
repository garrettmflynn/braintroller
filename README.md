# braintroller
 Automate system commands with your brain

 This is currently just a simple WebSocket relay between the browser and `robotjs` to allow you to type single characters. It is a quick proof of concept for triggering keypress events while playing video games using the [device-decoder](https://github.com/brainsatplay/device-decoder) API for biosensing devices.

## Note
You may need to build `robotjs` binaries if prebuilt binaries are not available for your platform. See [`robotjs` documentation](https://github.com/octalmage/robotjs#building) for more information.

As we plan to move this code into the [Brains@Play Desktop] application, we will need to package `robotjs` for Electron. See [`robotjs` documentation](https://robotjs.io/docs/electron) for more information.